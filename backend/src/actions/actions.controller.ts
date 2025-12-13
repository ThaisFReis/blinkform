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
  @Header('Access-Control-Expose-Headers', 'X-Action-Version,X-Blockchain-Ids,Content-Type')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')
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
  @Header('Access-Control-Expose-Headers', 'X-Action-Version,X-Blockchain-Ids,Content-Type')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')
  async postAction(
    @Param('formId') formId: string,
    @Query() query: Record<string, any>,
    @Body() body: any,
  ) {
    // Account comes from the body in Solana Actions
    const account = body.account || body.data?.account;
    return this.actionsService.postAction(formId, account, body, query);
  }

  @Post(':formId/:choice')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('Access-Control-Expose-Headers', 'X-Action-Version,X-Blockchain-Ids,Content-Type')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')
  async postActionWithChoice(
    @Param('formId') formId: string,
    @Param('choice') choice: string,
    @Query() query: Record<string, any>,
    @Body() body: any,
  ) {
    // Account comes from the body in Solana Actions
    const account = body.account || body.data?.account;
    // Merge choice into query for unified handling
    const enrichedQuery = { ...query, choice };
    return this.actionsService.postAction(formId, account, body, enrichedQuery);
  }
}