import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { DataResponseInterceptor } from './data-response.interceptor';

interface DataResponse<T = any> {
  data: T;
  apiVersion: string | undefined;
}

describe('DataResponseInterceptor', () => {
  let interceptor: DataResponseInterceptor;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataResponseInterceptor,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    interceptor = module.get<DataResponseInterceptor>(DataResponseInterceptor);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should have configService injected', () => {
    expect(configService).toBeDefined();
  });

  describe('intercept', () => {
    it('should wrap response data with apiVersion', (done) => {
      const mockData = { id: 1, name: 'test' };
      const mockApiVersion = '1.0.0';

      const mockExecutionContext = {} as ExecutionContext;
      const handleSpy = jest.fn().mockReturnValue(of(mockData));
      const mockCallHandler = {
        handle: handleSpy,
      } as CallHandler;

      mockConfigService.get.mockReturnValue(mockApiVersion);

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result: DataResponse) => {
          expect(result).toEqual({
            data: mockData,
            apiVersion: mockApiVersion,
          });
          expect(mockConfigService.get).toHaveBeenCalledWith(
            'appConfig.apiVersion',
          );
          expect(handleSpy).toHaveBeenCalled();
          done();
        });
    });

    it('should handle null data', (done) => {
      const mockData = null;
      const mockApiVersion = '2.0.0';

      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as CallHandler;

      mockConfigService.get.mockReturnValue(mockApiVersion);

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result: DataResponse) => {
          expect(result).toEqual({
            data: null,
            apiVersion: mockApiVersion,
          });
          done();
        });
    });

    it('should handle undefined data', (done) => {
      const mockData = undefined;
      const mockApiVersion = '1.5.0';

      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as CallHandler;

      mockConfigService.get.mockReturnValue(mockApiVersion);

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result: DataResponse) => {
          expect(result).toEqual({
            data: undefined,
            apiVersion: mockApiVersion,
          });
          done();
        });
    });

    it('should handle array data', (done) => {
      const mockData = [{ id: 1 }, { id: 2 }];
      const mockApiVersion = '1.2.0';

      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as CallHandler;

      mockConfigService.get.mockReturnValue(mockApiVersion);

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result: DataResponse) => {
          expect(result).toEqual({
            data: mockData,
            apiVersion: mockApiVersion,
          });
          done();
        });
    });

    it('should handle string data', (done) => {
      const mockData = 'simple string';
      const mockApiVersion = '1.0.1';

      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as CallHandler;

      mockConfigService.get.mockReturnValue(mockApiVersion);

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result: DataResponse) => {
          expect(result).toEqual({
            data: mockData,
            apiVersion: mockApiVersion,
          });
          done();
        });
    });

    it('should handle missing apiVersion config', (done) => {
      const mockData = { test: 'data' };

      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(mockData)),
      } as CallHandler;

      mockConfigService.get.mockReturnValue(undefined);

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result: DataResponse) => {
          expect(result).toEqual({
            data: mockData,
            apiVersion: undefined,
          });
          done();
        });
    });

    it('should call next.handle() and pipe the result', (done) => {
      const mockData = { id: 1 };
      const mockApiVersion = '1.0.0';

      const mockExecutionContext = {} as ExecutionContext;
      const handleSpy = jest.fn().mockReturnValue(of(mockData));
      const mockCallHandler = {
        handle: handleSpy,
      } as CallHandler;

      mockConfigService.get.mockReturnValue(mockApiVersion);

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      expect(handleSpy).toHaveBeenCalled();
      expect(result$).toBeDefined();

      result$.subscribe((result: DataResponse) => {
        expect(result.data).toEqual(mockData);
        expect(result.apiVersion).toBe(mockApiVersion);
        done();
      });
    });
  });
});
