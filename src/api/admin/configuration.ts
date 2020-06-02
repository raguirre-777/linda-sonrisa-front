import { SERVICIO_ENDPOINT } from '../constants';
import { ConfigurationDto } from '../dto/configuration.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class Configuration {
    static async get() {
        return await request.get('/configuration/');
    }

    static async save(configuration: ConfigurationDto) {
        return await request.put('/configuration/', configuration);
    }
}