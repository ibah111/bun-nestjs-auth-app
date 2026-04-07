import 'colors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { swaggerSetup as SwaggerSetup } from './swagger/swagger-setup';
import { API_PATH, DOCS_PATH } from './consts/application';
import { CustomHttpExceptionFilter } from './utils/custom-exception-filter';

export const node_env: string = process.env.NODE_ENV || 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  const PORT = process.env.PORT ?? 30111;
  app.enableCors({
    origin: '*',
  });
  app.useGlobalFilters(new CustomHttpExceptionFilter());
  app.setGlobalPrefix(API_PATH);
  app.enableVersioning({ type: VersioningType.URI });

  SwaggerSetup(app);
  await app.listen(PORT, '0.0.0.0');
  switch (node_env) {
    case 'production':
      logger.error(`Application in ${node_env} mode`.red);
      break;
    default:
      logger.log(`Application in ${node_env} mode`.green);
      break;
  }
  console.log(`${(await app.getUrl()) + DOCS_PATH}`.yellow);
}
bootstrap();
