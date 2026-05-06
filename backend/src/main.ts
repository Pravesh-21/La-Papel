import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable Validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('AURÉA Salon & Spa API')
    .setDescription('The API for AURÉA luxury salon')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Run on port 3002 to avoid conflicting with Next.js on 3000
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
