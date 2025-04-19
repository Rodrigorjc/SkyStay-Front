export interface Notifications{
    titulo: string;
    mensaje: string;
    code: number;
    tipo?: string;
}

export function isNotification(error: unknown): error is Notifications {
    return (error as Notifications).titulo !== undefined;
}