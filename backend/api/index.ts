import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

// Cache the NestJS app instance
let cachedApp: INestApplication;

async function createApp() {
  if (!cachedApp) {
    const expressAdapter = new ExpressAdapter();

    cachedApp = await NestFactory.create(
      AppModule,
      expressAdapter,
      { cors: true }
    );

    cachedApp.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Content-Encoding', 'Accept-Encoding'],
      credentials: false,
    });

    // Don't set global prefix for Vercel - routing in vercel.json already handles /api prefix
    // This prevents double /api/api/... paths
    // cachedApp.setGlobalPrefix('api', { exclude: ['health', 'actions.json'] });

    await cachedApp.init();
  }

  return cachedApp;
}

// Export default handler for Vercel
export default async (req: any, res: any) => {
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding');
    res.setHeader('Access-Control-Expose-Headers', 'X-Action-Version,X-Blockchain-Ids,Content-Type');
    res.status(200).end();
    return;
  }

  // Strip /api prefix from URL since it's part of the base URL
  // This allows using BACKEND_URL=https://...vercel.app/api
  // without doubling the prefix
  if (req.url.startsWith('/api/')) {
    req.url = req.url.substring(4);  // Remove '/api'
  } else if (req.url === '/api') {
    req.url = '/';
  }

  const app = await createApp();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
