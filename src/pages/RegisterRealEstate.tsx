import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterRealEstate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (authError) {
      toast({
        title: "Erro ao criar conta",
        description: authError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!authData.user) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a conta.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 2. Create real estate
    const { data: realEstateData, error: realEstateError } = await supabase
      .from("real_estates")
      .insert({
        name: formData.get("name") as string,
        cnpj: formData.get("cnpj") as string,
        phone: formData.get("phone") as string,
        email: email,
        address: formData.get("address") as string,
        creci: formData.get("creci") as string,
        status: "pending",
      })
      .select()
      .single();

    if (realEstateError) {
      toast({
        title: "Erro ao cadastrar imobiliária",
        description: realEstateError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 3. Link user to real estate
    const { error: linkError } = await supabase
      .from("real_estate_users")
      .insert({
        user_id: authData.user.id,
        real_estate_id: realEstateData.id,
        role: "admin",
      });

    if (linkError) {
      toast({
        title: "Erro ao vincular usuário",
        description: linkError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Cadastro enviado!",
      description: "Sua imobiliária está aguardando aprovação. Verifique seu e-mail para confirmar a conta.",
    });

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para home
        </Link>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2">Cadastro de Imobiliária</h1>
          <p className="text-muted-foreground mb-8">
            Preencha os dados da sua imobiliária para começar a anunciar
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Imobiliária</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Ex: Imobiliária Premium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                name="cnpj"
                required
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="(11) 98765-4321"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="contato@suaimobiliaria.com.br"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
              />
              <p className="text-sm text-muted-foreground">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                required
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creci">CRECI</Label>
              <Input
                id="creci"
                name="creci"
                required
                placeholder="Número do CRECI"
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Imobiliária"}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground mt-4">
              Já tem uma conta?{" "}
              <Link to="/auth" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterRealEstate;
