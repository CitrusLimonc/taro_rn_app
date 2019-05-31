'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import px from '../../Biz/px.js';
/*
* 付款信息
*/
export default class EasyPay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.rex){
            const {products,data} = this.props;
            let newpro = [];
            let total = 0;
            let totalmoney = 0;
            for(let i in products){
                if(!IsEmpty(products[i].refund_status) && products[i].refund_status!='1'){
                    newpro.push(products[i]);
                    total = parseInt(total) + parseInt(products[i].num);
                    totalmoney = totalmoney + parseFloat(products[i].payment);
                }
            }
            totalmoney = parseFloat(totalmoney).toFixed(2) + '';
            let int=totalmoney.split('.');
            return (
               <View style={styles.cal_view}>
                   <Text style={{fontSize:32,color:'#4a4a4a'}}>退款总额：</Text>
                   <View style={[styles.item_right]}>
                      <Text style={styles.text_black36}>{newpro.length}</Text>
                      <Text style={styles.text_black24}> 种货品 共 </Text>
                      <Text style={[styles.text_black36]}>{total}</Text>
                      <Text style={styles.text_black24}> 件 合计(含运费)：</Text>
                      <Text style={styles.text_or36}>{`¥ ${int[0]}.`}</Text>
                      <Text style={styles.text_or24}>{IsEmpty(int[1])?'00':int[1]}</Text>
                   </View>
               </View>
            );
        }else{
        	  const {products,money,data} = this.props;
            let total=0;
            for(let i in products){
            	total += parseInt(products[i].num);
            }
            let mstr = parseFloat(money['totalAmount']).toFixed(2) + '';
            let int= mstr.split('.');
            return (
               <View style={styles.cal_view}>
                   <Text style={styles.text_black36}>{products.length}</Text>
                   <Text style={styles.text_black24}> 种货品 共 </Text>
                   <Text style={[styles.text_black36]}>{total}</Text>
                   <Text style={styles.text_black24}> 件 合计(含运费)：</Text>
                   <Text style={styles.text_or36}>{`¥ ${int[0]}.`}</Text>
                   <Text style={[styles.text_or24,{paddingTop:12}]}>{IsEmpty(int[1])?'00':int[1]}</Text>
               </View>
            );
      }
    }
}
const styles = {
  cal_view:{
    flex:1,
    paddingTop: px(12),
    paddingBottom: px(12),
    paddingLeft: px(24),
    paddingRight: px(24),
    borderBottomWidth: px(1),
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  blue_box:{
    width: px(134),
    height: px(42),
    borderRadius: px(6),
    borderStyle:'solid',
    borderWidth: px(2),
    borderColor: '#3089DC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blue_text:{
    color: '#3089DC',
    fontSize: px(24),

  },
  item_right:{
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text_black36:{
    fontSize: px(36),
    height: px(36),
  },
  text_black24:{
    fontSize: px(24),
  },
  text_or36:{
    color: '#ff6000',
    fontSize: px(36),
    height: px(36),
  },
  text_or24:{
    color: '#ff6000',
    fontSize: px(24),
  },
}
