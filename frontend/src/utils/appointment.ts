import type { client } from "./client";

export enum AppointmentStatus {
  CANCELED = "Cancelado",  
  COMPLETED = "Concluído",
  CONFIRMED = "Confirmado",
  PENDING = "Pendente",
}

export interface appointment {
  id: number;
  date: string;
  appointmentValue: number;
  paid: boolean;
  status: AppointmentStatus;
  client: client;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface appointmentFields {
  clientid: number;
  date: string;
  appointmentValue: number;
  paid: boolean;
  status: AppointmentStatus;
  paymentMethod: string;
}

export interface appointmentPaginated {
  appointments: appointment[];
  total: number;
  page: number;
  lastPage: number;
}
