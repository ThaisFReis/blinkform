import { Controller, Get, Header } from '@nestjs/common';

@Controller() // No prefix - serves at root level
export class RootController {
  @Get('actions.json')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Expose-Headers', 'Content-Type')
  getActionsManifest() {
    return {
      rules: [
        {
          pathPattern: '/api/actions/**',
          apiPath: '/api/actions/**' // Relative path - works on any domain (Vercel, Railway, localhost)
        }
      ]
    };
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
