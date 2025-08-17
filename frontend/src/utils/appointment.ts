export enum AppointmentStatus {
    PENDING = "Pendente",
    CONFIRMED = "Confirmado", 
    CANCELED = "Cancelado",
    COMPLETED = "Concluído"
}

export interface appointment {
    id: number;
    date: Date;
    appointmentValue: number;
    paid: boolean;
    status: AppointmentStatus;
    paymentMethod: string;
    createdAt: Date;
    updatedAt:Date;
    deletedAt: Date | null;
}