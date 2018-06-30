import request from '@/libs/request';

// import qs from 'qs'

export function checkList (params) {
    return request({
        url: 'unioncheck/merchantCheck/checkList',
        method: 'get',
        params: params
    });
}

// export function exportCheck (params) {
//     return request({
//         url: 'unioncheck/merchantCheck/downloadCheck',
//         method: 'get',
//         params: params,
//         // data: params
//     });
// }

export function fundList(params) {
    return request({
        url: 'unioncheck/merchantCheck/getUnioncheckAPPAndFundList',
        method: 'post',
        params: params,
        data: params
    });
}

export function getCheckSummary(params) {
    return request({
        url: 'unioncheck/portal/doCheck/getCheckBillDataSummary',
        method: 'post',
        params: params,
        data: params
    });
}

export function getHistoryCheck(params) {
    return request({
        url: 'unioncheck/portal/doCheck/getHistoryRecord',
        method: 'get',
        params: params
    });
}

export default {
    checkList,
    // exportCheck,
    fundList,
    getCheckSummary, // 对账 查看配置信息
    getHistoryCheck, // 对账 历史对账
};
