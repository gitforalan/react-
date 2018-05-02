import es6Promise from 'es6-promise';
import 'isomorphic-fetch';
es6Promise.polyfill();
import config from '../config/config';
import md5 from '../static/md5.js';
import { Modal } from 'antd-mobile';

const alert = Modal.alert;

const startFetch = (url, data, getWhat) => ({
    type: `FETCH_REQUEST${getWhat ? getWhat : ''}`,
    param: data,
    payload: url
});

const endFetch = (json, data, getWhat) => ({
    type: `FETCH_SUCCESS${getWhat ? getWhat : ''}`,
    param: data,
    payload: json
});

const doDispatch = (json, data, type) => ({
    type: type,
    param: data,
    payload: json
})

//处理请求错误
const errorFetch = (json, data, getWhat) => ({
    type: `FETCH_FAILED${getWhat ? getWhat : ''}`,
    param: data,
    payload: json
})

//全局错误码(中文)
const errorInfoZH = {
    "3701": "分享时间过期",
    "3702": "云存没有绑定",
    "3703": "设备云存不能分享",
    "3704": "分享码错误",
    "3705": "签名错误",
    "3706": "分享云存不存在",
    "3707": "云存id不存在",
    "3708": "订单id不存在",
    "3709": "支付宝信息为空",
    "3710": "支付验签订单号错误",
    "3711": "支付宝支付失败",
    "3712": "支付宝签名错误",
    "3713": "json格式错误",
    "3714": "设备绑定云存",
    "3715": "不支持这个支付",
    "3716": "订单已支付",
    "3717": "支付宝result格式不正确",
    "3718": "分享url已过期",
    "3719": "商品语言不存在",
    "3720": "商品id不存在",
    "3721": "app库存不足",
    "3722": "商品已下架",
    "3723": "兑换码不存在",
    "3724": "兑换码已过期",
    "3725": "兑换码类型不匹配",
    "3726": "云存类型不匹配"
}

//全局错误码(英文)
const errorInfoEN = {
    "3701": "share time is out date",
    "3702": "deviceCloud is not binding",
    "3703": "deviceCloud can't share",
    "3704": "shareCode is matching",
    "3705": "sign is matching",
    "3706": "shareCloud is not exists",
    "3707": "Cloud_id is not exists",
    "3708": "order_id is not exists",
    "3709": "alipay is empty",
    "3710": "order_num is matching",
    "3711": "alipay pay failed",
    "3712": "alipay sign error",
    "3713": "json format error",
    "3714": "deviceCloud is binding",
    "3715": "Pay does not support",
    "3716": "order has been paid",
    "3717": "alipay result format error",
    "3718": "share the url has expired",
    "3719": "goods language is not exists",
    "3720": "goods_id is not exists",
    "3721": "app count low stocks",
    "3722": "The goods have been laid off",
    "3723": "redeem code is not exists",
    "3724": "redeem code has expire",
    "3725": "redeem code type is mismatching",
    "3726": "cloud type is mismatching"
}


const doFetch = (url, type, data, getWhat, callback) => (dispatch, getState) => {
    dispatch(startFetch('/message/nonce?method=get', {}, "_VERIFY"));
    fetch('/message/nonce?method=get')
        .then(
        response => response.json()
        )
        .then(
        json => {
            let verify = json['nonce'] + json['request_id'];
            verify = md5(verify.toLocaleUpperCase() + 'Japass^2>.j');

            let basicInfo = localStorage.getItem("loginInfo");
            let currentLoginInfo = JSON.parse(basicInfo);
            let currentlocaleLang
            currentlocaleLang = currentLoginInfo.goods_language;
            let result = {
                request_id: json['request_id'],
                nonce: json['nonce'],
                verify: verify,
                access_token: currentLoginInfo.access_token,
                app_bundle: currentLoginInfo.app_bundle,
                goods_language: currentlocaleLang
            }
            dispatch(endFetch(result, data, '_VERIFY'))

            dispatch(startFetch(url, data, getWhat));

            let dataArray = [];
            dataArray.push('request_id=' + result.request_id);
            dataArray.push('verify=' + result.verify);
            dataArray.push('access_token=' + result.access_token);
            dataArray.push('app_bundle=' + result.app_bundle);
            dataArray.push('goods_language=' + result.goods_language);
            let query = (dataArray.join('&') + '&');
            for (let i in data) {
                query += `${i}=${data[i]}&`;
            }

            if (type == 'get') return fetch(`${config.target + url}&${query.slice(0, -1)}`).then(response => response.json()).then(json => {
                dispatch(endFetch(json, data, getWhat))
                if (callback) {
                    callback();
                }

            }).catch(e => { })

            if (type == 'post') return fetch(`${config.target + url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: query.slice(0, -1)
            })

                .then(response => {
                    return response.json()

                })

                .then(json => {
                    if (json.hasOwnProperty("error")) {
                        function getError(key) {
                            // 根据语言显示对应的错误码
                            if (currentlocaleLang == "zh_CN") { // 中文
                                for (var i in errorInfoZH) {
                                    if (i == key) {
                                        json.error_description = errorInfoZH[i];
                                    }
                                }

                            } else if (currentlocaleLang == "en") { // 英文
                                for (var i in errorInfoEN) {
                                    if (i == key) {
                                        json.error_description = errorInfoEN[i];
                                    }
                                }
                            }
                        }
                        getError(json.error)
                        dispatch(errorFetch(json, data, getWhat))
                    } else {
                        dispatch(endFetch(json, data, getWhat))
                        if (callback) {
                            callback();
                        }

                    }

                })
                .catch(error => {

                });
        }
        )
};








export { doFetch, doDispatch };