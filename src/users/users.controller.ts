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
  Session,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Authservice } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: Authservice,
  ) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@Session() session: any): Promise<User> {
    return this.usersService.findOneById(session.userId);
  }

  @Get('whoami2')
  whoAmI2(@CurrentUser() user: User) {
    return user;
  }

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(signupDto);

    session.userId = user.id;

    return user;
  }

  @Post('signin')
  async signin(
    @Body() signinDto: SigninDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(signinDto);

    session.userId = user.id;

    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
    return;
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<User> {
    // console.log('Handler is running');

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
    return this.usersService.removeOneById(id);
  }

  @Patch(':id')
  updateOneById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateOneById(id, updateUserDto);
  }
}
