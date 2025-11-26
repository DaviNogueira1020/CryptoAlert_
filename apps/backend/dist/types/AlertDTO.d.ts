export interface CreateAlertDTO {
    userId: number;
    crypto: string;
    targetPrice: number;
    direction: "above" | "below";
}
export interface UpdateAlertDTO {
    crypto?: string;
    targetPrice?: number;
    direction?: "above" | "below";
    isActive?: boolean;
}
export interface AlertResponse {
    id: string;
    userId: number;
    crypto: string;
    targetPrice: number;
    direction: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=AlertDTO.d.ts.map