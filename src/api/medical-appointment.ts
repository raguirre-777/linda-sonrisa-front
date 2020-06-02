import { SERVICIO_ENDPOINT } from './constants';
import { MedicalAppointmentDto } from './dto/medical-appointment.dto';
import { MedicalAppointmentAvailabilityDto } from './dto/medical-appointment-availability.dto';
import { Request } from './request';

const request = new Request(SERVICIO_ENDPOINT);

export class MedicalAppointment {
    static async getAll() {
        return await request.get('/medical-appointment/');
    }

    static async get(id?: number) {
        return await request.get(`/medical-appointment/${id}`);
    }

    static async create(esp: MedicalAppointmentDto) {
        return await request.post('/medical-appointment/', esp);
    }

    static async createBulk(esp: MedicalAppointmentDto[]) {
        return await request.post('/medical-appointment/bulk/', esp);
    }

    static async getAvailabilityList(specialityId: number, centerId: number) {
        return await request.get(`/medical-appointment/availability/${specialityId}/${centerId}`);
    }
    
    static async getAvailability(esp: MedicalAppointmentAvailabilityDto[]) {
        return await request.post('/medical-appointment/availability/', esp);
    }

    static async update(esp: MedicalAppointmentDto, id?: number) {
        return await request.put(`/medical-appointment/${id}`, esp);
    }

    static async delete(id?: number) {
        return await request.delete(`/medical-appointment/${id}`);
    }
}