import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createClient(createClientDto: CreateClientDto, idUser: number) {
    const user = await this.userRepository.findOne({ where: { id: idUser } });

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const client = this.clientRepository.create({
      ...createClientDto,
      user: user,
    });

    const savedClient = await this.clientRepository.save(client);
    return savedClient;
  }

  async findAllClientsPaginated(idUser: number, limit:number, page: number) {
    const user = await this.userRepository.findOne({
      where: {id: idUser}
    })

    if(!user) {
      throw new UnauthorizedException("Unauthorized user");
    }

    const [clients, total] = await this.clientRepository.findAndCount({
      where: {
        user: {id: idUser}
      },
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        user: true,
        appointment: true
      },
      order: {
        createdAt: "DESC"
      }
    })

    return {
      clients: clients,
      total: total,
      page: page,
      lastPage: Math.ceil(total/limit),
    }
  }

  async findOneClient(id: number, idUser: number) {
    const client = await this.clientRepository.findOne({
      where: {
        id: id,
        user: {id: idUser}
      }
    });
    if (!client) {
      throw new NotFoundException("Client not found");
    }

    return client;
  }

  async updateClient(id: number, updateClientDto: UpdateClientDto, idUser:number){
    
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    
    const client = await this.clientRepository.findOne({
      where: {
        id: id,
        user: {
          id: idUser
        }
      }
    });
    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }
    if (!client) {
      throw new NotFoundException("Client not found");
    }

    if (Object.keys(updateClientDto).length === 0) {
      return client;
    }
    const updatedClient = Object.assign(client, updateClientDto);
    return this.clientRepository.save(updatedClient);
  }

  async removeClient(id: number, idUser:number) {
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    const client = await this.clientRepository.findOne({
      where: {
        id: id,
        user: {
          id: idUser
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    if (!client) {
      throw new NotFoundException("Client not found");
    }
    await this.clientRepository.delete(id);
    return { message: 'Client deleted successfully' };
  }
}
