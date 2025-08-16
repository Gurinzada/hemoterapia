import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { AppointmentModule } from './appointment/appointment.module';
import * as dotenv from "dotenv";
import { Appointment } from './appointment/entities/appointment.entity';
import { User } from './users/entities/user.entity';
import { Client } from './clients/entities/client.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.PORT_DATABASE),
      username: process.env.DB_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Appointment, User, Client],
      synchronize: true,
      timezone: 'Z',
    }),
    UsersModule,
    ClientsModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
