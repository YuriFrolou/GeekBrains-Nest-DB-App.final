import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  UseInterceptors,
  UploadedFile, Req, HttpException, HttpStatus, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersEntity } from '../entities/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoad } from '../utils/HelperFileLoad';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {Request}from "express";

const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @ApiTags('users')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'create user',
    type: UsersEntity,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async createUser(@Body() createUserDto: CreateUserDto, @UploadedFile() cover: Express.Multer.File): Promise<UsersEntity> {
    if (cover?.filename) {
      createUserDto.cover = PATH_NEWS + cover.filename;
    } else {
      createUserDto.cover = 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg';
    }

    return await this.usersService.createUser(createUserDto);
  }

  @Get('/login')
  @ApiTags('users')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'login in browser',
  })
  @Render('user-login')
  async loginUser() {
  }

  @Get('/update/:id')
  @ApiTags('users')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'update profile in browser',
  })
  @Render('user-update')
  async updateUserOnBrowser(@Param('id') id: number) {
    const _user = await this.usersService.getUserById(id);
    return {
      user:_user
    }
  }

  @Get()
  @ApiTags('users')
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: [UsersEntity],
  })
  async getUsers(): Promise<UsersEntity[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  @ApiTags('users')
  @ApiResponse({
    status: 200,
    description: 'get user by id',
    type: UsersEntity,
  })
  async getUser(@Req() request, @Param('id') id: number): Promise<UsersEntity> {
    console.log(request.headers);
    return await this.usersService.getUserById(id);
  }


  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiTags('users')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'update user',
    type: UsersEntity,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async updateUser(@Req() request, @Body() updateUserDto: UpdateUserDto,@UploadedFile() cover: Express.Multer.File): Promise<UsersEntity> {
   const userId=request.user.userId;

   if(!userId){
     throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
   }

    if (cover?.filename) {
      updateUserDto.cover = PATH_NEWS + cover.filename;
    }
    return await this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  @ApiTags('users')
  @ApiResponse({
    status: 200,
    description: 'delete user',
    type: [UsersEntity],
  })
  async removeUser(@Param('id') id: number): Promise<UsersEntity[]> {
    return await this.usersService.removeUser(id);
  }


  @Post('/role/:id')
  @ApiTags('users')
  @ApiResponse({
    status: 201,
    description: 'set user role',
    type: UsersEntity,
  })
  async setModerator(@Param('id') id: number): Promise<UsersEntity> {
    return await this.usersService.setModerator(id);
  }
}
