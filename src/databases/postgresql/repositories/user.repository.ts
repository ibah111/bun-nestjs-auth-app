import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/user.model";
import { DBConnection } from "@/enums/db.enum";
import type { IUser } from "@/interface/user.interface";

@Injectable()
export class UserRepository {
    private readonly logger: Logger = new Logger(UserRepository.name)

    constructor(
        @InjectModel(User, DBConnection.PostgreSQL)
        private readonly userModel: typeof User
    ) { }

    public async create(body: IUser): Promise<User> {
        this.logger.log('user created successfully')
        return await this.userModel.create({ ...body });
    }

    public async findByPk(id: number) {
        return await this.userModel.findByPk(id)
    }

    public async find(criteria: Partial<User>) {
        return await this.userModel.findOne({ where: criteria })
    }

    public async findByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ where: { email } });
    }
}
