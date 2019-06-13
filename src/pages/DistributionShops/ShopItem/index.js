import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Checkbox,Image} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import Event from 'ay-event';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import styles from './styles';
import { SyncShop,GetOrderState } from '../../../Biz/Apis';
import {NetWork} from '../../../Public/Common/NetWork/NetWork.js';
import {Domain} from '../../../Env/Domain';
import px from '../../../Biz/px.js';
import AyButton from '../../../Component/AyButton/index';

/*
* @author cy
* 店铺卡片
*/
export default class ShopItem extends Component {
    constructor(props) {
        super(props);
        this.state={
            isrunning:'0',
            starttime:'',
        };
        // Event.on('App.getrunning',(data) => {
        //     let self = this;
        //     this.getrunning();
        // });
    }

    componentDidMount(){
        //同步订单
        const {item} = this.props;
        // this.syncshop(item);
        this.getrunning();
    }

    //同步订单
    // syncshop=(item)=>{
    //     GetOrderState({
    //         shopId:item.id,
    //         SuccessCallBack:(res)=>{
    //             console.log('GetOrderState',res);
    //             if(res.isend){
    //                 SyncShop({
    //                     shopId:item.id,
    //                     shopName:item.shop_name,
    //                     shopType:item.shop_type,
    //                     SuccessCallBack:(res)=>{
    //                         console.log('SyncShop',res);
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // }
    //获取队列中信息
    getrunning=()=>{
        const self = this;
        if(!IsEmpty(self.props.productid)){
            NetWork.Post({
                url:'dishelper/getrunning',
                host:Domain.WECHART_URL,
                params:{
                    shop_id:self.props.item.id,
                    productid:self.props.productid,
                }
            },(rsp)=>{
                console.log('kankanrunning',rsp);
                let isrunning = '0';
                let starttime = '';
                if(rsp.code == 200){
                    isrunning = '1';
                    starttime = rsp.value;
                }
                self.setState({
                    isrunning:isrunning,
                    starttime:starttime
                })
            });
        }

    }


    render() {
        const {hasAuth,checkboxStyle,isChecked,item} = this.props;
        const {isrunning,starttime} = this.state;
        let name = '';
        let diaabledone = this.props.diaabledone;
        let time = '';
        if(isrunning == '1'){
            diaabledone = true;
            if(!IsEmpty(starttime)){
                name ='正在铺货,预计完成时间';
            }else{
                name ='正在铺货,下拉刷新获取预计时间';
            }
        }
        if(!IsEmpty(starttime)){
            time = starttime;
        }    
        return (
            <View style={styles.shopLine} >
                {
                    hasAuth == false && isrunning =='0' ?
                    <View style={styles.authError}>
                        <Text style={{fontSize:px(24),color:'#ff6000'}}>店铺授权失效，请授权后再铺货</Text>
                    </View>
                    :
                    null
                }
                <Checkbox 
                color = "#ff6000"
                style={checkboxStyle} 
                checked={isChecked} 
                disabled={diaabledone} 
                onChange={()=>{this.props.checkboxOnChange(item.id)}}
                />
                <View style={{flexDirection:'row',alignItems:'center',marginLeft:px(24)}} onClick={()=>{
                    if(diaabledone){
                        if(item.shop_type == 'wc'&&isrunning == '0'){
                            Toast.info('删除旺铺请联系客服', 2);
                        }
                    }else{
                        this.props.checkboxOnChange(item.id,hasAuth,item.shop_type)
                    }
                }}>
                    <Image src={item.pic_url} style={styles.shopImage}/>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text style={{fontSize:px(28),color:'#4a4a4a',marginLeft:px(12),}}>{item.shop_name}</Text>
                        <Text style={{fontSize:px(24),color:'#ff6600',marginLeft:px(12),}}>{name}</Text>
                        <Text style={{fontSize:px(24),color:'#ff6600',marginLeft:px(12),}}>{time}</Text>
                    </View>
                </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                {
                    hasAuth == false ?
                    <AyButton type="primary" style={{width:px(152),height:px(56)}} onClick={()=>{this.props.sureAccess(item.shop_type,false,false,item.id)}}>去授权</AyButton>
                    :
                    <AyButton type="primary" style={{width:px(152),height:px(56)}} onClick={()=>{this.props.goToPage(item.id)}}>铺货设置</AyButton>
                }
                </View>
            </View>
        );
    }s
}
