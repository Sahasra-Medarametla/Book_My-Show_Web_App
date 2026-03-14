import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { useMovies } from '@/hooks/useMovies';
import { Skeleton } from '@/components/ui/skeleton';

const languages = ['All', 'Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada'];

const MovieListings = () => {
  const { data: movies, isLoading } = useMovies();
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const filteredMovies = movies?.filter(movie => 
    selectedLanguage === 'All' || movie.language === selectedLanguage
  ) || [];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Recommended Movies
            </h2>
            <p className="text-muted-foreground mt-1">
              Now showing in your city
            </p>
          </div>
          <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium">
            See All
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedLanguage === lang
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found for this language.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieListings;
