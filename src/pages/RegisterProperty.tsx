import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const RegisterProperty = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, realEstate, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para cadastrar imóveis.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [authLoading, user, navigate, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!realEstate) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você precisa estar vinculado a uma imobiliária para cadastrar imóveis.
              <Link to="/cadastro-imobiliaria" className="underline ml-2">
                Cadastre sua imobiliária
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (realEstate.status !== "approved") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sua imobiliária está com status: <strong>{realEstate.status === "pending" ? "Aguardando aprovação" : "Rejeitada"}</strong>.
              Apenas imobiliárias aprovadas podem cadastrar imóveis.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 6) {
      toast({
        title: "Limite de fotos",
        description: "Você pode enviar no máximo 6 fotos.",
        variant: "destructive",
      });
      return;
    }
    setImageFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      // 1. Create property
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .insert({
          real_estate_id: realEstate.id,
          title: formData.get("title") as string,
          type: formData.get("type") as string,
          price: parseFloat(formData.get("price") as string),
          area: parseFloat(formData.get("area") as string),
          bedrooms: formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null,
          bathrooms: formData.get("bathrooms") ? parseInt(formData.get("bathrooms") as string) : null,
          parking: formData.get("parking") ? parseInt(formData.get("parking") as string) : null,
          cep: formData.get("cep") as string,
          address: formData.get("address") as string,
          description: formData.get("description") as string,
          tour_360_url: formData.get("tour_360_url") as string || null,
          status: "active",
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // 2. Upload images
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${propertyData.id}-${i + 1}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("property-images")
            .getPublicUrl(filePath);

          await supabase.from("property_images").insert({
            property_id: propertyData.id,
            image_url: publicUrl,
            display_order: i + 1,
          });
        }
      }

      toast({
        title: "Imóvel cadastrado!",
        description: "Seu anúncio está publicado.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar imóvel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <Label htmlFor="tour_360_url">Link do Tour 360° (opcional)</Label>
              <Input
                id="tour_360_url"
                name="tour_360_url"
                type="url"
                placeholder="https://..."
              />
              <p className="text-sm text-muted-foreground">
                Cole o link do tour virtual 360° do imóvel
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photos">Fotos do Imóvel</Label>
              <Input
                id="photos"
                name="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-sm text-muted-foreground">
                Adicione até 6 fotos de alta qualidade do imóvel
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Anúncio"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterProperty;
