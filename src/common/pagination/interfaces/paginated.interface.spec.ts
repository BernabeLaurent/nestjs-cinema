import { Paginated } from './paginated.interface';

describe('Paginated Interface', () => {
  it('should define correct structure', () => {
    const mockPaginatedData: Paginated<{ id: number; name: string }> = {
      data: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      meta: {
        itemsPerPage: 10,
        totalItems: 25,
        currentPage: 1,
        totalPages: 3,
      },
      links: {
        first: 'http://localhost:3000/api/items?limit=10&page=1',
        last: 'http://localhost:3000/api/items?limit=10&page=3',
        current: 'http://localhost:3000/api/items?limit=10&page=1',
        next: 'http://localhost:3000/api/items?limit=10&page=2',
        previous: 'http://localhost:3000/api/items?limit=10&page=1',
      },
    };

    expect(mockPaginatedData).toBeDefined();
    expect(mockPaginatedData.data).toBeInstanceOf(Array);
    expect(mockPaginatedData.meta).toBeDefined();
    expect(mockPaginatedData.links).toBeDefined();
  });

  it('should have correct meta properties', () => {
    const mockPaginatedData: Paginated<string> = {
      data: ['test1', 'test2'],
      meta: {
        itemsPerPage: 10,
        totalItems: 25,
        currentPage: 2,
        totalPages: 3,
      },
      links: {
        first: 'first-link',
        last: 'last-link',
        current: 'current-link',
        next: 'next-link',
        previous: 'previous-link',
      },
    };

    expect(mockPaginatedData.meta.itemsPerPage).toBe(10);
    expect(mockPaginatedData.meta.totalItems).toBe(25);
    expect(mockPaginatedData.meta.currentPage).toBe(2);
    expect(mockPaginatedData.meta.totalPages).toBe(3);
  });

  it('should have correct link properties', () => {
    const mockPaginatedData: Paginated<number> = {
      data: [1, 2, 3],
      meta: {
        itemsPerPage: 5,
        totalItems: 20,
        currentPage: 3,
        totalPages: 4,
      },
      links: {
        first: 'http://example.com/first',
        last: 'http://example.com/last',
        current: 'http://example.com/current',
        next: 'http://example.com/next',
        previous: 'http://example.com/previous',
      },
    };

    expect(mockPaginatedData.links.first).toBe('http://example.com/first');
    expect(mockPaginatedData.links.last).toBe('http://example.com/last');
    expect(mockPaginatedData.links.current).toBe('http://example.com/current');
    expect(mockPaginatedData.links.next).toBe('http://example.com/next');
    expect(mockPaginatedData.links.previous).toBe(
      'http://example.com/previous',
    );
  });

  it('should work with different data types', () => {
    interface TestUser {
      id: number;
      email: string;
      isActive: boolean;
    }

    const mockUserPagination: Paginated<TestUser> = {
      data: [
        { id: 1, email: 'user1@test.com', isActive: true },
        { id: 2, email: 'user2@test.com', isActive: false },
      ],
      meta: {
        itemsPerPage: 2,
        totalItems: 2,
        currentPage: 1,
        totalPages: 1,
      },
      links: {
        first: 'first',
        last: 'last',
        current: 'current',
        next: 'next',
        previous: 'previous',
      },
    };

    expect(mockUserPagination.data[0].id).toBe(1);
    expect(mockUserPagination.data[0].email).toBe('user1@test.com');
    expect(mockUserPagination.data[0].isActive).toBe(true);
    expect(mockUserPagination.data[1].isActive).toBe(false);
  });

  it('should handle empty data array', () => {
    const mockEmptyPagination: Paginated<any> = {
      data: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 0,
      },
      links: {
        first: 'first-link',
        last: 'last-link',
        current: 'current-link',
        next: 'next-link',
        previous: 'previous-link',
      },
    };

    expect(mockEmptyPagination.data).toEqual([]);
    expect(mockEmptyPagination.meta.totalItems).toBe(0);
    expect(mockEmptyPagination.meta.totalPages).toBe(0);
  });

  it('should support generic typing', () => {
    type ProductType = {
      id: string;
      name: string;
      price: number;
    };

    const mockProductPagination: Paginated<ProductType> = {
      data: [
        { id: 'prod-1', name: 'Product 1', price: 19.99 },
        { id: 'prod-2', name: 'Product 2', price: 29.99 },
      ],
      meta: {
        itemsPerPage: 2,
        totalItems: 50,
        currentPage: 1,
        totalPages: 25,
      },
      links: {
        first: 'products?page=1',
        last: 'products?page=25',
        current: 'products?page=1',
        next: 'products?page=2',
        previous: 'products?page=1',
      },
    };

    expect(mockProductPagination.data).toHaveLength(2);
    expect(mockProductPagination.data[0]).toHaveProperty('price');
    expect(typeof mockProductPagination.data[0].price).toBe('number');
  });
});
