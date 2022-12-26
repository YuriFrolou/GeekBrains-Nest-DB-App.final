import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersEntity } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../auth/role/role.enum';
import { UpdateUserDto } from '../dto/update-user.dto';


describe('UsersService', () => {
  let usersService: UsersService;
  const userDto: CreateUserDto = {
    firstName: 'Sergey',
    lastName: 'Kononchuk',
    email: 'serg@mail.ru',
    password: '22222',
    role: Role.User,
  };
  const userCreated: UsersEntity = {
    id: expect.any(Number),
    firstName: 'Sergey',
    lastName: 'Kononchuk',
    email: 'serg@mail.ru',
    password: expect.any(String),
    roles: Role.User,
    cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };
  const users: Array<UsersEntity> = [{
    ...userCreated,
    id: 1,
  }];
  const mockUsersRepository = {
    save: jest.fn().mockImplementation(async (user) => Promise.resolve({
      id: expect.any(Number), ...user, createdAt: new Date(),
      updatedAt: new Date(),
    })),
    find: jest.fn().mockImplementation(async () => Promise.resolve(users)),
    findOne: jest.fn().mockImplementation((id:number) => Promise.resolve({id,...userCreated})),
    findOneBy:jest.fn().mockImplementation((id:number) => Promise.resolve({id,...userCreated})),
    remove:jest.fn().mockImplementation((id:number)=>{
      users.slice(id,1);
      Promise.resolve({id,...userCreated})
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
  it('should create and save a new user', async () => {
    expect(await usersService.createUser(userDto)).toEqual(userCreated);
  });
  it('should get all users', async () => {
    expect(await usersService.getUsers()).toEqual(users);
  });
  it('should get an user by id', async () => {
    expect(await usersService.getUserById(1)).toEqual(userCreated);
  });
  it('should update an user by id', async () => {
    const dto: UpdateUserDto = { firstName: 'Alex' };
    expect(await usersService.updateUser(1,dto)).toEqual({ ...userCreated,...dto});
  });
  it('should delete an user by id', async () => {
    expect(await usersService.removeUser(1)).toEqual(users);
  });
});