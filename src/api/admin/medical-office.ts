import { SERVICIO_ENDPOINT } from '../constants';
import { MedicalOfficeDto } from '../dto/medical-office.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class MedicalOffice {
    static async getAll() {
        return await request.get('/medical-office/');
    }

    static async get(id?: number) {
        return await request.get(`/medical-office/${id}`);
    }

    static async getByMedicalBuilding(id?: number) {
        return await request.get(`/medical-office/medical-building/${id}`);
    }


    static async create(esp: MedicalOfficeDto) {
        return await request.post('/medical-office/', esp);
    }

    static async update(esp: MedicalOfficeDto, id?: number) {
        return await request.put(`/medical-office/${id}`, esp);
    }

    static async delete(id?: number) {
        return await request.delete(`/medical-office/${id}`);
    }
}