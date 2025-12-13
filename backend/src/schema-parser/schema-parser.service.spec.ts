import { Test, TestingModule } from '@nestjs/testing';
import { SchemaParserService, FormSchema, FormNode, ActionResponse } from './schema-parser.service';

describe('SchemaParserService', () => {
  let service: SchemaParserService;

  const mockSchema: FormSchema = {
    nodes: [
      {
        id: 'start',
        type: 'input',
        data: { questionText: 'What is your name?' },
      },
      {
        id: 'choice1',
        type: 'choice',
        data: {
          questionText: 'Choose an option',
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ],
        },
      },
      {
        id: 'end',
        type: 'end',
        data: { message: 'Thank you!' },
      },
    ],
    edges: [
      { id: 'edge1', source: 'start', target: 'choice1' },
      { id: 'edge2', source: 'choice1', target: 'end' },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchemaParserService],
    }).compile();

    service = module.get<SchemaParserService>(SchemaParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentNode', () => {
    it('should return the current node when found', () => {
      const result = service.getCurrentNode(mockSchema, 'start');

      expect(result).toEqual(mockSchema.nodes[0]);
    });

    it('should return null when node not found', () => {
      const result = service.getCurrentNode(mockSchema, 'non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getStartNode', () => {
    it('should return the node with no incoming edges as start node', () => {
      const result = service.getStartNode(mockSchema);

      expect(result).toEqual(mockSchema.nodes[0]);
    });

    it('should return null for empty schema', () => {
      const emptySchema: FormSchema = { nodes: [], edges: [] };
      const result = service.getStartNode(emptySchema);

      expect(result).toBeNull();
    });
  });

  describe('getNextNode', () => {
    it('should return the next node based on edges', () => {
      const result = service.getNextNode(mockSchema, 'start');

      expect(result).toEqual(mockSchema.nodes[1]); // choice1 node
    });

    it('should return null when no edge found', () => {
      const result = service.getNextNode(mockSchema, 'end');

      expect(result).toBeNull();
    });
  });

  describe('generateActionResponse', () => {
    it('should generate action response for input node with nextNodeId', () => {
      const currentNode: FormNode = {
        id: 'input1',
        type: 'question',
        data: {
          questionText: 'What is your name?',
          questionType: 'input',
          validation: { required: true }
        }
      };
      const result = service.generateActionResponse('Test Form', currentNode, 'next-id', 'form-123');

      expect(result.type).toBe('action');
      expect(result.title).toBe('Test Form');
      expect(result.description).toBe('Question: What is your name?');
      expect(result.label).toBe('Continue');
      expect(result.links.actions).toHaveLength(1);
      expect(result.links.actions[0].label).toBe('Next');
      expect(result.links.actions[0].href).toContain('/api/actions/form-123?input={input}');
      expect(result.links.actions[0].parameters).toEqual([{
        name: 'input',
        label: 'What is your name?',
        required: true
      }]);
    });

    it('should generate action response for input node without nextNodeId (final step)', () => {
      const currentNode: FormNode = {
        id: 'input-final',
        type: 'question',
        data: {
          questionText: 'Final question?',
          questionType: 'input',
          validation: { required: false }
        }
      };
      const result = service.generateActionResponse('Test Form', currentNode, undefined, 'form-123');

      expect(result.type).toBe('action');
      expect(result.links.actions).toHaveLength(1);
      expect(result.links.actions[0].label).toBe('Submit');
      expect(result.links.actions[0].href).toContain('/api/actions/form-123?input={input}');
    });

    it('should generate action response for choice node', () => {
      const currentNode: FormNode = {
        id: 'choice1',
        type: 'question',
        data: {
          questionText: 'Choose an option',
          questionType: 'choice',
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ]
        }
      };
      const result = service.generateActionResponse('Test Form', currentNode, 'next-id', 'form-123');

      expect(result.type).toBe('action');
      expect(result.title).toBe('Test Form');
      expect(result.description).toBe('Question: Choose an option');
      expect(result.label).toBe('Continue');
      expect(result.links.actions).toHaveLength(2);
      expect(result.links.actions[0].label).toBe('Option A');
      expect(result.links.actions[0].href).toContain('/api/actions/form-123/a');
      expect(result.links.actions[1].label).toBe('Option B');
      expect(result.links.actions[1].href).toContain('/api/actions/form-123/b');
    });

    it('should generate action response for end node', () => {
      const currentNode = mockSchema.nodes[2]; // end node
      const result = service.generateActionResponse('Test Form', currentNode, 'next-id');

      expect(result.type).toBe('action');
      expect(result.title).toBe('Test Form');
      expect(result.description).toBe('Thank you!');
      expect(result.label).toBe('Complete');
      expect(result.links.actions).toHaveLength(1);
      expect(result.links.actions[0].label).toBe('Finish');
      expect(result.links.actions[0].href).toContain('/api/forms/complete');
    });

    it('should generate default action response for unknown node type', () => {
      const unknownNode: FormNode = {
        id: 'unknown',
        type: 'question',
        data: {
          questionType: 'unknown'
        },
      };
      const result = service.generateActionResponse('Test Form', unknownNode, 'next-id', 'form-123');

      expect(result.links.actions).toHaveLength(1);
      expect(result.links.actions[0].label).toBe('Continue');
      expect(result.links.actions[0].href).toContain('/api/actions/form-123');
    });
  });

  describe('validateNodeInput', () => {
    it('should validate required input node with valid input', () => {
      const node: FormNode = {
        id: 'input1',
        type: 'input',
        data: { required: true },
      };

      expect(service.validateNodeInput(node, 'valid input')).toBe(true);
    });

    it('should invalidate required input node with empty input', () => {
      const node: FormNode = {
        id: 'input1',
        type: 'input',
        data: { required: true },
      };

      expect(service.validateNodeInput(node, '')).toBe(false);
      expect(service.validateNodeInput(node, '   ')).toBe(false);
    });

    it('should validate non-required input node with empty input', () => {
      const node: FormNode = {
        id: 'input1',
        type: 'input',
        data: { required: false },
      };

      expect(service.validateNodeInput(node, '')).toBe(true);
    });

    it('should validate choice node with valid option', () => {
      const node: FormNode = {
        id: 'choice1',
        type: 'choice',
        data: {
          required: true,
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
      };

      expect(service.validateNodeInput(node, 'a')).toBe(true);
      expect(service.validateNodeInput(node, 'b')).toBe(true);
    });

    it('should invalidate choice node with invalid option', () => {
      const node: FormNode = {
        id: 'choice1',
        type: 'choice',
        data: {
          required: true,
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
      };

      expect(service.validateNodeInput(node, 'c')).toBe(false);
    });

    it('should validate non-required choice node with empty input', () => {
      const node: FormNode = {
        id: 'choice1',
        type: 'choice',
        data: { required: false },
      };

      expect(service.validateNodeInput(node, '')).toBe(true);
    });
  });

  describe('processUserInput', () => {
    it('should process valid input and return next node', () => {
      const result = service.processUserInput(mockSchema, 'start', 'John Doe');

      expect(result).toEqual({
        nextNodeId: 'choice1',
        isValid: true,
      });
    });

    it('should return error for invalid input', () => {
      const inputNode: FormNode = {
        id: 'input1',
        type: 'input',
        data: { required: true },
      };
      const schemaWithRequiredInput: FormSchema = {
        nodes: [inputNode],
        edges: [],
      };

      const result = service.processUserInput(schemaWithRequiredInput, 'input1', '');

      expect(result).toEqual({
        nextNodeId: 'input1',
        isValid: false,
        error: 'Invalid input',
      });
    });

    it('should return null nextNodeId when no next node', () => {
      const endNode: FormNode = {
        id: 'end',
        type: 'end',
        data: {},
      };
      const schemaWithEnd: FormSchema = {
        nodes: [endNode],
        edges: [],
      };

      const result = service.processUserInput(schemaWithEnd, 'end', 'anything');

      expect(result).toEqual({
        nextNodeId: null,
        isValid: true,
      });
    });

    it('should return error when node not found', () => {
      const result = service.processUserInput(mockSchema, 'non-existent', 'input');

      expect(result).toEqual({
        nextNodeId: null,
        isValid: false,
        error: 'Node not found',
      });
    });
  });
});