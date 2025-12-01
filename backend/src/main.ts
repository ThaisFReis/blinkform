import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('Enabling CORS with configuration:', {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://blinkform-8fnj3xztv-thaisfreis-projects.vercel.app',
      'https://frontend-kappa-woad-89.vercel.app',
      'https://blinkform.vercel.app',
      /\.vercel\.app$/,
      '*' // Allow all for debugging
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // Enable CORS for frontend - Railway deployment fix
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://blinkform-8fnj3xztv-thaisfreis-projects.vercel.app',
      'https://frontend-kappa-woad-89.vercel.app',
      'https://blinkform.vercel.app',
      /\.vercel\.app$/,
      '*' // Allow all for debugging
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  console.log('CORS enabled successfully');

  // Add logging middleware for debugging CORS
  app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log(`Origin: ${req.headers.origin}`);
    console.log(`User-Agent: ${req.headers['user-agent']}`);

    // Log response headers after they are set
    const originalSend = res.send;
    res.send = function(body) {
      console.log(`Response status: ${res.statusCode}`);
      console.log(`Access-Control-Allow-Origin: ${res.getHeader('Access-Control-Allow-Origin')}`);
      console.log(`Access-Control-Allow-Methods: ${res.getHeader('Access-Control-Allow-Methods')}`);
      console.log(`Access-Control-Allow-Headers: ${res.getHeader('Access-Control-Allow-Headers')}`);
      return originalSend.call(this, body);
    };

    next();
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  console.log('About to listen on port', process.env.PORT ?? 3001);
  await app.listen(process.env.PORT ?? 3001);
  console.log('Server is listening');
}
bootstrap();
