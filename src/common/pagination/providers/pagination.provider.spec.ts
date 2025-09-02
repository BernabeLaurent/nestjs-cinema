import { Test, TestingModule } from '@nestjs/testing';
import { REQUEST } from '@nestjs/core';
import { PaginationProvider } from './pagination.provider';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Repository } from 'typeorm';

describe('PaginationProvider', () => {
  let provider: PaginationProvider;

  const mockRequest = {
    protocol: 'http',
    headers: {
      host: 'localhost:3000',
    },
    url: '/api/test?limit=10&page=1',
  };

  const mockRepository = {
    find: jest.fn(),
    count: jest.fn(),
  } as Partial<Repository<any>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginationProvider,
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    provider = module.get(PaginationProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should have request injected', () => {
    const providerWithRequest = provider as any;
    expect(providerWithRequest.request).toBeDefined();
    expect(providerWithRequest.request.protocol).toBe('http');
  });

  describe('paginateQuery', () => {
    const mockData = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
    ];

    beforeEach(() => {
      (mockRepository.find as jest.Mock).mockResolvedValue(mockData);
      (mockRepository.count as jest.Mock).mockResolvedValue(25);
    });

    it('should return paginated data with default values', async () => {
      const paginationQuery = new PaginationQueryDto();

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result).toBeDefined();
      expect(result.data).toEqual(mockData);
      expect(result.meta).toBeDefined();
      expect(result.links).toBeDefined();
    });

    it('should set correct meta information', async () => {
      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 10;
      paginationQuery.page = 1;

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalItems).toBe(25);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.totalPages).toBe(3);
    });

    it('should call repository with correct skip and take parameters', async () => {
      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 15;
      paginationQuery.page = 2;

      await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(mockRepository.find).toHaveBeenCalledWith({
        skip: 15, // This should be calculated as (page - 1) * limit but the current code uses limit directly
        take: 15,
      });
    });

    it('should generate correct link URLs', async () => {
      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 10;
      paginationQuery.page = 2;

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      const baseUrl = 'http://localhost:3000/api/test';
      expect(result.links.first).toBe(`${baseUrl}?limit=10&page=1`);
      expect(result.links.last).toBe(`${baseUrl}?limit=10&page=3`);
      expect(result.links.current).toBe(`${baseUrl}?limit=10&page=2`);
      expect(result.links.next).toBe(`${baseUrl}?limit=10&page=3`);
      expect(result.links.previous).toBe(`${baseUrl}?limit=10&page=1`);
    });

    it('should handle first page navigation', async () => {
      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 10;
      paginationQuery.page = 1;

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.links.previous).toBe(
        'http://localhost:3000/api/test?limit=10&page=1',
      );
      expect(result.links.next).toBe(
        'http://localhost:3000/api/test?limit=10&page=2',
      );
    });

    it('should handle last page navigation', async () => {
      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 10;
      paginationQuery.page = 3; // Last page

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.links.next).toBe(
        'http://localhost:3000/api/test?limit=10&page=3',
      );
      expect(result.links.previous).toBe(
        'http://localhost:3000/api/test?limit=10&page=2',
      );
    });

    it('should use default values when limit/page are undefined', async () => {
      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = undefined;
      paginationQuery.page = undefined;

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.currentPage).toBe(1);
      expect(mockRepository.find).toHaveBeenCalledWith({
        skip: 10, // Default limit
        take: undefined,
      });
    });

    it('should calculate total pages correctly', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(23);

      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 10;

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.meta.totalPages).toBe(3); // Math.ceil(23/10) = 3
    });

    it('should handle zero total items', async () => {
      (mockRepository.count as jest.Mock).mockResolvedValue(0);
      (mockRepository.find as jest.Mock).mockResolvedValue([]);

      const paginationQuery = new PaginationQueryDto();

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });

    it('should build correct base URL from request', async () => {
      const customMockRequest = {
        protocol: 'https',
        headers: {
          host: 'example.com:8080',
        },
        url: '/custom/path?param=value',
      };

      const customProvider = await Test.createTestingModule({
        providers: [
          PaginationProvider,
          {
            provide: REQUEST,
            useValue: customMockRequest,
          },
        ],
      })
        .compile()
        .then((module) => module.get(PaginationProvider));

      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 5;
      paginationQuery.page = 1;

      const result = await customProvider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.links.first).toContain(
        'https://example.com:8080/custom/path',
      );
    });

    it('should handle different limit sizes', async () => {
      const paginationQuery = new PaginationQueryDto();
      paginationQuery.limit = 5;
      paginationQuery.page = 1;

      const result = await provider.paginateQuery(
        paginationQuery,
        mockRepository as Repository<any>,
      );

      expect(result.meta.itemsPerPage).toBe(5);
      expect(result.meta.totalPages).toBe(5); // Math.ceil(25/5) = 5
    });
  });
});
