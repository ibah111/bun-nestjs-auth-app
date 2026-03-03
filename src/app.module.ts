import { Module } from '@nestjs/common';
import { PagesModule } from './pages';
import { DatabaseModule } from './databases';
import { ModulesModule } from './modules';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards/at-guard';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfig } from './utils/env-config';

const envFilePath = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev'

@Module({
  imports: [
    DatabaseModule,
    PagesModule,
    ModulesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const factory: JwtModuleOptions = {
          secret: configService.get<string>('app.jwt_access_secret'),
          signOptions: {
            expiresIn: '15m'
          }
        }
        return factory
      }
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })
  ],
  providers: [
    AtStrategy,
    RtStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]
})
export class AppModule { }
