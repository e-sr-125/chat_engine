import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const port = process.env.PORT || 3000; // Use Railway's PORT if available
  // await app.listen(port, '0.0.0.0');
  // console.log(`Chat Engine running on port ${port}`);
  
  app.enableCors();
  await app.listen(3000, '0.0.0.0');
  console.log('Chat Engine running on http://localhost:3000');
}

bootstrap();
