import request from '@/libs/request';

export function statisticsList (params) {
    return request({
        url: 'unioncheck/check/merchant/statistics',
        method: 'get',
        params: params
    })
}

export default {
    statisticsList
}
