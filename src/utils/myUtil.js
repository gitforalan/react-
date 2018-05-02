

import { FormattedMessage } from 'react-intl'; //国际化语言

var url = window.location.href;
function parseQueryString(url) {
    var obj = {};
    var paramStr = url.split("?")[1];
    if (paramStr != undefined) {
        var paramArray = paramStr.split("&");
        for (var i = 0; i < paramArray.length; i++) {
            var key = paramArray[i].split("=")[0];
            var value = paramArray[i].split("=")[1];
            obj[key] = value;
        }
        var currentLang = obj.goods_language;
        var goods_language
        switch (currentLang) {
            case 'zh-Hans-CN':
                goods_language = 'zh_CN'
                break;
            case 'zh-Hans-US':
                goods_language = 'zh_CN'
                break;
            case 'zh_CN':
                goods_language = 'zh_CN'
                break;
            case 'en':
                goods_language = 'en'
                break;
            case 'en_GB':
                goods_language = 'en'
                break;
            default:
                goods_language = 'en'
                break;
        }

        obj.goods_language = goods_language
        localStorage.setItem('loginInfo', JSON.stringify(obj));
    }
}

parseQueryString(url)

//获取语言
const basicInfo = localStorage.getItem("loginInfo");
const currentLoginInfo = JSON.parse(basicInfo);
let currentLang = currentLoginInfo.goods_language;


/**
 * 时间戳转换
 */

const FormatUtils = function (unixtime) {
    let unixTimestamp = new Date(unixtime * 1000)
    let Y = unixTimestamp.getFullYear()
    let M = ((unixTimestamp.getMonth() + 1) >= 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1))
    let D = (unixTimestamp.getDate() >= 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate())
    let H = (unixTimestamp.getHours() >= 10 ? unixTimestamp.getHours() : '0' + unixTimestamp.getHours())
    let Min = (unixTimestamp.getMinutes() >= 10 ? unixTimestamp.getMinutes() : '0' + unixTimestamp.getMinutes())
    let S = (unixTimestamp.getSeconds() >= 10 ? unixTimestamp.getSeconds() : '0' + unixTimestamp.getSeconds())
    let toDay = Y + '-' + M + '-' + D + ' ' + H + ':' + Min + ':' + S
    return toDay

}




/**
 * 转换货币单位
 */
const transformCurrency = function (currency) {
    if (currency == undefined) return
    let currencyU = currency.toUpperCase()
    switch (currencyU) {
        case 'RMB':
            return '￥';
        case 'USD':
            return '$';
        default:
            return currencyU;
    }
}

/**
 *转换云存服务周期
 */

const transformCeil = function (ceil) {

    if (currentLang == "zh_CN") {

        switch (ceil) {
            case 0:
                return '天';
            case 1:
                return '月';
            default:
                return ceil;
        }

    } else if (currentLang == "en") {

        switch (ceil) {
            case 0:
                return 'Day';
            case 1:
                return 'Month';
            default:
                return ceil;
        }

    }
}



/**
 * 转换支付状态
 */

const transformStatus = function (order_status) {
    // ordre_status	int	订单状态，0表示未支付，1表示已支付

    if (currentLang == "zh_CN") {


        switch (order_status) {
            case 0:
                return '未支付';
            case 1:
                return '已支付';
            default:
                return order_status;
        }

    } else if (currentLang == "en") {

        switch (order_status) {
            case 0:
                return 'unPaid';
            case 1:
                return 'Paid';
            default:
                return order_status;
        }

    }

}

/**
 * 转换申诉处理状态
 */

const transformAppeals = function (cmp_manageStatus) {
    //申诉处理状态 0:未处理 1 正在处理 2 处理完成

    if (currentLang == "zh_CN") {

        switch (cmp_manageStatus) {
            case 0:
                return '未处理';
            case 1:
                return '正在处理';
            case 2:
                return '处理完成';
            default:
                return cmp_manageStatus;
        }

    } else if (currentLang == "en") {

        switch (cmp_manageStatus) {
            case 0:
                return 'untreated';
            case 1:
                return 'processing';
            case 2:
                return 'figureOut';
            default:
                return cmp_manageStatus;
        }

    }


}

/**
 * 转换申诉类型
 * 
 */
const transformAppealsType = function (cmp_type) {
    //申诉处理状态 0:未处理 1 正在处理中 2 处理完成

    if (currentLang == "zh_CN") {

        switch (cmp_type) {
            case 0:
                return '购买问题';
            case 1:
                return '云存服务问题';
            case 2:
                return '分享问题';
            default:
                return cmp_type;
        }

    } else if (currentLang == "en") {

        switch (cmp_type) {
            case 0:
                return 'Buy problem';
            case 1:
                return 'Cloud services';
            case 2:
                return 'Share issue';
            default:
                return cmp_type;
        }

    }



}

export { transformCurrency, FormatUtils, transformCeil, transformStatus, transformAppeals, transformAppealsType };