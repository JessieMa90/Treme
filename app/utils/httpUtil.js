/**
 * Created with JetBrains WebStorm
 * User:jessie
 * Data:2017/12/14
 * Time:13:48
 *
 */
import axios, {CancelToken} from "axios";
import {Modal} from "antd";
import Qs from "qs";
let loginModal = null;
//axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.transformRequest = [function (data) {
    const isObject = obj => obj && (typeof obj === 'object') && !(data instanceof FormData);
    if (isObject(data)) {
        Object.keys(data).forEach(key => {
            data[key] = isObject(data[key]) ? JSON.stringify(data[key]) : data[key]
        });
        return Qs.stringify(data);
    } else {
        return data;
    }

}].concat(axios.defaults.transformRequest);

axios.interceptors.response.use(
    response => {
        let res = response.data || response;
        if (res.redirect === true) {
            window.location.href = res.from.indexOf("http") === 0 ? res.from : (axios.defaults.baseURL + res.from);
            return;

        }
        if (res.info === "NO_PERMISSION") {
            if (!loginModal) {
                loginModal = Modal.confirm({
                    className: "confirm-dialog",
                    title: '',
                    content: '由于您长期未操作，会话已经超时，请重新登录',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        window.location.href = "login.html";
                    },
                    onCancel: () => {
                        window.location.href = "login.html"
                    }
                });
            }

            return;
        }
        if (typeof res === "string" && (res.trim().toUpperCase().startsWith("<!DOCTYPE HTML>"))) {
            window.location.href = "login.html"
            return;

        }
        return res;
    }
);

export default {
    post(url, data, options) {
        const source = CancelToken.source();
        let op = {withCredentials: true, cancelToken: source.token};
        options && Object.assign(op, options);
        let request = axios.post(url, data, op).then(res => {
            request.__source = null;
            return res;
        }).catch(thrown => {
            request.__source = null;
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                return thrown;
            }
        });
        request.__source = source;
        return request;
    },

    get (url, params, options) {
        const source = CancelToken.source();
        let op = {withCredentials: true, cancelToken: source.token};
        options && Object.assign(op, options);
        params = params && {params: params} || {};
        let request = axios.get(url, Object.assign(params, op)).then(res => {
            request.__source = null;
            return res;
        }).catch(thrown => {
            request.__source = null;
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                return thrown;
            }
        });
        request.__source = source;
        return request;
    },
    request(url, type, data, options) {
        const source = CancelToken.source();
        const params = Object.assign({
            method: data ? "post" : "get",
            url: url,
            responseType: type ? type : 'stream',
            cancelToken: source.token
        }, options || {});
        let request = axios(params).then(res => {
            request.__source = null;
            return res;
        }).catch(thrown => {
            request.__source = null;
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                return thrown;
            }
        });
        request.__source = source;
        return request;
    },

    all(...requests) {
        return axios.all(requests).then(axios.spread(responses => {
            return responses.map(res => {
                return res.then(r => {
                    return r;
                })
            })
        })).catch(e => {
            console.log(e.message);
        });
    }
};
