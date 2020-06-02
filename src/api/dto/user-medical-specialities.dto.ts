import { UserDto } from './user.dto';
import { MedicalSpecialityDto } from './medical-speciality.dto';

export interface UserMedicalSpecialitiesDto {
    userDoctor: UserDto;
    medicalSpecialities: MedicalSpecialityDto[];
}