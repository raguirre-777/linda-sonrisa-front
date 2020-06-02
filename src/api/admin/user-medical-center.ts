import { SERVICIO_ENDPOINT } from '../constants';
import { UserMedicalCenterDto } from '../dto/user-medical-center.dto';
import { UserMedicalCentersDto } from '../dto/user-medical-centers.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class UserMedicalCenter {
    static async getAll() {
        return await request.get('/user-medical-center/');
    }

    static async get(id?: number) {
        return await request.get(`/user-medical-center/${id}`);
    }

    static async create(esp: UserMedicalCenterDto) {
        return await request.post('/user-medical-center/', esp);
    }

    static async saveBulk(esp: UserMedicalCentersDto) {
        return await request.put('/user-medical-center/user/bulk', esp);
    }

    static async update(esp: UserMedicalCenterDto, id?: number) {
        return await request.put(`/user-medical-center/${id}`, esp);
    }

    static async delete(id?: number) {
        return await request.delete(`/user-medical-center/${id}`);
    }
}