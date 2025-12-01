import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SchemaParserService } from '../schema-parser/schema-parser.service';
export declare class ActionsService {
    private prisma;
    private redis;
    private schemaParser;
    constructor(prisma: PrismaService, redis: RedisService, schemaParser: SchemaParserService);
    getAction(formId: string, account?: string): Promise<import("../schema-parser/schema-parser.service").ActionResponse>;
    postAction(formId: string, account: string, body: any): Promise<import("../schema-parser/schema-parser.service").ActionResponse | {
        type: string;
        message: string;
        links: {
            actions: {
                label: string;
                href: string;
            }[];
        };
        icon?: undefined;
        title?: undefined;
        description?: undefined;
        label?: undefined;
    } | {
        type: string;
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
        message?: undefined;
    }>;
}
