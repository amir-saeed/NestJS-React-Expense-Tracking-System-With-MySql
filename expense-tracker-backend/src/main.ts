import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend requests
  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  });

  // Enable validation pipes for DTOs
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setDescription('API documentation for Expense Tracker app')
    .setVersion('1.0')
    .addTag('expenses', 'Expense management operations')
    .addTag('GraphQL', 'GraphQL API documentation (actual endpoint is at /graphql)')
    .addServer('/graphql', 'GraphQL API Endpoint')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
