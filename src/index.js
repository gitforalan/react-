import { Route, Link } from 'react-router-dom'
import { render } from 'react-dom';
import React from 'react';
import 'normalize.css';
import './index.scss';
import 'flex.css/dist/data-flex.css';
import { Provider, connectAdvanced } from 'react-redux';
import FastClick from './utils/fastclick';
FastClick.attach(document.body);
import store from './store'
import { GoodsListRedux } from './components/Goods/GoodsList';
import GoodsDetailRedux from './components/Goods/GoodsDetail';
import OrderDetailRedux from './components/Order/OrderDetail';
import OrderPayedRedux from './components/Order/OrderPayed';
import OrdersListRedux from './components/Order/OrdersList';
import AppealsListRedux from './components/Appeal/AppealsList';
import AppealsDetailRedux from './components/Appeal/AppealsDetail';
import AppealsRedux from './components/Appeal/Appeals';
import config from './config/config';
import Bundle from './utils/bundle';

import AppLocale from './languageProvider/index';

// 内容国际化支持
//如果浏览器没有自带intl，则需要在使用npm安装intl之后添加如下代码
import intl from 'intl';
import { addLocaleData, IntlProvider, FormattedMessage, injectIntl } from 'react-intl'; //导入国际化语言配置文件
// antd-mobile 组件的国际化支持
import { LocaleProvider } from 'antd-mobile';


const Router = config.Router; //路由配置

let basicInfo = localStorage.getItem("loginInfo");

let basicInfoJson = JSON.parse(basicInfo);

let currentLang

let loginLang = basicInfoJson.goods_language;
switch (loginLang) {
    case 'zh_CN':
        currentLang = 'zh'
        break;
    case 'en':
        currentLang = 'en'
        break;
    default:
        currentLang = 'en'
        break;
}

const currentAppLocale = AppLocale[currentLang];

render(
    (
        <LocaleProvider locale={currentAppLocale.antd}>
            <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}
                formats={currentAppLocale.formats}
            >
                <Provider store={store}>
                    {/*如果路径不对，请修改basename为你想要的，或者直接删除basename属性*/}
                    {/*<Router basename="/react-t">*/}
                    <Router>
                        <div style={{ width: '100%', height: '100%' }} >
                            <Route exact path="/" component={GoodsListRedux} />
                            <Route path="/goodsDetail/:id" component={GoodsDetailRedux} />
                            <Route path="/orderDetail/:id" component={OrderDetailRedux} />
                            <Route path="/orderPayed/:id" component={OrderPayedRedux} />
                            <Route path="/ordersList" component={OrdersListRedux} />
                            <Route path="/appealsList/:id" component={AppealsListRedux} />
                            <Route path="/appealsDetail/:id" component={AppealsDetailRedux} />
                            <Route path="/appeals" component={AppealsRedux} />
                        </div>
                    </Router>
                </Provider>
            </IntlProvider>
        </LocaleProvider>
    ), document.getElementById('app')
);

















