import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get(':formId')
  async getAction(
    @Param('formId') formId: string,
    @Query('account') account?: string,
  ) {
    return this.actionsService.getAction(formId, account);
  }

  @Post(':formId')
  async postAction(
    @Param('formId') formId: string,
    @Query('account') account: string,
    @Body() body: any,
  ) {
    return this.actionsService.postAction(formId, account, body);
  }
}