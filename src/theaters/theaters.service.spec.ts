import { Test, TestingModule } from '@nestjs/testing';
import { TheatersService } from './theaters.service';
import { CreateTheaterProvider } from './providers/create-theater.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Theater } from './theater.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateTheaterDto } from './dtos/create-theater.dto';
import { PatchTheaterDto } from './dtos/patch-theater.dto';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { BadRequestException, RequestTimeoutException } from '@nestjs/common';

describe('TheatersService', () => {
  let service: TheatersService;
  let theatersRepository: Repository<Theater>;
  let createTheaterProvider: CreateTheaterProvider;

  const mockTheater: Theater = {
    id: 1,
    name: 'Test Theater',
    zipCode: 75001,
    city: 'Paris',
    address: '123 Test Street',
    codeCountry: RegionsIso.FRANCE,
    openingTime: '08:00',
    closingTime: '23:00',
    phoneNumber: '+33123456789',
    createDate: new Date(),
    updateDate: new Date(),
    deleteDate: new Date(),
    moviesTheaters: [],
  };

  beforeEach(async () => {
    const mockTheatersRepository = {
      findOneBy: jest.fn(() => Promise.resolve(null)),
      save: jest.fn(() => Promise.resolve({})),
      softDelete: jest.fn(() =>
        Promise.resolve({
          affected: 1,
          raw: {},
          generatedMaps: [],
        } as UpdateResult),
      ),
    };

    const mockCreateTheaterProvider = {
      create: jest.fn(() => Promise.resolve(mockTheater)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TheatersService,
        {
          provide: CreateTheaterProvider,
          useValue: mockCreateTheaterProvider,
        },
        {
          provide: getRepositoryToken(Theater),
          useValue: mockTheatersRepository,
        },
      ],
    }).compile();

    service = module.get<TheatersService>(TheatersService);
    theatersRepository = module.get<Repository<Theater>>(
      getRepositoryToken(Theater),
    );
    createTheaterProvider = module.get<CreateTheaterProvider>(
      CreateTheaterProvider,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return theater when found', async () => {
      const findOneBySpy = jest
        .spyOn(theatersRepository, 'findOneBy')
        .mockResolvedValue(mockTheater);

      const result = await service.findOneById(1);

      expect(result).toEqual(mockTheater);
      expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw BadRequestException when theater not found', async () => {
      jest.spyOn(theatersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(BadRequestException);
      await expect(service.findOneById(1)).rejects.toThrow(
        'Theater not found WITH THIS ID',
      );
    });

    it('should throw RequestTimeoutException when database error occurs', async () => {
      jest
        .spyOn(theatersRepository, 'findOneBy')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findOneById(1)).rejects.toThrow(
        RequestTimeoutException,
      );
      await expect(service.findOneById(1)).rejects.toThrow(
        'unable to process your request',
      );
    });
  });

  describe('create', () => {
    it('should call createTheaterProvider.create', async () => {
      const createTheaterDto: CreateTheaterDto = {
        name: 'Test Theater',
        zipCode: 75002,
        city: 'Paris',
        address: '456 test',
        codeCountry: RegionsIso.FRANCE,
        openingTime: '09:00',
        closingTime: '22:00',
        phoneNumber: '+33987654321',
      };

      const expectedResult = { ...mockTheater, ...createTheaterDto };
      const createSpy = jest
        .spyOn(createTheaterProvider, 'create')
        .mockResolvedValue(expectedResult);

      const result = await service.create(createTheaterDto);

      expect(createSpy).toHaveBeenCalledWith(createTheaterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update theater successfully', async () => {
      const patchTheaterDto: PatchTheaterDto = {
        name: 'Updated Theater',
        city: 'Lyon',
      };

      const findOneBySpy = jest
        .spyOn(theatersRepository, 'findOneBy')
        .mockResolvedValue(mockTheater);
      const saveSpy = jest.spyOn(theatersRepository, 'save').mockResolvedValue({
        ...mockTheater,
        ...patchTheaterDto,
      });

      const result = await service.update(1, patchTheaterDto);

      expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });
      expect(saveSpy).toHaveBeenCalled();
      expect(result.name).toBe(patchTheaterDto.name);
      expect(result.city).toBe(patchTheaterDto.city);
    });

    it('should throw BadRequestException when theater not found for update', async () => {
      const patchTheaterDto: PatchTheaterDto = {
        name: 'Updated Theater',
      };

      jest.spyOn(theatersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, patchTheaterDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(1, patchTheaterDto)).rejects.toThrow(
        'Theater not found WITH THIS ID',
      );
    });

    it('should throw RequestTimeoutException when save fails', async () => {
      const patchTheaterDto: PatchTheaterDto = {
        name: 'Updated Theater',
      };

      jest
        .spyOn(theatersRepository, 'findOneBy')
        .mockResolvedValue(mockTheater);
      jest
        .spyOn(theatersRepository, 'save')
        .mockRejectedValue(new Error('Save error'));

      await expect(service.update(1, patchTheaterDto)).rejects.toThrow(
        RequestTimeoutException,
      );
    });
  });

  describe('delete', () => {
    it('should delete theater successfully', async () => {
      const findOneBySpy = jest
        .spyOn(theatersRepository, 'findOneBy')
        .mockResolvedValue(mockTheater);
      const softDeleteSpy = jest
        .spyOn(theatersRepository, 'softDelete')
        .mockResolvedValue({
          affected: 1,
          raw: {},
          generatedMaps: [],
        } as UpdateResult);

      const result = await service.delete(1);

      expect(findOneBySpy).toHaveBeenCalledWith({ id: 1 });
      expect(softDeleteSpy).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true, id: 1 });
    });

    it('should throw BadRequestException when theater not found for deletion', async () => {
      jest.spyOn(theatersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(BadRequestException);
      await expect(service.delete(1)).rejects.toThrow(
        'Theater not found WITH THIS ID',
      );
    });

    it('should throw RequestTimeoutException when delete fails', async () => {
      jest
        .spyOn(theatersRepository, 'findOneBy')
        .mockResolvedValue(mockTheater);
      jest
        .spyOn(theatersRepository, 'softDelete')
        .mockRejectedValue(new Error('Delete error'));

      await expect(service.delete(1)).rejects.toThrow(RequestTimeoutException);
    });
  });
});
