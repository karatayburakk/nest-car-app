import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Authservice } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<Authservice>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneById: (id: number) =>
        Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User),
      findAllByEmail: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'asdf' } as User]),
      // removeOneById: () => {},
      // updateOneById: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (signinDto: { email: string; password: string }) =>
        Promise.resolve({
          id: 1,
          email: signinDto.email,
          password: signinDto.password,
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: Authservice,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllByEmail returns a list of users with the given email', async () => {
    const users = await controller.findAllByEmail('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with given id', async () => {
    const user = await controller.findOneById(1);
    expect(user).toBeDefined();
  });

  it('findOneById throws an error if user with given id is not found', async () => {
    fakeUsersService.findOneById = () => null;

    await expect(controller.findOneById(1)).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      {
        email: 'asdf@asdf.com',
        password: 'asdf',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
