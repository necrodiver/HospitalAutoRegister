import { message } from 'ant-design-vue';

function fetchFunc(url = '', data = {}, type = 'GET') {
    const baseConfig = {
        credentials: 'include',
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'force-cache'
    };
    if (type === 'GET') {
        let queryList = [];
        Object.keys(data).forEach(key => {
            queryList.push(`${key}=${data[key]}`);
        });
        let queryStr = queryList.join('&');
        if (queryStr) {
            url = `${url}?${queryStr}`;
        }
    }
    if (type == 'POST') {
        Object.defineProperty(baseConfig, 'body', {
            value: JSON.stringify(data)
        });
    }
    return fetch(url, baseConfig)
        .then(res => {
            const status = res.status;
            if (!/^(2|3)\d{2}$/.test(status)) {
                switch (status) {
                    case 404:
                        message.error('请求错误！');
                        break;
                    default:
                        message.error('请求错误，请重启！');
                        break;
                }
                return Promise.reject(0);
            }
            return res.json();
        })
        .then(res => {
            if (res.message) {
                try {
                    return JSON.parse(res.message);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
            return '';
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

const fetchHelper = {
    get: (url = '', data = {}) => {
        return fetchFunc(url, data, 'GET');
    },
    post: (url = '', data = {}) => {
        return fetchFunc(url, data, 'POST');
    }
};
export default {
    install: (app, options) => {
        app.provide('$fetch', fetchHelper);
    }
};
