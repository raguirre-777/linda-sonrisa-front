import { SERVICIO_ENDPOINT } from '../constants';
import { UserMedicalSpecialityDto } from '../dto/user-medical-speciality.dto';
import { UserMedicalSpecialitiesDto } from '../dto/user-medical-specialities.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class UserMedicalSpeciality {
    static async getAll() {
        return await request.get('/user-medical-speciality/');
    }

    static async get(id?: number) {
        return await request.get(`/user-medical-speciality/${id}`);
    }

    static async create(esp: UserMedicalSpecialityDto) {
        return await request.post('/user-medical-speciality/', esp);
    }

    static async saveBulk(esp: UserMedicalSpecialitiesDto) {
        return await request.put('/user-medical-speciality/user/bulk', esp);
    }

    static async update(esp: UserMedicalSpecialityDto, id?: number) {
        return await request.put(`/user-medical-speciality/${id}`, esp);
    }

    static async delete(id?: number) {
        return await request.delete(`/user-medical-speciality/${id}`);
    }
}