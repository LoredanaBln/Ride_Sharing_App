export interface Driver {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    carType: string;
    licenseNumber: string;
    carColor: string;
    rating?: number;
    imageData?: string;
    status: 'OFFLINE' | 'AVAILABLE' | 'BUSY';
}