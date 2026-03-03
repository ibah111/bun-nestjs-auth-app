import { TableNames } from '@/enums/db.enum';
import { hashUtility } from '@/utils/hash';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  BeforeSave,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: TableNames.USERS,
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fio!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password_hash!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  position!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, defaultValue: new Date(), allowNull: false })
  declare created_at?: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, defaultValue: new Date(), allowNull: false })
  declare updated_at?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deleted_at?: Date;

  @BeforeSave
  static async hashPassword(user: User) {
    if (user.changed('password_hash')) {
      user.password_hash = await hashUtility(user.password_hash)

    }
  }
}
