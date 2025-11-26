export interface CreateNotificationDTO {
    userId: string;
    title: string;
    message: string;
    type: "system" | "alert" | "security" | "info";
}
export interface NotificationResponse {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
}
//# sourceMappingURL=notifications.types.d.ts.map