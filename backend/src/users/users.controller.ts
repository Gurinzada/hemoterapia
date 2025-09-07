/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUseDto } from './dto/login-user.dto';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async login(@Body() userDtologin: LoginUseDto) {
    const user = await this.usersService.login(userDtologin);

    return user;
  }

  @Post('/create')
  async createUser(@Body() createUser: CreateUserDto, @Req() req: Request) {
    const userId = (req as any).user as { email: string; id: number };
    const newUser = await this.usersService.create(createUser, userId.id);
    return newUser;
  }

  @Get('/my')
  async getMyProfile(@Req() req: Request) {
    const userId = (req as any).user as { email: string; id: number };
    const myProfile = await this.usersService.getMyProfile(userId.id);

    return myProfile;
  }

  @Get('/findAllUsers')
  async findAll(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const userId = (req as any).user as { email: string; id: number };
    const myUserAdmin = await this.usersService.getMyProfile(userId.id);
    if (myUserAdmin.role !== UserRole.MEGA) {
      throw new UnauthorizedException('User not authorized');
    }
    console.log(limit, page);
    const users = await this.usersService.findAll((page = 1), (limit = 10));
    return users;
  }

  @Delete('/:id')
  async deleteUser(@Req() req: Request, @Param('id') id: number) {
    const userId = (req as any).user as { email: string; id: number };
    const findOneUser = await this.usersService.getMyProfile(userId.id);
    if (findOneUser.role !== UserRole.MEGA) {
      throw new UnauthorizedException('User not authorized');
    }
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id/password')
  async updatePassword(
    @Req() req: Request,
    @Param('id') id: number,
    @Body('password') password: string,
  ) {
    const userId = (req as any).user as { id: number; role: UserRole };
    const user = await this.usersService.getMyProfile(userId.id);
    if (user.role !== UserRole.MEGA) {
      throw new UnauthorizedException('User not authorized');
    }

    return this.usersService.updatePassword(id, password);
  }
}
