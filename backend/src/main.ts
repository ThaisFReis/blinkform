import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://blinkform-8fnj3xztv-thaisfreis-projects.vercel.app',
      'https://blinkform.vercel.app',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  console.log('About to listen on port', process.env.PORT ?? 3001);
  await app.listen(process.env.PORT ?? 3001);
  console.log('Server is listening');
}
bootstrap();
