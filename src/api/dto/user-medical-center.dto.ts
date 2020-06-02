import { UserDto } from './user.dto';
import { MedicalCenterDto } from './medical-center.dto';

export interface UserMedicalCenterDto {
    id?: number;
    userDoctor: UserDto;
    medicalCenter: MedicalCenterDto;
    status?: string;
}