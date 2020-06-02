import Axios from "axios";
import { ResponseDto } from './dto/response.dto';
import { REQUEST_TIMEOUT } from "./constants";

export class Request {
    private endpoint;
    constructor(enpoint: string) {
        this.endpoint = enpoint;
    }

    _getHeader() {
        const session = localStorage.getItem('session');
        try {
            if (session === null) {
                return {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 1000 * REQUEST_TIMEOUT + 1000,
                };
            }
            const sesionObj = JSON.parse(session);
            return {
                headers: {
                    Authorization: `Bearer ${sesionObj.token}`,
                    'Content-Type': 'application/json',
                },
                timeout: 1000 * REQUEST_TIMEOUT + 1000,
            };
        } catch{
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 1000 * REQUEST_TIMEOUT + 1000,
            };
        }
    }

    async get(url: string): Promise<ResponseDto> {
        try {
            const result = await Axios.get(this.endpoint + url, this._getHeader());
            if (result.status === 200 || result.status === 201) {
                return {
                    status: result.status,
                    error: false,
                    data: result.data,
                }
            } else {
                return {
                    status: result.status,
                    error: result.statusText,
                    data: result.data,
                }
            }
        } catch (error) {
            if (error.response !== undefined) {
                const err = error.response.data;
                if (err.message !== undefined) {
                    return {
                        status: error.status,
                        error: err.message,
                        data: undefined,
                    }
                }
            }
            return {
                status: error.status,
                error: error.toString(),
                data: undefined,
            }
        }
    }

    async post(url: string, body: any): Promise<ResponseDto> {
        try {
            const result = await Axios.post(this.endpoint + url, body, this._getHeader());
            if (result.status === 200 || result.status === 201) {
                return {
                    status: result.status,
                    error: false,
                    data: result.data,
                }
            } else {
                return {
                    status: result.status,
                    error: result.statusText,
                    data: result.data,
                }
            }
        } catch (error) {
            if (error.response !== undefined) {
                const err = error.response.data;
                if (err.message !== undefined) {
                    return {
                        status: error.status,
                        error: err.message,
                        data: undefined,
                    }
                }
            }
            return {
                status: error.status,
                error: error.toString(),
                data: undefined,
            }
        }
    }

    async put(url: string, body: any): Promise<ResponseDto> {
        try {
            const result = await Axios.put(this.endpoint + url, body, this._getHeader());
            if (result.status === 200 || result.status === 201) {
                return {
                    status: result.status,
                    error: false,
                    data: result.data,
                }
            } else {
                return {
                    status: result.status,
                    error: result.statusText,
                    data: result.data,
                }
            }
        } catch (error) {
            if (error.response !== undefined) {
                const err = error.response.data;
                if (err.message !== undefined) {
                    return {
                        status: error.status,
                        error: err.message,
                        data: undefined,
                    }
                }
            }
            return {
                status: error.status,
                error: error.toString(),
                data: undefined,
            }
        }
    }

    async delete(url: string): Promise<ResponseDto> {
        try {
            const result = await Axios.delete(this.endpoint + url, this._getHeader());
            if (result.status === 200 || result.status === 201) {
                return {
                    status: result.status,
                    error: false,
                    data: result.data,
                }
            } else {
                return {
                    status: result.status,
                    error: result.statusText,
                    data: result.data,
                }
            }
        } catch (error) {
            if (error.response !== undefined) {
                const err = error.response.data;
                if (err.message !== undefined) {
                    return {
                        status: error.status,
                        error: err.message,
                        data: undefined,
                    }
                }
            }
            return {
                status: error.status,
                error: error.toString(),
                data: undefined,
            }
        }
    }
}