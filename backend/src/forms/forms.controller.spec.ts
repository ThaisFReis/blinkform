import { Test, TestingModule } from '@nestjs/testing';
import { FormsController } from './forms.controller';
import { FormsService, CreateFormDto, UpdateFormDto } from './forms.service';

describe('FormsController', () => {
  let controller: FormsController;
  let formsService: jest.Mocked<FormsService>;

  const mockForm = {
    id: 'test-form-id',
    creatorAddress: 'test-creator',
    title: 'Test Form',
    description: 'Test Description',
    schema: { nodes: [], edges: [] },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockFormsService = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      findAllByCreator: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsController],
      providers: [
        {
          provide: FormsService,
          useValue: mockFormsService,
        },
      ],
    }).compile();

    controller = module.get<FormsController>(FormsController);
    formsService = module.get(FormsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a form and return result', async () => {
      const createFormDto: CreateFormDto = {
        title: 'New Form',
        description: 'New Description',
        schema: { nodes: [], edges: [] },
      };

      const expectedResult = { id: 'new-form-id' };
      formsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createFormDto);

      expect(formsService.create).toHaveBeenCalledWith(createFormDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a form by id', async () => {
      formsService.findOne.mockResolvedValue(mockForm);

      const result = await controller.findOne('test-form-id');

      expect(formsService.findOne).toHaveBeenCalledWith('test-form-id');
      expect(result).toEqual(mockForm);
    });
  });

  describe('update', () => {
    it('should update a form and return result', async () => {
      const updateFormDto: UpdateFormDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      formsService.update.mockResolvedValue(mockForm);

      const result = await controller.update('test-form-id', updateFormDto);

      expect(formsService.update).toHaveBeenCalledWith('test-form-id', updateFormDto);
      expect(result).toEqual(mockForm);
    });
  });

  describe('findAllByCreator', () => {
    it('should return forms for a creator', async () => {
      const forms = [mockForm];
      formsService.findAllByCreator.mockResolvedValue(forms);

      const result = await controller.findAllByCreator('test-creator');

      expect(formsService.findAllByCreator).toHaveBeenCalledWith('test-creator');
      expect(result).toEqual(forms);
    });
  });
});