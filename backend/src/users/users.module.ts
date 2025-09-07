import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthMiddlaware } from 'src/auth/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddlaware).forRoutes({ path: "/users/create", method: RequestMethod.POST })
      .apply(AuthMiddlaware).forRoutes({path: "/users/my", method: RequestMethod.GET})
      .apply(AuthMiddlaware).forRoutes({path: "/users/findAllUsers", method: RequestMethod.GET})
      .apply(AuthMiddlaware).forRoutes({path: "/users/:id", method: RequestMethod.DELETE})
      .apply(AuthMiddlaware).forRoutes({path: "/users/:id/password", method: RequestMethod.PATCH})
  }
}
