import { DBConnection } from '@/enums/db.enum';
import { Global, Module, Provider } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from './models';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { ConfigService } from '@nestjs/config';

const repositories: Provider[] = [UserRepository, RefreshTokenRepository]

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      name: DBConnection.PostgreSQL,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const getNumber = (value: string | undefined, fallback: number) =>
          Number.parseInt(value ?? `${fallback}`, 10);
        return {
          dialect: DBConnection.PostgreSQL,
          port: getNumber(configService.get<string>('database.port'), 5432),
          host: configService.get<string>('database.host'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          logging: false,
          models,
        }
      }
    }),
    SequelizeModule.forFeature(models, DBConnection.PostgreSQL)
  ],
  providers: repositories,
  exports: repositories,
})
export class PostgreSQLModule { }
