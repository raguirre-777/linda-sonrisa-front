import { SERVICIO_ENDPOINT } from '../constants';
import { UserDto } from '../dto/user.dto';
import { Request } from '../request';

const request = new Request(SERVICIO_ENDPOINT);

export class Users {
    static async getAll() {
        return await request.get('/user/');
    }

    static async getByRole(role: 'ADMIN' | 'USER' | 'DOCTOR') {
        return await request.get(`/user/roles/${role}`);
    }

    static async get(id?: number) {
        return await request.get(`/user/${id}`);
    }

    static async create(user: UserDto) {
        return await request.post('/user/', user);
    }

    static async update(user: UserDto, id?: number) {
        return await request.put(`/user/${id}`, user);
    }

    static async delete(id?: number) {
        return await request.delete(`/user/${id}`);
    }
}