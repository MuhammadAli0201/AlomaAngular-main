import { User } from "./user";

export interface AuditLog {
    auditLogId: number;
    dateTime: Date;
    userId: number;
    user: User;
    actionType: string;
}
