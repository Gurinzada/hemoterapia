export enum UserRole {
    MEGA = "megaadmin",
    ADMIN = "admin",
}

export interface user {
    id: number;
    userName:string;
    email: string;
    role: UserRole;
    createdAt: Date
    updateAt: Date;
    deletedAt: Date | null;
}