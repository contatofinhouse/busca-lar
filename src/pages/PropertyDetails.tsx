import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Bed, Bath, Car, Square, Phone, Mail, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockProperties } from "@/lib/mockData";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <Link to="/">
            <Button>Voltar para busca</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para busca
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Slideshow de Fotos */}
            <div className="space-y-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {/* Foto principal */}
                  <CarouselItem>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                  {/* Fotos adicionais (placeholder) */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={property.image}
                          alt={`${property.title} - Foto ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Tour 360 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Tour Virtual 360°</h2>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4 inline-block">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Tour 360° disponível em breve
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {property.type}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.neighborhood}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>

              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    <span>{property.bedrooms} quartos</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5" />
                    <span>{property.bathrooms} banheiros</span>
                  </div>
                )}
                {property.parkingSpaces && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    <span>{property.parkingSpaces} vagas</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5" />
                    <span>{property.area}m²</span>
                  </div>
                )}
              </div>

              <div className="text-4xl font-bold text-primary mb-8">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(property.price)}
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Características</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features?.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Imobiliária</h3>
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {property.realEstate.logo}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{property.realEstate.name}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${property.realEstate.phone}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{property.realEstate.phone}</span>
                </a>
                <a
                  href={`mailto:${property.realEstate.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{property.realEstate.email}</span>
                </a>
              </div>

              <Button className="w-full" size="lg">
                Entrar em contato
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
