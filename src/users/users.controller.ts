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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersEntity } from '../entities/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoad } from '../utils/HelperFileLoad';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginUserDto } from '../dto/login-user.dto';

const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @ApiOperation({summary:'Create user'})
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
  async createUser(@Body() createUserDto: CreateUserDto, @UploadedFile() cover: Express.Multer.File=null): Promise<UsersEntity> {
    if (cover?.filename) {
      createUserDto.cover = PATH_NEWS + cover.filename;
    } else {
      createUserDto.cover = 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg';
    }

    return await this.usersService.createUser(createUserDto);
  }

  @Get('/login')
  @ApiOperation({summary:'Login in browser'})
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'login in browser',
  })
  @Render('user-login')
  async loginUser() {
  }

  @Get('/update/:id')
  @ApiOperation({summary:'Update profile in browser'})
  @ApiBody({ type: UpdateUserDto })
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
  @ApiOperation({summary:'Get all users'})
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: [UsersEntity],
  })
  async getUsers(): Promise<UsersEntity[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({summary:'Get user by id'})
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
  @ApiOperation({summary:'Update user'})
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'update user',
    type: UsersEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden'
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async updateUser(@Req() request, @Body() updateUserDto: UpdateUserDto,@UploadedFile() cover: Express.Multer.File=null): Promise<UsersEntity> {
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
  @ApiOperation({summary:'Delete user'})
  @ApiResponse({
    status: 200,
    description: 'delete user',
    type: [UsersEntity],
  })
  async removeUser(@Param('id') id: number): Promise<UsersEntity[]> {
    return await this.usersService.removeUser(id);
  }


  @Post('/role/:id')
  @ApiOperation({summary:'Set user role'})
  @ApiResponse({
    status: 201,
    description: 'set user role',
    type: UsersEntity,
  })
  async setModerator(@Param('id') id: number): Promise<UsersEntity> {
    return await this.usersService.setModerator(id);
  }
}
