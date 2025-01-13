import { DriverInfoDTO } from "./DriverInfoDTO";

export interface OrderNotification {
  orderId: number;
  status: string;
  message: string;
  timestamp: number;
  driverInfo?: DriverInfoDTO;
  estimatedArrival?: number;
  startLocation?: string;
  endLocation?: string;
  estimatedPrice?: number;
  distance?: number;
}
