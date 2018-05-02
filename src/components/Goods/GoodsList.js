import { SearchBar, ListView, Flex, Icon, Modal, PullToRefresh, Grid, Button } from 'antd-mobile';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import './GoodsList.scss';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { transformCurrency, FormatUtils } from '../../utils/myUtil';
import config from '../../config/config'
import { MyNavBarRedux } from '../common/NavBar';
import Loading from '../common/Loading';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';


import {injectIntl, FormattedMessage } from 'react-intl'; //国际化语言

const alert = Modal.alert;


class GoodsList extends React.Component {
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


  handleGrid(el, index) {

    switch (index) {
      case 0:
        location.href = "iOSPushViewController://CloudStorage"; //ios
        break;
      case 1:
        this.props.history.push('/ordersList')
        break;
      case 2:
        this.props.history.push('/appeals')
        break;
      default:
        this.props.history.push('/')
        break;
    }

  }


  componentDidMount() {


    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;

    this.setState({
      height: hei
    })

    this.props.clearGoodsList();

    this.props.indexListNextPage('/cloud/goods?method=goodsList', 'post', {
      pageIndex: 1,
      start: 0,
      count: 10,
    })



  }


  componentDidUpdate() {

    if (this.state.useBodyScroll) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }



  }

  //优化性能，避免多次重复渲染，只根据关心的数据选择是否渲染,这里比较随意
  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.goodsListObj.goodsList.length != nextProps.goodsListObj.goodsList.length) || (this.props.goodsListObj.pageIndex != nextProps.goodsListObj.pageIndex);
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
          />}</span>
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
    const { history,isFetching, goodsListObj, indexListNextPage, intl } = this.props;

    //特殊处理一下判断fetching，一次渲染后只允许拿一次新数据
    let nowFetching = isFetching;
  
    if (goodsListObj.error) { //出错 
      alert(intl.formatMessage({ id: 'alertTitle' }), goodsListObj.msg)
    }


    //grid的数据
    const data = [
      {
        icon: require('../../images/icon.png'),
        text: <FormattedMessage
          id="topicgoods"
          defaultMessage="topicgoods"
        />
      },
      {
        icon: require('../../images/icon.png'),
        text: <FormattedMessage
          id="topicOrders"
          defaultMessage="topicOrders"
        />
      },
      {
        icon: require('../../images/icon.png'),
        text: <FormattedMessage
          id="topicAppeals"
          defaultMessage="topicAppeals"
        />
      }
    ]


    const separator = (rowID) => (
      <div key={`separator-${rowID}`} style={{
        backgroundColor: '#F5F5F9',
        height: '0.1rem',
        borderTop: '0.01rem solid #ECECED',
        borderBottom: '0.01rem solid #ECECED',
      }}
      />
    );
    const row = (rowData, rowID) => {
      return (
        <div key={rowID} className="GoodsListItem" data-flex="main:left cross:center" >

          <div style={{ display: '-webkit-box', display: 'flex', flexFlow: 'row', width: '100%', height: '2.30rem', padding: '0.2rem 0', backgroundColor: '#ffffff' }}>
            <div style={{ width: '1.28rem', margin: '0.51rem 0.30rem', backgroundColor: '#fff' }}>
              <div style={{ width: '1.28rem', height: '1.28rem' }}>
                <img style={{ width: '100%', height: '100%', borderRadius: '0.20rem' }} src={rowData.goods_imgurl} alt="icon" />
              </div>
            </div>
            <div style={{ flex: '1', padding: '0.10rem 0.30rem 0 0', overflow: 'hidden' }}>
              <div className="goods-row-text">{rowData.goods_name}</div>
              <div className="des-text">{rowData.goods_describe}</div>
              <div style={{ display: '-webkit-box', display: 'flex', paddingTop: '0.30rem' }}>
                <div style={{ flex: '1', color: 'red', fontSize: '0.3rem' }}>{transformCurrency(rowData.currency_type) + rowData.price}</div>
                <Button className="buyBtn" type="ghost" size="small" inline onClick={() => { history.push('goodsDetail/:' + rowData.goods_id) }} >
                  <FormattedMessage
                    id="goodsListBuyBtn"
                    defaultMessage="goodsListBuyBtn"
                  />
                </Button>
              </div>
            </div>
          </div>

        </div>
      );
    };


    return (
      <div>

        <MyNavBarRedux
          history={history}
          page="goodsListPage"
          titleName={<FormattedMessage
            id="goodsListTitle"
            defaultMessage="goodsListTitle"
          />}
        />

        {
          isFetching && <Loading />
        }

        <div style={{ padding: '0.40rem 0.76rem 0.20rem 0.76rem', height: '1.68rem', backgroundColor: '#fff' }}>
          <Grid data={data}
            columnNum={3}
            hasLine={false}
            onClick={(el, index) => this.handleGrid(el, index)}
            renderItem={dataItem => (
              <div>
                <img src={dataItem.icon} style={{ width: '0.88rem', height: '0.88rem' }} alt="icon" />
                <div style={{ color: '#333333', fontSize: '0.28rem', marginTop: '0.20rem' }}>
                  <span>{dataItem.text}</span>
                </div>
              </div>
            )}
          />
        </div>
        <div style={{ margin: '0 auto', width: '100%' }} ref={"goodslist2"}>
          <ListView
            key={0}
            ref={el => this.lv = el}
            dataSource={this.state.dataSource.cloneWithRows(goodsListObj.goodsList)}
            renderRow={row}
            renderSeparator={(sectionId, rowId) => separator(rowId)}
            useBodyScroll={this.state.userBodyScroll}
            style={{
              height: this.state.height,
              border: '0.01rem solid #ddd',
              margin: '0.1rem 0',
            }}

            pullToRefresh={<PullToRefresh
              refreshing={isFetching}
              indicator={{ activate: <FormattedMessage id="goodsListFreshTip" />, release: <FormattedMessage id="goodsListLoading" />, finish: <FormattedMessage id="goodsListLoaded" /> }}
              onRefresh={
                () => {
                  this.props.clearGoodsList();
                  this.props.indexListNextPage('/cloud/goods?method=goodsList', 'post', {
                    pageIndex: this.props.goodsListObj.pageIndex,
                    start: this.props.goodsListObj.start,
                    count: this.props.goodsListObj.pageSize,
                    mdrender: 'false'
                  })
                  this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(goodsListObj.goodsList),
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
              if (!this.props.goodsListObj.hasMore) {
                return;
              }
              indexListNextPage('/cloud/goods?method=goodsList', 'post', {
                pageIndex: goodsListObj.pageIndex,
                start: this.props.goodsListObj.start,
                count: this.props.goodsListObj.pageSize,
                mdrender: 'false'
              })

              nowFetching = true;
            }}
          />
        </div>

      </div>

    );
  }
}

//关联redux
const GoodsListRedux = connect((state, mapStateToProps, mapActionCreators) => ({
  goodsListObj: state.goodsListObj,
  isFetching: state.isFetching.isFetching
}), (dispatch) => ({
  indexListNextPage: (url, type, json, isFetching) => {
    dispatch(doFetch(url, type, json, '_GOODS_LIST'))
  },
  clearGoodsList: () => {
    dispatch(doDispatch({}, {}, 'CLEAR_GOODS_LIST'))
  }
}))(injectIntl(GoodsList));

export { GoodsListRedux }
