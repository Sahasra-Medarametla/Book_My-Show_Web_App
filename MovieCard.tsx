import { useState } from 'react';
import { Star } from 'lucide-react';
import { Movie } from '@/hooks/useMovies';
import BookingModal from './BookingModal';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <div className="group cursor-pointer animate-fade-in">
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-card">
          <img
            src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400'}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-background/90 rounded-md backdrop-blur-sm">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span className="text-xs font-bold">{movie.rating}</span>
          </div>
          
          {/* Certification Badge */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
            {movie.certification}
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{movie.genres?.slice(0, 2).join('/') || 'Drama'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{movie.language}</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span className="text-foreground font-medium">{movie.rating}</span>
              <span className="text-muted-foreground">({movie.votes})</span>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        movie={movie}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
};

export default MovieCard;
