import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Booking {
  id: string;
  user_id: string;
  movie_id: string;
  seats: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  show_date: string;
  show_time: string;
  theater_name: string;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
  movies?: {
    title: string;
    poster_url: string | null;
  };
}

export const useBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          movies (
            title,
            poster_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

export interface CreateBookingData {
  movie_id: string;
  seats: number;
  total_amount: number;
  show_date: string;
  show_time: string;
  theater_name?: string;
}

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingData) => {
      if (!user) throw new Error('Must be logged in to book');

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          movie_id: data.movie_id,
          seats: data.seats,
          total_amount: data.total_amount,
          show_date: data.show_date,
          show_time: data.show_time,
          theater_name: data.theater_name || 'PVR Cinemas',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'paid',
          payment_id: paymentId,
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Mock email notification as toast
      toast.success('🎉 Booking Confirmed!', {
        description: `Your ticket has been booked successfully! Confirmation email sent. Payment ID: ${data.payment_id}`,
        duration: 5000,
      });
    },
  });
};
