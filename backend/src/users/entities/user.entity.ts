import { Client } from "src/clients/entities/client.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum UserRole {
    MEGA = "megaadmin",
    ADMIN = "admin",
    OPERATOR = "operador",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName:string;

    @Column({unique: true, nullable: false})
    email:string;

    @Column({nullable: false})
    password:string;

    @Column({type: "enum", enum: UserRole, default: UserRole.ADMIN, nullable: false})
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn({nullable: true})
    deletedAt: Date | null;

    @OneToMany(() => Client, (client) => client.user, {nullable: true})
    client: Client[];
}
