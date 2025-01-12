export interface OrderNotification {
    orderId: number;
    startLocation: string;
    endLocation: string;
    estimatedPrice: number;
    distance: number;
    timestamp: number;
    status: string;
    message: string;
} 