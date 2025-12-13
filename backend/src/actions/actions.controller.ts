import { Controller, Get, Post, Options, Param, Query, Body, Header } from '@nestjs/common';
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
  @Header('X-Blockchain-Ids', 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')
  async getAction(
    @Param('formId') formId: string,
    @Query('account') account?: string,
  ) {
    return this.actionsService.getAction(formId, account);
  }

  /**
   * Callback endpoint for links.next
   * Called by Blink client after PostResponse to render next question UI
   * IMPORTANT: Must come BEFORE :formId/:choice to avoid route collision
   */
  @Post(':formId/next')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('Access-Control-Expose-Headers', 'X-Action-Version,X-Blockchain-Ids,Content-Type')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')
  async getNextAction(
    @Param('formId') formId: string,
    @Query('account') account: string,
    @Body() body: any,
  ) {
    // Account can come from query params or body
    const userAccount = account || body.account || body.data?.account;
    return this.actionsService.getNextAction(formId, userAccount);
  }

  @Post(':formId/:choice')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('Access-Control-Expose-Headers', 'X-Action-Version,X-Blockchain-Ids,Content-Type')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')
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

  @Post(':formId')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('Access-Control-Expose-Headers', 'X-Action-Version,X-Blockchain-Ids,Content-Type')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')
  async postAction(
    @Param('formId') formId: string,
    @Query() query: Record<string, any>,
    @Body() body: any,
  ) {
    // Account comes from the body in Solana Actions
    const account = body.account || body.data?.account;
    return this.actionsService.postAction(formId, account, body, query);
  }

  /**
   * OPTIONS handler for CORS preflight - /next endpoint
   */
  @Options(':formId/next')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  async optionsNext() {
    return {};
  }
}