import type { appointment } from "./appointment";
import type { user } from "./user";


export interface client {
    id: number;
    userNameClient:string;
    emailClient?:string;
    phoneClient?:string;
    user:user;
    createdAt:Date
    updatedAt:Date;
    deletedAt:Date | null;
    appointment:appointment[]
}


export interface clientPaginated {
    clients: client[]
    total: number;
    page: number;
    lastPage: number;
}