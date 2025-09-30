import { PropertyCard } from "./PropertyCard";

interface Property {
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

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid = ({ properties }: PropertyGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
};
