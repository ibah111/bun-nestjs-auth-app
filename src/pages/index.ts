import { Module } from '@nestjs/common';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    HealthcheckModule,
    LoginModule,
    RegisterModule,
    TokenModule,
  ],
})
export class PagesModule { }
