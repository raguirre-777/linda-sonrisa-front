import { MedicalBuildingDto } from "./medical-building.dto";
export interface MedicalOfficeDto {
    id?: number;
    code: string;
    floor: string;
    name: string;
    status?: string;
    medicalBuilding: MedicalBuildingDto;
}