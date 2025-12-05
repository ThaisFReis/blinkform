import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule, { cors: true });

    // Enable CORS with Solana Actions-specific headers
    cachedApp.enableCors({
      origin: '*',
      methods: 'GET,POST,PUT,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization,Content-Encoding,Accept-Encoding',
      credentials: false,
    });

    // Set global API prefix
    cachedApp.setGlobalPrefix('api', { exclude: ['health', 'actions.json'] });

    await cachedApp.init();
  }

  return cachedApp;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
