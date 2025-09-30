import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const RegisterProperty = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Imóvel cadastrado!",
      description: "Seu anúncio será publicado em breve.",
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
          <h1 className="text-3xl font-bold mb-2">Cadastrar Imóvel</h1>
          <p className="text-muted-foreground mb-8">
            Preencha os dados do imóvel para criar seu anúncio
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Anúncio</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Ex: Apartamento Moderno no Centro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Imóvel</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="sala-comercial">Sala Comercial</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                  placeholder="850000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  required
                  placeholder="120"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parking">Vagas</Label>
                <Input
                  id="parking"
                  name="parking"
                  type="number"
                  placeholder="2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                required
                placeholder="00000-000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input
                id="address"
                name="address"
                required
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Descreva o imóvel, suas características e diferenciais..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photos">Fotos do Imóvel</Label>
              <Input
                id="photos"
                name="photos"
                type="file"
                multiple
                accept="image/*"
              />
              <p className="text-sm text-muted-foreground">
                Adicione fotos de alta qualidade do imóvel
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Publicar Anúncio
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterProperty;
