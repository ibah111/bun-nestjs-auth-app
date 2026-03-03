import { DOCS_PATH } from '@/consts/application';
import { node_env } from '@/main';
import { HealthcheckModule } from '@/pages/healthcheck/healthcheck.module';
import { LoginModule } from '@/pages/login/login.module';
import { RegisterModule } from '@/pages/register/register.module';
import { TokenModule } from '@/pages/token/token.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('back-office-auth')
    .setDescription('Back office auth microservice')
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'Bearer'
    })
    .setVersion('0.0.1')
    .build();

  const included_controllers: Function[] = [
    HealthcheckModule,
    LoginModule,
    RegisterModule,
    TokenModule
  ]

  const document = SwaggerModule.createDocument(app, config, {
    include: node_env === 'production' ? included_controllers : undefined
  });
  SwaggerModule.setup(DOCS_PATH, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
