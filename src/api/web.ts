import { SERVICIO_ENDPOINT } from './constants';
import { Request } from './request';

const request = new Request(SERVICIO_ENDPOINT);

export class Web {
    static async getConfig() {
        return await request.get('/web/config');
    }

    static async getSpeciality() {
        return await request.get('/web/speciality');
    }

    static async getCenter() {
        return await request.get('/web/center');
    }

}