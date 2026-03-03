import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Index,
    Default,
} from 'sequelize-typescript';
import { User } from './user.model';

export interface RefreshTokenAttributes {
    id?: number;
    user_id: number;
    token_hash: string;
    user_agent: string | null;
    ip_address: string | null;
    expires_at: Date;
    revoked_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface RefreshTokenCreationAttributes
    extends Omit<RefreshTokenAttributes, 'id' | 'created_at' | 'updated_at' | 'revoked_at'> { }

@Table({
    tableName: 'refresh_tokens',
    underscored: true,
})
export class RefreshToken
    extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id?: number;

    @ForeignKey(() => User)
    @Index('refresh_tokens_user_id_idx')
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare user_id: number;

    @Index('refresh_tokens_token_hash_idx')
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare token_hash: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare user_agent: string | null;

    @Column({
        type: DataType.STRING(64),
        allowNull: true,
    })
    declare ip_address: string | null;

    @Index('refresh_tokens_expires_at_idx')
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare expires_at: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare revoked_at: Date | null;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare created_at: Date;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare updated_at: Date;

    @BelongsTo(() => User)
    declare user: User;
}
