import { GenericResponse } from "../models/generic-response";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3000';

const request = <T, K>(): (
    requestPath: string,
    method: string,
    token: string,
    payload?: K
) => Promise<GenericResponse<T>> => {
    return async (
        requestPath: string,
        method: string,
        token: string,
        payload?: K
    ) => {
        const body = payload ? JSON.stringify(payload) : null;
        return new Promise<GenericResponse<T>>((resolve) => {
            fetch(`${BACKEND_BASE_URL}${requestPath}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            })
                .then(async (res: Response) => {
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw JSON.stringify(errorData);
                    }
                    return res.json();
                })
                .then((result) => {
                    resolve(new GenericResponse(result, true, null as any));
                }, (error) => {
                    try {
                        const errorData = JSON.parse(error);
                        const errorMessage = errorData.message || errorData.error || 'An error occurred';
                        resolve(new GenericResponse(null as any, false, errorMessage));
                    } catch {
                        resolve(new GenericResponse(null as any, false, 'An error occurred'));
                    }
                }).catch((error) => {
                    resolve(new GenericResponse(null as any, false, error.message || 'Network error'));
                });
        });
    }
};

export const get = <T>(): (
    requestPath: string, token: string
) => Promise<GenericResponse<T>> => {
    const _request = request<T, null>();
    return async (requestPath: string, token: string) => {
        return await _request(requestPath, 'GET', token, null);
    }
};

export const post = <T, K>(): (
    requestPath: string, token: string, payload?: K
) => Promise<GenericResponse<T>> => {
    const _request = request<T, K>();
    return async (requestPath: string, token: string, payload?: K) => {
        return await _request(requestPath, 'POST', token, payload);
    }
};

export const put = <T, K>(): (
    requestPath: string, token: string, payload: K
) => Promise<GenericResponse<T>> => {
    const _request = request<T, K>();
    return async (requestPath: string, token: string, payload: K) => {
        return await _request(requestPath, 'PUT', token, payload);
    }
};

export const _delete = <T>(): (
    requestPath: string, token: string
) => Promise<GenericResponse<T>> => {
    const _request = request<T, null>();
    return async (requestPath: string, token: string) => {
        return await _request(requestPath, 'DELETE', token, null);
    }
};
