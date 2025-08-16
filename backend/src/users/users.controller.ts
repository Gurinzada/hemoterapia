/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUseDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async login(@Body() userDtologin: LoginUseDto){
    const user = await this.usersService.login(userDtologin);

    return user;
  }

  @Post('/create')
  async createUser (@Body() createUser: CreateUserDto, @Req() req:Request) {
    const userId = (req as any).user as {email: string, id: number};
    const newUser = await this.usersService.create(createUser, userId.id);
    return newUser;
  }

  @Get("/my")
  async getMyProfile (@Req() req:Request) {
    const userId = (req as any).user as {email: string, id: number};
    const myProfile = await this.usersService.getMyProfile(userId.id);

    return myProfile;
  }

}
