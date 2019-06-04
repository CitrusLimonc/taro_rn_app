'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import px from '../../../Biz/px.js';
/*
* 优惠信息
*/
export default class CalMoney extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data,products } = this.props;
        let money=0;
        for(let i in products){
            money += parseFloat(products[i].total_fee);
        }
        let discountpay = (data['discount']/100).toFixed(2);
        return (
            <View style={styles.cal_view}>
        		{data['discount']==0?(null):(
        	    	<View style={styles.cal_line}>
            		    <Text style={styles.text_black}>店铺优惠</Text>
            		    <Text style={[styles.text_green,{color:discountpay>0?'red':'#1BB11B'}]}>{`${discountpay>0?'':'-'}¥${Math.abs(discountpay)}`}</Text>
        		    </View>
        		)}
        		<View style={styles.cal_line}>
        		    <Text style={styles.text_grey}>货品总价(含优惠)</Text>
        		    <Text style={styles.text_grey}>{`¥${money.toFixed(2)}`}</Text>
        		</View>
        		<View style={styles.cal_line}>
        		    <Text style={styles.text_grey}>运费</Text>
        		    <Text style={styles.text_grey}>{`¥${parseFloat(data['shippingFee']).toFixed(2)}`}</Text>
        		</View>
            </View>
        );
    }
}
const styles = {
    cal_view:{
        paddingTop: px(6),
        paddingBottom: px(12),
        paddingLeft: px(24),
        paddingRight: px(24),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
    },
    text_grey:{
        fontSize: px(24),
        color: '#999999',
    },
    text_black:{
        fontSize: px(24),
    },
    text_green:{
        fontSize: px(24),
        color: '#1BB11B',
    },
    cal_line:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: px(6),
    },
}
