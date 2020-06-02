export interface UserDto {
    id?: number;
    rut: string;
    password?: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    mobile: string;
    role?: string;
    status?: string;
    dateBirth: Date;
    userMedicalSpecialities?: any[];
    userMedicalCenters?: any[];
}