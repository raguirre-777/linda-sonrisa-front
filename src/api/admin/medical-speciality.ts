import { SERVICIO_ENDPOINT } from '../constants';
import { MedicalSpecialityDto } from '../dto/medical-speciality.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class MedicalSpeciality {
    static async getAll() {
        return await request.get('/medical-speciality/');
    }

    static async get(id?: number) {
        return await request.get(`/medical-speciality/${id}`);
    }

    static async create(esp: MedicalSpecialityDto) {
        return await request.post('/medical-speciality/', esp);
    }

    static async update(esp: MedicalSpecialityDto, id?: number) {
        return await request.put(`/medical-speciality/${id}`, esp);
    }

    static async delete(id?: number) {
        return await request.delete(`/medical-speciality/${id}`);
    }
}