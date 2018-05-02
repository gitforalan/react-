import React from 'react';
import './OrderDetail.scss';
import { connect } from 'react-redux';
import { Card, Flex, Button, Modal, InputItem, Radio, List } from 'antd-mobile';
import { doFetch } from '../../commonActions/fetch';
import { MyNavBarRedux } from '../../components/common/NavBar';
import { transformCurrency, FormatUtils, transformCeil } from '../../utils/myUtil';
import Loading from '../common/Loading';
import config from '../../config/config';
import {injectIntl, FormattedMessage } from 'react-intl'; //国际化语言



const widthRem = document.documentElement.clientWidth / parseInt(document.documentElement.style.fontSize);

const alert = Modal.alert;
const Item = List.Item;
const Brief = Item.Brief;

class OrderPayed extends React.Component {


    //渲染数据
    componentWillMount() {
        this.props.getorderPayed('/cloud/pay?method=getPay', 'post', {
            order_id: this.props.match.params.id.slice(1)
        })
    }
    componentDidUpdate() {
        document.body.style.overflow = 'auto';
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isFetching && !nextProps.isFetching;
    }

    //已支付返回到订单列表
    orderPayedBack(){
        let self = this;
        self.props.history.push("/ordersList");
    }

    render() {
        const { isFetching, data, getArticleContent, loginObj, addFavourite, removeFavourite, history,intl } = this.props;

        if (data.error) { //出错 
            alert(intl.formatMessage({ id: 'alertTitle' }), data.msg)
            history.push('/ordersList'); //重定向
        }

        //头部
        const self = this;
        const productInfo = () => {
            return (
                <div className="detail-header" style={{ paddingLeft: '0.30rem' }}>
                    <div className='orderDetailTxt'>
                        <span>{data.goods_name}</span>
                    </div>
                </div>
            )
        }

        return (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
                <MyNavBarRedux page="orderPayedPage" 
                    titleName={
                        <FormattedMessage
                            id="orderDetailTitle"
                            defaultMessage="orderDetailTitle"
                        />
                    }
                 callback={() => this.orderPayedBack()}
                />
                {
                    isFetching && <Loading />
                }
                <Card >
                    <Card.Body style={{ backgroundColor: '#fff' }}>
                        <div style={{ fontSize: '0.36rem', height: '1.00rem', lineHeight: '1.00rem', textAlign: 'left',borderBottom: '0.02rem solid #ddd', margin: '0 0.30rem' }}>
                            <div>
                                <span>{data.goods_name}</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ height: '1.10rem', backgroundColor: '#fff' }}>
                                <div style={{ display: '-webkit-box', display: 'flex', height: '1.00rem', lineHeight: '1.00rem', backgroundColor: '#fff', margin: '0 0.30rem', borderBottom: '0.02rem solid #ddd', }}>
                                    <div style={{ flex: '1' }}>
                                        <p style={{ height: '1.00rem', lineHeight: '1.00rem', color: '#333333', fontSize: '0.28rem' }}>
                                            <FormattedMessage
                                                id="goodsDetailMsg"
                                                defaultMessage="goodsDetailMsg"
                                            />
                                        </p>
                                    </div>
                                    <div style={{ height: '1.00rem', lineHeight: '1.00rem', verticalAlign: 'middle', textAlign: 'right', paddingTop: '0.15rem' }}>
                                        <Button style={{ display: 'inline-block', width: '1.52rem', height: '0.50rem', lineHeight: '0.50rem', fontSize: '0.22rem', color: '#009cff', marginRight: '0.15rem', backgroundColor: '#fff', border: '0.02rem solid #009cff' }} className='bindBtn' type="primary" inline size="small" onClick={() => { history.push('/appealsDetail/:' + this.props.match.params.id.slice(1)) }}>
                                            <FormattedMessage
                                                id="orderDetailAppealBtn"
                                                defaultMessage="orderDetailAppealBtn"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div>
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
                                        <span style={{ fontSize: '0.26rem' }} >{data.service_cycle}<FormattedMessage
                                            id="Day"
                                            defaultMessage="Day"
                                        /></span>
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
                                        <span style={{ fontSize: '0.26rem' }}>{data.service_length + transformCeil(data.service_ceil)}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: '-webkit-box', display: 'flex', width: '100%', height: '1.00rem', lineHeight: '1.00rem', position: 'fixed', bottom: '0', textAlign: 'center' }}>
                                <button style={{ flex: '1', textAlign: 'center', fontSize: '0.26rem', color: '#fff', border: '0.01rem solid #009cff', backgroundColor: '#009cff' }} type="button" onClick={() => { history.push('/ordersList') }} >
                                    <FormattedMessage
                                        id="orderDetailBackList"
                                        defaultMessage="orderDetailBackList"
                                    />
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )


    }
}

const OrderPayedRedux = connect((state, mapStateToProps, mapActionCreators) => ({
    data: state.orderPayed,
    loginObj: state.loginObj,
    isFetching: state.isFetching.isFetching
}), (dispatch) => ({
    getorderPayed: (url, type, json) => {
        dispatch(doFetch(url, type, json, '_ORDER_PAYED'))
    }

}))(injectIntl(OrderPayed));

export default OrderPayedRedux;




