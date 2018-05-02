import React from 'react';
import './AppealsDetail.scss';
import { connect } from 'react-redux';
import { Card, Flex, Button, Modal, Icon, Toast, InputItem, TextareaItem, Radio, Menu, ActivityIndicator, Picker, Accordion, List } from 'antd-mobile';
import { doFetch, doDispatch } from '../../commonActions/fetch';
import { MyNavBarRedux } from '../../components/common/NavBar';
import { transformCurrency, FormatUtils, transformCeil } from '../../utils/myUtil';
import Loading from '../common/Loading';
import config from '../../config/config';
import { createForm } from 'rc-form';
import { injectIntl, FormattedMessage } from 'react-intl'; //国际化语言

const widthRem = document.documentElement.clientWidth / parseInt(document.documentElement.style.fontSize);
const alert = Modal.alert;
const RadioItem = Radio.RadioItem;

const appealProblem = [
    {
        value: 0,
        label: <FormattedMessage id="appealsCmpBuyP" />

    },
    {
        value: 1,
        label: <FormattedMessage id="appealsCmpServerP" />

    },
    {
        value: 2,
        label: <FormattedMessage id="appealsCmpSareP" />

    }

];


class AppealsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: null,
            sValue: ['0'],
            value: 0,

        };
    }


    componentDidMount() {
        document.body.style.overflow = 'auto';
    }

    componentDidUpdate() {
        document.body.style.overflow = 'auto';
    }


    onChangePicker(label, value) {
        this.setState({
            label
        });
    };

    onChangeProblem(value) {
        this.setState({
            value,
        });
    }



    appealsSubmit() {
        let self = this;

        let cmp_title = document.getElementById('cmp_title').value
        if (cmp_title == '' || cmp_title == undefined || cmp_title == null) {
            Toast.info(this.props.intl.formatMessage({ id: 'appealsTitleNull' }), 1);
            return
        }

        let cmp_type = self.state.value
        if (cmp_title == '' || cmp_title == undefined || cmp_title == null) {
            Toast.info(this.props.intl.formatMessage({ id: 'appealsTypeNull' }), 1);
            return
        }

        //申诉人联系方式
        var contact = new Object();
        let contact_qq = document.getElementById('contact_qq').value
        if (contact_qq != '' && contact_qq != undefined && contact_qq != null) {
            var reg = new RegExp("^[0-9]*$");
            if (!reg.test(contact_qq)) {
                Toast.info(this.props.intl.formatMessage({ id: 'appealsQQNull' }), 1);
                return
            }
            contact['qq'] = contact_qq
        }
        let contact_email = document.getElementById('contact_email').value
        if (contact_email != '' && contact_email != undefined && contact_email != null) {
            var reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
            if (!reg.test(contact_email)) {
                Toast.info(this.props.intl.formatMessage({ id: 'appealsEmailNull' }), 1);
                return
            }
            contact['email'] = contact_email
        }
        let contact_phone = document.getElementById('contact_phone').value
        if (contact_phone != '' && contact_phone != undefined && contact_phone != null) {
            var reg = /^1(3|4|5|7|8)\d{9}$/;
            if (!reg.test(contact_phone)) {
                Toast.info(this.props.intl.formatMessage({ id: 'appealsPhoneNull' }), 1);
                return
            }
            contact['mobile'] = contact_phone
        }
        let contact_skype = document.getElementById('contact_skype').value
        if (contact_skype != '' && contact_skype != undefined && contact_skype != null) {
            var reg = new RegExp("^[0-9]*$");
            if (!reg.test(contact_skype)) {
                Toast.info(this.props.intl.formatMessage({ id: 'appealsSkypeNull' }), 1);
                return
            }
            contact['skype'] = contact_skype
        }
        let contact_msn = document.getElementById('contact_msn').value
        if (contact_msn != '' && contact_msn != undefined && contact_msn != null) {
            var reg = new RegExp("^[0-9]*$");
            if (!reg.test(contact_msn)) {
                Toast.info(this.props.intl.formatMessage({ id: 'appealsMsnNull' }), 1);
                return
            }
            contact['msn'] = contact_msn
        }

        if (isOwnEmpty(contact)) {
            Toast.info(this.props.intl.formatMessage({ id: 'appealsNoneNull' }), 1);
            return
        }

        //判断申诉联系方式是否为空
        function isOwnEmpty(obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    return false;//返回false，不为空对象
                }
            }
            return true;//返回true，为空对象
        };


        let cmp_describe = document.getElementById('cmp_describe').value
        if (cmp_describe == '' || cmp_describe == undefined || cmp_describe == null) {
            Toast.info(this.props.intl.formatMessage({ id: 'appealsDescripeNull' }), 1);
            return
        }

        this.props.getAppealsDetail('/cloud/appeal?method=appealAdd', 'post', {

            order_id: this.props.match.params.id.slice(1),
            cmp_title: cmp_title,
            cmp_type: cmp_type,
            contact: JSON.stringify(contact),
            cmp_describe: cmp_describe
        }, function () {
            let cmp_id = self.props.data.cmp_id
            if (cmp_id != '' && cmp_id != undefined && cmp_id != null) {
                self.props.history.push("/appeals");
            }

        })

    }

    //申诉详情返回
    appealsDetailBack() {
        this.props.history.goBack()
    }


    render() {
        const { isFetching, data, getArticleContent, loginObj, addFavourite, removeFavourite, history, intl } = this.props;
        const { sValue, label, value } = this.state;
        const { getFieldProps } = this.props.form;
        let appeal_id = this.props.match.params.id.slice(1);

        if (data.error) { //出错 
            alert(intl.formatMessage({ id: 'alertTitle' }), data.msg)
        }

        return (
            <div>
                <MyNavBarRedux page="appealsDetailPage"
                    titleName={<FormattedMessage
                        id="appealsDetailTitle"
                        defaultMessage="appealsDetailTitle"
                    />}
                    callback={() => this.appealsDetailBack()}
                />
                {
                    isFetching && <Loading />
                }
                <div style={{backgroundColor: '#EFEFF4', borderTop: '0.01rem solid #ddd' }}>
                    <form>
                        <div style={{ backgroundColor: '#f5f5f5', marginTop: '0.40rem' }}>
                        <div style={{ marginBottom: '1.30rem'}}>
                            <InputItem id='cmp_title' style={{ padding: '0 0.30rem', color: '#333333', fontSize: '0.28rem' }}
                                placeholder={intl.formatMessage({ id: 'appealsCmpTitletip' })}
                            >
                                <FormattedMessage
                                    id="appealsCmpTitle"
                                    defaultMessage="appealsCmpTitle"
                                />
                            </InputItem>
                            <div style={{ height: '0.80rem', backgroundColor: '#fff',borderBottom: '0.01rem solid #ddd', backgroundColor:'#f5f5f5' }}>
                                <p style={{ height: '0.80rem', lineHeight: '0.80rem', color: '#333333', fontSize: '0.28rem', margin: '0 0.30rem' }}>
                                    <FormattedMessage
                                        id="appealsCmpTypetip"
                                        defaultMessage="appealsCmpTypetip"
                                    />
                                </p>
                            </div>
                            <div style={{ padding: '0 0.30rem 0 0.30rem', backgroundColor: '#fff' }} >

                                <List >
                                    {
                                        appealProblem.map((i, index) => {
                                            return (
                                                <RadioItem
                                                    key={i.value}
                                                    checked={value === i.value}
                                                    onChange={() => this.onChangeProblem(i.value)}>
                                                    {i.label}
                                                </RadioItem>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                            <div style={{ width: '100%', marginTop: '0.20rem',backgroundColor:'#fff', padding: '0 0.30rem', fontSize: '0.28rem', color: '#333', height: '0.80rem', lineHeight: '0.80rem' }}>
                                <FormattedMessage
                                    id="appealsCmpContact"
                                    defaultMessage="appealsCmpContact"
                                />
                            </div>
                            <div id='myAccordion' >
                                <List className="my-list">
                                    <List.Item style={{ display: '-webkit-box', display: 'flex', height: '0.28rem', backgroundColor: '#fff', lineHeight: '0.28rem' }}>
                                        <InputItem id='contact_qq'
                                            placeholder={intl.formatMessage({ id: 'appealsCmpContactqqtip' })}
                                        >
                                            <FormattedMessage
                                                id="appealsCmpContactqq"
                                                defaultMessage="appealsCmpContactqq"
                                            />
                                        </InputItem>
                                    </List.Item>
                                    <List.Item style={{ display: '-webkit-box', display: 'flex', height: '0.28rem', backgroundColor: '#fff', lineHeight: '0.28rem' }}>
                                        <InputItem id='contact_email'
                                            placeholder={intl.formatMessage({ id: 'appealsCmpContactemailtip' })}
                                        >
                                            <FormattedMessage
                                                id="appealsCmpContactemail"
                                                defaultMessage="appealsCmpContactemail"
                                            />
                                        </InputItem>
                                    </List.Item>
                                    <List.Item style={{ display: '-webkit-box', display: 'flex', height: '0.28rem', backgroundColor: '#fff', lineHeight: '0.28rem' }}>
                                        <InputItem id='contact_phone'
                                            placeholder={intl.formatMessage({ id: 'appealsCmpContactphonetip' })}
                                        >
                                            <FormattedMessage
                                                id="appealsCmpContactphone"
                                                defaultMessage="appealsCmpContactphone"
                                            />
                                        </InputItem>
                                    </List.Item>
                                    <List.Item style={{ display: '-webkit-box', display: 'flex', height: '0.28rem', backgroundColor: '#fff', lineHeight: '0.28rem' }}>
                                        <InputItem id='contact_skype'
                                            placeholder={intl.formatMessage({ id: 'appealsCmpContactskypetip' })}
                                        >skype:</InputItem>
                                    </List.Item>
                                    <List.Item style={{ display: '-webkit-box', display: 'flex', height: '0.28rem', backgroundColor: '#fff', lineHeight: '0.28rem' }}>
                                        <InputItem id='contact_msn'
                                            placeholder={intl.formatMessage({ id: 'appealsCmpContactmsntip' })}
                                        >msn:</InputItem>
                                    </List.Item>
                                </List>
                            </div>
                            <TextareaItem style={{ display: '-webkit-box', display: 'flex', backgroundColor: '#fff', margin: '0.20rem 0', padding: '0 0.30rem', fontSize: '0.26rem' }}
                                {...getFieldProps('count') }
                                rows={5}
                                count={100}
                                id='cmp_describe'
                                placeholder={intl.formatMessage({ id: 'appealsCmpDescribe' })}
                            />
                            </div>
                            <div style={{ display: '-webkit-box', display: 'flex', width: '100%', height: '1.00rem', lineHeight: '1.00rem', position: 'fixed', bottom: '0', textAlign: 'center' }}>
                                <button style={{ flex: '1', textAlign: 'center', backgroundColor: '#009cff', fontSize: '0.26rem', color: '#fff', border: '0.01rem solid #009cff' }} type="button" onClick={() => this.appealsSubmit()} >

                                    <FormattedMessage
                                        id="appealsCmpSubmit"
                                        defaultMessage="appealsCmpSubmit"
                                    />

                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )


    }
}

const AppealsDetailRedux = createForm()(AppealsDetail);

export default connect((state, mapStateToProps, mapActionCreators) => ({
    data: state.appealsDetail,
    show: state.show
}), (dispatch) => ({
    getAppealsDetail: (url, type, json, callback) => {
        dispatch(doFetch(url, type, json, '_APPEALS_DETAIL', callback))
    }

}))(injectIntl(AppealsDetailRedux));








