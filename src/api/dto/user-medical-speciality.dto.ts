import { UserDto } from './user.dto';
import { MedicalSpecialityDto } from './medical-speciality.dto';

export interface UserMedicalSpecialityDto {
    id?: number;
    userDoctor: UserDto;
    medicalSpeciality: MedicalSpecialityDto;
    status?: string;
}