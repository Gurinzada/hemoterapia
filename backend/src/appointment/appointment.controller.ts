/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  
  @Post(":id")
  async createNewAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: Request, @Param("id") idclient:number) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.appointmentService.createNewAppointment(createAppointmentDto, idUser.id, idclient);
    return response;
  }

  @Get('/paginated/:id')
  async getAllAppointmentsPaginated(@Req() req: Request, @Query('limit') limit:number, @Query("page") page:number, @Param("id") idclient:number) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.appointmentService.getAllAppointmentsPaginated(idUser.id, idclient, limit = 10, page = 1);
    return response
  }

  @Get(':id')
  async findOneAppointment(@Param('id') id: string) {
    const response = await this.appointmentService.findOneAppointment(+id);
    return response;
  }

  @Patch(":id")
  async updateAppointment(@Req() req: Request, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.appointmentService.updateAppointment(+id, updateAppointmentDto, idUser.id);
    return response;
  }

  @Delete(":id")
  async removeAppointment(@Req() req: Request, @Param('id') id: string) {
    const idUser = (req as any).user as { id:number; email:string };
    const response = await this.appointmentService.removeAppointment(+id, idUser.id);
    return response;
  }

}
