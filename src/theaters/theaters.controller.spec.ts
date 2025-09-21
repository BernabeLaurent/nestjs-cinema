/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TheatersController } from './theaters.controller';
import { TheatersService } from './theaters.service';
import { CreateTheaterDto } from './dtos/create-theater.dto';
import { PatchTheaterDto } from './dtos/patch-theater.dto';
import { GetTheaterDto } from './dtos/get-theater.dto';
import { RegionsIso } from '../common/enums/regions-iso.enum';

describe('TheatersController', () => {
  let controller: TheatersController;
  let theatersService: TheatersService;

  const mockTheater = {
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
    const mockTheatersService = {
      findOneById: jest.fn(() => Promise.resolve(mockTheater as GetTheaterDto)),
      create: jest.fn(() => Promise.resolve(mockTheater as CreateTheaterDto)),
      update: jest.fn(() => Promise.resolve(mockTheater as PatchTheaterDto)),
      delete: jest.fn(() => Promise.resolve({ deleted: true, id: 1 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheatersController],
      providers: [
        {
          provide: TheatersService,
          useValue: mockTheatersService,
        },
      ],
    }).compile();

    controller = module.get(TheatersController);
    theatersService = module.get(TheatersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTheater', () => {
    it('should return a theater by id', async () => {
      const getTheaterDto: GetTheaterDto = { id: 1 };
      (theatersService.findOneById as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockTheater),
      );

      const result = await controller.getTheater(getTheaterDto.id);

      expect(theatersService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTheater);
    });
  });

  describe('createTheater', () => {
    it('should create a new theater', async () => {
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
      (theatersService.create as jest.Mock).mockImplementation(() =>
        Promise.resolve(expectedResult),
      );

      const result = await controller.createTheater(createTheaterDto);

      expect(theatersService.create).toHaveBeenCalledWith(createTheaterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTheater', () => {
    it('should update a theater', async () => {
      const id = 1;
      const patchTheaterDto: PatchTheaterDto = {
        name: 'Updated Theater',
        codeCountry: RegionsIso.FRANCE,
        address: 'quelque part',
        city: 'Lyon',
        zipCode: 83140,
        phoneNumber: '+33612345678',
        openingTime: '10:00',
        closingTime: '00:00',
      } as PatchTheaterDto;

      const updatedTheater = { ...mockTheater, ...patchTheaterDto };
      (theatersService.update as jest.Mock).mockImplementation(() =>
        Promise.resolve(updatedTheater),
      );

      const result = await controller.updateTheater(id, patchTheaterDto);

      expect(theatersService.update).toHaveBeenCalledWith(id, patchTheaterDto);
      expect(result).toEqual(updatedTheater);
    });
  });

  describe('deleteTheater', () => {
    it('should delete a theater', async () => {
      const id = 1;
      const deleteResult = { deleted: true, id };
      (theatersService.delete as jest.Mock).mockImplementation(() =>
        Promise.resolve(deleteResult),
      );

      const result = await controller.deleteTheater(id);

      expect(theatersService.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deleteResult);
    });
  });
});
