import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import MovieListings from '@/components/MovieListings';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28">
        <HeroCarousel />
        <MovieListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
