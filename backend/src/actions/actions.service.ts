import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SchemaParserService } from '../schema-parser/schema-parser.service';

@Injectable()
export class ActionsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private schemaParser: SchemaParserService,
  ) {}

  async getAction(formId: string, account?: string) {
    // Fetch form
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });
    if (!form) {
      throw new Error('Form not found');
    }

    // Get current node from session or start
    let currentNodeId = 'start';
    if (account) {
      const sessionKey = `session:${formId}:${account}`;
      const session = await this.redis.get(sessionKey);
      if (session) {
        const sessionData = JSON.parse(session);
        currentNodeId = sessionData.current_node_id || 'start';
      }
    }

    // Get current node from schema
    const schema = form.schema as any;
    let currentNode = this.schemaParser.getCurrentNode(schema, currentNodeId);

    // If no current node, get start node
    if (!currentNode) {
      currentNode = this.schemaParser.getStartNode(schema);
      if (currentNode) {
        currentNodeId = currentNode.id;
      }
    }

    if (!currentNode) {
      throw new Error('No valid node found in form schema');
    }

    // Get next node for action generation
    const nextNode = this.schemaParser.getNextNode(schema, currentNodeId);

    // Generate action response
    return this.schemaParser.generateActionResponse(
      form.title,
      currentNode,
      nextNode?.id
    );
  }

  async postAction(formId: string, account: string, body: any) {
    // Fetch form
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });
    if (!form) {
      throw new Error('Form not found');
    }

    // Get current session
    const sessionKey = `session:${formId}:${account}`;
    const session = await this.redis.get(sessionKey);
    const sessionData = session ? JSON.parse(session) : { current_node_id: null, answers: {} };

    // Get current node
    const schema = form.schema as any;
    let currentNodeId = sessionData.current_node_id;
    let currentNode = currentNodeId ? this.schemaParser.getCurrentNode(schema, currentNodeId) : null;

    // If no current node, start from beginning
    if (!currentNode) {
      currentNode = this.schemaParser.getStartNode(schema);
      if (currentNode) {
        currentNodeId = currentNode.id;
        sessionData.current_node_id = currentNodeId;
      }
    }

    if (!currentNode) {
      throw new Error('No valid node found in form schema');
    }

    // Process user input
    const userInput = body.input || body.choice || body;
    const result = this.schemaParser.processUserInput(schema, currentNodeId, userInput);

    if (!result.isValid) {
      // Return error response
      return {
        type: 'error',
        message: result.error || 'Invalid input',
        links: {
          actions: [{
            label: 'Try Again',
            href: `/api/actions/${formId}?account=${account}`
          }]
        }
      };
    }

    // Update session with answer
    sessionData.answers = sessionData.answers || {};
    sessionData.answers[currentNodeId] = userInput;

    // Move to next node
    if (result.nextNodeId) {
      sessionData.current_node_id = result.nextNodeId;
      await this.redis.set(sessionKey, JSON.stringify(sessionData), 3600); // 1 hour

      // Get next node response
      const nextNode = this.schemaParser.getCurrentNode(schema, result.nextNodeId);
      if (nextNode) {
        const nextNextNode = this.schemaParser.getNextNode(schema, result.nextNodeId);
        return this.schemaParser.generateActionResponse(
          form.title,
          nextNode,
          nextNextNode?.id
        );
      }
    }

    // Form completed - save submission
    await this.prisma.submission.create({
      data: {
        formId: form.id,
        userAccount: account,
        answers: sessionData.answers,
      },
    });

    // Clear session
    await this.redis.del(sessionKey);

    // Return completion response
    return {
      type: 'completed',
      icon: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Complete',
      title: form.title,
      description: 'Thank you for completing the form!',
      label: 'Completed',
      links: {
        actions: [{
          label: 'View Results',
          href: `/api/forms/${formId}/results`
        }]
      }
    };
  }
}