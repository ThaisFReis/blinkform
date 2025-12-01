import { Test, TestingModule } from '@nestjs/testing';
import { FormsService, CreateFormDto, UpdateFormDto } from './forms.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FormsService', () => {
  let service: FormsService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockForm = {
    id: 'test-form-id',
    creatorAddress: 'test-creator-address',
    title: 'Test Form',
    description: 'Test Description',
    schema: { nodes: [], edges: [] },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      form: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a form successfully', async () => {
      const createFormDto: CreateFormDto = {
        title: 'Test Form',
        description: 'Test Description',
        schema: { nodes: [], edges: [] },
      };

      prismaService.form.create.mockResolvedValue(mockForm);

      const result = await service.create(createFormDto);

      expect(prismaService.form.create).toHaveBeenCalledWith({
        data: {
          creatorAddress: 'test-creator-address',
          title: createFormDto.title,
          description: createFormDto.description,
          schema: createFormDto.schema,
        },
      });
      expect(result).toEqual({ id: mockForm.id });
    });

    it('should create a form with custom creator address', async () => {
      const createFormDto: CreateFormDto = {
        creatorAddress: 'custom-creator',
        title: 'Test Form',
        description: 'Test Description',
        schema: { nodes: [], edges: [] },
      };

      prismaService.form.create.mockResolvedValue({ ...mockForm, creatorAddress: 'custom-creator' });

      const result = await service.create(createFormDto);

      expect(prismaService.form.create).toHaveBeenCalledWith({
        data: {
          creatorAddress: 'custom-creator',
          title: createFormDto.title,
          description: createFormDto.description,
          schema: createFormDto.schema,
        },
      });
      expect(result).toEqual({ id: mockForm.id });
    });
  });

  describe('findOne', () => {
    it('should return a form when found', async () => {
      prismaService.form.findUnique.mockResolvedValue(mockForm);

      const result = await service.findOne('test-form-id');

      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-form-id' },
      });
      expect(result).toEqual(mockForm);
    });

    it('should throw an error when form not found', async () => {
      prismaService.form.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow('Form not found');
      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });
  });

  describe('update', () => {
    it('should update a form successfully', async () => {
      const updateFormDto: UpdateFormDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const updatedForm = { ...mockForm, ...updateFormDto };
      prismaService.form.update.mockResolvedValue(updatedForm);

      const result = await service.update('test-form-id', updateFormDto);

      expect(prismaService.form.update).toHaveBeenCalledWith({
        where: { id: 'test-form-id' },
        data: updateFormDto,
      });
      expect(result).toEqual(updatedForm);
    });
  });

  describe('findAllByCreator', () => {
    it('should return forms for a creator', async () => {
      const forms = [mockForm];
      prismaService.form.findMany.mockResolvedValue(forms);

      const result = await service.findAllByCreator('test-creator');

      expect(prismaService.form.findMany).toHaveBeenCalledWith({
        where: { creatorAddress: 'test-creator' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(forms);
    });
  });
});