/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async createClient(@Body() createClientDto: CreateClientDto, @Req() req:Request){
    const idUser = (req as any).user as {id: number; email:string};
    const response = await this.clientsService.createClient(createClientDto, idUser.id);
    return response;
  }

  @Get('/paginated')
  async findAllClientsPaginated(@Req() req: Request, @Query('limit') limit:number, @Query("page") page:number) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.clientsService.findAllClientsPaginated(idUser.id, limit, page);
    return response;
  }

  @Get(':id')
  async findOneClient(@Param('id') id: number, @Req() req: Request) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.clientsService.findOneClient(+id, idUser.id);
    return response;
  }

  @Patch(":id")
  async updateClient(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto, @Req() req: Request) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.clientsService.updateClient(+id, updateClientDto, idUser.id);
    return response;
  }

  @Delete(":id")
  async removeClient(@Param('id') id: number, @Req() req: Request) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.clientsService.removeClient(+id, idUser.id);
    return response;
  }
}
