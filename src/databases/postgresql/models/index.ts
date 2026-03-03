import type { ModelCtor } from 'sequelize-typescript';
import { User } from './user.model';
import { RefreshToken } from './refresh-token.model';

export const models: ModelCtor[] = [User, RefreshToken];
