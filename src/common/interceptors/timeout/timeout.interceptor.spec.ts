import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { of, throwError, delay, timer } from 'rxjs';
import { TimeoutError } from 'rxjs';
import { TimeoutInterceptor } from './timeout.interceptor';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TimeoutInterceptor,
          useClass: TimeoutInterceptor,
        },
      ],
    }).compile();

    interceptor = module.get(TimeoutInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should allow request to complete within timeout', (done) => {
      const mockData = { id: 1, name: 'test' };
      const mockExecutionContext = {} as ExecutionContext;
      const handleSpy = jest.fn().mockReturnValue(of(mockData));
      const mockCallHandler = {
        handle: handleSpy,
      } as CallHandler;

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .subscribe((result) => {
          expect(result).toEqual(mockData);
          expect(handleSpy).toHaveBeenCalled();
          done();
        });
    });

    it('should throw RequestTimeoutException when timeout occurs', (done) => {
      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(timer(35000)), // Longer than 30s timeout
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should not complete successfully');
        },
        error: (error: RequestTimeoutException) => {
          expect(error).toBeInstanceOf(RequestTimeoutException);
          expect(error.message).toBe('Request timed out');
          done();
        },
      });
    }, 40000);

    it('should handle TimeoutError and convert to RequestTimeoutException', (done) => {
      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => new TimeoutError())),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should not complete successfully');
        },
        error: (error: RequestTimeoutException) => {
          expect(error).toBeInstanceOf(RequestTimeoutException);
          expect(error.message).toBe('Request timed out');
          done();
        },
      });
    });

    it('should preserve HttpException errors', (done) => {
      const originalError = new HttpException(
        'Not Found',
        HttpStatus.NOT_FOUND,
      );
      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => originalError)),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should not complete successfully');
        },
        error: (error: HttpException) => {
          expect(error).toBe(originalError);
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('Not Found');
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
          done();
        },
      });
    });

    it('should convert other errors to generic Error', (done) => {
      const originalError = 'Some string error';
      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => originalError)),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should not complete successfully');
        },
        error: (error: Error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Some string error');
          done();
        },
      });
    });

    it('should handle numeric errors', (done) => {
      const originalError = 500;
      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => originalError)),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should not complete successfully');
        },
        error: (error: Error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('500');
          done();
        },
      });
    });

    it('should handle object errors', (done) => {
      const originalError = { message: 'Complex error', code: 'ERR_001' };
      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => originalError)),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should not complete successfully');
        },
        error: (error: Error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('[object Object]');
          done();
        },
      });
    });

    it('should apply 30 second timeout', (done) => {
      const startTime = Date.now();
      const mockExecutionContext = {} as ExecutionContext;

      // Create an observable that takes longer than 30 seconds
      const longRunningObservable = of(null).pipe(delay(35000));
      const mockCallHandler = {
        handle: jest.fn().mockReturnValue(longRunningObservable),
      } as CallHandler;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          fail('Should timeout before completion');
        },
        error: (error: RequestTimeoutException) => {
          const elapsed = Date.now() - startTime;
          expect(error).toBeInstanceOf(RequestTimeoutException);
          expect(elapsed).toBeLessThan(32000); // Should timeout around 30s, with some margin
          expect(elapsed).toBeGreaterThan(29000); // But not too early
          done();
        },
      });
    }, 40000); // Set test timeout higher than interceptor timeout

    it('should call next.handle() and return observable', () => {
      const mockData = { test: 'data' };
      const mockExecutionContext = {} as ExecutionContext;
      const handleSpy = jest.fn().mockReturnValue(of(mockData));
      const mockCallHandler = {
        handle: handleSpy,
      } as CallHandler;

      const result$ = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      expect(handleSpy).toHaveBeenCalled();
      expect(result$).toBeDefined();
    });
  });
});