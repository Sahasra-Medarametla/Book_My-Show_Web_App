import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  certification: string;
  duration_minutes: number;
  release_date: string | null;
  availability: 'now_showing' | 'coming_soon' | 'ended';
  featured: boolean;
  price: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('availability', 'now_showing')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: ['featured-movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('featured', true)
        .eq('availability', 'now_showing')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Movie | null;
    },
    enabled: !!id,
  });
};
