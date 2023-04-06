import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  create(signupDto: SignupDto): Promise<User> {
    const user = this.usersRepo.create(signupDto);

    return this.usersRepo.save(user);
  }

  findOneById(id: number): Promise<User> {
    if (!id) return null;
    return this.usersRepo.findOne({ where: { id } });
  }

  findAllByEmail(email: string): Promise<User[]> {
    return this.usersRepo.find({ where: { email } });
  }

  async updateOneById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (!user) throw new NotFoundException('User Not Found');

    Object.assign(user, updateUserDto);

    return this.usersRepo.save(user);
  }

  async removeOneByID(id: number): Promise<User> {
    const user = await this.findOneById(id);

    if (!user) throw new NotFoundException('User Not Found');

    return this.usersRepo.remove(user);
  }
}
