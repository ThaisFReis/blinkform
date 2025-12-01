import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';

describe('ActionsController', () => {
  let controller: ActionsController;
  let actionsService: jest.Mocked<ActionsService>;

  const mockActionResponse = {
    icon: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=BlinkForm',
    title: 'Test Form',
    description: 'Question: What is your name?',
    label: 'Continue',
    links: {
      actions: [{
        label: 'What is your name?',
        href: '/api/actions/start?node=start',
      }],
    },
  };

  beforeEach(async () => {
    const mockActionsService = {
      getAction: jest.fn(),
      postAction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [
        {
          provide: ActionsService,
          useValue: mockActionsService,
        },
      ],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
    actionsService = module.get(ActionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAction', () => {
    it('should get action for a form without account', async () => {
      actionsService.getAction.mockResolvedValue(mockActionResponse);

      const result = await controller.getAction('test-form-id');

      expect(actionsService.getAction).toHaveBeenCalledWith('test-form-id', undefined);
      expect(result).toEqual(mockActionResponse);
    });

    it('should get action for a form with account', async () => {
      const account = 'user123';
      actionsService.getAction.mockResolvedValue(mockActionResponse);

      const result = await controller.getAction('test-form-id', account);

      expect(actionsService.getAction).toHaveBeenCalledWith('test-form-id', account);
      expect(result).toEqual(mockActionResponse);
    });
  });

  describe('postAction', () => {
    it('should post action for a form', async () => {
      const formId = 'test-form-id';
      const account = 'user123';
      const body = { input: 'test input' };

      actionsService.postAction.mockResolvedValue(mockActionResponse);

      const result = await controller.postAction(formId, account, body);

      expect(actionsService.postAction).toHaveBeenCalledWith(formId, account, body);
      expect(result).toEqual(mockActionResponse);
    });
  });
});