import { Appointment } from "src/appointment/entities/appointment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userNameClient:string;

    @Column({ nullable: true })
    emailClient: string;

    @Column({nullable: true})
    phoneClient: string;

    @ManyToOne(() => User, (user) => user.client, {nullable: true})
    user: User;

    @OneToMany(() => Appointment, (appointment) => appointment.client, {nullable: true, onDelete: "CASCADE"})
    appointment: Appointment[];

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @DeleteDateColumn({nullable: true})
    deletedAt:Date | null;
}
