import request from '../utils/request';

export default {
    getall:function (query) {
        return request({
            url: './task.json',
            method: 'get',
            params: query
        });
    },
    get:function () {
        return request({
            url: './task.json',
            method: 'get',
            params: query
        });
    }
}