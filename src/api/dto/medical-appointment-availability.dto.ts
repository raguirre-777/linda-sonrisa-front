import { MedicalOfficeDto } from "./medical-office.dto";
import { UserDto } from "./user.dto";

export interface MedicalAppointmentAvailabilityDto {
    schedule: Date;
    medicalOffice: MedicalOfficeDto;
    userDoctor: UserDto;
    availability?: boolean;
}
