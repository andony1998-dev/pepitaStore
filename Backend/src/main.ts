import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const isProduction = process.env.NODE_ENV === 'production';
  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  const productionOrigins = (process.env.FRONTEND_URL ?? '').split(',').map(s => s.trim()).filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return isProduction
          ? callback(new Error('Not allowed by CORS'))
          : callback(null, true);
      }
      if (isProduction) {
        return productionOrigins.includes(origin)
          ? callback(null, true)
          : callback(new Error('Not allowed by CORS'));
      }
      return localhostRegex.test(origin)
        ? callback(null, true)
        : callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Librería Pepita API corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
