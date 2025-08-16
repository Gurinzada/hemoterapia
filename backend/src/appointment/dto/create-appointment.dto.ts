import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";

export class CreateAppointmentDto {

    @IsDateString()
    date: Date;

    @IsNumber({maxDecimalPlaces: 2})
    appointmentValue: number;

    @IsBoolean()
    paid: boolean;

    @IsString()
    @IsEnum(AppointmentStatus)
    status: AppointmentStatus;

    @IsString()
    @IsOptional()
    paymentMethod: string;
}
