import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '@/databases/postgresql/repositories/user.repository';
import { HashService } from '@/modules/hash/hash.service';
import { RegisterDto } from './register.dto';
import { ApiResponce } from '@/types/api-responce.type';
import { User } from '@/databases/postgresql/models/user.model';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) { }

  async register(body: RegisterDto): Promise<ApiResponce<User>> {
    const existing_user = await this.userRepository.findByEmail(body.email);
    if (existing_user) {
      throw new ConflictException('User with this email already exists');
    }

    const password_hash = await this.hashService.hash(body.password);

    const user = await this.userRepository.create({
      fio: body.fio,
      email: body.email,
      password_hash,
      position: body.position,
    });
    return {
      success: true,
      message: "User created",
      data: user
    }
  }
}

