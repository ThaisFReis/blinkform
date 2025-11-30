import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ActionsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getAction(formId: string, account?: string) {
    // Fetch form
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });
    if (!form) {
      throw new Error('Form not found');
    }

    // Check session
    let currentNodeId = 'start'; // default
    if (account) {
      const sessionKey = `session:${formId}:${account}`;
      const session = await this.redis.get(sessionKey);
      if (session) {
        const sessionData = JSON.parse(session);
        currentNodeId = sessionData.current_node_id || 'start';
      }
    }

    // For now, return basic response
    return {
      icon: 'https://blinkform.xyz/og/start.png',
      title: form.title,
      description: `Step 1 of 3`,
      label: 'Start',
      links: {
        actions: [
          {
            label: 'Start',
            href: `/api/actions/${formId}?next_node=question_1`,
          },
        ],
      },
    };
  }
}