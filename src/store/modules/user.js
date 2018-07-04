import Cookies from 'js-cookie';
import ajax from '@/api/login';

const user = {
    state: {
        fetching: false, // 查询数据的状态
    },
    mutations: {
        logout () {
            Cookies.remove('user');
            Cookies.remove('password');
            Cookies.remove('access');
            localStorage.clear();
        }
    },
    actions: {
        async loginOut() {
            await ajax.loginOut({}).then(() => {
                this.state.fetching = true;
            }).catch(() => {
            });
        }
    }
};

export default user;
