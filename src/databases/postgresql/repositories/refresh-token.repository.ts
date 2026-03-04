import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RefreshToken } from "../models/refresh-token.model";
import { DBConnection } from "@/enums/db.enum";
import { FindOptions } from "sequelize";
import { IRTCreate } from "@/interface/rt.interface";

@Injectable()
export class RefreshTokenRepository {

    constructor(
        @InjectModel(RefreshToken, DBConnection.PostgreSQL)
        private readonly rtModel: typeof RefreshToken
    ) { }

    public async create(body: IRTCreate) {
        return await this.rtModel.create({
            ...body
        })
    }

    public async find(options: FindOptions<RefreshToken>) {
        return await this.rtModel.findAll(options)
    }

    public async findOne(options: FindOptions) {
        return await this.rtModel.findOne(options)
    }

    public async updateExpiresAt(id: number, expires_at: Date) {
        return await this.rtModel.update(
            { expires_at },
            { where: { id } }
        )
    }

    public async destroy(id: number) {
        return await this.rtModel.destroy({ where: { id } })
    }
}