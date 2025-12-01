import { FormsService } from './forms.service';
import type { CreateFormDto, UpdateFormDto } from './forms.service';
export declare class FormsController {
    private readonly formsService;
    constructor(formsService: FormsService);
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
