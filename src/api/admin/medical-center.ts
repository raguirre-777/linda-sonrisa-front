import { SERVICIO_ENDPOINT } from '../constants';
import { MedicalCenterDto } from '../dto/medical-center.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class MedicalCenter {
    static async getAll() {
        return await request.get('/medical-center/');
    }

    static async get(id?: number) {
        return await request.get(`/medical-center/${id}`);
    }

    static async create(esp: MedicalCenterDto) {
        return await request.post('/medical-center/', esp);
    }

    static async update(esp: MedicalCenterDto, id?: number) {
        return await request.put(`/medical-center/${id}`, esp);
    }

    static async delete(id?: number) {
        return await request.delete(`/medical-center/${id}`);
    }
}