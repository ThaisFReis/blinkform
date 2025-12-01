import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SchemaParserService } from '../schema-parser/schema-parser.service';

describe('ActionsService', () => {
  let service: ActionsService;
  let prismaService: jest.Mocked<PrismaService>;
  let redisService: jest.Mocked<RedisService>;
  let schemaParserService: jest.Mocked<SchemaParserService>;

  const mockForm = {
    id: 'test-form-id',
    title: 'Test Form',
    schema: {
      nodes: [
        {
          id: 'start',
          type: 'input',
          data: { questionText: 'What is your name?' },
        },
        {
          id: 'end',
          type: 'end',
          data: { message: 'Thank you!' },
        },
      ],
      edges: [
        {
          id: 'edge1',
          source: 'start',
          target: 'end',
        },
      ],
    },
  };

  const mockCurrentNode = {
    id: 'start',
    type: 'input',
    data: { questionText: 'What is your name?' },
  };

  const mockNextNode = {
    id: 'end',
    type: 'end',
    data: { message: 'Thank you!' },
  };

  const mockActionResponse = {
    icon: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=BlinkForm',
    title: 'Test Form',
    description: 'Question: What is your name?',
    label: 'Continue',
    links: {
      actions: [
        {
          label: 'What is your name?',
          href: '/api/actions/start?node=start',
        },
      ],
    },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      form: {
        findUnique: jest.fn(),
      },
      submission: {
        create: jest.fn(),
      },
    } as any;

    const mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const mockSchemaParserService = {
      getCurrentNode: jest.fn(),
      getStartNode: jest.fn(),
      getNextNode: jest.fn(),
      generateActionResponse: jest.fn(),
      processUserInput: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: SchemaParserService,
          useValue: mockSchemaParserService,
        },
      ],
    }).compile();

    service = module.get<ActionsService>(ActionsService);
    prismaService = module.get(PrismaService);
    redisService = module.get(RedisService);
    schemaParserService = module.get(SchemaParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAction', () => {
    it('should return action for new user (no session)', async () => {
      prismaService.form.findUnique.mockResolvedValue(mockForm);
      redisService.get.mockResolvedValue(null);
      schemaParserService.getStartNode.mockReturnValue(mockCurrentNode);
      schemaParserService.getNextNode.mockReturnValue(mockNextNode);
      schemaParserService.generateActionResponse.mockReturnValue(mockActionResponse);

      const result = await service.getAction('test-form-id');

      expect(prismaService.form.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-form-id' },
      });
      expect(redisService.get).not.toHaveBeenCalled();
      expect(schemaParserService.getStartNode).toHaveBeenCalledWith(mockForm.schema);
      expect(schemaParserService.generateActionResponse).toHaveBeenCalledWith(
        mockForm.title,
        mockCurrentNode,
        mockNextNode.id
      );
      expect(result).toEqual(mockActionResponse);
    });

    it('should return action for existing user session', async () => {
      const sessionData = JSON.stringify({ current_node_id: 'start' });
      prismaService.form.findUnique.mockResolvedValue(mockForm);
      redisService.get.mockResolvedValue(sessionData);
      schemaParserService.getCurrentNode.mockReturnValue(mockCurrentNode);
      schemaParserService.getNextNode.mockReturnValue(mockNextNode);
      schemaParserService.generateActionResponse.mockReturnValue(mockActionResponse);

      const result = await service.getAction('test-form-id', 'user123');

      expect(redisService.get).toHaveBeenCalledWith('session:test-form-id:user123');
      expect(schemaParserService.getCurrentNode).toHaveBeenCalledWith(mockForm.schema, 'start');
      expect(result).toEqual(mockActionResponse);
    });

    it('should throw error when form not found', async () => {
      prismaService.form.findUnique.mockResolvedValue(null);

      await expect(service.getAction('non-existent-id')).rejects.toThrow('Form not found');
    });

    it('should throw error when no valid node found', async () => {
      prismaService.form.findUnique.mockResolvedValue(mockForm);
      redisService.get.mockResolvedValue(null);
      schemaParserService.getStartNode.mockReturnValue(null);

      await expect(service.getAction('test-form-id')).rejects.toThrow('No valid node found in form schema');
    });
  });

  describe('postAction', () => {
    const mockSessionData = { current_node_id: 'start', answers: {} };

    it('should process user input and return next action', async () => {
      const userInput = 'John Doe';
      const processResult = { nextNodeId: 'end', isValid: true };

      prismaService.form.findUnique.mockResolvedValue(mockForm);
      redisService.get.mockResolvedValue(JSON.stringify(mockSessionData));
      schemaParserService.getCurrentNode.mockReturnValue(mockCurrentNode);
      schemaParserService.processUserInput.mockReturnValue(processResult);
      schemaParserService.getCurrentNode.mockReturnValueOnce(mockNextNode);
      schemaParserService.generateActionResponse.mockReturnValue(mockActionResponse);
      redisService.set.mockResolvedValue('OK');

      const result = await service.postAction('test-form-id', 'user123', { input: userInput });

      expect(schemaParserService.processUserInput).toHaveBeenCalledWith(
        mockForm.schema,
        'start',
        userInput
      );
      expect(redisService.set).toHaveBeenCalledWith(
        'session:test-form-id:user123',
        JSON.stringify({
          current_node_id: 'end',
          answers: { start: userInput },
        }),
        3600
      );
      expect(result).toEqual(mockActionResponse);
    });

    it('should return error response for invalid input', async () => {
      const userInput = '';
      const processResult = { nextNodeId: 'start', isValid: false, error: 'Invalid input' };

      prismaService.form.findUnique.mockResolvedValue(mockForm);
      redisService.get.mockResolvedValue(JSON.stringify(mockSessionData));
      schemaParserService.getCurrentNode.mockReturnValue(mockCurrentNode);
      schemaParserService.processUserInput.mockReturnValue(processResult);

      const result = await service.postAction('test-form-id', 'user123', { input: userInput });

      expect(result).toEqual({
        type: 'error',
        message: 'Invalid input',
        links: {
          actions: [{
            label: 'Try Again',
            href: '/api/actions/test-form-id?account=user123'
          }]
        }
      });
    });

    it('should complete form and save submission', async () => {
      const userInput = 'Final Answer';
      const processResult = { nextNodeId: null, isValid: true };

      prismaService.form.findUnique.mockResolvedValue(mockForm);
      redisService.get.mockResolvedValue(JSON.stringify(mockSessionData));
      schemaParserService.getCurrentNode.mockReturnValue(mockCurrentNode);
      schemaParserService.processUserInput.mockReturnValue(processResult);
      prismaService.submission.create.mockResolvedValue({
        id: 'submission-id',
        formId: 'test-form-id',
        userAccount: 'user123',
        answers: { start: userInput },
        createdAt: new Date(),
      });
      redisService.del.mockResolvedValue(1);

      const result = await service.postAction('test-form-id', 'user123', { input: userInput });

      expect(prismaService.submission.create).toHaveBeenCalledWith({
        data: {
          formId: 'test-form-id',
          userAccount: 'user123',
          answers: { start: userInput },
        },
      });
      expect(redisService.del).toHaveBeenCalledWith('session:test-form-id:user123');
      expect((result as any).type).toBe('completed');
      expect((result as any).title).toBe('Test Form');
    });

    it('should start from beginning if no current session', async () => {
      const userInput = 'First Answer';

      prismaService.form.findUnique.mockResolvedValue(mockForm);
      redisService.get.mockResolvedValue(null);
      schemaParserService.getStartNode.mockReturnValue(mockCurrentNode);
      schemaParserService.processUserInput.mockReturnValue({ nextNodeId: 'end', isValid: true });
      schemaParserService.getCurrentNode.mockReturnValue(mockNextNode);
      schemaParserService.generateActionResponse.mockReturnValue(mockActionResponse);
      redisService.set.mockResolvedValue('OK');

      const result = await service.postAction('test-form-id', 'user123', { input: userInput });

      expect(schemaParserService.getStartNode).toHaveBeenCalledWith(mockForm.schema);
      expect(result).toEqual(mockActionResponse);
    });
  });
});