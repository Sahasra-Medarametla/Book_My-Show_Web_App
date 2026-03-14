import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedMovies, Movie } from '@/hooks/useMovies';
import { Skeleton } from '@/components/ui/skeleton';
import BookingModal from './BookingModal';

const HeroCarousel = () => {
  const { data: featuredMovies, isLoading } = useFeaturedMovies();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!featuredMovies?.length) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredMovies?.length]);

  const goToPrevious = () => {
    if (!featuredMovies?.length) return;
    setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!featuredMovies?.length) return;
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handleBookNow = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsBookingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] bg-secondary">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-16 w-96" />
            <Skeleton className="h-6 w-80" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!featuredMovies?.length) {
    return (
      <div className="relative h-[70vh] md:h-[80vh] bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">No Featured Movies</h2>
          <p className="text-muted-foreground">Check back later for exciting movies!</p>
        </div>
      </div>
    );
  }

  const currentMovie = featuredMovies[currentIndex];

  return (
    <>
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${currentMovie.backdrop_url || currentMovie.poster_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-2xl animate-fade-in" key={currentIndex}>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
                {currentMovie.certification}
              </span>
              <span className="text-muted-foreground text-sm">
                {currentMovie.release_date}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {currentMovie.title}
            </h1>
            
            <p className="text-muted-foreground text-lg mb-4 line-clamp-2">
              {currentMovie.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {currentMovie.genres?.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1">
                <span className="text-gold text-xl">★</span>
                <span className="text-xl font-bold">{currentMovie.rating}/10</span>
              </div>
              <span className="text-muted-foreground">
                {currentMovie.votes} votes
              </span>
            </div>
            
            <div className="flex gap-4">
              <Button size="lg" className="gap-2" onClick={() => handleBookNow(currentMovie)}>
                <Play className="h-5 w-5 fill-current" />
                Book Tickets
              </Button>
              <Button size="lg" variant="outline" className="border-foreground/20 hover:bg-foreground/10">
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'bg-foreground/30 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>

      {selectedMovie && (
        <BookingModal
          movie={selectedMovie}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedMovie(null);
          }}
        />
      )}
    </>
  );
};

export default HeroCarousel;
