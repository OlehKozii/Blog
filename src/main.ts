import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('Blog Post')
    .setVersion('Beta 0.1')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'refresh_token',
        in: 'cookie',
        description: 'Refresh token',
      },
      'refresh_token',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'auth_token',
        in: 'cookie',
        description: 'Refresh token',
      },
      'auth_token',
    )
    .addServer('http://localhost:5000')
    .setExternalDoc('Download', '/api-docs-json')
    .setContact(
      'Oleh Kozii',
      'https://djinni.co/q/b12a61def5/',
      'ukraine2342@gmail.com',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT);
  console.log(
    `📝 Documentation: http://localhost:${process.env.PORT}/api-docs`,
  );
  console.log(`🖥 Server: http://localhost:${process.env.PORT}`);
}
bootstrap().catch((e) => console.log(e));
