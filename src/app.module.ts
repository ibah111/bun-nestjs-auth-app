import { Module } from '@nestjs/common';
import { DatabaseModule } from './databases/postgresql';
import { PagesModule } from './pages';


@Module({
  imports: [DatabaseModule, PagesModule],
})
export class AppModule {}
