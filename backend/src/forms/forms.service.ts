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
}
