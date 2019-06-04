'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Image } from '@tarojs/components';
import Event from 'ay-event';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import px from '../../../Biz/px.js';

const stateList = { 1:'买家未收到货',2:'买家已收到货',3:'买家已退货',}
/*
* @author cy
* 订单基本信息
*/
export default class RefundEx extends Component {
    constructor(props) {
        super(props);
        this.state={
        }
        this.copyVou = this.copyVou.bind(this);
    }

    //复制订单号
    copyVou(){
        const { tid } = this.props;
        Event.emit('App.trclbd',{
            msg:tid,
            cal:'订单号已复制'
        })
    }

    render() {
        const { data,tid,status,exdata } = this.props;
        return (
            <View style={styles.vou_view}>
                <View style={[styles.bill_line,{marginTop:px(12)}]}>
                    <Text style={styles.text_grey}>订 单 号  ：</Text>
                    <Text style={styles.text_bl}>{tid}</Text>
                    <View onClick={this.copyVou}>
                    <Image style={[styles.new,{marginLeft:px(24)}]} src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png' />
                    </View>
                </View>
                <View style={[styles.bill_line]}>
                    <Text style={styles.text_grey}>退款单号：</Text>
                    <Text style={styles.text_bl}>{exdata.TQID}</Text>
                </View>
                <View style={[styles.bill_line]}>
                    <Text style={styles.text_grey}>申请时间：</Text>
                    <Text style={styles.text_bl}>{exdata.gmtApply}</Text>
                </View>
                <View style={[styles.bill_line]}>
                    <Text style={styles.text_grey}>退款原因：</Text>
                    <Text style={styles.text_bl}>{exdata.applyReason}</Text>
                </View>
                <View style={[styles.bill_line]}>
                    <Text style={styles.text_grey}>是否收货：</Text>
                    <Text style={styles.text_bl}>{stateList[exdata.goodsStatus]}</Text>
                </View>
                <View style={[styles.bill_line]}>
                    <Text style={styles.text_grey}>是否退货：</Text>
                    <Text style={styles.text_bl}>{exdata.onlyRefund?'不需要退货':'需要退货'}</Text>
                </View>
                <View style={[styles.bill_line]}>
                    <Text style={styles.text_grey}>退款总额：</Text>
                    <Text style={styles.text_bl}>{`¥${exdata.refundPayment/100}(含运费${exdata.refundCarriage/100})`}</Text>
                </View>
                {IsEmpty(exdata.refundOperationList[0].discription)?(null):(
                    <View style={[styles.bill_line]}>
                        <Text style={styles.text_grey}>退款说明：</Text>
                        <Text style={[styles.text_bl,{textOverflow:'ellipsis',overflow:'ellipsis'}]}>{exdata.refundOperationList[0].discription}</Text>
                    </View>
                )}

            </View>
        );
    }
}
const styles = {
    vou_view:{
        paddingLeft: px(24),
        paddingRight: px(24),
        paddingTop: px(12),
        paddingBottom: px(30),
        justifyContent: 'space-between',
        backgroundColor:'#ffffff',
    },
    bill_line:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:px(8),
    },
    text_grey:{
        fontSize: px(24),
        color: '#999999',
    },
    text_bl:{
        fontSize: px(24),
    },
    new:{
        height: px(28),
        width: px(28),
    },
}
