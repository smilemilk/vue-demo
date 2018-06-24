import request from '@/libs/request';

// import qs from 'qs'

export function refundList (params) {
    return request({
        url: 'unioncheck/merchantCheck/checkList',
        method: 'get',
        params: params
    });
}

export default {
    refundList
};
