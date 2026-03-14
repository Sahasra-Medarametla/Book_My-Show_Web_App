import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  paid: 'bg-green-500/20 text-green-500 border-green-500/50',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/50',
  expired: 'bg-muted text-muted-foreground border-muted',
};

const Bookings = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading } = useBookings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your movie tickets</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-28 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings?.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Bookings Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't booked any movies yet. Start exploring!
              </p>
              <Button onClick={() => navigate('/')}>Browse Movies</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings?.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Movie Poster */}
                    <img
                      src={booking.movies?.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100'}
                      alt={booking.movies?.title || 'Movie'}
                      className="w-20 h-28 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          {booking.movies?.title || 'Unknown Movie'}
                        </h3>
                        <Badge
                          variant="outline"
                          className={statusColors[booking.status]}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(booking.show_date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{booking.show_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{booking.theater_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Ticket className="h-4 w-4" />
                          <span>{booking.seats} {booking.seats === 1 ? 'Seat' : 'Seats'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Booking ID</p>
                          <p className="text-sm font-mono">{booking.id.slice(0, 8)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total Amount</p>
                          <p className="text-lg font-bold text-primary">₹{booking.total_amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bookings;
