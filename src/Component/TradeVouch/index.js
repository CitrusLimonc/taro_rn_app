'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import px from '../../Biz/px.js';
/*
* 订单付款时间等信息
*/
class Vouch extends Component {
    constructor(props) {
        super(props);
        this.state={
            paw:{1:'支付宝',2:'网商银行信任付',3:'诚e赊',4:'银行转账',5:'赊销宝',6:'电子承兑票据',7:'账期支付',8:'合并支付渠道',9:'无打款',10:'零售通赊购',13:'支付平台',12:'声明付款'},
            trtype:{1:'担保交易',2:'预存款交易',3:'ETC境外收单交易',4:'即时到帐交易',5:'保障金安全交易',6:'统一交易流程',7:'分阶段付款',8:'货到付款交易',9:'信用凭证支付交易',10:'账期支付交易',50060:'支付宝担保交易'}
        }
        this.copyVou = this.copyVou.bind(this);
        this.paytime = this.paytime.bind(this);
        this.payway = this.payway.bind(this);
        this.closeTime = this.closeTime.bind(this);
        this.sendTime = this.sendTime.bind(this);
    }

    //获取付款时间
    paytime(){
        const { data,tid,status } = this.props;
        let self = this;
        let time;
        if(!IsEmpty(data.pay_time)){
            time = data.pay_time;
            return (
                    <View style={[styles.bill_line,{marginTop:px(12)}]}>
                        <Text style={styles.text_grey}>付款时间：</Text>
                        <Text style={styles.text_bl}>{time}</Text>
                    </View>
            )
        }
        return (null);
    }
    //获取支付方式
    payway(){
        const { data,tid,status } = this.props;
        let self = this;
        if(!IsEmpty(data.pay_type)&&status!='null'){
            return (
                    <View style={[styles.bill_line,{marginTop:px(12)}]}>
                        <Text style={styles.text_grey}>支付方式：</Text>
                        <Text style={styles.text_bl}>{self.state.paw[data.pay_type]}</Text>
                    </View>
            )
        }
        return (null);
    }
    //获取关闭时间
    closeTime(){
        const { data,tid,status } = this.props;
        let self = this;
        let time;
        if(!IsEmpty(data.end_time) && data.end_time != '0000-00-00 00:00:00' &&status == '交易关闭'){
            time = data.end_time;
            return (
                    <View style={[styles.bill_line,{marginTop:px(12)}]}>
                        <Text style={styles.text_grey}>关闭时间：</Text>
                        <Text style={styles.text_bl}>{time}</Text>
                    </View>
            )
        }
        return (null);
    }
    //获取订单发货时间
    sendTime(){
        const { data,tid,status } = this.props;
        let self = this;
        let time;
        if(!IsEmpty(data.end_time) && data.end_time != '0000-00-00 00:00:00' && status == '已成功'){
            time = data.end_time;
            return (
                    <View style={[styles.bill_line,{marginTop:px(12)}]}>
                        <Text style={styles.text_grey}>发货时间：</Text>
                        <Text style={styles.text_bl}>{time}</Text>
                    </View>
            )
        }
        return (null);
    }
    //复制订单号
    copyVou(){
        const { tid } = this.props;
        UitlsRap.clipboard(tid,()=>{
            Taro.showToast({
                title: '订单号已复制',
                icon: 'none',
                duration: 2000
            });
        });
    }

    render() {
        const { data,tid,status } = this.props;

        return (
            <View style={styles.vou_view}>
                <View style={[styles.bill_line,{marginTop:px(12)}]}>
                    <Text style={styles.text_grey}>下单时间：</Text>
                    <Text style={styles.text_bl}>{data.created}</Text>
                </View>
                <View style={[styles.bill_line,{marginTop:px(12)}]}>
                    <Text style={styles.text_grey}>付款时间：</Text>
                    <Text style={styles.text_bl}>{data.pay_time}</Text>
                </View>
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
export default Vouch;
