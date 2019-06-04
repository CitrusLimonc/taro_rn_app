'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Image } from '@tarojs/components';
import Event from 'ay-event';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import px from '../../../Biz/px.js';

/*
* 发票信息
*/
export default class BillInfo extends Component {
    constructor(props) {
        super(props);
        this.copyBill = this.copyBill.bind(this);
    }

    copyBill(){
        const { data } = this.props;
        Event.emit('App.trclbd',{
            msg:data.taxpayerIdentify,
            cal:'买家税号已复制'
        })
    }

    render() {
        const { data } = this.props;
        return (
            <View style={styles.bill_view}>
        		<View style={styles.bill_line}>
                    <Text style={styles.text_grey}>发票信息</Text>
                </View>
                <View style={[styles.bill_line,{marginTop:px(12)}]}>
                    <Text style={styles.text_grey}>发票抬头：</Text>
                    <Text style={styles.text_bl}>{data.invoice_name}</Text>
                </View>
                {IsEmpty(data.taxpayerIdentify)?(null):(
                    <View style={[styles.bill_line,{marginTop:px(12)}]}>
                        <Text style={styles.text_grey}>买家税号：</Text>
                        <Text style={[styles.text_bl,{flex:1}]}>{data.invoice_taxes_id}</Text>
                        <View onClick={this.copyBill}>
                            <Image style={[styles.new,{marginLeft:px(24)}]} src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png' />
                        </View>
                    </View>
                )}
            </View>
        );
    }
}
const styles = {
    bill_view:{
        paddingLeft: px(24),
        paddingRight: px(24),
        paddingTop: px(12),
        paddingBottom: px(30),
        justifyContent: 'space-between',
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
