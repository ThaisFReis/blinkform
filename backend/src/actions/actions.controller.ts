import { Controller, Get, Param, Query } from '@nestjs/common';
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
}