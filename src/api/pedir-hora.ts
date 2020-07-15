import { SERVICIO_ENDPOINT, LOCAL } from './constants';
import { PedirHoraDto } from './dto/pedir-hora.dto';
import { Request } from './request';

const request = new Request(SERVICIO_ENDPOINT);


export class PedirHora {
    static async register(hora: PedirHoraDto) {
        return await request.post('/hora', hora);
    }

}