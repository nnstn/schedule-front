import request from '../utils/request';

const auth =  {
    login:(data) => {
        return request({
            url: '/auth/login',
            params: data
        });
    },
    register:function () {
        return request({
            url: '/auth/register',
            method: 'post',
            params: query
        });
    }
}


export default auth;
