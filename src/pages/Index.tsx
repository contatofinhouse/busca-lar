import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { PropertyGrid } from "@/components/PropertyGrid";
import { Button } from "@/components/ui/button";
import { mockProperties } from "@/lib/mockData";
import { Building2 } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProperties(mockProperties);
    } else {
      const filtered = mockProperties.filter(
        (property) =>
          property.neighborhood.toLowerCase().includes(query.toLowerCase()) ||
          property.title.toLowerCase().includes(query.toLowerCase()) ||
          property.type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-neutral-50 py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Encontre o imóvel ideal
            </h1>
            <p className="text-xl text-muted-foreground">
              Busque por CEP ou endereço e descubra as melhores opções
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {searchQuery ? "Resultados da busca" : "Imóveis em destaque"}
            </h2>
            <p className="text-muted-foreground">
              {filteredProperties.length} imóveis encontrados
            </p>
          </div>
          <Link to="/cadastro-imovel">
            <Button size="lg" variant="outline">
              <Building2 className="mr-2 h-5 w-5" />
              Cadastrar Imóvel
            </Button>
          </Link>
        </div>

        {filteredProperties.length > 0 ? (
          <PropertyGrid properties={filteredProperties} />
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              Nenhum imóvel encontrado para esta busca
            </p>
            <Button onClick={() => handleSearch("")}>
              Ver todos os imóveis
            </Button>
          </div>
        )}
      </div>

      <div className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-4">É uma imobiliária?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Cadastre-se e comece a anunciar seus imóveis
          </p>
          <Link to="/cadastro-imobiliaria">
            <Button size="lg">Cadastrar Imobiliária</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
