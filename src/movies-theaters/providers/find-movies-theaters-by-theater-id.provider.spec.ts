import { Test, TestingModule } from '@nestjs/testing';
import { FindMoviesTheatersByTheaterIdProvider } from './find-movies-theaters-by-theater-id.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieTheater } from '../movie-theater.entity';
import { Repository } from 'typeorm';

describe('FindMoviesTheatersByTheaterIdProvider', () => {
  let provider: FindMoviesTheatersByTheaterIdProvider;
  let repository: Repository<MovieTheater>;

  const mockRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindMoviesTheatersByTheaterIdProvider,
        {
          provide: getRepositoryToken(MovieTheater),
          useValue: mockRepository,
        },
      ],
    }).compile();

    provider = module.get(FindMoviesTheatersByTheaterIdProvider);
    repository = module.get<Repository<MovieTheater>>(
      getRepositoryToken(MovieTheater),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('findAll', () => {
    it('should find movies theaters by theater id', async () => {
      const theaterId = 1;
      const expectedMovieTheaters = [
        {
          id: 1,
          theater: { id: theaterId, name: 'Test Theater' },
        },
      ];

      mockRepository.find.mockResolvedValue(expectedMovieTheaters);

      const result = await provider.findAll(theaterId);

      expect(result).toEqual(expectedMovieTheaters);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { theater: { id: theaterId } },
        relations: ['theater'],
      });
    });

    it('should throw error when database operation fails', async () => {
      const theaterId = 1;
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(provider.findAll(theaterId)).rejects.toThrow(
        'Could not find movietheater with this id',
      );
    });
  });
});
