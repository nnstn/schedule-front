import request from '../utils/request';

const task =  {
    getall:(data) => {
        return request({
            url: '/task/getall',
            data: data
        });
    },
    insert:function (data) {
        return request({
            url: '/task/insert',
            data: data
        });
    }
}

export default task;
