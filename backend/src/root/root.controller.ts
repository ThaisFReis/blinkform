import { Controller, Get, Header } from '@nestjs/common';

@Controller() // No prefix - serves at root level
export class RootController {
  @Get('actions.json')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  getActionsManifest() {
    return {
      rules: [
        {
          pathPattern: '/api/actions/**',
          apiPath: 'https://blinkform-production.up.railway.app/api/actions/**'
        }
      ]
    };
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
