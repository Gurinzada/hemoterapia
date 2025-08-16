import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createNewAppointment(
    createAppointment: CreateAppointmentDto,
    idUser: number,
    idClient: number,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const client = await this.clientRepository.findOne({
      where: {
        id: idClient,
        user: {
          id: idUser,
        },
      },
    });

    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    const newAppointment = this.appointmentRepository.create({
      ...createAppointment,
      client: client,
    });

    const savedNewAppointment =
      await this.appointmentRepository.save(newAppointment);
    return savedNewAppointment;
  }

  async getAllAppointmentsPaginated(
    idUser: number,
    idClient: number,
    limit: number,
    page: number,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const client = await this.clientRepository.findOne({
      where: {
        id: idClient,
        user: {
          id: idUser,
        },
      },
    });

    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    const [appointment, total] = await this.appointmentRepository.findAndCount({
      where: {
        client: {
          id: idClient,
          user: {
            id: idUser,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        client: true,
      },
      order: {
        date: 'DESC',
      },
    });

    const appointmentsByDate: Record<string, Appointment[]> = {};
    appointment.forEach((item) => {
      const dateObj = new Date(item.date);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const formattedDateKey = `${day}/${month}/${year}`;
      if(!appointmentsByDate[formattedDateKey]){
        appointmentsByDate[formattedDateKey] = [];
      }
      appointmentsByDate[formattedDateKey].push(item);
    })

    return {
      appointments: appointmentsByDate,
      total: total,
      page: page,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOneAppointment(id: number) {
    const findAppointmentClient = await this.appointmentRepository.findOne({
      where: {
        id,
      }
    });

    return findAppointmentClient;
  }

  async updateAppointment(id: number, updateAppointmentDto: UpdateAppointmentDto, idUser: number){
    const user = await this.userRepository.findOne({
      where: {
        id: idUser
      }
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const updateAppointment = await this.appointmentRepository.findOne({
      where: {
        id,
      }
    });

    if (!updateAppointment) {
      throw new NotFoundException("Appointment not found");
    }

    if (Object.keys(updateAppointmentDto).length === 0) {
      return updateAppointment;
    }

    const updatedAppointment = Object.assign(updateAppointment, updateAppointmentDto);
    return this.appointmentRepository.save(updatedAppointment);
  }

  async removeAppointment(id: number, idUser: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: idUser
      }
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    await this.appointmentRepository.delete(+id);
    return { message: 'Appointment deleted successfully' };
  }
}
