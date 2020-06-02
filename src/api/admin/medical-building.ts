import { SERVICIO_ENDPOINT } from '../constants';
import { MedicalBuildingDto } from '../dto/medical-building.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class MedicalBuilding {
    static async getAll() {
        return await request.get('/medical-building/');
    }

    static async get(id?: number) {
        return await request.get(`/medical-building/${id}`);
    }

    static async getByMedicalCenter(id?: number) {
        return await request.get(`/medical-building/medical-center/${id}`);
    }


    static async create(esp: MedicalBuildingDto) {
        return await request.post('/medical-building/', esp);
    }

    static async update(esp: MedicalBuildingDto, id?: number) {
        return await request.put(`/medical-building/${id}`, esp);
    }

    static async delete(id?: number) {
        return await request.delete(`/medical-building/${id}`);
    }
}