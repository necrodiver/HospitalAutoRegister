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
                let msg = '';
                switch (status) {
                    case 404:
                        msg = '请求错误';
                        break;
                    default:
                        msg = '请求错误，请重启！';
                        break;
                }
                return Promise.reject(msg);
            }
            return res.json();
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
let isLoop = true;

function loopRegister(params) {
    fetchHelper
        .post('/api/create', params)
        .then(res => {
            if (res && res.message) {
                try {
                    const outRes = JSON.parse(res.message);
                    if (outRes.status === 0) {
                        self.postMessage({
                            code: 0,
                            message: res.message
                        });
                    } else {
                        self.postMessage({
                            code: outRes.status,
                            message: res.message
                        });
                        if (isLoop) {
                            loopRegister(params);
                        } else {
                            self.close();
                        }
                    }
                } catch (err) {
                    self.postMessage({
                        code: 100,
                        message: '转换出错'
                    });
                }
            }
        })
        .catch(err => {
            self.postMessage({
                code: 101,
                message: err
            });
        });
}

self.onmessage = e => {
    if (e.data) {
        if (e.data.code === 0) {
            isLoop = true;
            loopRegister(e.data.data);
        }
        if (e.data.code === 1) {
            isLoop = false;
        }
    }
};
