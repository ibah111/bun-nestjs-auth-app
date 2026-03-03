import { DBConnection } from '@/enums/db.enum';
import { ApiResponce } from '@/types/api-responce.type';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class HealthcheckService {
    constructor(
        @InjectConnection(DBConnection.PostgreSQL)
        private readonly sequelize: Sequelize
    ) { }

    async getHealthcheck(): Promise<ApiResponce<any>> {
        const data = await this.sequelize.query('SELECT 1 as OK')
        return {
            success: true,
            message: "Auth server OK",
            data
        }
    }
}

