import request from '@/libs/request';

// import qs from 'qs'

export function getToken (params) {
    return request({
        url: 'unioncheck/sec/rsa',
        method: 'get',
        params: params
    });
}

export function getTokenPK (params) {
    return request({
        url: 'unioncheck/sec/publickey',
        method: 'get',
        params: params
    });
}


export function login (params) {
    return request({
        url: 'unioncheck/user/mechantlogin',
        method: 'post',
        data: params,
        params: params
    });
}

export function getUser (params) {
    return request({
        url: 'unioncheck/merchantuser',
        method: 'get',
        params: params
    })
}

export function getRule (params) {
    return request({
        url: 'unioncheck/user/getperms',
        method: 'post',
        params: params,
        data: params
    })
}

export function loginOut (params) {
    return request({
        url: 'unioncheck/user/mechantlogout',
        method: 'post',
        data: params,
        params: params
    })
}

export default {
    getToken,
    login,
    getTokenPK,
    getUser,
    getRule,
    loginOut
};
