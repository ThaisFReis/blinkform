import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with Solana Actions-specific headers
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Content-Encoding,Accept-Encoding',
    credentials: false,
  });

  // Set global API prefix
  app.setGlobalPrefix('api', { exclude: ['health'] });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
