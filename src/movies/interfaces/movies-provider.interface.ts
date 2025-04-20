export interface Movie {
  title: string;
  year: string;
  description: string;
}

export interface MoviesProvider {
  searchMovies(query: string): Promise<Movie[]>;
  getUpcomingMovies(query: string): Promise<Movie[]>;
  getMovieDetails(id: string): Promise<Movie>;
}
