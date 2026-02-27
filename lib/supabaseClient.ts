import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
);

// Types
export interface Section {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  short_description: string;
  full_description: string;
  story: string;
  technical_details: Record<string, any>;
  section_id: string;
  created_at: string;
  section?: Section;
}

// Data fetching functions
export async function getSections(): Promise<Section[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sections:', error);
    return [];
  }

  return data || [];
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching section:', error);
    return null;
  }

  return data;
}

export async function getProductsBySection(sectionId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('section_id', sectionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      section:sections(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getRelatedProducts(sectionId: string, currentProductId: string, limit: number = 3): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('section_id', sectionId)
    .neq('id', currentProductId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      section:sections(*)
    `)
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}