'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Image } from '@tarojs/components';
import styles from './styles.js';

/**
 * 订单来源
 **/
export default class OrderSource extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {shopType,shopName,orderId} = this.props;
        let imgSrc = '';
        switch (shopType) {
            case 'taobao':
                imgSrc = 'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png';
                break;
            case 'pdd':
                imgSrc = 'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png';
                break;
            default: break;
        }
        return (
            <View style={{flex:1}}>
                <View style={styles.wangwang}>
                    <Text style={{color:'#999999',fontSize:24}}>订单来源：</Text>
                    <Image src={imgSrc} style={{width:48,height:48}}/>
                    <Text style={styles.wangText}>{shopName}</Text>
                </View>
                <View style={styles.wangwang} onClick={()=>{/*RAP.emit('App.trclbd',{msg:orderId,cal:'订单号已复制'});*/}}>
                    <Text style={{color:'#999999',fontSize:24}}>订单编号：</Text>
                    <Text style={{fontSize:px(24),color:'#4A4A4A'}}>{orderId}</Text>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                        <Image style={[styles.copyIcon,{marginLeft:px(24)}]}
                        src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png'
                        />
                    </View>
                </View>
            </View>

        );
    }
}
