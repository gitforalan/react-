import React from 'react';
import ReactDOM from 'react-dom';
import './GoodsDetail.scss';
import { connect } from 'react-redux';
import { Card, Flex, Button, Modal, Icon, InputItem, Stepper } from 'antd-mobile';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { MyNavBarRedux } from '../../components/common/NavBar';
import { transformCurrency, FormatUtils, transformCeil } from '../../utils/myUtil';
import Loading from '../common/Loading';
import config from '../../config/config';
import { injectIntl, FormattedMessage } from 'react-intl'; //国际化语言

const widthRem = document.documentElement.clientWidth / parseInt(document.documentElement.style.fontSize);

const alert = Modal.alert;



class GoodsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            val: 1,
        }
    }

    //渲染数据 
    componentDidMount() {

        const self = this;
        this.props.getGoodsDetail('/cloud/goods?method=getGoods', 'post', {
            page: this.props.goodsListObj.pageIndex,
            limit: config.pageSize,
            mdrender: 'false',
            goods_id: this.props.match.params.id.slice(1)
        }, function () {
            self.computeCount(1)
        })

    }

    componentDidUpdate(nextProps, nextState) {
        document.body.style.overflow = 'auto';
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.isFetching && !nextProps.isFetching) || (this.props.data.discount_price != nextProps.data.discount_price) || (this.props.data.origin_price != nextProps.data.origin_price);

    }
    //提交订单
    producDetailHandle() {

        let dataGoodsCount = this.props.data.goods_count;
        if (dataGoodsCount == '0') return
        let self = this;
        let orderCount = this.state.val;
        //提交订单
        this.props.submitOrder('/cloud/pay?method=payAdd', 'post', {
            goods_id: this.props.match.params.id.slice(1),
            buy_count: orderCount,
            order_type: 0
        }, function () {
            let order_id = self.props.data['order_id'];
            self.props.history.push("/orderDetail/:" + order_id);
        })

    }

    //改变购买数量（计数器）
    onChangeNum(val) {
        this.setState({
            val
        });
        this.computeCount(val)
    }


    //计算订单价格
    computeCount(count) {
        this.props.getGoodsTotal('/cloud/pay?method=calculate_price', 'post', {
            goods_id: this.props.match.params.id.slice(1),
            buy_count: count
        })
    }

    //商品详情返回
    goodsDetailBack() {
        this.props.changePageIndex();
        this.props.clearGoodsDetail();
        this.props.history.push("/");

    }



    render() {
        const { isFetching, data, loginObj, history, intl } = this.props;
        const { val } = this.state;
        const self = this;

        if (data.error) { //出错 
            alert(intl.formatMessage({ id: 'alertTitle' }), data.msg)
        }

        return (
            <div>
                <MyNavBarRedux page="goodsDetailPage"
                    callback={() => this.goodsDetailBack()}
                    titleName={data.goods_name}
                />

                {
                    isFetching && <Loading />
                }

                <div>
                    <div style={{ marginBottom: '1.00rem' }}>
                        <div style={{ width: "100%", height: '4.00rem', border: '0.01rem solid #ddd' }}>
                            <img style={{ maxWidth: '100%', height: '4.00rem', display: 'block', margin: 'auto' }} src={data.goods_imgurl} alt="icon" />
                        </div>
                        <div style={{ display: '-webkit-box', display: 'flex', height: '0.90rem', backgroundColor: '#fff', marginBottom: '0.20rem', padding: '0.30rem 0.30rem', border: '0.01rem solid #ddd' }}>
                            <div style={{ flex: '1' }}>
                                <p style={{ color: '#333333', fontWeight: 'bold', fontSize: '0.30rem' }}>{data.goods_name}</p>
                                <p style={{ fontSize: '0.22rem', color: '#333333', marginTop: '0.20rem' }} >{FormatUtils(data.goods_puttime) + '一' + FormatUtils(data.goods_outtime)}</p>
                            </div>
                            <div style={{ color: '#f52d2d', fontSize: '0.50rem', lineHeight: '0.90rem', height: '0.90rem' }}>{transformCurrency(data.currency_type)}{data.price}</div>
                        </div>
                        <div style={{ display: '-webkit-box', display: 'flex', height: '1.00rem', backgroundColor: '#fff', marginBottom: '0.20rem', padding: '0.30rem 0.30rem', border: '0.01rem solid #ddd' }}>
                            <div style={{ flex: '1' }}>
                                <p style={{ color: '#333333', fontSize: '0.28rem' }}>
                                    <FormattedMessage
                                        id="goodsDetailBuyCount"
                                        defaultMessage="goodsDetailBuyCount"
                                    />
                                </p>
                                <p style={{ paddingTop: '0.20rem', color: "#f52d2d", fontSize: '0.22rem' }} >
                                    <FormattedMessage
                                        id="goodsDetailTotalCount"
                                        defaultMessage="goodsDetailTotalCount"
                                    />{data.goods_count}
                                </p>
                            </div>
                            <div style={{ height: '1.00rem', lineHeight: '1.00rem' }}>
                                <Stepper
                                    style={{ width: '100%', minWidth: '2.00rem', height: '0.60rem', lineHeight: '0.60rem' }}
                                    showNumber
                                    max={data.goods_count}
                                    min={1}
                                    defaultValue={1}
                                    onChange={(val) => this.onChangeNum(val)}
                                />
                            </div>
                        </div>


                        <div style={{ height: '0.80rem', backgroundColor: '#fff', padding: '0 0.30rem 0.30rem 0.30rem', border: '0.01rem solid #ddd' }}>
                            <p style={{ height: '0.80rem', lineHeight: '0.80rem', borderBottom: '0.01rem solid #ddd', color: '#333333', fontSize: '0.28rem' }}>
                                <FormattedMessage
                                    id="goodsDetailMsg"
                                    defaultMessage="goodsDetailMsg"
                                />

                            </p>
                        </div>
                        <div style={{ height: '2.40rem', backgroundColor: '#fff', marginBottom: '0.20rem', border: '0.01rem solid #ddd' }}>
                            <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', padding: '0 0.30rem', lineHeight: '0.80rem', fontSize: '0.26rem' }}>
                                <div style={{ flex: '1' }}>
                                    <span style={{ color: '#333333', fontSize: '0.28rem' }}>
                                        <FormattedMessage
                                            id="goodsDetailTypeName"
                                            defaultMessage="goodsDetailTypeName"
                                        />
                                    </span>
                                </div>
                                <div style={{ flex: '1', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    <span>{data.service_name}</span>
                                </div>
                            </div>
                            <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#fff', padding: '0 0.30rem', lineHeight: '0.80rem', fontSize: '0.26rem', border: '0.01rem solid #ddd' }}>
                                <div style={{ flex: '1' }}>
                                    <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                        <FormattedMessage
                                            id="goodsDetailServiceTime"
                                            defaultMessage="goodsDetailServiceTime"
                                        />
                                    </span>
                                </div>
                                <div style={{ flex: '1', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
                                    <span>{data.service_cycle} <FormattedMessage
                                        id="Day"
                                        defaultMessage="Day"
                                    /></span>
                                </div>
                            </div>
                            <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', padding: '0 0.30rem', lineHeight: '0.80rem', fontSize: '0.26rem', border: '0.01rem solid #ddd' }}>
                                <div style={{ flex: '1' }}>
                                    <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                        <FormattedMessage
                                            id="goodsDetailServiceLength"
                                            defaultMessage="goodsDetailServiceLength"
                                        />
                                    </span>
                                </div>
                                <div style={{ flex: '1', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    <span>{data.service_length}{transformCeil(data.service_ceil)}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#fff', padding: '0 0.30rem 0.30rem 0.30rem', border: '0.01rem solid #ddd' }}>
                            <p style={{ borderBottom: '0.01rem solid #ddd', color: '#333333', fontSize: '0.28rem', height: '0.80rem', lineHeight: '0.80rem' }}>
                                <FormattedMessage
                                    id="goodsDetailgoodsDescribe"
                                    defaultMessage="goodsDetailgoodsDescribe"
                                />
                            </p>
                            <p className='goodsDetaildescride' style={{ color: '#888888', fontSize: '0.26rem', paddingTop: '0.20rem', paddingBottom: '0.20rem', lineHeight: '0.36rem' }}>{data.goods_describe}</p>
                        </div>
                    </div>
                    <div style={{ display: '-webkit-box', display: 'flex', height: '1.00rem', backgroundColor: '#fff', lineHeight: '1.00rem', position: 'fixed', bottom: '0', width: '100%', border: '0.01rem solid #ddd' }}>
                        <div style={{ flex: '1' }}>
                            <span style={{ color: '#fe2727', fontSize: '0.30rem', paddingLeft: '0.30rem' }}>
                                <FormattedMessage
                                    id="goodsDetaildiscountPrice"
                                    defaultMessage="goodsDetaildiscountPrice"
                                />
                                {transformCurrency(data.currency_type) + data.discount_price}
                            </span>
                            <span style={{ color: '#aaa', fontSize: '0.26rem', textDecoration: 'line-through', paddingLeft: '0.30rem' }}>
                                <FormattedMessage
                                    id="goodsDetailOriginPrice"
                                    defaultMessage="goodsDetailOriginPrice"
                                />
                                {transformCurrency(data.currency_type) + data.origin_price}
                            </span>
                        </div>

                        <div style={{ width: '2.70rem', backgroundColor: data.goods_count == '0' ? '#888888' : '#009cff', textAlign: 'center' }} onClick={() => this.producDetailHandle()}>
                            <span style={{ width: '2.70rem', height: '1.00rem', lineHeight: '1.00rem', color: '#fff', fontSize: '0.26rem', textAlign: 'center' }}>
                                <FormattedMessage
                                    id="goodsDetailBuyBtn"
                                    defaultMessage="goodsDetailBuyBtn"
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )



    }
}

const GoodsDetailRedux = connect((state, mapStateToProps, mapActionCreators) => ({
    data: state.goodsDetail,
    isFetching: state.isFetching.isFetching,
    goodsListObj: state.goodsListObj
}), (dispatch) => ({
    getGoodsDetail: (url, type, json, callback) => {
        dispatch(doFetch(url, type, json, '_GOODS_DETAIL', callback))
    },
    getGoodsTotal: (url, type, json) => {
        dispatch(doFetch(url, type, json, '_GOODS_TOTAL'))

    },
    submitOrder: (url, type, json, callback) => {
        dispatch(doFetch(url, type, json, '_SUBMIT_ORDER', callback));
    },
    changeCount: (count) => {
        dispatch(doDispatch({ count: count }, {}, 'CHANGE_GOODS_COUNT'))
    },
    changePageIndex: () => {
        dispatch(doDispatch({}, {}, 'HISTORY_BACK'))
    },
    clearGoodsDetail: () => {
        dispatch(doDispatch({}, {}, 'CLEAR_GOODS_DETAIL'))
    }

}))(injectIntl(GoodsDetail));

export default GoodsDetailRedux;

