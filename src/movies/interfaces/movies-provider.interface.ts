// src/movies/providers/movies-provider.interface.ts
export interface Movie {
  title: string;
  year: string;
  description: string;
}

export interface MoviesProvider {
  searchMovies(query: string): Promise<Movie[]>;
  getMovieDetails(id: string): Promise<Movie>;
}
