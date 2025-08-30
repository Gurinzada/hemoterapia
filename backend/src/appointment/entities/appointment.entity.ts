import { Client } from "src/clients/entities/client.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum AppointmentStatus {
    PENDING = "Pendente",
    CONFIRMED = "Confirmado", 
    CANCELED = "Cancelado",
    COMPLETED = "Concluído"
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    appointmentValue: number;

    @Column({nullable: false, default: false})
    paid: boolean;

    @Column({nullable: false, default: AppointmentStatus.PENDING, type: "enum", enum: AppointmentStatus})
    status: AppointmentStatus;

    @Column({nullable: true})
    paymentMethod: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @DeleteDateColumn({nullable: true})
    deletedAt: Date | null;

    @ManyToOne(() => Client, (client) => client.appointment, {nullable: true})
    client: Client;

}
