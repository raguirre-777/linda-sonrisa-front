import { MedicalCenterDto } from "./medical-center.dto";
export interface MedicalBuildingDto {
    id?: number;
    code: string;
    name: string;
    status?: string;
    medicalCenter: MedicalCenterDto;
}