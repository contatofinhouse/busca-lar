import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { RealEstate } from "@/lib/supabase-types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  realEstate: RealEstate | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRealEstate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [realEstate, setRealEstate] = useState<RealEstate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRealEstate = async (userId: string) => {
    const { data: userLink } = await supabase
      .from("real_estate_users")
      .select("real_estate_id")
      .eq("user_id", userId)
      .single();

    if (userLink) {
      const { data: realEstateData } = await supabase
        .from("real_estates")
        .select("*")
        .eq("id", userLink.real_estate_id)
        .single();

      setRealEstate(realEstateData);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchRealEstate(session.user.id);
          }, 0);
        } else {
          setRealEstate(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchRealEstate(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRealEstate(null);
  };

  const refreshRealEstate = async () => {
    if (user) {
      await fetchRealEstate(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, realEstate, loading, signOut, refreshRealEstate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
