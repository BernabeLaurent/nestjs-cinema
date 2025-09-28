/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TmdbProvider } from './tmdb.provider';
import tmdbConfig from '../../config/tmdb.config';
import { CreateMovieProvider } from './create-movie.provider';
import { CreateCastProvider } from './create-cast.provider';
import { ImagesService } from '../../../common/images/images.service';
import { Languages } from '../../../common/enums/languages.enum';
import { RegionsIso } from '../../../common/enums/regions-iso.enum';
import { TmdbMovieDto } from '../dtos/tmdb-movie.dto';
import { CastDto } from '../dtos/cast.dto';
import { Movie } from '../../movie.entity';
import { Cast } from '../../cast.entity';
import { RequestTimeoutException } from '@nestjs/common';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TmdbProvider', () => {
  let provider: TmdbProvider;

  const mockTmdbConfig = {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.themoviedb.org/3',
    defaultLanguage: Languages.FRENCH,
    defaultCountry: RegionsIso.FRANCE,
    defaultPage: 1,
  };

  const mockCreateMovieProvider = {
    createOrUpdate: jest.fn(),
  };

  const mockCreateCastProvider = {
    createCast: jest.fn(),
  };

  const mockImagesService = {
    downloadImage: jest.fn(),
  };

  const mockTmdbMovieDto: TmdbMovieDto = {
    id: 123456,
    title: 'Test Movie',
    original_title: 'Test Movie Original',
    overview: 'Test description',
    release_date: '2024-12-15',
    vote_average: 7.5,
    original_language: 'fr',
    backdrop_path: '/backdrop.jpg',
    poster_path: '/poster.jpg',
    adult: false,
    runtime: 120,
    tagline: 'Test tagline',
    belongs_to_collection: null,
    budget: 0,
    genres: [],
    homepage: '',
    imdb_id: 'tt123456',
    popularity: 8.5,
    production_companies: [],
    production_countries: [],
    revenue: 0,
    spoken_languages: [],
    status: 'Released',
    video: false,
    vote_count: 1000,
  };

  const mockCastDto: CastDto = {
    cast_id: 1,
    character: 'Test Character',
    name: 'Test Actor',
    original_name: 'Test Actor Original',
    profile_path: '/actor.jpg',
    adult: false,
    gender: 1,
    order: 0,
    movieId: 1,
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmdbProvider,
        {
          provide: tmdbConfig.KEY,
          useValue: mockTmdbConfig,
        },
        {
          provide: CreateMovieProvider,
          useValue: mockCreateMovieProvider,
        },
        {
          provide: CreateCastProvider,
          useValue: mockCreateCastProvider,
        },
        {
          provide: ImagesService,
          useValue: mockImagesService,
        },
      ],
    }).compile();

    provider = module.get<TmdbProvider>(TmdbProvider);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('mapTmdbDtoToMovie', () => {
    it('should map TMDB DTO to Movie DTO correctly', () => {
      const result = provider.mapTmdbDtoToMovie(mockTmdbMovieDto);

      expect(result).toEqual({
        movieExterneId: 123456,
        title: 'Test Movie',
        originalTitle: 'Test Movie Original',
        description: 'Test description',
        originalDescription: 'Test description',
        tagline: 'Test tagline',
        originalTagline: 'Test tagline',
        isAdult: false,
        averageRatingExterne: 7.5,
        releaseDate: new Date('2024-12-15'),
        startDate: new Date('2024-12-15'),
        endDate: new Date('2024-12-15'),
        runtime: 120,
        originalLanguage: Languages.FRENCH,
        backdropPath: '/backdrop.jpg',
        posterPath: '/poster.jpg',
      });
    });

    it('should return null for unsupported language', () => {
      const unsupportedLanguageDto = {
        ...mockTmdbMovieDto,
        original_language: 'unsupported',
      };

      const result = provider.mapTmdbDtoToMovie(unsupportedLanguageDto);

      expect(result).toBeNull();
    });

    it('should handle missing optional fields', () => {
      const minimalDto: TmdbMovieDto = {
        id: 123456,
        title: 'Minimal Movie',
        original_title: 'Minimal Movie',
        overview: 'Minimal description',
        original_language: 'fr',
        adult: false,
        vote_average: 0,
        release_date: '',
        backdrop_path: '',
        poster_path: '',
        runtime: 0,
        tagline: '',
        belongs_to_collection: null,
        budget: 0,
        genres: [],
        homepage: '',
        imdb_id: '',
        popularity: 0,
        production_companies: [],
        production_countries: [],
        revenue: 0,
        spoken_languages: [],
        status: 'Released',
        video: false,
        vote_count: 0,
      };

      const result = provider.mapTmdbDtoToMovie(minimalDto);

      expect(result).toEqual({
        movieExterneId: 123456,
        title: 'Minimal Movie',
        originalTitle: 'Minimal Movie',
        description: 'Minimal description',
        originalDescription: 'Minimal description',
        tagline: '',
        originalTagline: '',
        isAdult: false,
        averageRatingExterne: 0,
        releaseDate: undefined,
        startDate: undefined,
        endDate: undefined,
        runtime: 0,
        originalLanguage: Languages.FRENCH,
        backdropPath: '',
        posterPath: '',
      });
    });

    it('should handle invalid date format', () => {
      const invalidDateDto = {
        ...mockTmdbMovieDto,
        release_date: 'invalid-date',
      };

      const result = provider.mapTmdbDtoToMovie(invalidDateDto);

      expect(result?.releaseDate).toBeUndefined();
      expect(result?.startDate).toBeUndefined();
      expect(result?.endDate).toBeUndefined();
    });
  });

  describe('mapTmdbCastDtoToCast', () => {
    it('should map TMDB Cast DTO to Cast entity correctly', () => {
      const result = provider.mapTmdbCastDtoToCast(mockCastDto);

      expect(result).toEqual({
        character: 'Test Character',
        name: 'Test Actor',
        originalName: 'Test Actor Original',
        profilePath: '/actor.jpg',
        adult: false,
        gender: 1,
        order: 0,
        movieId: 1,
        castId: 1,
      });
    });

    it('should handle cast with missing profile path', () => {
      const castWithoutProfile = {
        ...mockCastDto,
        profile_path: undefined,
      };

      const result = provider.mapTmdbCastDtoToCast(castWithoutProfile);

      expect(result.profilePath).toBeUndefined();
    });
  });

  describe('getCastMovie', () => {
    it('should get cast for existing movie', async () => {
      const movieExternalId = 123456;
      const movieId = 1;
      const mockCastResponse = {
        data: {
          cast: [mockCastDto],
        },
      };
      const mockCast = { id: 1, name: 'Test Actor' } as Cast;

      mockedAxios.get.mockResolvedValue(mockCastResponse);
      mockCreateCastProvider.createCast.mockResolvedValue(mockCast);

      const result = await provider.getCastMovie(movieExternalId, movieId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockTmdbConfig.baseUrl}/movie/${movieExternalId}/credits`,
        {
          headers: {
            Authorization: `Bearer ${mockTmdbConfig.apiKey}`,
            'accept-Type': 'application/json',
          },
        },
      );
      expect(result).toEqual([mockCast]);
    });

    it('should fetch movie details when movieId not provided', async () => {
      const movieExternalId = 123456;
      const mockMovieResponse = {
        data: mockTmdbMovieDto,
      };
      const mockCastResponse = {
        data: {
          cast: [mockCastDto],
        },
      };
      const mockCast = { id: 1, name: 'Test Actor' } as Cast;

      mockedAxios.get
        .mockResolvedValueOnce(mockMovieResponse) // First call for movie details
        .mockResolvedValueOnce(mockCastResponse); // Second call for cast

      mockCreateMovieProvider.createOrUpdate.mockResolvedValue(mockMovie);
      mockCreateCastProvider.createCast.mockResolvedValue(mockCast);

      const result = await provider.getCastMovie(movieExternalId);

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockCast]);
    });

    it('should throw RequestTimeoutException on API error', async () => {
      const movieExternalId = 123456;
      const movieId = 1;

      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(
        provider.getCastMovie(movieExternalId, movieId),
      ).rejects.toThrow(RequestTimeoutException);
    });

    it('should handle empty cast response', async () => {
      const movieExternalId = 123456;
      const movieId = 1;
      const mockCastResponse = {
        data: {
          cast: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockCastResponse);

      const result = await provider.getCastMovie(movieExternalId, movieId);

      expect(result).toEqual([]);
    });
  });

  describe('searchExternalMovies', () => {
    it('should search movies successfully', async () => {
      const query = 'Avatar';
      const mockResponse = {
        data: {
          results: [mockTmdbMovieDto],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);
      mockCreateMovieProvider.createOrUpdate.mockResolvedValue(mockMovie);

      const result = await provider.searchExternalMovies(query);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockTmdbConfig.baseUrl}/search/movie`,
        {
          headers: {
            Authorization: `Bearer ${mockTmdbConfig.apiKey}`,
            'accept-Type': 'application/json',
          },
          params: {
            query,
            language: mockTmdbConfig.defaultLanguage,
          },
        },
      );
      expect(result).toEqual([mockMovie]);
    });

    it('should handle empty search results', async () => {
      const query = 'NonexistentMovie';
      const mockResponse = {
        data: {
          results: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await provider.searchExternalMovies(query);

      expect(result).toEqual([]);
    });

    it('should filter out movies with unsupported languages', async () => {
      const query = 'Avatar';
      const unsupportedMovie = {
        ...mockTmdbMovieDto,
        original_language: 'unsupported',
      };
      const mockResponse = {
        data: {
          results: [mockTmdbMovieDto, unsupportedMovie],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);
      mockCreateMovieProvider.createOrUpdate.mockResolvedValue(mockMovie);

      const result = await provider.searchExternalMovies(query);

      expect(result).toEqual([mockMovie]); // Only one movie, unsupported filtered out
    });

    it('should throw RequestTimeoutException on API error', async () => {
      const query = 'Avatar';

      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(provider.searchExternalMovies(query)).rejects.toThrow(
        RequestTimeoutException,
      );
    });
  });

  describe('getMovieDetails', () => {
    it('should get movie details successfully', async () => {
      const movieId = 123456;
      const mockResponse = {
        data: mockTmdbMovieDto,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);
      mockCreateMovieProvider.createOrUpdate.mockResolvedValue(mockMovie);

      const result = await provider.getMovieDetails(movieId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockTmdbConfig.baseUrl}/movie/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${mockTmdbConfig.apiKey}`,
            'accept-Type': 'application/json',
          },
          params: {
            language: mockTmdbConfig.defaultLanguage,
          },
        },
      );
      expect(result).toEqual(mockMovie);
    });

    it('should handle movie with unsupported language', async () => {
      const movieId = 123456;
      const unsupportedMovieDto = {
        ...mockTmdbMovieDto,
        original_language: 'unsupported',
      };
      const mockResponse = {
        data: unsupportedMovieDto,
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await provider.getMovieDetails(movieId);

      expect(result).toBeNull();
    });

    it('should throw RequestTimeoutException on API error', async () => {
      const movieId = 123456;

      mockedAxios.get.mockRejectedValue(new Error('Network timeout'));

      await expect(provider.getMovieDetails(movieId)).rejects.toThrow(
        RequestTimeoutException,
      );
    });
  });

  describe('getUpcomingMovies', () => {
    it('should get upcoming movies successfully', async () => {
      const region = RegionsIso.FRANCE;
      const language = Languages.FRENCH;
      const page = 1;
      const mockResponse = {
        data: {
          results: [mockTmdbMovieDto],
          total_pages: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);
      provider.getMovieDetails = jest.fn().mockResolvedValue(mockMovie);

      const result = await provider.getUpcomingMovies(region, language, page);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockTmdbConfig.baseUrl}/movie/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${mockTmdbConfig.apiKey}`,
            'accept-Type': 'application/json',
          },
          params: {
            page,
            language,
            region,
          },
        },
      );
      expect(result).toEqual([mockMovie]);
    });

    it('should use default parameters when not provided', async () => {
      const mockResponse = {
        data: {
          results: [mockTmdbMovieDto],
          total_pages: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);
      provider.getMovieDetails = jest.fn().mockResolvedValue(mockMovie);

      const result = await provider.getUpcomingMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockTmdbConfig.baseUrl}/movie/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${mockTmdbConfig.apiKey}`,
            'accept-Type': 'application/json',
          },
          params: {
            page: mockTmdbConfig.defaultPage,
            language: mockTmdbConfig.defaultLanguage,
            region: mockTmdbConfig.defaultCountry,
          },
        },
      );
      expect(result).toEqual([mockMovie]);
    });

    it('should handle multiple pages', async () => {
      const mockResponsePage1 = {
        data: {
          results: [mockTmdbMovieDto],
          total_pages: 2,
        },
      };
      const mockResponsePage2 = {
        data: {
          results: [{ ...mockTmdbMovieDto, id: 789 }],
          total_pages: 2,
        },
      };

      mockedAxios.get
        .mockResolvedValueOnce(mockResponsePage1)
        .mockResolvedValueOnce(mockResponsePage2);
      provider.getMovieDetails = jest.fn().mockResolvedValue(mockMovie);

      const result = await provider.getUpcomingMovies();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockMovie, mockMovie]);
    });

    it('should filter out invalid movies', async () => {
      const mockResponse = {
        data: {
          results: [mockTmdbMovieDto],
          total_pages: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);
      provider.getMovieDetails = jest
        .fn()
        .mockResolvedValueOnce(mockMovie)
        .mockRejectedValueOnce(new Error('Movie error'));

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await provider.getUpcomingMovies();

      expect(result).toEqual([mockMovie]); // Only valid movie returned
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should throw RequestTimeoutException on API error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(provider.getUpcomingMovies()).rejects.toThrow(
        RequestTimeoutException,
      );
    });
  });
});
