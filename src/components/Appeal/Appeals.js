import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { SearchBar, List, Flex, Icon,Modal, NavBar, Button, PullToRefresh } from 'antd-mobile';
import './Appeals.scss';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { MyNavBarRedux } from '../../components/common/NavBar';
import config from '../../config/config'
import Loading from '../common/Loading';
import {injectIntl, FormattedMessage } from 'react-intl'; //国际化语言
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;


class Appeals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: document.documentElement.clientHeight,
        };
    }


    //渲染数据
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        this.setState({
            height: hei
        })
        this.props.clearAppeals();
        this.props.appealsNextPage('/cloud/appeal?method=userAppealList', 'post', {
            pageIndex: '1',
            start: '0',
            count: '10'
        })


    }

    //申诉列表返回
    appealsBack() {
        this.props.history.push("/");
    }



    render() {
        const { history, isFetching, appealsObj, getOrdersList,intl } = this.props;

        if (appealsObj.error) { //出错 
            alert(intl.formatMessage({ id: 'alertTitle' }), appealsObj.msg)
          }


        let appeals = this.props.appealsObj.appeals
        return (
            <div style={{ overflow: "hidden" }} >
                <MyNavBarRedux page="AppealsPage"
                    titleName={
                        <FormattedMessage
                            id="appealsListTitle"
                            defaultMessage="appealsListTitle"
                        />
                    }
                    callback={() => this.appealsBack()}

                />
                {
                    isFetching && <Loading />
                }
                <PullToRefresh
                    ref={el => this.ptr = el}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                    direction={'up'}
                    refreshing={isFetching}
                    indicator ={{activate:<FormattedMessage id="goodsListFreshTip"/>, release: <FormattedMessage id="goodsListLoading"/>, finish:<FormattedMessage id="goodsListLoaded"/>} }
                    onRefresh={
                        () => {
                            if (!this.props.appealsObj.hasMore) {
                                return;
                            }

                            this.props.appealsNextPage('/cloud/appeal?method=userAppealList', 'post', {
                                pageIndex: this.props.appealsObj.pageIndex,
                                start: this.props.appealsObj.start,
                                count: this.props.appealsObj.pageSize
                            })
                        }
                    }
                >
                    <List >
                        {
                            appeals.map(function (appeal, index) {
                                return (
                                    <Item key={index} style={{ margin: '0.20rem 0', backgroundColor: '#fff', borderBottom: '0.01rem solid #ddd', borderTop: '0.01rem solid #ddd' }}
                                        multipleLine
                                    >
                                        <p style={{ flex: '1', marginLeft: '0.30rem', marginRight: '0.30rem', color: '#333333', fontSize: '0.28rem', paddingTop: '0.15rem', paddingBottom: '0.15rem', borderBottom: '0.01rem solid #ddd' }}>

                                            <FormattedMessage
                                                id="appealsListNum"
                                                defaultMessage="appealsListNum"
                                            />
                                            <span style={{ paddingLeft: '0.30rem' }}>{appeal.order_num}</span></p>
                                        <div style={{ width: '100%', padding: '0.20rem' }} >
                                            <p style={{ color: '#888888', fontSize: '0.26rem', paddingBottom: '0.15rem' }}>
                                                <FormattedMessage
                                                    id="appealsListDvice"
                                                    defaultMessage="appealsListDvice"
                                                />
                                                <span style={{ paddingLeft: '0.30rem' }}> {appeal.eseeid == '' ? <FormattedMessage
                                                    id="appealsListDviceNone"
                                                    defaultMessage="appealsListDviceNone"
                                                /> : appeal.eseeid}</span></p>
                                            <p style={{ color: '#888888', fontSize: '0.26rem' }} >
                                                <FormattedMessage
                                                    id="appealsListChannel"
                                                    defaultMessage="appealsListChannel"
                                                />
                                                <span style={{ paddingLeft: '0.30rem' }}> {appeal.channel == '' ? <FormattedMessage
                                                    id="appealsListChannelNone"
                                                    defaultMessage="appealsListChannelNone"
                                                /> : appeal.channel}</span></p>
                                        </div>
                                        <div style={{ textAlign: 'right', height: '0.70rem', lineHeight: '0.70rem', paddingLeft: '0.30rem', paddingRight: '0.30rem', }} >
                                            <Button style={{ display: 'inline-block', marginRight: '0.20rem', color: '#009cff', fontSize: '0.22rem', border: '0.02rem solid #009cff', width: '1.52rem', height: '0.50rem', lineHeight: '0.50rem' }} type="ghost" size="small" inline onClick={() => { history.push('appealsDetail/:' + appeal.order_id) }} >
                                                <FormattedMessage
                                                    id="appealsListAppealDetail"
                                                    defaultMessage="appealsListAppealDetail"
                                                />
                                            </Button>
                                            <Button style={{ display: 'inline-block', color: '#009cff', fontSize: '0.22rem', border: '0.02rem solid #009cff', width: '1.52rem', height: '0.50rem', lineHeight: '0.50rem' }} type="ghost" size="small" inline onClick={() => { history.push('appealsList/:' + appeal.order_id) }}>

                                                <FormattedMessage
                                                    id="appealsListAppealList"
                                                    defaultMessage="appealsListAppealList"
                                                />
                                            </Button>
                                        </div>
                                    </Item>
                                );

                            })
                        }
                    </List>
                </PullToRefresh>
            </div>
        );
    }
}


//关联redux
const AppealsRedux = connect((state, mapStateToProps, mapActionCreators) => ({
    appealsObj: state.appealsObj,
    isFetching: state.isFetching.isFetching
}), (dispatch) => ({
    appealsNextPage: (url, type, json, cb) => {
        dispatch(doFetch(url, type, json, '_APPEALS', cb))
    },
    clearAppeals: () => {
        dispatch(doDispatch({}, {}, 'CLEAR_APPEALS'))
    }
}))(injectIntl(Appeals));

export default AppealsRedux
