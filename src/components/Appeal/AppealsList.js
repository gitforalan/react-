import { SearchBar, Flex, Icon,Modal, NavBar, Accordion, List, Button, PullToRefresh } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import './AppealsList.scss';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { transformCurrency, FormatUtils, transformStatus, transformAppeals, transformAppealsType } from '../../utils/myUtil';
import config from '../../config/config'
import { MyNavBarRedux } from '../common/NavBar';
import Loading from '../common/Loading';
import {injectIntl, FormattedMessage } from 'react-intl'; //国际化语言
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;


class AppealsList extends React.Component {
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

        this.props.appealsListNextPage('/cloud/appeal?method=appealList', 'post', {
            order_id: this.props.match.params.id.slice(1),
            pageIndex: 1,
            start:0,
            count: 10
        })


    }
    //返回时清除数据
    appealsListBack() {
        this.props.clearAppealsList();
        this.props.history.push("/appeals");

    }



    render() {
        const { history, data, isFetching, appealsListObj, appealsListNextPage,intl } = this.props;
        if (appealsListObj.error) { //出错 
            alert(intl.formatMessage({ id: 'alertTitle' }), appealsListObj.msg)
          }

        const appealsLists = appealsListObj.appealsList

        return (

            <div>
                <MyNavBarRedux page="appealsListPage" callback={() => this.appealsListBack()}
                    titleName={
                        <FormattedMessage
                            id="appealsTitle"
                            defaultMessage="appealsTitle"
                        />
                    }
                />
                <PullToRefresh
                    ref={el => this.ptr = el}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                    direction={'up'}
                    refreshing={isFetching}
                    indicator={{ activate: <FormattedMessage id="goodsListFreshTip" />, release: <FormattedMessage id="goodsListLoading" />, finish: <FormattedMessage id="goodsListLoaded" /> }}
                    onRefresh={
                        () => {
                            if (!this.props.appealsListObj.hasMore) {
                                return;
                            }
                            this.props.appealsListNextPage('/cloud/appeal?method=appealList', 'post', {
                                order_id: this.props.match.params.id.slice(1),
                                pageIndex: this.props.appealsListObj.pageIndex,
                                start: this.props.appealsListObj.start,
                                count: this.props.appealsListObj.pageSize
                            })
                        }
                    }
                >

                    <div>
                        <List >
                            {
                                appealsLists.map(function (appealsList, index) {
                                    let contact = appealsList.contact
                                    return (
                                        <Item key={index} style={{ margin: '0.40rem 0', backgroundColor: '#fff', borderBottom: '0.01rem solid #ddd', borderTop: '0.01rem solid #ddd' }}
                                            multipleLine
                                            onClick={() => { }}
                                        >
                                            <div>
                                                <div style={{ display: '-webkit-box', display: 'flex', height: '1.00rem', backgroundColor: '#fff', lineHeight: '1.00rem', padding: '0 0.30rem' }}>
                                                    <div style={{ flex: '1' }}>
                                                        <span style={{ color: '#333333', fontSize: '0.26rem', paddingRight: '0.30rem' }}>
                                                            <FormattedMessage
                                                                id="appealsTime"
                                                                defaultMessage="appealsTime"
                                                            />
                                                        </span>
                                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>{FormatUtils(appealsList.cmp_time)}</span>
                                                    </div>
                                                    <div style={{ height: '1.00rem', lineHeight: '1.00rem', paddingTop: '0.15rem' }} >
                                                        <Button style={{ display: 'inline-block', fontSize: '0.22rem', borderWidth: '0.02rem', width: '1.52rem', height: '0.50rem', lineHeight: '0.50rem', color: appealsList.cmp_manageStatus == '2' ? '#888888' : '#fff', backgroundColor: appealsList.cmp_manageStatus == '2' ? '#fff' : '#009cff', borderColor: appealsList.cmp_manageStatus == '2' ? '#888888' : '#108EE9' }} type="primary" size="small">{transformAppeals(appealsList.cmp_manageStatus)}</Button>
                                                    </div>
                                                </div>
                                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', lineHeight: '0.80rem', borderTop: '0.01rem solid #ddd', padding: '0 0.30rem' }}>
                                                    <div style={{ flex: '1', paddingRight: '0.30rem' }}>
                                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                                            <FormattedMessage
                                                                id="appealsTite"
                                                                defaultMessage="appealsTite"
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className='deslist-text'>
                                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>{appealsList.cmp_title}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Accordion className="my-accordion" >
                                                        <Accordion.Panel header={
                                                            <FormattedMessage
                                                                id="appealsContact"
                                                                defaultMessage="appealsContact"
                                                            />
                                                        }>
                                                            <List className="my-list">
                                                                <List.Item>
                                                                    <div style={{ margin: '0 0.30rem' }}>
                                                                        <span style={{ paddingRight: '0.30rem' }}>
                                                                            <FormattedMessage
                                                                                id="appealsCmpContactqq"
                                                                                defaultMessage="appealsCmpContactqq"
                                                                            />
                                                                        </span>
                                                                        <span>{contact.qq}</span>
                                                                    </div>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <div style={{ margin: '0 0.30rem' }}>
                                                                        <span style={{ paddingRight: '0.30rem' }}>
                                                                            <FormattedMessage
                                                                                id="appealsCmpContactemail"
                                                                                defaultMessage="appealsCmpContactemail"
                                                                            />

                                                                        </span>
                                                                        <span>{contact.email}</span>
                                                                    </div>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <div style={{ margin: '0 0.30rem' }}>
                                                                        <span style={{ paddingRight: '0.30rem' }}>
                                                                            <FormattedMessage
                                                                                id="appealsCmpContactphone"
                                                                                defaultMessage="appealsCmpContactphone"
                                                                            />
                                                                        </span>
                                                                        <span>{contact.mobile}</span>
                                                                    </div>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <div style={{ margin: '0 0.30rem' }}>
                                                                        <span style={{ paddingRight: '0.30rem' }}>skype:</span>
                                                                        <span>{contact.skype}</span>
                                                                    </div>
                                                                </List.Item>
                                                                <List.Item>
                                                                    <div style={{ margin: '0 0.30rem' }}>
                                                                        <span style={{ paddingRight: '0.30rem' }}>msn:</span>
                                                                        <span>{contact.msn}</span>
                                                                    </div>
                                                                </List.Item>

                                                            </List>
                                                        </Accordion.Panel>
                                                    </Accordion>
                                                </div>

                                                <div style={{ display: '-webkit-box', display: 'flex', height: '0.80rem', backgroundColor: '#f5f5f5', lineHeight: '0.80rem', padding: '0 0.30rem' }}>
                                                    <div style={{ flex: '1', paddingRight: '0.30rem' }}>
                                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                                            <FormattedMessage
                                                                id="appealsType"
                                                                defaultMessage="appealsType"
                                                            />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>{transformAppealsType(appealsList.cmp_type)}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: '-webkit-box', display: 'flex', backgroundColor: '#fff', lineHeight: '0.80rem', padding: '0 0.30rem' }}>
                                                    <div style={{ flex: '1', paddingRight: '0.30rem' }}>
                                                        <span style={{ color: '#333333', fontSize: '0.26rem' }}>
                                                            <FormattedMessage
                                                                id="appealsDescribe"
                                                                defaultMessage="appealsDescribe"
                                                            />
                                                        </span>
                                                    </div>
                                                    <div >
                                                        <p className='appealsDetailText' style={{ color: '#333333', fontSize: '0.26rem', textAlign: 'right' }}>{appealsList.cmp_describe}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </Item>
                                    );

                                })

                            }
                        </List>

                    </div>
                </PullToRefresh>

            </div >

        );




    }
}

//关联redux
const AppealsListRedux = connect((state, mapStateToProps, mapActionCreators) => ({
    appealsListObj: state.appealsListObj,
    isFetching: state.isFetching.isFetching
}), (dispatch) => ({

    appealsListNextPage: (url, type, json, cb) => {
        dispatch(doFetch(url, type, json, '_APPEALS_LIST', cb))
    },
    clearAppealsList: () => {
        dispatch(doDispatch({}, {}, 'CLEAR_APPEALS_LIST'))
    }

}))(injectIntl(AppealsList));

export default AppealsListRedux 
