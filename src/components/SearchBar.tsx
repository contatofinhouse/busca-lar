import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center gap-2 bg-card rounded-full shadow-xl border border-border p-2">
        <div className="flex items-center gap-2 flex-1 px-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <Input
            name="search"
            type="text"
            placeholder="Busque por CEP ou endereço..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
        </div>
        <Button type="submit" size="lg" className="rounded-full">
          <Search className="h-5 w-5 mr-2" />
          Buscar
        </Button>
      </div>
    </form>
  );
};
