import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { FormsService } from './forms.service';
import type { CreateFormDto, UpdateFormDto } from './forms.service';

interface SubmitFormDto {
  responses: Record<string, any>;
  userAccount?: string;
}

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  async create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, updateFormDto);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Body() submitFormDto: SubmitFormDto) {
    return this.formsService.submit(id, submitFormDto);
  }

  @Get()
  async findAllByCreator(@Query('creator') creatorAddress: string) {
    return this.formsService.findAllByCreator(creatorAddress);
  }
}
