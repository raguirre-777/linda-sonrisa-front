
import { UserDto } from "./user.dto";
import { MedicalAppointmentDto } from "./medical-appointment.dto";

export interface MedicalAppointmentReservedDto {
    medicalAppointment: MedicalAppointmentDto;
    user?: UserDto | null;
}
