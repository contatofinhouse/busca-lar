import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const RegisterRealEstate = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Cadastro enviado!",
      description: "Entraremos em contato em breve para validar os dados.",
    });
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

            <Button type="submit" size="lg" className="w-full">
              Cadastrar Imobiliária
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterRealEstate;
