import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://blinkform-8fnj3xztv-thaisfreis-projects.vercel.app',
      'https://blinkform.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
