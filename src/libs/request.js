import axios from 'axios';
import _ from 'lodash';
import iView from 'iview';
import store from '../store';
import {jsCookie} from '@/libs/auth';
import util from '@/libs/util';
// import { getToken } from '@/utils/auth'

axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

// 创建axios实例
const service = axios.create({
    baseURL: util.ajax.baseURL, // api的base_url
    timeout: 15000, // 请求超时时间
    contentType: 'application/json;charset=UTF-8',
    responseType: 'json',
    withCredentials: false // 是否允许带cookie这些
});
service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// request拦截器
service.interceptors.request.use(config => {
    // 在发送请求之前做某些事
    const hasToken = jsCookie.get('token');
    const operatorId = jsCookie.get('operatorId');

    if (hasToken) {
        config.headers['token'] = hasToken; // 让每个请求携带自定义token
        config.headers['operatorId'] = operatorId;
    }
    return config;
}, error => {
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * 通过response自定义code来标示请求状态
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data;
        if (res.status !== 0) {
            if (_.get(res, 'des')) {
                iView.Message.error({
                    message: res.des,
                    type: 'error',
                    duration: 5 * 1000
                });
            }
            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                iView.Notice.info('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('LogOut').then(() => {
                        location.reload(); // 为了重新实例化vue-router对象 避免bug
                    });
                });
            }
            // eslint-disable-next-line
            return Promise.reject('error');
        } else {
            return response.data;
        }
    },
    error => {
        console.log('err' + error);// for debug
        iView.Message.error({
            message: error.des,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;
