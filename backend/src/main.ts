// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation and data transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically removes properties NOT in your DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true, // Critical for 2025: Converts URL/Body strings to DTO types
      transformOptions: {
        enableImplicitConversion: true, // Converts "1" to 1 for IDs automatically
      },
    }),
  );

  // Enable CORS if you plan to connect a frontend later
  //app.enableCORS();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
