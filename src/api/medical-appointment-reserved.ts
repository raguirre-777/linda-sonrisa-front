import { SERVICIO_ENDPOINT } from './constants';
import { MedicalAppointmentReservedDto } from './dto/medical-appointment-reserved.dto';
import { Request } from './request';

const request = new Request(SERVICIO_ENDPOINT);

export class MedicalAppointmentReserved {
    static async getAll() {
        return await request.get('/medical-appointment-reserved/');
    }

    static async get(id?: number) {
        return await request.get(`/medical-appointment-reserved/${id}`);
    }

    static async getMe() {
        return await request.get('/medical-appointment-reserved/me/');
    }

    static async getMeById(id: number) {
        return await request.get(`/medical-appointment-reserved/me/${id}`);
    }

    static async create(esp: MedicalAppointmentReservedDto) {
        return await request.post('/medical-appointment-reserved/', esp);
    }

    static async update(esp: MedicalAppointmentReservedDto, id?: number) {
        return await request.put(`/medical-appointment-reserved/${id}`, esp);
    }

    static async updateStatus(id: number, status: string) {
        const statusDto = {
            status,
        }
        return await request.put(`/medical-appointment-reserved/status/${id}`, statusDto);
    }

    static async delete(id?: number) {
        return await request.delete(`/medical-appointment-reserved/${id}`);
    }
}