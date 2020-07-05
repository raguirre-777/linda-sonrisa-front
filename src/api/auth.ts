import { SERVICIO_ENDPOINT, LOCAL } from './constants';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { RecoveryDto } from './dto/recovery.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Request } from './request';

const request = new Request(SERVICIO_ENDPOINT);


export class Auth {
    static async login(login: LoginDto) {
        localStorage.removeItem("session");
        return await request.post('/auth/login', login);
    }

    static async sigin(login: LoginDto) {
        localStorage.removeItem("session");
        return await request.post('/auth/signin', login);
    }

    static async recovery(recovery: RecoveryDto) {
        localStorage.removeItem("session");
        return await request.post('/auth/recovery', recovery);
    }

    static async register(user: UserDto) {
        return await request.post('/auth/register', user);
    }


    static async changePassword(changePass: ChangePasswordDto) {
        return await request.post('/auth/change-password', changePass);
    }

    static async updateMe(user: UserDto) {
        return await request.put('/user/me', user);
    }
}