import request from '@/libs/request';

// import qs from 'qs'

export function modPassword (params) {
    return request({
        url: 'unioncheck/user/loginpwd/reset',
        method: 'post',
        params: params,
        data: params
    });
}

export function ipHistory (params) {
    return request({
        url: 'unioncheck/check/loginrecord',
        method: 'get',
        params: params
    })
}

export default {
    modPassword,
    ipHistory
};
