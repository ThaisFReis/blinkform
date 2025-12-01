import { PrismaService } from '../prisma/prisma.service';
export interface CreateFormDto {
    creatorAddress: string;
    title: string;
    description?: string;
    schema: any;
}
export interface UpdateFormDto {
    title?: string;
    description?: string;
    schema?: any;
    isActive?: boolean;
}
export declare class FormsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFormDto: CreateFormDto): Promise<{
        id: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        creatorAddress: string;
        title: string;
        description: string | null;
        schema: import("@prisma/client/runtime/client").JsonValue;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, updateFormDto: UpdateFormDto): Promise<{
        id: string;
        creatorAddress: string;
        title: string;
        description: string | null;
        schema: import("@prisma/client/runtime/client").JsonValue;
        isActive: boolean;
        createdAt: Date;
    }>;
    findAllByCreator(creatorAddress: string): Promise<{
        id: string;
        creatorAddress: string;
        title: string;
        description: string | null;
        schema: import("@prisma/client/runtime/client").JsonValue;
        isActive: boolean;
        createdAt: Date;
    }[]>;
}
