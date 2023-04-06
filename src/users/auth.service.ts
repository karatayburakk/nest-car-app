import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { User } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class Authservice {
  constructor(private readonly usersService: UsersService) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { email, password } = signupDto;
    const users = await this.usersService.findAllByEmail(email);

    if (users.length) throw new BadRequestException('Email in use');

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({ email, password: result });

    return user;
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const [user] = await this.usersService.findAllByEmail(email);

    if (!user) throw new BadRequestException('Email or Password Wrong');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash)
      throw new BadRequestException('Email or Password Wrong');

    return user;
  }
}
