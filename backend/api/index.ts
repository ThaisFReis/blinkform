import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication;

async function bootstrap() {
  if (!cachedApp) {
    const expressAdapter = new ExpressAdapter();

    cachedApp = await NestFactory.create(
      AppModule,
      expressAdapter
    );

    // Enable CORS with Solana Actions-specific headers
    cachedApp.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Content-Encoding', 'Accept-Encoding'],
      credentials: false,
    });

    await cachedApp.init();
  }

  return cachedApp;
}

export default async (req: any, res: any) => {
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding');
    res.status(200).end();
    return;
  }

  // Strip /api prefix from the URL before passing to NestJS
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
    if (req.url === '') {
      req.url = '/';
    }
  }

  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
