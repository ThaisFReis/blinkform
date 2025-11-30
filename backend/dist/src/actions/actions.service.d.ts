import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class ActionsService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    getAction(formId: string, account?: string): Promise<{
        icon: string;
        title: string;
        description: string;
        label: string;
        links: {
            actions: {
                label: string;
                href: string;
            }[];
        };
    }>;
}
