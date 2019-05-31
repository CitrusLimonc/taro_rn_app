import Taro, { Component, Config } from '@tarojs/taro';
import { View , Text ,Image} from '@tarojs/components';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import ItemIcon from '../ItemIcon';
import px from '../../Biz/px.js';
import styles from './styles.js';
/**
* @author cy
* 旺旺图标显示和操作
* 传入旺旺的账号text
* lzy 3.15
**/

export default class WangWang extends Component{
    constructor(props) {
        super(props);
        this.state={
            checked:false,
        };
    };

    //呼起旺旺
    wangchatp = () =>{
        const { loginid } = this.props;
        if(this.props.title=='买家昵称'){
            UitlsRap.clipboard(this.props.text,()=>{
                Taro.showToast({
                    title: '买家昵称昵称复制成功',
                    icon: 'none',
                    duration: 2000
                });
            });
        }else{
            // RAP.emit('App.openwc',loginid);
        }

    }

    //去申请退款
    goToPage = (status) =>{
        const {orderId,tid,shopName,shopId} = this.props;
        switch (status) {
            case '取消订单':
            case '申请退款':{
                // RAP.emit('App.update_lastPayOrders',{
                //     lastPayOrders:orderId,
                //     lastTaoTid:tid,
                //     lastShopId:shopId,
                //     lastShopName:shopName,
                //     updateOrderStatus:status
                // });
                // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': orderId, 'sys_page': 1 });
                // RAP.navigator.push({url: ofurls});
            } break;
            default: break;
        }
    }

    render(){
        const {title,text,tabStatus,status} = this.props;

        return(
            <View style={styles.wangwang}>
                <Text style={{color:'#999999',fontSize:24}} onClick={this.wangchatp}>{title}：</Text>
                <Text onClick={this.wangchatp} style={styles.wangText}>{text}</Text>
                {this.props.title=='买家昵称'?(
                    <View onClick={this.wangchatp} style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                        <Image style={[styles.copyIcon,{marginLeft:px(24)}]}
                        src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png'
                        />
                    </View>
                )
                :(<ItemIcon onClick={this.wangchatp} code={"\ue6ba"} iconStyle={styles.wangIcon}/>)
                }
                {
                    tabStatus == '已关闭' && (status == 'waitbuyerpay' || status == 'waitsellersend') ?
                    (
                        status == 'waitbuyerpay' ?
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}} onClick={()=>{this.goToPage('取消订单')}}>
                            <Text style={{fontSize:px(28),color:'#ff6000'}}>取消订单</Text>
                            <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(32),color:'#ff6000'}}/>
                        </View>
                        :
                        (
                            status != 'cancel' && status != 'success' && status != 'terminated' ?
                            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}} onClick={()=>{this.goToPage('申请退款')}}>
                                <Text style={{fontSize:px(28),color:'#ff6000'}}>申请退款</Text>
                                <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(32),color:'#ff6000'}}/>
                            </View>
                            :
                            ''
                        )
                    )
                    :
                    ''
                }
            </View>
        );
    }
}
