import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AuthMiddlaware } from 'src/auth/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Client, User])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddlaware).forRoutes(AppointmentController);
  }
}
