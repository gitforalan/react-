import React from 'react';
import './NavBar.scss';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import { Popover, NavBar, Icon } from 'antd-mobile';
import { connect } from 'react-redux';
import doFetch from '../../commonActions/fetch';
import config from '../../config/config';


const Item = Popover.Item;

const ReturnButton = () => (
    <div>返回</div>
);

class MyNavBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            disabled: false
        };
    }


    render() {
        const { homeListObj, changeArticleType, page, titleName, history, callback } = this.props;

        let offsetX = -10; // just for pc demo
        if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
            offsetX = -26;
        }

        return (<div style={{ color: '#f5f5f7' }} >
            <NavBar
                //左导航栏
                icon={<Icon type="left" size={'lg'} onClick={() => {
                    if (callback) {
                        callback()
                        return;
                    }

                    if (this.props.page == 'goodsListPage') {
                        location.href = "iOSNavGoBack://popViewController"; //ios
                    }
                }} />}

                mode="light"
            >
                <span>{titleName}</span>
            </NavBar>
        </div >);

    }
}

//Action生成器，生成的事件dispatch后触发的也是加载HomeList的大Reducer
const changeArticleType = (val) => ({
    type: 'CHANGE_ARTICLE_TYPE',
    payload: {
        tab: val
    }
});

//关联redux
const MyNavBarRedux = connect((state) => ({
    homeListObj: state.homeListObj,
    selectedTab: state.selectedTab
}), (dispatch) => ({
    changeArticleType: (url, type, json) => {
        dispatch(changeArticleType(json.tab))
        dispatch(doFetch(url, type, json, '_TOPICS'))
    }
}))(MyNavBar);

export { MyNavBarRedux };

















