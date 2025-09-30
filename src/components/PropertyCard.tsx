import { MapPin, Bed, Bath, Car, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  neighborhood: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  area?: number;
}

export const PropertyCard = ({
  id,
  image,
  title,
  price,
  neighborhood,
  type,
  bedrooms,
  bathrooms,
  parkingSpaces,
  area,
}: PropertyCardProps) => {
  return (
    <Link to={`/imovel/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {type}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{neighborhood}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{bathrooms}</span>
              </div>
            )}
            {parkingSpaces && (
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                <span>{parkingSpaces}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{area}m²</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(price)}
          </div>
        </div>
      </Card>
    </Link>
  );
};
