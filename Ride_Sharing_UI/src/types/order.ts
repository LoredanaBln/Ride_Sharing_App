export interface Order {
    passengerId: number;
    startLocation: string;
    endLocation: string;
    startLatitude: number;
    endLatitude: number;
    startLongitude: number;
    endLongitude: number;
    paymentType: string;
    estimatedPrice: number;
}