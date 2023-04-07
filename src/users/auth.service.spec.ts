import { Test } from '@nestjs/testing';
import { Authservice } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: Authservice;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of UsersService

    const users: User[] = [];

    fakeUsersService = {
      findAllByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (signup: { email: string; password: string }) => {
        const user = {
          email: signup.email,
          password: signup.password,
          id: Math.floor(Math.random() * 999999),
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        Authservice,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(Authservice);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup({
      email: 'asdf@asdf.com',
      password: 'asdf',
    });

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup({ email: 'asdf@asdf.com', password: 'asdf' });

    await expect(
      service.signup({ email: 'asdf@asdf.com', password: 'asdf' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin({ email: 'asdf@asdf.com', password: 'asdf' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup({
      email: 'asdf@asdf.com',
      password: 'differentpassword',
    });

    await expect(
      service.signin({ email: 'asdf@asdf.com', password: 'password' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup({ email: 'asdf@asdf.com', password: 'mypassword' });

    const user = await service.signin({
      email: 'asdf@asdf.com',
      password: 'mypassword',
    });

    expect(user).toBeDefined();
  });
});
