import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUseDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string) {
    const saltRounds = 10;
    const genSaltForHash = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, genSaltForHash);

    return hash;
  }

  private async comparePassword(password: string, hashPassword: string) {
    const comparePassword = await bcrypt.compare(password, hashPassword);
    return comparePassword;
  }

  async create(createUser: CreateUserDto, idUser: number) {
    const myMegaAdminUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });

    if (!myMegaAdminUser || myMegaAdminUser.role !== UserRole.MEGA) {
      throw new UnauthorizedException('User not authorized');
    }

    const createNewUser = await this.userRepository.findOne({
      where: {
        email: createUser.email,
      },
    });

    if (createNewUser) {
      throw new ForbiddenException('User already exists');
    }

    const hashPassword = await this.hashPassword(createUser.password);

    const newUser = this.userRepository.create({
      ...createUser,
      password: hashPassword,
    });
    const savedNewUser = await this.userRepository.save(newUser);
    return savedNewUser;
  }

  async login(loginUser: LoginUseDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUser.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User or Password incorrect');
    }

    const isRigthPassword = await this.comparePassword(
      loginUser.password,
      user.password,
    );

    if (!isRigthPassword) {
      throw new NotFoundException('User or Password incorrect');
    }

    const generateToken = jwt.sign(
      { id: user.id, email: user.email },
      String(process.env.JWT_SECRET),
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return {
      token: generateToken,
    };
  }

  async getMyProfile(idUser: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async findAll(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      users,
      total,
      page: Number(page),
      lastPage: Math.ceil(total / limit),
    };
  }

  async deleteUser(id: number) {
    await this.userRepository.softDelete(id);
    return { message: 'User deleted' };
  }

  async updatePassword(id: number, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashPassword = await this.hashPassword(newPassword);
    user.password = hashPassword;
    return this.userRepository.save(user);
  }
}
