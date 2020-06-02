import { MedicalOfficeDto } from "./medical-office.dto";
import { UserDto } from "./user.dto";
import { MedicalSpecialityDto } from "./medical-speciality.dto";

export interface MedicalAppointmentDto {
    schedule: Date;
    medicalSpeciality: MedicalSpecialityDto;
    medicalOffice: MedicalOfficeDto;
    userDoctor: UserDto;
}
