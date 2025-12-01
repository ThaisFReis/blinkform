import { Controller, Get, Post, Param, Query, Body, Header } from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get(':formId')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  async getAction(
    @Param('formId') formId: string,
    @Query('account') account?: string,
  ) {
    return this.actionsService.getAction(formId, account);
  }

  @Post(':formId')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  async postAction(
    @Param('formId') formId: string,
    @Query('account') account: string,
    @Body() body: any,
  ) {
    return this.actionsService.postAction(formId, account, body);
  }
}