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
    const form = await this.prisma.form.create({
      data: {
        creatorAddress: createFormDto.creatorAddress || 'test-creator-address',
        title: createFormDto.title,
        description: createFormDto.description,
        schema: createFormDto.schema,
      },
    });
    return { id: form.id };
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
