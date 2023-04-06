import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.signup(createUserDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<User> {
    console.log(typeof id);
    const user = await this.usersService.findOneById(id);

    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

  @Get()
  findAllByEmail(@Query('email') email: string): Promise<User[]> {
    return this.usersService.findAllByEmail(email);
  }

  @Delete(':id')
  removeOneById(@Param('id') id: number): Promise<User> {
    return this.usersService.removeOneByID(id);
  }

  @Patch(':id')
  updateOneById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateOneById(id, updateUserDto);
  }
}
