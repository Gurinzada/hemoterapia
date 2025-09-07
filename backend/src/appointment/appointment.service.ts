import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
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


    const [appointment, total] = await this.appointmentRepository.findAndCount({
      where: {
        client: {
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
      const [year, month, day] = item.date.split("-");
      const formattedDateKey = `${day}/${month}/${year}`;
      if(!appointmentsByDate[formattedDateKey]){
        appointmentsByDate[formattedDateKey] = [];
      }
      appointmentsByDate[formattedDateKey].push(item);
    })

    const convertAppoitmentsToArray = Object.entries(appointmentsByDate).map(([date, appointments]) => {
      return ({
        date,
        appointment: appointments
      })
    })

    return {
      appointments: convertAppoitmentsToArray,
      total: total,
      page: Number(page),
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOneAppointment(id: number) {
    const findAppointmentClient = await this.appointmentRepository.findOne({
      where: {
        id,
      },
      relations: {
        client: true
      }
    });

    return {
      ...findAppointmentClient,
      clientid: findAppointmentClient?.client.id
    };
  }

  async updateAppointment(id: number, updateAppointmentDto: UpdateAppointmentDto, idUser: number, clientid:number){
    const user = await this.userRepository.findOne({
      where: {
        id: idUser
      },
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const updateAppointment = await this.appointmentRepository.findOne({
      where: {
        id,
      },
      relations: {
        client: true
      }
    });

    if (!updateAppointment) {
      throw new NotFoundException("Appointment not found");
    }

    updateAppointment.client.id = Number(clientid);
    updateAppointment.appointmentValue = Number(updateAppointmentDto.appointmentValue);
    updateAppointment.date = String(updateAppointmentDto.date);
    updateAppointment.paid = Boolean(updateAppointmentDto.paid);
    updateAppointment.paymentMethod = String(updateAppointmentDto.paymentMethod);
    updateAppointment.status = (updateAppointmentDto.status as AppointmentStatus);

    return this.appointmentRepository.save(updateAppointment);
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
