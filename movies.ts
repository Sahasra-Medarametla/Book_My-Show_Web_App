export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  certification: string;
  releaseDate: string;
  featured?: boolean;
  backdrop?: string;
  description?: string;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    rating: 9.2,
    votes: "245.5K",
    genres: ["Action", "Drama", "Thriller"],
    language: "Telugu",
    certification: "UA",
    releaseDate: "Dec 5, 2024",
    featured: true,
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=800&fit=crop",
    description: "The epic saga continues as Pushpa Raj rises to new heights of power and faces his greatest adversaries yet."
  },
  {
    id: 2,
    title: "Mufasa: The Lion King",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    rating: 8.7,
    votes: "156.2K",
    genres: ["Animation", "Adventure", "Drama"],
    language: "English",
    certification: "U",
    releaseDate: "Dec 20, 2024",
    featured: true,
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1920&h=800&fit=crop",
    description: "Discover the rise of the legendary lion king Mufasa in this breathtaking prequel."
  },
  {
    id: 3,
    title: "Baby John",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    rating: 7.8,
    votes: "89.3K",
    genres: ["Action", "Thriller"],
    language: "Hindi",
    certification: "UA",
    releaseDate: "Dec 25, 2024",
    featured: true,
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=800&fit=crop",
    description: "A gripping action thriller that will keep you on the edge of your seat."
  },
  {
    id: 4,
    title: "Sonic the Hedgehog 3",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    rating: 8.5,
    votes: "178.9K",
    genres: ["Animation", "Adventure", "Comedy"],
    language: "English",
    certification: "U",
    releaseDate: "Dec 20, 2024"
  },
  {
    id: 5,
    title: "Marco",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    rating: 9.0,
    votes: "112.4K",
    genres: ["Action", "Crime", "Drama"],
    language: "Malayalam",
    certification: "A",
    releaseDate: "Dec 20, 2024"
  },
  {
    id: 6,
    title: "Kraven the Hunter",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    rating: 7.2,
    votes: "67.8K",
    genres: ["Action", "Adventure"],
    language: "English",
    certification: "UA",
    releaseDate: "Dec 13, 2024"
  },
  {
    id: 7,
    title: "Moana 2",
    poster: "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=400&h=600&fit=crop",
    rating: 8.3,
    votes: "203.1K",
    genres: ["Animation", "Adventure", "Family"],
    language: "English",
    certification: "U",
    releaseDate: "Nov 29, 2024"
  },
  {
    id: 8,
    title: "Gladiator II",
    poster: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=400&h=600&fit=crop",
    rating: 8.9,
    votes: "287.6K",
    genres: ["Action", "Adventure", "Drama"],
    language: "English",
    certification: "UA",
    releaseDate: "Nov 22, 2024"
  },
  {
    id: 9,
    title: "Wicked",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    rating: 8.6,
    votes: "145.3K",
    genres: ["Musical", "Fantasy", "Drama"],
    language: "English",
    certification: "U",
    releaseDate: "Nov 22, 2024"
  },
  {
    id: 10,
    title: "Amaran",
    poster: "https://images.unsplash.com/photo-1547235001-d703406d3f17?w=400&h=600&fit=crop",
    rating: 9.1,
    votes: "198.7K",
    genres: ["Action", "Biography", "Drama"],
    language: "Tamil",
    certification: "UA",
    releaseDate: "Oct 31, 2024"
  }
];

export const featuredMovies = movies.filter(movie => movie.featured);
