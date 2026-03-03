import { Module } from "@nestjs/common";
import { PostgreSQLModule } from "./postgresql";

@Module({
    imports: [PostgreSQLModule]
})
export class DatabaseModule {}
