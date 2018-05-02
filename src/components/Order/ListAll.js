import { SearchBar, ListView, Flex, Icon,Modal, NavBar, PullToRefresh, SegmentedControl } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import './OrdersList.scss';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { transformCurrency, FormatUtils, transformStatus } from '../../utils/myUtil';
import config from '../../config/config'
import { MyNavBarRedux } from '../common/NavBar'
import Loading from '../common/Loading';
import {injectIntl, FormattedMessage } from 'react-intl'; //国际化语言
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

const alert = Modal.alert;

class ListAll extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            scrollTop: 0,
            height: document.documentElement.clientHeight,
            userBodyScroll: false
        }
    }

 
    componentWillMount() {

        const order_status = this.props.ordersListObj.status == 2 ? "" : "order_status:" + this.props.ordersListObj.status;
        let obj = {
            start: '0',
            count: '10',
            pageIndex: '1',
            order_status: ""
        }

        if (this.props.ordersListObj.status != 0 && this.props.ordersListObj.status != 1) {
            delete obj.order_status;
        } else {
            obj.order_status = this.props.ordersListObj.status;
        }
        this.props.clearOrdersList();
        this.props.indexListNextPage('/cloud/pay?method=payList', 'post', obj)
     

    }


    componentDidUpdate(nextProps, nextState) {
        const order_status = this.props.ordersListObj.status == 2 ? "" : "order_status:" + this.props.ordersListObj.status;
  
        let netxtStatus = nextProps.ordersListObj.status
        if(netxtStatus == null ){
            netxtStatus = 2
        }

        if (this.props.ordersListObj.status != netxtStatus ) {
            let obj = {
                start: '0',
                count: '10',
                pageIndex: '1',
                order_status: ""
            }

            if (this.props.ordersListObj.status != 0 && this.props.ordersListObj.status != 1) {
                delete obj.order_status;
            } else {
                obj.order_status = this.props.ordersListObj.status;
            }
 
            this.props.clearOrdersList();
            this.props.indexListNextPage('/cloud/pay?method=payList', 'post', obj)

        }

    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
        this.setState({
            height: hei
        })

        if (this.state.useBodyScroll) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }


    }

    //优化性能，避免多次重复渲染，只根据关心的数据选择是否渲染,这里比较随意
    shouldComponentUpdate(nextProps, nextState) {

        return (this.props.ordersListObj.ordersList.length != nextProps.ordersListObj.ordersList.length) || (this.props.ordersListObj.pageIndex != nextProps.ordersListObj.pageIndex) || (this.props.ordersListObj.status != nextProps.ordersListObj.status)

    }

    renderCustomIcon() {
        return [
            <div key="0" className="am-refresh-control-pull">
                <span>{this.state.showFinishTxt ? <FormattedMessage
                    id="goodsListFreshed"
                    defaultMessage="goodsListFreshed"
                /> : <FormattedMessage
                        id="goodsListFreshing"
                        defaultMessage="goodsListFreshing"
                    />}
                </span>
            </div>,
            <div key="1" className="am-refresh-control-release">
                <span><FormattedMessage
                    id="goodsListFreshTip"
                    defaultMessage="goodsListFreshTip"
                /></span>
            </div>,
        ];
    }

    render() {


        const { history, isFetching, ordersListObj, indexListNextPage, status, intl } = this.props;
        //特殊处理一下判断fetching，一次渲染后只允许拿一次新数据
        let nowFetching = isFetching;

        if (ordersListObj.error) { //出错 
            alert(intl.formatMessage({ id: 'alertTitle' }), ordersListObj.msg)
          }

        const separator = (rowID) => (
            <div key={`separator-${rowID}`} style={{
                backgroundColor: '#F5F5F9',
                height: '0.1rem',
                borderTop: '0.01rem solid #ddd',
                borderBottom: '0.01rem solid #ddd',
            }}
            />
        );
        const row = (rowData, rowID) => {
            return (
                //order_status	是	int	未支付是0，已支付是1，默认所有
                <div className="row" key={rowID}>
                    <div className="row-title" style={{ display: '-webkit-box', display: 'flex' }}>
                        <div style={{ flex: '1' }} >
                            <p style={{ color: '#333333', fontSize: '0.26rem' }} >
                                <FormattedMessage
                                    id="odersListNum"
                                    defaultMessage="odersListNum"
                                />
                                {rowData.order_num}</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.26rem', color: rowData.order_status == '0' ? '#009cff' : '#f23a21' }} onClick={() => {
                                if (rowData.order_status == '0') {
                                    history.push('orderDetail/:' + rowData.order_id)
                                } else if (rowData.order_status == '1') {
                                    history.push('orderPayed/:' + rowData.order_id)
                                }
                            }}>{transformStatus(rowData.order_status)}</div>
                        </div>
                        <div style={{ paddingTop: '0.06rem' }}>
                            <Icon style={{ color: '#888888', display: 'inline-block' }} type="right" size='lg' />
                        </div>

                    </div>

                    <div style={{ display: '-webkit-box', display: 'flex', height: '2.30rem', width: '100%',justifyContent: 'space-between' }}>
                        <div style={{ width: '1.28rem', margin: '0.51rem 0.30rem', backgroundColor: '#fff' }}>
                            <div style={{ width: '1.28rem', height: '1.28rem' }}>
                                <img style={{ width: '100%', height: '100%', borderRadius: '0.20rem' }} src={rowData.goods_imgurl} alt="icon" />
                            </div>
                        </div>
                        <div style={{flex:'1', padding: '0.30rem 0.30rem 0 0'}}>
                            <div style={{ display: '-webkit-box', display: 'flex' }}>
                                <div  style={{flex: '1',width:'100%'}} >
                                <p  className='ordersTitle' style={{color: '#333333', fontSize: '0.30rem', padding: '0 0.30rem 0 0' }}>{rowData.goods_name}</p>
                                </div>
                                <p style={{color: '#333', fontSize: '0.28rem' }}>x{rowData.goods_count}</p>
                            </div>
                            <div style={{ display: '-webkit-box', display: 'flex', paddingTop: '0.20rem', paddingBottom: '0.20rem' }}>
                                <div style={{ flex: '1' }}>
                                    <div style={{ color: '#f23a21', fontSize: '0.28rem' }}>{transformCurrency(rowData.currency_type) + rowData.order_price}</div>
                                    <div style={{ color: '#888888', fontSize: '0.22rem', textDecoration: 'line-through', paddingTop: '0.10rem' }}>{transformCurrency(rowData.currency_type) + rowData.origin_price}</div>
                                </div>
                            </div>
                            <div style={{}} >
                            <p className="orders-des-text">{rowData.goods_describe}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div>
                {isFetching && <Loading />}

                <ListView
                    key={0}
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource.cloneWithRows(ordersListObj.ordersList)}
                    renderRow={row}
                    renderSeparator={(sectionId, rowId) => separator(rowId)}
                    useBodyScroll={this.state.userBodyScroll}
                    style={{
                        height: this.state.height,
                        border: '0.01rem solid #ddd',
                        margin: '0.1rem 0',
                    }}
                    PullToRefresh={<PullToRefresh
                        refreshing={isFetching}
                        onRefresh={
                            () => {

                                const order_status = this.props.ordersListObj.status == 2 ? "" : "order_status:" + this.props.ordersListObj.status;
 
                                this.props.clearOrdersList();
                                this.props.indexListNextPage('/cloud/pay?method=payList', 'post', {
                                    pageIndex: this.props.ordersListObj.pageIndex,
                                    start: this.props.ordersListObj.start,
                                    count: this.props.ordersListObj.pageSize
                                })
                                this.setState({
                                    dataSource: this.state.dataSource.cloneWithRows(ordersListObj.ordersList),
                                    showFinishTxt: true,
                                });
                            }
                        }
                        icon={this.renderCustomIcon()}
                    />}
                    onScroll={
                        (e) => {
                            {/* this.st = e.scroller.getValues().top;
                            this.domScroller = e; */}
                        }
                    }
                    onEndReached={(e) => {
                        if (!e || nowFetching) return;

                        if (!this.props.ordersListObj.hasMore) {
                            return;
                        }

                        const order_status = this.props.ordersListObj.status == 2 ? "" : "order_status:" + this.props.ordersListObj.status;
                        let obj = {
                            pageIndex: this.props.ordersListObj.pageIndex,
                            start: this.props.ordersListObj.start,
                            count: this.props.ordersListObj.pageSize,
                            order_status: ""
                        }

                        if (this.props.ordersListObj.status != 0 && this.props.ordersListObj.status != 1) {
                            delete obj.order_status;
                        } else {
                            obj.order_status = this.props.ordersListObj.status;
                        }

                        this.props.indexListNextPage('/cloud/pay?method=payList', 'post', obj)

                        nowFetching = true;
                    }}
                />
            </div>

        );
    }
}

//关联redux
const ListAllRedux = connect((state, mapStateToProps, mapActionCreators) => ({
    ordersListObj: state.ordersListObj,
    isFetching: state.isFetching.isFetching
}), (dispatch) => ({
    indexListNextPage: (url, type, json, isFetching) => {
        dispatch(doFetch(url, type, json, '_ORDERS_LIST'))
    },
    clearOrdersList: () => {
        dispatch(doDispatch({}, {}, 'CLEAR_ORDERS_LIST'))
    },
    changeStatus: (status) => {
        dispatch(doDispatch(status, {}, "CHANGE_STATUS"));
    }
}))(injectIntl(ListAll));

export { ListAllRedux };
