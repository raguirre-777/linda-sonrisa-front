import { UserDto } from './user.dto';
import { MedicalCenterDto } from './medical-center.dto';

export interface UserMedicalCentersDto {
    userDoctor: UserDto;
    medicalCenters: MedicalCenterDto[];
}