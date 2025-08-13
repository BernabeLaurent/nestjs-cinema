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
      findOneById: jest.fn(() => Promise.resolve(mockTheater)),
      create: jest.fn(() => Promise.resolve(mockTheater)),
      update: jest.fn(() => Promise.resolve(mockTheater)),
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

    controller = module.get<TheatersController>(TheatersController);
    theatersService = module.get<TheatersService>(TheatersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTheater', () => {
    it('should return a theater by id', async () => {
      const getTheaterDto: GetTheaterDto = { id: 1 };
      const findOneByIdSpy = jest
        .spyOn(theatersService, 'findOneById')
        .mockResolvedValue(mockTheater);

      const result = await controller.getTheater(getTheaterDto);

      expect(findOneByIdSpy).toHaveBeenCalledWith(1);
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
      const createSpy = jest
        .spyOn(theatersService, 'create')
        .mockResolvedValue(expectedResult);

      const result = await controller.createTheater(createTheaterDto);

      expect(createSpy).toHaveBeenCalledWith(createTheaterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTheater', () => {
    it('should update a theater', async () => {
      const id = 1;
      const patchTheaterDto: PatchTheaterDto = {
        name: 'Updated Theater',
        city: 'Lyon',
      };

      const updatedTheater = { ...mockTheater, ...patchTheaterDto };
      const updateSpy = jest
        .spyOn(theatersService, 'update')
        .mockResolvedValue(updatedTheater);

      const result = await controller.updateTheater(id, patchTheaterDto);

      expect(updateSpy).toHaveBeenCalledWith(id, patchTheaterDto);
      expect(result).toEqual(updatedTheater);
    });
  });

  describe('deleteTheater', () => {
    it('should delete a theater', async () => {
      const id = 1;
      const deleteResult = { deleted: true, id };
      const deleteSpy = jest
        .spyOn(theatersService, 'delete')
        .mockResolvedValue(deleteResult);

      const result = await controller.deleteTheater(id);

      expect(deleteSpy).toHaveBeenCalledWith(id);
      expect(result).toEqual(deleteResult);
    });
  });
});
