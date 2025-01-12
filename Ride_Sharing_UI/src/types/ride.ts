export interface Ride {
    id: number;
    startLocation: string;
    endLocation: string;
    date: string;
    price: number;
    status?: string;
    distance?: number;
    duration?: number;
}