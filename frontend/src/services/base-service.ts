import { GenericResponse } from "../models/generic-response";


const request = <T, K>(): (
    requestPath: string,
    method: string,
    headers: {},
    payload?: K,
) => Promise<GenericResponse<T>> => {
    return async (
        requestPath: string,
        method: string,
        headers: {},
        payload?: K,
    ) => {
        const baseUrl: string = process.env.REACT_APP_BACKEND_API_URL || '';
        const body = payload ? JSON.stringify(payload) : null;
        const requestHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...headers
        };

        return new Promise<GenericResponse<T>>((resolve) => {
            fetch(`${baseUrl}${requestPath}`, {
                method,
                headers: requestHeaders,
                body
            })
                .then(async (res: Response) => {
                    if (!res.ok) {
                        throw JSON.stringify(await res.json());
                    }
                    if(res.status === 204) return null;
                    return res.json();
                })
                .then((result) => {
                    resolve(new GenericResponse(result, true, null as any));
                }, (error) => {
                    const errorMessage = JSON.parse(error).status_message;
                    resolve(new GenericResponse(null as any, false, errorMessage));
                }).catch((error) => {
                    const errorMessage = JSON.parse(error).status_message;
                    resolve(new GenericResponse(null as any, false, errorMessage));
                });
        });
    }
};

export const get = <T>(): (
    requestPath: string, headers?: {},
) => Promise<GenericResponse<T>> => {
    const _request = request<T, null>();
    return async (requestPath: string, headers: {} = {}) => {
        return await _request(requestPath, 'GET', headers, null);
    }
};

export const post = <T, K>(): (
    requestPath: string, payload?: K, headers?: {}
) => Promise<GenericResponse<T>> => {
    const _request = request<T, K>();
    return async (requestPath: string, payload?: K, headers: {} = {}) => {
        return await _request(requestPath, 'POST', headers, payload);
    }
};

export const put = <T, K>(): (
    requestPath: string, payload: K, headers?: {}
) => Promise<GenericResponse<T>> => {
    const _request = request<T, K>();
    return async (requestPath: string, payload: K, headers: {} = {}) => {
        return await _request(requestPath, 'PUT', headers, payload);
    }
};

export const _delete = <T>(): (
    requestPath: string, headers?: {}
) => Promise<GenericResponse<T>> => {
    const _request = request<T, null>();
    return async (requestPath: string, headers: {} = {}) => {
        return await _request(requestPath, 'DELETE', headers, null);
    }
};