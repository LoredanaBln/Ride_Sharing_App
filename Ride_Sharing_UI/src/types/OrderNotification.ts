export interface OrderNotification {
    orderId: number;
    status: string;
    message: string;
    timestamp: number;
    driverInfo?: DriverInfoDTO;
    estimatedArrival?: number;
    canClose?: boolean;
} 