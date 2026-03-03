import { DBConnection } from '@/enums/db.enum';
import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from './models';

@Global()
@Module({
  imports: [
    SequelizeModule.forRoot({
      name: DBConnection.PostgreSQL,
      dialect: DBConnection.PostgreSQL,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      host: process.env.POSTGRES_HOST || 'localhost',
      username: process.env.POSTGRES_USER || 'USER',
      password: process.env.POSTGRES_PASSWORD || 'PASSWORD',
      database: process.env.POSTGRES_DB || 'BASE',
      logging: console.log,
      models,
    }),
    SequelizeModule.forFeature(models, DBConnection.PostgreSQL)
  ],
})
export class PostgreSQLModule {}
