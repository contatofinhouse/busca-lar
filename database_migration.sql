-- =====================================================
-- MIGRATION: B2B Real Estate Platform
-- Execute este SQL no SQL Editor do Supabase
-- =====================================================

-- Create real_estates table (imobiliárias)
CREATE TABLE IF NOT EXISTS public.real_estates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  creci TEXT NOT NULL,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create real_estate_users table (link users to real estates)
CREATE TABLE IF NOT EXISTS public.real_estate_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  real_estate_id UUID NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, real_estate_id)
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  real_estate_id UUID NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking INTEGER,
  cep TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  tour_360_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create property_images table (max 6 images per property)
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL CHECK (display_order >= 1 AND display_order <= 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(property_id, display_order)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('property-images', 'property-images', true),
  ('real-estate-logos', 'real-estate-logos', true),
  ('property-tours', 'property-tours', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.real_estates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for real_estates
CREATE POLICY "Anyone can view approved real estates"
  ON public.real_estates FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view their own real estate"
  ON public.real_estates FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.real_estate_users 
      WHERE real_estate_id = id
    )
  );

CREATE POLICY "Users can insert real estates"
  ON public.real_estates FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Real estate admins can update their real estate"
  ON public.real_estates FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.real_estate_users 
      WHERE real_estate_id = id AND role = 'admin'
    )
  );

-- RLS Policies for real_estate_users
CREATE POLICY "Users can view their own associations"
  ON public.real_estate_users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Real estate admins can manage users"
  ON public.real_estate_users FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.real_estate_users 
      WHERE real_estate_id = real_estate_users.real_estate_id AND role = 'admin'
    )
  );

-- RLS Policies for properties
CREATE POLICY "Anyone can view active properties from approved real estates"
  ON public.properties FOR SELECT
  USING (
    status = 'active' AND 
    real_estate_id IN (
      SELECT id FROM public.real_estates WHERE status = 'approved'
    )
  );

CREATE POLICY "Real estate users can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.real_estate_users 
      WHERE real_estate_id = properties.real_estate_id
    ) AND
    real_estate_id IN (
      SELECT id FROM public.real_estates WHERE status = 'approved'
    )
  );

CREATE POLICY "Real estate users can update their properties"
  ON public.properties FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.real_estate_users 
      WHERE real_estate_id = properties.real_estate_id
    )
  );

CREATE POLICY "Real estate users can delete their properties"
  ON public.properties FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.real_estate_users 
      WHERE real_estate_id = properties.real_estate_id
    )
  );

-- RLS Policies for property_images
CREATE POLICY "Anyone can view property images"
  ON public.property_images FOR SELECT
  USING (true);

CREATE POLICY "Real estate users can manage their property images"
  ON public.property_images FOR ALL
  USING (
    auth.uid() IN (
      SELECT reu.user_id 
      FROM public.properties p
      JOIN public.real_estate_users reu ON p.real_estate_id = reu.real_estate_id
      WHERE p.id = property_images.property_id
    )
  );

-- Storage policies for property-images
CREATE POLICY "Anyone can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their property images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images' AND
    auth.uid() IS NOT NULL
  );

-- Storage policies for real-estate-logos
CREATE POLICY "Anyone can view real estate logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'real-estate-logos');

CREATE POLICY "Authenticated users can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'real-estate-logos' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'real-estate-logos' AND
    auth.uid() IS NOT NULL
  );

-- Storage policies for property-tours
CREATE POLICY "Anyone can view property tours"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-tours');

CREATE POLICY "Authenticated users can upload tours"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-tours' AND
    auth.uid() IS NOT NULL
  );

-- Create indexes for better performance
CREATE INDEX idx_properties_real_estate_id ON public.properties(real_estate_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_real_estate_users_user_id ON public.real_estate_users(user_id);
CREATE INDEX idx_real_estate_users_real_estate_id ON public.real_estate_users(real_estate_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_real_estates_updated_at
  BEFORE UPDATE ON public.real_estates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
