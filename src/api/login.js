import request from '@/libs/request';

// import qs from 'qs'

export function getToken (params) {
    return request({
        url: 'unioncheck/sec/rsa',
        method: 'get',
        params: params
    });
}

export default {
    getToken
};
