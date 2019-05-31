'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Image,Link } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import ItemIcon from '../ItemIcon';
import px from '../../Biz/px.js';
import styles from './styles.js';
/**
* @author lzy
* 详情页面收件人信息
* lzy 3.15
**/
export default class TradeReceiver extends Component {
    constructor(props) {
        super(props);
        this.state={
            phone:'', //电话号码
        }
        this.copyAddress = this.copyAddress.bind(this);
    }

    //复制用户信息
	copyAddress(){
		const { data } = this.props;
        let address = data.receiver_city+data.receiver_district+data.receiver_address;
        if (data.store_id == 'pdd') {
            address = data.receiver_address;
        }

        let text = `联系人：${data.receiver_name}  联系电话：${this.state.phone}  联系地址：${address} 邮编${data.receiver_zip}`;
        UitlsRap.clipboard(text,()=>{
            Taro.showToast({
                title: '信息已复制',
                icon: 'none',
                duration: 2000
            });
        });
	}

    componentWillMount(){
        const { data } = this.props;
        let self = this;
        if(IsEmpty(self.props.phone)){
            //获取电话号码
            LocalStore.Get([`rep${data.tid}`],(result)=>{
                if(result!=''){
                    let pp = Parse2json(result[`rep${data.tid}`]);
                    self.setState({phone:pp})
                }
            })
        }else{
            self.setState({phone:self.props.phone})
        }
    }

    render() {
        const { data } = this.props;
        const { phone } = this.state;
        // if (!IsEmpty(data.receiverInfo)) {
        //     data.orderReceiverInfo = data.receiverInfo;
        // }
        let address = data.receiver_city+data.receiver_district+data.receiver_address;
        let receiverZip = '000000';
        if (!IsEmpty(data.receiver_zip)) {
            receiverZip = data.receiver_zip;
        }
        return (
            <View style={styles.blis_view}>
                <View style={styles.row_view}>
 					<Text style={styles.text_grey}>收 件 人  ：</Text>
 					<Text style={[styles.text_bl,{flex:1}]}>{data.receiver_name}</Text>
 					{!IsEmpty(phone)?(
						<Link style={{flexDirection:'row'}} href={`tel:${phone}`}>
						    <Text style={styles.text_blue}>{phone}</Text>
							<ItemIcon iconStyle={{marginLeft:px(20),color:'#3d97e1',fontSize:px(28)}} code={"\ue662"} />
						</Link>
 					):(null)}
                </View>
                <View onClick={this.copyAddress} style={[styles.row_view,{alignItems:'flex-start',marginTop:px(12)}]}>
                	<Text style={styles.text_grey}>收货地址：</Text>
                	<Text style={[styles.text_bl,{flex:1,textOverflow:'ellipsis',lines:2,width:px(530)}]}>{`${address} 邮编${receiverZip}`}</Text>
                	<View>
                	    <Image style={[styles.new,{marginLeft:px(24)}]} src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png' />
                	</View>
                </View>
            </View>
        );
    }
}
