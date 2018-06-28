import request from '@/libs/request';

// import qs from 'qs'

export function checkList (params) {
    return request({
        url: 'unioncheck/merchantCheck/checkList',
        method: 'get',
        params: params
    });
}

export function exportCheck (params) {
    return request({
        url: 'unioncheck/merchantCheck/downloadMerchantCheck',
        method: 'post',
        params: params,
        data: params
    });
}

export default {
    checkList,
    exportCheck
};
