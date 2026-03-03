import { DOCS_PATH } from '@/consts/application';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('back-office-auth')
    .setDescription('Back office auth microservice')
    .setVersion('0.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(DOCS_PATH, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
