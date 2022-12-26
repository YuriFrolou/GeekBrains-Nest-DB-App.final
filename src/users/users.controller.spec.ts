import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../auth/role/role.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersEntity } from '../entities/users.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as mocks from 'node-mocks-http';


describe('UsersController', () => {
  let usersController: UsersController;
  const req = mocks.createRequest({
    user: {
      userId: 1,
    },
  });
  const users: UsersEntity[] = [];
  const userDto: CreateUserDto = {
    firstName: 'Sergey',
    lastName: 'Kononchuk',
    email: 'serg@mail.ru',
    password: '22222',
    role: Role.User,
  };
  const userCreated: UsersEntity = {
    id: 1,
    firstName: 'Sergey',
    lastName: 'Kononchuk',
    email: 'serg@mail.ru',
    password: '22222',
    roles: Role.User,
    cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };


  const mockUsersService = {
    getUsers:jest.fn(()=>(users)),
    createUser: jest.fn(dto => {
      const user={
        ...dto,
        cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
      return user;
    }),
    updateUser: jest.fn().mockImplementation((id, dto) => ({ id, ...userCreated, ...dto})),
    removeUser: jest.fn().mockImplementation(id => {
      users.slice(id,1);
      return users;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).overrideProvider(UsersService).useValue(mockUsersService).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create an user', () => {
    expect(usersController.createUser(userDto)).toEqual(Promise.resolve(userCreated));
    expect(mockUsersService.createUser).toHaveBeenCalledWith(userDto);
  });
  it('should update an user', async () => {
    const dto: UpdateUserDto = { firstName: 'Alex' };
    expect(usersController.updateUser(req, dto)).toEqual(Promise.resolve({ ...userCreated, ...dto }));
  });
  it('should delete an user', async () => {
    expect(usersController.removeUser(1)).toEqual(Promise.resolve(users));
  });
  it('should get all users', async () => {
    expect(usersController.getUsers()).toEqual(Promise.resolve(users));
  });
});