import { Module } from "@nestjs/common";
import { RedisCacheModule } from "./cache/cache.module";
import { HashModule } from "./hash/hash.module";

@Module({
    imports: [RedisCacheModule, HashModule]
})
export class ModulesModule { }