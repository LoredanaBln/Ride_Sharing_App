export interface Ride {
  id: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string;
  price: number;
  status?: string;
  distance?: number;
  duration?: number;
}
