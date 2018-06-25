import request from '@/libs/request';

// import qs from 'qs'

export function getToken (params) {
    return request({
        url: 'unioncheck/sec/rsa',
        method: 'get',
        params: params
    });
}


export function login (params) {
    return request({
        url: '/unioncheck/user/mechantlogin',
        method: 'post',
        data: JSON.stringify(params)
    });
}

export default {
    getToken,
    login
};
