import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend - simplified for Railway
  app.enableCors({
    origin: true, // Allow all origins for now to debug
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  console.log('About to listen on port', process.env.PORT ?? 3001);
  await app.listen(process.env.PORT ?? 3001);
  console.log('Server is listening');
}
bootstrap();
