import { HttpException, HttpStatus, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { hash } from '../utils/crypto';
import { Role } from '../auth/role/role.enum';

@Injectable()
export class UsersService {


  constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {
  }

  async createUser(createUserDto: CreateUserDto):Promise<UsersEntity> {
    const user = new UsersEntity();
    user.firstName= createUserDto.firstName;
    user.lastName= createUserDto.lastName;
    user.email= createUserDto.email;
    user.password= createUserDto.password;
    user.cover = createUserDto.cover||'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg';
    user.roles= createUserDto.role;
    user.password = await hash(user.password);
    user.createdAt= new Date();
    user.updatedAt= new Date();

    return await this.usersRepository.save(user);
  }

  async getUsers():Promise<UsersEntity[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: number):Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['sessions'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByEmail(email): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async setModerator(idUser): Promise<UsersEntity> {
    const _user = await this.getUserById(idUser);
    if (!_user) {
      throw new UnauthorizedException();
    }
    if(_user.roles!==Role.Admin){
      _user.roles = Role.Moderator;
    }
    return this.usersRepository.save(_user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto):Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy({ id });


    user.firstName= updateUserDto.firstName?updateUserDto.firstName : user.firstName;
    user.lastName=updateUserDto.lastName? updateUserDto.lastName : user.lastName;
    user.email= updateUserDto.email?updateUserDto.email : user.email;
    user.password= updateUserDto.password ? await hash(updateUserDto.password) : user.password;
    user.cover= updateUserDto.cover?updateUserDto.cover:user.cover;
    user.updatedAt= new Date();


    return await this.usersRepository.save(user);
  }


  async removeUser(id: number):Promise<UsersEntity[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    await this.usersRepository.remove(user);
    return await this.usersRepository.find();
  }

}
