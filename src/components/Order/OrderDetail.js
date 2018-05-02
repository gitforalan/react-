import React from 'react';
import PropTypes from 'prop-types';
import './OrderDetail.scss';
import { connect } from 'react-redux';
import { Card, Flex, Button, Modal, InputItem, Radio, List, NavBar, Icon, Picker } from 'antd-mobile';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { MyNavBarRedux } from '../../components/common/NavBar';
import { transformCurrency, FormatUtils, transformCeil } from '../../utils/myUtil';
import Loading from '../common/Loading';
import config from '../../config/config'

import { injectIntl, FormattedMessage } from 'react-intl'; //国际化语言

import es6Promise from 'es6-promise';
import 'isomorphic-fetch';
es6Promise.polyfill();

const widthRem = document.documentElement.clientWidth / parseInt(document.documentElement.style.fontSize);

const alert = Modal.alert;

const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;




const payData = [
    [
        {
            label: '支付宝',
            value: '支付宝',
        },
        // {
        //     label: '微信',
        //     value: '微信',
        // }, {
        //     label: 'paypal',
        //     value: 'paypal'
        // }
    ]
];

const dataPay = [
    { value: 0, label: <FormattedMessage id="Alipay" /> },
    // { value: 1, label: <FormattedMessage id="Wechat" /> },
    // { value: 2, label: 'paypal' },
];



class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sValue: ['支付宝'],
            value: 0,
        };
    }


    //渲染数据
    componentWillMount() {
        this.props.getOrderDetail('/cloud/pay?method=getPay', 'post', {
            order_id: this.props.match.params.id.slice(1)
        })

    }
    componentDidUpdate() {
        document.body.style.overflow = 'auto';
    }
 
    //删除订单
    ordersListHandle() {
        let self = this;
        this.props.cancelOrder('/cloud/pay?method=payDel', 'post', {
            order_id: this.props.match.params.id.slice(1),

        }, function () {
            let del_status = self.props.data.del_status;
            if (del_status == 1) { // 0 删除失败 1 删除成功
                self.props.history.push("/ordersList");
            } else if (del_status == 0) {
                window.location.reload()
            }

        })

    }

    changePayType(type) {
        this.props.changePayType(type);
    }

    payHandle() {

        let self = this;
        let pay_type = this.state.value
        let url = '';
        switch (pay_type) {
            case 0:
                url = '/cloud/alipay?method=orderSign'
                break;
            case 1:
                url = ''
                alert('微信支付')
                return;
                break;
            case 2:
                url = ''
                alert('paypal')
                return;
                break;
            default:
                alert('请选择支付类型！')
        }

        if (pay_type == '0' || pay_type == '1' || pay_type == '2') {
            this.props.orderPay(url, 'post', {
                order_id: this.props.match.params.id.slice(1)
            }, function () {
     
                let order_sign = self.props.data.order_sign;
                // console.log('test')
                // console.log(order_sign)
                // return
                let oDiv = document.getElementById('orderPayView')
                oDiv.innerHTML = order_sign
                let alipaysubmit = document.getElementById("alipaysubmit")
           
                //动态修改目标表单的action属性  (因为我们的支付宝支付是沙箱测试环境 所以提交地址修改为沙箱测试环境)
                /**
                 * 正式提交环境：https://openapi.alipay.com/gateway.do?charset=utf-8
                 * 沙箱测试提交环境：https://openapi.alipaydev.com/gateway.do?charset=utf-8
                 */
                alipaysubmit.action = 'https://openapi.alipaydev.com/gateway.do?charset=utf-8';
                alipaysubmit.submit();
            })
        }

    }

    // 订单返回函数
    OrderDetailBack() {
        this.props.history.goBack()
    }

    onChange(value) {
        this.setState({
            value,
        });

    };




    render() {
        const { isFetching, data, getArticleContent, loginObj, addFavourite, removeFavourite, history, intl } = this.props;
        const { sValue, value } = this.state;

        if (data.error) { //出错 
            alert(intl.formatMessage({ id: 'alertTitle' }), data.msg)
            history.push('/ordersList'); //重定向
        }

    
        //头部
        const self = this;
        const productInfo = () => {
            return (
                <div style={{ height: '1.00rem', textAlign: 'center' }}>
                    <div>
                        <span>{data.goods_name}</span>
                    </div>
                </div>
            )
        }

        return (

            <div>
                <MyNavBarRedux page="orderDetailPage"
                    titleName={
                        <FormattedMessage
                            id="orderDetailTitle"
                            defaultMessage="orderDetailTitle"
                        />
                    }
                    callback={() => this.OrderDetailBack()}
                />

                {
                    isFetching && <Loading />
                }

                <Card>
                    <Card.Body>
                        <div style={{ marginBottom: '1.30rem' }}>
                            <div style={{ fontSize: '0.36rem', height: '1.00rem', lineHeight: '1.00rem', textAlign: 'left', borderBottom: '0.02rem solid #ddd', margin: '0 0.30rem' }}>
                                <div className='orderDetailTxt'>
                                    <span>{data.goods_name}</span>
                                </div>
                            </div>


                            <div style={{ height: '1.10rem', backgroundColor: '#fff' }}>
                                <p style={{ height: '1.00rem', lineHeight: '1.00rem', borderBottom: '0.02rem solid #ddd', color: '#333333', fontSize: '0.28rem', margin: '0 0.30rem' }}>
                                    <FormattedMessage
                                        id="goodsDetailMsg"
                                        defaultMessage="goodsDetailMsg"
                                    />

                                </p>
                            </div>
                            <div style={{ marginBottom: '0.20rem' }}>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', lineHeight: '0.80rem' }}>
                                    <div style={{ flex: '1', paddingLeft: '0.30rem' }}>
                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                            <FormattedMessage
                                                id="orderDetailcloudMun"
                                                defaultMessage="orderDetailcloudMun"
                                            />
                                        </span>
                                    </div>
                                    <div style={{ paddingRight: '0.30rem' }}>
                                        <span style={{ fontSize: '0.26rem' }}>{data.order_num}</span>
                                    </div>
                                </div>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#fff', lineHeight: '0.80rem' }}>
                                    <div style={{ flex: '1', paddingLeft: '0.30rem' }}>
                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                            <FormattedMessage
                                                id="orderDetailPayTime"
                                                defaultMessage="orderDetailPayTime"
                                            />
                                        </span>
                                    </div>
                                    <div style={{ paddingRight: '0.30rem' }}>
                                        <span style={{ fontSize: '0.26rem' }}>{FormatUtils(data.order_time)}</span>
                                    </div>
                                </div>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', lineHeight: '0.80rem' }}>
                                    <div style={{ paddingLeft: '0.30rem' }}>
                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                            <FormattedMessage
                                                id="orderDetailCloudTitle"
                                                defaultMessage="orderDetailCloudTitle"
                                            />

                                        </span>
                                    </div>
                                    <div className='orderDetailTxt' style={{flex:'1', paddingLeft:'0.30rem', paddingRight: '0.30rem',textAlign:'right' }}>
                                        <span style={{ fontSize: '0.26rem' }}>{data.goods_name}</span>
                                    </div>
                                </div>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#fff', lineHeight: '0.80rem' }}>
                                    <div style={{ flex: '1', paddingLeft: '0.30rem' }}>
                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                            <FormattedMessage
                                                id="orderDetailCloudOderNum"
                                                defaultMessage="orderDetailCloudOderNum"
                                            />
                                        </span>
                                    </div>
                                    <div style={{ paddingRight: '0.30rem' }}>
                                        <span style={{ fontSize: '0.26rem' }}>{data.buy_count}</span>
                                    </div>
                                </div>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', lineHeight: '0.80rem' }}>
                                    <div style={{ flex: '1', paddingLeft: '0.30rem' }}>
                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                            <FormattedMessage
                                                id="orderDetailCloudOderPrice"
                                                defaultMessage="orderDetailCloudOderPrice"
                                            />
                                        </span>
                                    </div>
                                    <div style={{ paddingRight: '0.30rem' }}>
                                        <span style={{ fontSize: '0.26rem' }}>{transformCurrency(data.currency_type) + data.order_price}</span>
                                    </div>
                                </div>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#fff', lineHeight: '0.80rem' }}>
                                    <div style={{ flex: '1', paddingLeft: '0.30rem' }}>
                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                            <FormattedMessage
                                                id="goodsDetailServiceTime"
                                                defaultMessage="goodsDetailServiceTime"
                                            />
                                        </span>
                                    </div>
                                    <div style={{ paddingRight: '0.30rem' }}>
                                        <span style={{ fontSize: '0.26rem' }}>{data.service_cycle}<FormattedMessage
                                            id="Day"
                                            defaultMessage="Day"
                                        /> </span>
                                    </div>
                                </div>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', lineHeight: '0.80rem' }}>
                                    <div style={{ flex: '1', paddingLeft: '0.30rem' }}>
                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                            <FormattedMessage
                                                id="goodsDetailServiceLength"
                                                defaultMessage="goodsDetailServiceLength"
                                            />
                                        </span>
                                    </div>
                                    <div style={{ paddingRight: '0.30rem' }}>
                                        <span style={{ fontSize: '0.26rem' }} >{data.service_length + transformCeil(data.service_ceil)}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ height: '0.80rem', backgroundColor: '#fff' }}>
                                <p style={{ height: '0.80rem', lineHeight: '0.80rem', borderBottom: '0.01rem solid #ddd', color: '#333333', fontSize: '0.28rem', margin: '0 0.30rem' }}>
                                    <FormattedMessage
                                        id="orderDetailPayType"
                                        defaultMessage="orderDetailPayType"
                                    />
                                </p>
                            </div>
                            <div style={{paddingLeft:'0.30rem',paddingRight:'0.30rem', backgroundColor: '#fff' }} >
                                <List >
                                    {
                                        dataPay.map((i, index) => {
                                            return (
                                                <RadioItem 
                                                    key={i.value}
                                                    checked={value === i.value}
                                                    onChange={() => this.onChange(i.value)}>
                                                    {i.label}
                                                </RadioItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                        </div>
                        <div style={{ display: '-webkit-box', display: 'flex', height: '1.00rem', backgroundColor: '#fff', lineHeight: '1.00rem', position: 'fixed', bottom: '0', width: '100%', border: '0.01rem solid #ddd' }}>
                            <div style={{ flex: '1', textAlign: 'center' }} onClick={() => alert(intl.formatMessage({ id: 'alertTitle' }), intl.formatMessage({ id: 'confirmOrder' }), [
                                {
                                    text: intl.formatMessage({ id: 'Back' })
                                },
                                {
                                    text: intl.formatMessage({ id: 'Ok' }), onPress: () => this.ordersListHandle()
                                }
                            ])} >
                                <span style={{ color: '#009cff', fontSize: '0.26rem', height: '1.00rem', lineHeight: '1.00rem', textAlign: 'center' }}> <FormattedMessage
                                    id="cancelOder"
                                    defaultMessage="cancelOder"
                                /> </span>
                            </div>
                            <div style={{ flex: '1', backgroundColor: '#009cff', textAlign: 'center' }} onClick={() => this.payHandle()} >
                                <span style={{ color: '#fff', fontSize: '0.26rem', height: '1.00rem', lineHeight: '1.00rem', textAlign: 'center' }} >
                                    <FormattedMessage
                                        id="OderPaying"
                                        defaultMessage="OderPaying"
                                    />
                                </span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <div id='orderPayView'> </div>
            </div>

        )


    }
}

const OrderDetailRedux = connect((state, mapStateToProps, mapActionCreators) => ({
    data: state.orderDetail,
    ordersListObj: state.ordersListObj,
    isFetching: state.isFetching.isFetching
}), (dispatch) => ({
    getOrderDetail: (url, type, json) => {
        dispatch(doFetch(url, type, json, '_ORDER_DETAIL'))
    },
    orderPay: (url, type, json, callback) => {
        dispatch(doFetch(url, type, json, '_ORDER_PAY', callback))
    },
    cancelOrder: (url, type, json, callback) => {
        dispatch(doFetch(url, type, json, '_ORDER_CANCEL', callback))
    },
    changePayType: (type) => {
        dispatch(doDispatch({ type: type }, {}, 'CHANGE_PAY_TYPE'));
    }

}))(injectIntl(OrderDetail));

export default OrderDetailRedux;




