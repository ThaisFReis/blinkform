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
    try {
      return this.actionsService.getAction(formId, account);
    } catch (error) {
      console.error('[Actions Controller] GET error:', error);
      return {
        type: 'action',
        icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
        title: 'Form Error',
        description: 'An error occurred while loading the form.',
        label: 'Try Again',
        message: error.message || 'Internal server error',
        links: {
          actions: [{
            label: 'Try Again',
            href: `https://blinkform-backend.vercel.app/api/actions/${formId}`
          }]
        }
      };
    }
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
    try {
      // Account can come from query params or body
      const userAccount = account || body.account || body.data?.account;
      return this.actionsService.getNextAction(formId, userAccount);
    } catch (error) {
      console.error('[Actions Controller] GET NEXT error:', error);
      return {
        type: 'error',
        icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
        title: 'Session Error',
        description: 'Session expired or invalid. Please start the form again.',
        label: 'Start Over',
        message: error.message || 'Session error',
        links: {
          actions: [{
            label: 'Start Over',
            href: `https://blinkform-backend.vercel.app/api/actions/${formId}`
          }]
        }
      };
    }
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
    try {
      // Account comes from the body in Solana Actions
      const account = body.account || body.data?.account;
      // Merge choice into query for unified handling
      const enrichedQuery = { ...query, choice };
      return this.actionsService.postAction(formId, account, body, enrichedQuery);
    } catch (error) {
      console.error('[Actions Controller] POST CHOICE error:', error);
      return {
        type: 'error',
        icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
        title: 'Action Error',
        description: 'An error occurred while processing your choice.',
        label: 'Try Again',
        message: error.message || 'Internal server error',
        links: {
          actions: [{
            label: 'Try Again',
            href: `https://blinkform-backend.vercel.app/api/actions/${formId}`
          }]
        }
      };
    }
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
    try {
      // Account comes from the body in Solana Actions
      const account = body.account || body.data?.account;
      return this.actionsService.postAction(formId, account, body, query);
    } catch (error) {
      console.error('[Actions Controller] POST error:', error);
      // Return Solana Actions compliant error response
      return {
        type: 'error',
        icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
        title: 'Transaction Error',
        description: 'An error occurred while processing the transaction.',
        label: 'Try Again',
        message: error.message || 'Internal server error',
        links: {
          actions: [{
            label: 'Try Again',
            href: `https://blinkform-backend.vercel.app/api/actions/${formId}`
          }]
        }
      };
    }
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