import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be an instance of PrismaClient', () => {
    // Since PrismaService extends PrismaClient, it should have PrismaClient methods
    expect(service).toHaveProperty('$connect');
    expect(service).toHaveProperty('$disconnect');
    expect(service).toHaveProperty('form');
    expect(service).toHaveProperty('submission');
  });

  describe('onModuleInit', () => {
    it('should call $connect when initialized', async () => {
      // Mock the $connect method
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
      connectSpy.mockRestore();
    });
  });
});