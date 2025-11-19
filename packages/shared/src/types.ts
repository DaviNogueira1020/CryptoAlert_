// Types compartilhados entre Frontend e Backend

export interface Alert {
  id: string;
  userId: number;
  crypto: string;
  targetPrice: number;
  direction: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertDTO {
  userId: number;
  crypto: string;
  targetPrice: number;
  direction: 'above' | 'below';
}

export interface UpdateAlertDTO {
  crypto?: string;
  targetPrice?: number;
  direction?: 'above' | 'below';
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    status: number;
  };
}
