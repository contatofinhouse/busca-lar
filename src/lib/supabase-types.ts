export type RealEstateStatus = 'pending' | 'approved' | 'rejected';

export interface RealEstate {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  creci: string;
  logo_url?: string;
  status: RealEstateStatus;
  created_at: string;
  updated_at: string;
}

export interface RealEstateUser {
  id: string;
  user_id: string;
  real_estate_id: string;
  role: 'admin' | 'agent';
  created_at: string;
}

export interface Property {
  id: string;
  real_estate_id: string;
  title: string;
  type: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  cep: string;
  address: string;
  description: string;
  tour_360_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}
