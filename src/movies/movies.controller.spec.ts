import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Languages } from '../common/enums/languages.enum';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { PatchMovieDto } from './dtos/patch-movie.dto';
import { CreateReviewMovieDto } from './dtos/create-review-movie.dto';
import { ValidateReviewMovieDto } from './dtos/validate-review-movie.dto';
import { SearchMoviesDto } from './source/dtos/search-movies.dto';
import { Movie } from './movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    originalTitle: 'Test Movie Original',
    description: 'Test description',
    movieExterneId: 123456,
    releaseDate: new Date('2024-12-15'),
    averageRatingExterne: 7.5,
    originalLanguage: Languages.FRENCH,
    backdropPath: '/backdrop.jpg',
    posterPath: '/poster.jpg',
    sessionsCinemas: [],
    reviews: [],
    cast: [],
  } as Movie;

  const mockMoviesService = {
    searchExternal: jest.fn(),
    getCast: jest.fn(),
    getDetails: jest.fn(),
    getUpcomingMovies: jest.fn(),
    search: jest.fn(),
    getMovieById: jest.fn(),
    updateMovie: jest.fn(),
    createMovieReview: jest.fn(),
    validateMovieReview: jest.fn(),
    getMovieReview: jest.fn(),
    getMovieReviews: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchExternal', () => {
    it('should search external movies', async () => {
      const query = 'Avatar';
      const expectedResult = [mockMovie];
      mockMoviesService.searchExternal.mockResolvedValue(expectedResult);

      const result = await controller.searchExternal(query);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.searchExternal).toHaveBeenCalledWith(query);
    });

    it('should handle empty query', async () => {
      const query = '';
      const expectedResult = [];
      mockMoviesService.searchExternal.mockResolvedValue(expectedResult);

      const result = await controller.searchExternal(query);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.searchExternal).toHaveBeenCalledWith(query);
    });
  });

  describe('searchExternalCast', () => {
    it('should get cast for external movie', async () => {
      const movieExternalId = 123456;
      const expectedCast = [
        { id: 1, name: 'Actor Name', character: 'Character Name' },
      ];
      mockMoviesService.getCast.mockResolvedValue(expectedCast);

      const result = await controller.searchExternalCast(movieExternalId);

      expect(result).toEqual(expectedCast);
      expect(mockMoviesService.getCast).toHaveBeenCalledWith(movieExternalId);
    });

    it('should handle invalid movie external id', async () => {
      const movieExternalId = -1;
      mockMoviesService.getCast.mockResolvedValue([]);

      const result = await controller.searchExternalCast(movieExternalId);

      expect(result).toEqual([]);
      expect(mockMoviesService.getCast).toHaveBeenCalledWith(movieExternalId);
    });
  });

  describe('getDetailsExternal', () => {
    it('should get external movie details', async () => {
      const movieId = 123456;
      mockMoviesService.getDetails.mockResolvedValue(mockMovie);

      const result = await controller.getDetailsExternal(movieId);

      expect(result).toEqual(mockMovie);
      expect(mockMoviesService.getDetails).toHaveBeenCalledWith(movieId);
    });

    it('should handle non-existent external movie', async () => {
      const movieId = 999999;
      mockMoviesService.getDetails.mockResolvedValue(null);

      const result = await controller.getDetailsExternal(movieId);

      expect(result).toBeNull();
      expect(mockMoviesService.getDetails).toHaveBeenCalledWith(movieId);
    });
  });

  describe('getUpcomingMoviesExternal', () => {
    it('should get upcoming movies with default parameters', async () => {
      const expectedMovies = [mockMovie];
      mockMoviesService.getUpcomingMovies.mockResolvedValue(expectedMovies);

      const result = await controller.getUpcomingMoviesExternal();

      expect(result).toEqual(expectedMovies);
      expect(mockMoviesService.getUpcomingMovies).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });

    it('should get upcoming movies with specific parameters', async () => {
      const region = RegionsIso.FRANCE;
      const language = Languages.FRENCH;
      const page = 2;
      const expectedMovies = [mockMovie];
      mockMoviesService.getUpcomingMovies.mockResolvedValue(expectedMovies);

      const result = await controller.getUpcomingMoviesExternal(
        region,
        language,
        page,
      );

      expect(result).toEqual(expectedMovies);
      expect(mockMoviesService.getUpcomingMovies).toHaveBeenCalledWith(
        region,
        language,
        page,
      );
    });

    it('should handle different regions', async () => {
      const region = RegionsIso.USA;
      const language = Languages.ENGLISH;
      const page = 1;
      const expectedMovies = [mockMovie];
      mockMoviesService.getUpcomingMovies.mockResolvedValue(expectedMovies);

      const result = await controller.getUpcomingMoviesExternal(
        region,
        language,
        page,
      );

      expect(result).toEqual(expectedMovies);
      expect(mockMoviesService.getUpcomingMovies).toHaveBeenCalledWith(
        region,
        language,
        page,
      );
    });

    it('should handle edge case with page 0', async () => {
      const region = RegionsIso.FRANCE;
      const language = Languages.FRENCH;
      const page = 0;
      const expectedMovies = [];
      mockMoviesService.getUpcomingMovies.mockResolvedValue(expectedMovies);

      const result = await controller.getUpcomingMoviesExternal(
        region,
        language,
        page,
      );

      expect(result).toEqual(expectedMovies);
      expect(mockMoviesService.getUpcomingMovies).toHaveBeenCalledWith(
        region,
        language,
        page,
      );
    });
  });

  describe('search', () => {
    it('should search movies with basic criteria', async () => {
      const searchDto: SearchMoviesDto = {
        name: 'Avatar',
      };
      const expectedResult = [
        {
          movie: mockMovie,
          theaters: [],
        },
      ];
      mockMoviesService.search.mockResolvedValue(expectedResult);

      const result = await controller.search(searchDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.search).toHaveBeenCalledWith(searchDto);
    });

    it('should search movies with complex criteria', async () => {
      const searchDto: SearchMoviesDto = {
        name: 'Avatar',
        theaterId: 1,
        adminSearch: false,
      };
      const expectedResult = [
        {
          movie: mockMovie,
          theaters: [
            {
              theater: { id: 1, name: 'Cinema Test' },
              sessions: [
                {
                  date: '2024-12-15',
                  sessions: [],
                },
              ],
            },
          ],
        },
      ];
      mockMoviesService.search.mockResolvedValue(expectedResult);

      const result = await controller.search(searchDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.search).toHaveBeenCalledWith(searchDto);
    });

    it('should handle empty search results', async () => {
      const searchDto: SearchMoviesDto = {
        name: 'NonexistentMovie',
      };
      mockMoviesService.search.mockResolvedValue([]);

      const result = await controller.search(searchDto);

      expect(result).toEqual([]);
      expect(mockMoviesService.search).toHaveBeenCalledWith(searchDto);
    });
  });

  describe('getMovie', () => {
    it('should get movie by ID', async () => {
      const movieId = 1;
      mockMoviesService.getMovieById.mockResolvedValue(mockMovie);

      const result = await controller.getMovie(movieId);

      expect(result).toEqual(mockMovie);
      expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(movieId);
    });

    it('should handle non-existent movie ID', async () => {
      const movieId = 999;
      mockMoviesService.getMovieById.mockResolvedValue(null);

      const result = await controller.getMovie(movieId);

      expect(result).toBeNull();
      expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(movieId);
    });

    it('should handle invalid movie ID', async () => {
      const movieId = -1;
      mockMoviesService.getMovieById.mockResolvedValue(null);

      const result = await controller.getMovie(movieId);

      expect(result).toBeNull();
      expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(movieId);
    });
  });

  describe('updateMovie', () => {
    it('should update movie successfully', async () => {
      const movieId = 1;
      const patchMovieDto: PatchMovieDto = {
        title: 'Updated Movie Title',
        description: 'Updated description',
      };
      const updatedMovie = { ...mockMovie, ...patchMovieDto };
      mockMoviesService.updateMovie.mockResolvedValue(updatedMovie);

      const result = await controller.updateMovie(movieId, patchMovieDto);

      expect(result).toEqual(updatedMovie);
      expect(mockMoviesService.updateMovie).toHaveBeenCalledWith(
        movieId,
        patchMovieDto,
      );
    });

    it('should update movie with partial data', async () => {
      const movieId = 1;
      const patchMovieDto: PatchMovieDto = {
        title: 'Only Title Updated',
      };
      const updatedMovie = { ...mockMovie, title: 'Only Title Updated' };
      mockMoviesService.updateMovie.mockResolvedValue(updatedMovie);

      const result = await controller.updateMovie(movieId, patchMovieDto);

      expect(result).toEqual(updatedMovie);
      expect(mockMoviesService.updateMovie).toHaveBeenCalledWith(
        movieId,
        patchMovieDto,
      );
    });

    it('should handle empty update data', async () => {
      const movieId = 1;
      const patchMovieDto: PatchMovieDto = {};
      mockMoviesService.updateMovie.mockResolvedValue(mockMovie);

      const result = await controller.updateMovie(movieId, patchMovieDto);

      expect(result).toEqual(mockMovie);
      expect(mockMoviesService.updateMovie).toHaveBeenCalledWith(
        movieId,
        patchMovieDto,
      );
    });
  });

  describe('createReviewMovie', () => {
    it('should create movie review', async () => {
      const createReviewDto: CreateReviewMovieDto = {
        movieId: 1,
        userId: 1,
        note: 5,
      };
      const createdReview = {
        id: 1,
        ...createReviewDto,
        createdAt: new Date(),
      };
      mockMoviesService.createMovieReview.mockResolvedValue(createdReview);

      const result = await controller.createReviewMovie(createReviewDto);

      expect(result).toEqual(createdReview);
      expect(mockMoviesService.createMovieReview).toHaveBeenCalledWith(
        createReviewDto,
      );
    });

    it('should create review with minimum rating', async () => {
      const createReviewDto: CreateReviewMovieDto = {
        movieId: 1,
        userId: 1,
        note: 1,
      };
      const createdReview = {
        id: 1,
        ...createReviewDto,
        createdAt: new Date(),
      };
      mockMoviesService.createMovieReview.mockResolvedValue(createdReview);

      const result = await controller.createReviewMovie(createReviewDto);

      expect(result).toEqual(createdReview);
      expect(mockMoviesService.createMovieReview).toHaveBeenCalledWith(
        createReviewDto,
      );
    });

    it('should create review with maximum rating', async () => {
      const createReviewDto: CreateReviewMovieDto = {
        movieId: 1,
        userId: 1,
        note: 5,
      };
      const createdReview = {
        id: 1,
        ...createReviewDto,
        createdAt: new Date(),
      };
      mockMoviesService.createMovieReview.mockResolvedValue(createdReview);

      const result = await controller.createReviewMovie(createReviewDto);

      expect(result).toEqual(createdReview);
      expect(mockMoviesService.createMovieReview).toHaveBeenCalledWith(
        createReviewDto,
      );
    });
  });

  describe('validateMovieReview', () => {
    it('should validate movie review as valid', async () => {
      const reviewId = 1;
      const validateDto: ValidateReviewMovieDto = {
        isValidated: true,
      };
      const validatedReview = {
        id: reviewId,
        isValid: true,
        validatedAt: new Date(),
      };
      mockMoviesService.validateMovieReview.mockResolvedValue(validatedReview);

      const result = await controller.validateMovieReview(
        reviewId,
        validateDto,
      );

      expect(result).toEqual(validatedReview);
      expect(mockMoviesService.validateMovieReview).toHaveBeenCalledWith(
        reviewId,
        validateDto,
      );
    });

    it('should validate movie review as invalid', async () => {
      const reviewId = 1;
      const validateDto: ValidateReviewMovieDto = {
        isValidated: false,
      };
      const validatedReview = {
        id: reviewId,
        isValid: false,
        validatedAt: new Date(),
      };
      mockMoviesService.validateMovieReview.mockResolvedValue(validatedReview);

      const result = await controller.validateMovieReview(
        reviewId,
        validateDto,
      );

      expect(result).toEqual(validatedReview);
      expect(mockMoviesService.validateMovieReview).toHaveBeenCalledWith(
        reviewId,
        validateDto,
      );
    });
  });

  describe('getMovieReview', () => {
    it('should get specific movie review', async () => {
      const movieId = 1;
      const userId = 1;
      const expectedReview = {
        id: 1,
        movieId,
        userId,
        rating: 5,
        comment: 'Great movie!',
      };
      mockMoviesService.getMovieReview.mockResolvedValue(expectedReview);

      const result = await controller.getMovieReview(movieId, userId);

      expect(result).toEqual(expectedReview);
      expect(mockMoviesService.getMovieReview).toHaveBeenCalledWith(
        movieId,
        userId,
      );
    });

    it('should handle non-existent review', async () => {
      const movieId = 1;
      const userId = 999;
      mockMoviesService.getMovieReview.mockResolvedValue(null);

      const result = await controller.getMovieReview(movieId, userId);

      expect(result).toBeNull();
      expect(mockMoviesService.getMovieReview).toHaveBeenCalledWith(
        movieId,
        userId,
      );
    });
  });

  describe('getMovieReviews', () => {
    it('should get all reviews for a movie', async () => {
      const movieId = 1;
      const expectedReviews = [
        {
          id: 1,
          movieId,
          userId: 1,
          rating: 5,
          comment: 'Great!',
        },
        {
          id: 2,
          movieId,
          userId: 2,
          rating: 4,
          comment: 'Good!',
        },
      ];
      mockMoviesService.getMovieReviews.mockResolvedValue(expectedReviews);

      const result = await controller.getMovieReviews(movieId);

      expect(result).toEqual(expectedReviews);
      expect(mockMoviesService.getMovieReviews).toHaveBeenCalledWith(movieId);
    });

    it('should handle movie with no reviews', async () => {
      const movieId = 1;
      mockMoviesService.getMovieReviews.mockResolvedValue([]);

      const result = await controller.getMovieReviews(movieId);

      expect(result).toEqual([]);
      expect(mockMoviesService.getMovieReviews).toHaveBeenCalledWith(movieId);
    });

    it('should handle non-existent movie', async () => {
      const movieId = 999;
      mockMoviesService.getMovieReviews.mockResolvedValue([]);

      const result = await controller.getMovieReviews(movieId);

      expect(result).toEqual([]);
      expect(mockMoviesService.getMovieReviews).toHaveBeenCalledWith(movieId);
    });
  });
});
