import { SearchBar, ListView, Flex, Icon, NavBar, PullToRefresh, SegmentedControl, Tabs, Badge } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import './OrdersList.scss';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { transformCurrency, FormatUtils, transformStatus } from '../../utils/myUtil';
import config from '../../config/config'
import { MyNavBarRedux } from '../common/NavBar'
import Loading from '../common/Loading';
import { ListAllRedux } from './ListAll';

import { FormattedMessage } from 'react-intl'; //国际化语言

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

const TabPane = Tabs.TabPane;



class OrdersList extends React.Component {
    constructor(props) {
        super(props);

    }



    componentDidMount() {
 
        if (!this.props.ordersListObj.status) {
            this.props.changeStatus(2);
        }

    }


    //优化性能，避免多次重复渲染，只根据关心的数据选择是否渲染,这里比较随意
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.ordersListObj.status != nextProps.ordersListObj.status

    }



    changeHandle(ev) {

        const cDiv = ev.target;
        const cV = ev.target.innerText;

        const basicInfo = localStorage.getItem("loginInfo");
        const currentLoginInfo = JSON.parse(basicInfo);
        let currentLang =currentLoginInfo.goods_language;
        
        let key
        if (currentLang == "zh_CN") {

            switch (cV) {
                case '全部':
                    key = '2'
                    break;
                case '未支付':
                    key = '0'
                    break;
                case '已支付':
                    key = '1'
                    break;
                default:
                    key = cV
                    break;
            }

        } else if (currentLang == "en") {

            switch (cV) {
                case "All":
                    key = '2'
                    break;
                case "unpaid":
                    key = '0'
                    break;
                case "Paid":
                    key = '1'
                    break;
                default:
                    key = cV
                    break;
            }

        }

        this.props.changeStatus(key);

    }

    renderContent(tab) {
        return <ListAllRedux tab={tab} />
 
    }

    //订单列表返回
    OrdersListBack() {
        this.props.history.push("/");
    }

    render() {

        const { history, isFetching, indexListNextPage } = this.props;
        const { status } = this.props.ordersListObj;

        const tabs = [
            {
                key: "2",
                title: <FormattedMessage
                    id="All"
                    defaultMessage="All"
                />,
                sub: 'all'
            },
            {
                key: "0",
                title: <FormattedMessage
                    id="UnPay"
                    defaultMessage="UnPay"
                />,
                sub: 'unpay'
            },
            {
                key: "1",
                title: <FormattedMessage
                    id="Payed"
                    defaultMessage="Payed"
                />,
                sub: 'payed'
            },
        ];

   
        return (
            <div>
                <MyNavBarRedux page="ordersListPage"
                    titleName={
                        <FormattedMessage
                            id="odersListTitle"
                            defaultMessage="odersListTitle"
                        />
                    }
                    callback={() => this.OrdersListBack()}
                />
                <div>
                    <Flex>
                        {
                            tabs.map((item, index) => {
                                let tabClassName = item.key == status ? 'activClass' : 'tabClass';

                                return (
                                    <Flex.Item
                                        key={item.key}
                                        style={{
                                            backgroundColor: '#fff',
                                            height: '0.88rem', lineHeight: '0.88rem',
                                            color: '#333', fontSize: '0.28rem',
                                            textAlign: 'center', margin: '0',
                                            borderTop: '0.01rem solid #ddd',
                                            borderBottom: '0.01rem solid #ddd'
                                        }}
                                    >
                                        <Flex.Item
                                            style={{
                                                backgroundColor: '#fff',
                                                height: '0.46rem', lineHeight: '0.46rem',
                                                textAlign: 'center', margin: '0',
                                                margin: '0.21rem 0 ',
                                                borderLeft: index === 1 ? '0.02rem solid #ddd' : 'none',
                                                borderRight: index === 1 ? '0.02rem solid #ddd' : 'none',
                                            }}

                                            className={tabClassName}
                                            onClick={(ev) => this.changeHandle(ev)}
                                        >{item.title}</Flex.Item>
                                    </Flex.Item>
                                )
                            })
                        }
                    </Flex>
                </div>
                <div>
                    <ListAllRedux history={history} />
                </div>

            </div>

        );
    }
}

//关联redux
const OrdersListRedux = connect((state) => ({
    ordersListObj: state.ordersListObj,
    isFetching: state.isFetching.isFetching
}), (dispatch) => ({

    changeStatus: (status) => {
        dispatch(doDispatch(status, {}, "CHANGE_STATUS"));
    }

}))(OrdersList);

export default OrdersListRedux 