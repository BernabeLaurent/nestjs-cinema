import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { MovieReview } from './movie-review.entity';
import { Cast } from './cast.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  NotFoundException,
  RequestTimeoutException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { MoviesProviderToken } from './movies.config';
import { FindOneMovieByExternalIdProvider } from './providers/find-one-movie-by-external-id.provider';
import { CreateMovieReviewProvider } from './providers/create-movie-review.provider';
import { ValidateMovieReviewProvider } from './providers/validate-movie-review.provider';
import { SearchMoviesProvider } from './providers/search-movies.provider';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { Languages } from '../common/enums/languages.enum';
import { PatchMovieDto } from './dtos/patch-movie.dto';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { CreateReviewMovieDto } from './dtos/create-review-movie.dto';
import { ValidateReviewMovieDto } from './dtos/validate-review-movie.dto';
import { SearchMoviesDto } from './source/dtos/search-movies.dto';

describe('MoviesService', () => {
  let service: MoviesService;

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

  const mockMoviesRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockMovieReviewRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCastsRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockMoviesProvider = {
    getUpcomingMovies: jest.fn(),
    getMovieDetails: jest.fn(),
    searchExternalMovies: jest.fn(),
    getCastMovie: jest.fn(),
  };

  const mockFindOneMovieByExternalIdProvider = {
    findOneByExternalId: jest.fn(),
  };

  const mockCreateMovieReviewProvider = {
    createMovieReview: jest.fn(),
  };

  const mockValidateMovieReviewProvider = {
    validateMovieReview: jest.fn(),
  };

  const mockSearchMoviesProvider = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMoviesRepository,
        },
        {
          provide: getRepositoryToken(MovieReview),
          useValue: mockMovieReviewRepository,
        },
        {
          provide: getRepositoryToken(Cast),
          useValue: mockCastsRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: MoviesProviderToken,
          useValue: mockMoviesProvider,
        },
        {
          provide: FindOneMovieByExternalIdProvider,
          useValue: mockFindOneMovieByExternalIdProvider,
        },
        {
          provide: CreateMovieReviewProvider,
          useValue: mockCreateMovieReviewProvider,
        },
        {
          provide: ValidateMovieReviewProvider,
          useValue: mockValidateMovieReviewProvider,
        },
        {
          provide: SearchMoviesProvider,
          useValue: mockSearchMoviesProvider,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchExternal', () => {
    it('should call provider searchExternalMovies', async () => {
      const query = 'Avatar';
      const expectedMovies = [mockMovie];
      mockMoviesProvider.searchExternalMovies.mockResolvedValue(expectedMovies);

      const result = await service.searchExternal(query);

      expect(result).toEqual(expectedMovies);
      expect(mockMoviesProvider.searchExternalMovies).toHaveBeenCalledWith(
        query,
      );
    });

    it('should handle provider errors', async () => {
      const query = 'Avatar';
      mockMoviesProvider.searchExternalMovies.mockRejectedValue(
        new Error('API Error'),
      );

      await expect(service.searchExternal(query)).rejects.toThrow('API Error');
    });
  });

  describe('search', () => {
    it('should call searchMoviesProvider search method', async () => {
      const searchDto: SearchMoviesDto = { name: 'Test' };
      const expectedResult = [{ movie: mockMovie, theaters: [] }];
      mockSearchMoviesProvider.search.mockResolvedValue(expectedResult);

      const result = await service.search(searchDto);

      expect(result).toEqual(expectedResult);
      expect(mockSearchMoviesProvider.search).toHaveBeenCalledWith(searchDto);
    });
  });

  describe('getCast', () => {
    it('should get cast for movie', async () => {
      const movieExternalId = 123456;
      const movieId = 1;
      const expectedCast = [{ id: 1, name: 'Actor Name' }];
      mockMoviesProvider.getCastMovie.mockResolvedValue(expectedCast);

      const result = await service.getCast(movieExternalId, movieId);

      expect(result).toEqual(expectedCast);
      expect(mockMoviesProvider.getCastMovie).toHaveBeenCalledWith(
        movieExternalId,
        movieId,
      );
    });
  });

  describe('getDetails', () => {
    it('should get movie details', async () => {
      const movieId = 123456;
      mockMoviesProvider.getMovieDetails.mockResolvedValue(mockMovie);

      const result = await service.getDetails(movieId);

      expect(result).toEqual(mockMovie);
      expect(mockMoviesProvider.getMovieDetails).toHaveBeenCalledWith(movieId);
    });
  });

  describe('getUpcomingMovies', () => {
    it('should return cached movies when available', async () => {
      const cachedMovies = [mockMovie];
      mockCacheManager.get.mockResolvedValue(cachedMovies);

      const result = await service.getUpcomingMovies();

      expect(result).toEqual(cachedMovies);
      expect(mockCacheManager.get).toHaveBeenCalledWith(
        'upcoming_movies_undefined_undefined_undefined',
      );
      expect(mockMoviesProvider.getUpcomingMovies).not.toHaveBeenCalled();
    });

    it('should fetch and cache movies when not in cache', async () => {
      const fetchedMovies = [mockMovie];
      mockCacheManager.get.mockResolvedValue(null);
      mockMoviesProvider.getUpcomingMovies.mockResolvedValue(fetchedMovies);

      const result = await service.getUpcomingMovies(
        RegionsIso.FRANCE,
        Languages.FRENCH,
        1,
      );

      expect(result).toEqual(fetchedMovies);
      expect(mockMoviesProvider.getUpcomingMovies).toHaveBeenCalledWith(
        RegionsIso.FRANCE,
        Languages.FRENCH,
        1,
      );
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'upcoming_movies_FR_fr_1',
        fetchedMovies,
        3600000,
      );
    });

    it('should handle provider errors gracefully', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockMoviesProvider.getUpcomingMovies.mockRejectedValue(
        new Error('API externe indisponible'),
      );

      await expect(service.getUpcomingMovies()).rejects.toThrow(
        'API externe indisponible',
      );
    });
  });

  describe('getMovieById', () => {
    it('should return cached movie if available', async () => {
      const movieId = 1;
      mockCacheManager.get.mockResolvedValue(mockMovie);

      const result = await service.getMovieById(movieId);

      expect(result).toEqual(mockMovie);
      expect(mockCacheManager.get).toHaveBeenCalledWith('movie_1');
      expect(mockMoviesRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should fetch movie from database when not cached', async () => {
      const movieId = 1;
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockMovie),
      };

      mockCacheManager.get.mockResolvedValue(null);
      mockMoviesRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getMovieById(movieId);

      expect(result).toEqual(mockMovie);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'movie.reviews',
        'reviews',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'movie.cast',
        'cast',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith('movie.id = :id', {
        id: movieId,
      });
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'movie_1',
        mockMovie,
        3600000,
      );
    });

    it('should throw NotFoundException when movie not found', async () => {
      const movieId = 999;
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockCacheManager.get.mockResolvedValue(null);
      mockMoviesRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(service.getMovieById(movieId)).rejects.toThrow(
        new NotFoundException(`Movie with ID ${movieId} not found`),
      );
    });

    it('should throw RequestTimeoutException on database error', async () => {
      const movieId = 1;
      mockCacheManager.get.mockResolvedValue(null);
      mockMoviesRepository.createQueryBuilder.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      await expect(service.getMovieById(movieId)).rejects.toThrow(
        RequestTimeoutException,
      );
    });
  });

  describe('getMovieByExternalId', () => {
    it('should find movie by external id', async () => {
      const externalId = 123456;
      mockFindOneMovieByExternalIdProvider.findOneByExternalId.mockResolvedValue(
        mockMovie,
      );

      const result = await service.getMovieByExternalId(externalId);

      expect(result).toEqual(mockMovie);
      expect(
        mockFindOneMovieByExternalIdProvider.findOneByExternalId,
      ).toHaveBeenCalledWith(externalId);
    });

    it('should return null when movie not found', async () => {
      const externalId = 999999;
      mockFindOneMovieByExternalIdProvider.findOneByExternalId.mockResolvedValue(
        null,
      );

      const result = await service.getMovieByExternalId(externalId);

      expect(result).toBeNull();
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const createMovieDto: Partial<CreateMovieDto> = {
        title: 'New Movie',
        movieExterneId: 789456,
      };

      mockMoviesRepository.create.mockReturnValue(mockMovie);
      mockMoviesRepository.save.mockResolvedValue(mockMovie);

      const result = await service.createMovie(createMovieDto);

      expect(result).toEqual(mockMovie);
      expect(mockMoviesRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockMoviesRepository.save).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw ConflictException on save error', async () => {
      const createMovieDto: Partial<CreateMovieDto> = {
        title: 'New Movie',
        movieExterneId: 789456,
      };

      mockMoviesRepository.create.mockReturnValue(mockMovie);
      mockMoviesRepository.save.mockRejectedValue(new Error('Duplicate key'));

      await expect(service.createMovie(createMovieDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('createCast', () => {
    it('should create a new cast member', async () => {
      const createCastDto = {
        name: 'Actor Name',
        character: 'Character Name',
        movieId: 1,
      };
      const mockCast = { id: 1, ...createCastDto };

      mockCastsRepository.create.mockReturnValue(mockCast);
      mockCastsRepository.save.mockResolvedValue(mockCast);

      const result = await service.createCast(createCastDto);

      expect(result).toEqual(mockCast);
      expect(mockCastsRepository.create).toHaveBeenCalledWith(createCastDto);
      expect(mockCastsRepository.save).toHaveBeenCalledWith(mockCast);
    });

    it('should throw ConflictException on save error', async () => {
      const createCastDto = {
        name: 'Actor Name',
        character: 'Character Name',
        movieId: 1,
      };

      mockCastsRepository.create.mockReturnValue(createCastDto);
      mockCastsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createCast(createCastDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateMovie', () => {
    it('should update movie successfully', async () => {
      const movieId = 1;
      const patchMovieDto: PatchMovieDto = {
        title: 'Updated Title',
      };
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockMovie),
      };

      mockMoviesRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockMoviesRepository.save.mockResolvedValue({
        ...mockMovie,
        ...patchMovieDto,
      });

      await service.updateMovie(movieId, patchMovieDto);

      expect(queryBuilder.where).toHaveBeenCalledWith('movie.id = :id', {
        id: movieId,
      });
      expect(mockMoviesRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when movie not found', async () => {
      const movieId = 999;
      const patchMovieDto: PatchMovieDto = {
        title: 'Updated Title',
      };
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockMoviesRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(service.updateMovie(movieId, patchMovieDto)).rejects.toThrow(
        new BadRequestException('Movie not found WITH THIS ID'),
      );
    });

    it('should throw RequestTimeoutException on database error', async () => {
      const movieId = 1;
      const patchMovieDto: PatchMovieDto = {
        title: 'Updated Title',
      };

      mockMoviesRepository.createQueryBuilder.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.updateMovie(movieId, patchMovieDto)).rejects.toThrow(
        RequestTimeoutException,
      );
    });
  });

  describe('createMovieReview', () => {
    it('should create movie review', async () => {
      const createReviewDto: CreateReviewMovieDto = {
        movieId: 1,
        userId: 1,
        note: 5,
      };
      const mockReview = { id: 1, ...createReviewDto };

      mockCreateMovieReviewProvider.createMovieReview.mockResolvedValue(
        mockReview,
      );

      const result = await service.createMovieReview(createReviewDto);

      expect(result).toEqual(mockReview);
      expect(
        mockCreateMovieReviewProvider.createMovieReview,
      ).toHaveBeenCalledWith(createReviewDto);
    });
  });

  describe('validateMovieReview', () => {
    it('should validate movie review', async () => {
      const reviewId = 1;
      const validateDto: ValidateReviewMovieDto = {
        isValidated: true,
      };
      const mockResult = { id: reviewId, isValid: true };

      mockValidateMovieReviewProvider.validateMovieReview.mockResolvedValue(
        mockResult,
      );

      const result = await service.validateMovieReview(reviewId, validateDto);

      expect(result).toEqual(mockResult);
      expect(
        mockValidateMovieReviewProvider.validateMovieReview,
      ).toHaveBeenCalledWith(reviewId, validateDto);
    });
  });

  describe('getMovieReview', () => {
    it('should get specific movie review', async () => {
      const movieId = 1;
      const userId = 1;
      const mockReview = {
        id: 1,
        movieId,
        userId,
        rating: 5,
        comment: 'Great!',
      };

      mockMovieReviewRepository.findOne.mockResolvedValue(mockReview);

      const result = await service.getMovieReview(movieId, userId);

      expect(result).toEqual(mockReview);
      expect(mockMovieReviewRepository.findOne).toHaveBeenCalledWith({
        where: { movieId, userId },
      });
    });

    it('should return null when review not found', async () => {
      const movieId = 1;
      const userId = 999;

      mockMovieReviewRepository.findOne.mockResolvedValue(null);

      const result = await service.getMovieReview(movieId, userId);

      expect(result).toBeNull();
    });
  });

  describe('getMovieReviews', () => {
    it('should get all reviews for a movie', async () => {
      const movieId = 1;
      const mockReviews = [
        { id: 1, movieId, userId: 1, rating: 5, comment: 'Great!' },
        { id: 2, movieId, userId: 2, rating: 4, comment: 'Good!' },
      ];

      mockMovieReviewRepository.findOne.mockResolvedValue(mockReviews);

      const result = await service.getMovieReviews(movieId);

      expect(result).toEqual(mockReviews);
      expect(mockMovieReviewRepository.findOne).toHaveBeenCalledWith({
        where: { movieId },
        relations: ['user'],
      });
    });

    it('should return empty array when no reviews found', async () => {
      const movieId = 999;

      mockMovieReviewRepository.findOne.mockResolvedValue([]);

      const result = await service.getMovieReviews(movieId);

      expect(result).toEqual([]);
    });
  });
});
