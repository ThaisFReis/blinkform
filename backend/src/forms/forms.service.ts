import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateFormDto {
  creatorAddress?: string;
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

export interface SubmitFormDto {
  responses: Record<string, any>;
  userAccount?: string;
}

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async create(createFormDto: CreateFormDto) {
    try {
      // Validate required fields
      if (!createFormDto.title || createFormDto.title.trim() === '') {
        throw new Error('Title is required');
      }

      if (!createFormDto.schema) {
        throw new Error('Schema is required');
      }

      // Validate creatorAddress length (Solana addresses are 44 chars)
      const creatorAddress = createFormDto.creatorAddress || 'test-creator-address';
      if (creatorAddress.length > 44) {
        throw new Error('Creator address is too long');
      }

      // Validate schema is valid JSON
      if (typeof createFormDto.schema !== 'object') {
        throw new Error('Schema must be a valid object');
      }

      const form = await this.prisma.form.create({
        data: {
          creatorAddress,
          title: createFormDto.title.trim(),
          description: createFormDto.description?.trim(),
          schema: createFormDto.schema,
        },
      });
      return { id: form.id };
    } catch (error) {
      console.error('Error creating form:', error);
      throw new Error(`Failed to create form: ${error.message}`);
    }
  }

  async findOne(id: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
    });

    if (!form) {
      throw new Error('Form not found');
    }

    return form;
  }

  async update(id: string, updateFormDto: UpdateFormDto) {
    const form = await this.prisma.form.update({
      where: { id },
      data: updateFormDto,
    });
    return form;
  }

  async findAllByCreator(creatorAddress: string) {
    return this.prisma.form.findMany({
      where: { creatorAddress },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submit(formId: string, submitFormDto: SubmitFormDto) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) {
      throw new Error('Form not found');
    }

    const submission = await this.prisma.submission.create({
      data: {
        formId: form.id,
        userAccount: submitFormDto.userAccount || 'anonymous',
        answers: submitFormDto.responses,
      },
    });

    return { id: submission.id, message: 'Form submitted successfully' };
  }
}
