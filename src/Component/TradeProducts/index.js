import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Image } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import px from '../../Biz/px.js';
import styles from './styles.js';
/**
* @author lzy
* 详情页面子订单组件
* lzy 3.15
**/

const stateList = { 1:'买家未收到货',2:'买家已收到货',3:'买家已退货',}
export default class TradeProducts extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible:false,
            refundInfo:{}, //退款信息
            time:[], //时间
        }
        this.renderItem = this.renderItem.bind(this);
        this.refundColor = {
            WAIT_SELLER_AGREE:{txt:'退款中',color:'rgba(228,16,16,0.8)',con:'退款协议等待卖家确认'},
            SUCCESS:{txt:'已退款',color:'rgba(139,87,42,0.8)',con:'退款成功'},
            CLOSED:{txt:'退款关闭',color:'rgba(139,87,42,0.8)',con:'退款关闭'},
            SELLER_REFUSE_BUYER:{txt:'退款中',color:'rgba(228,16,16,0.8)',con:'卖家拒绝退款'},
            WAIT_SELLER_CONFIRM_GOODS:{txt:'退款中',color:'rgba(228,16,16,0.8)',con:'等待卖家确认收货'},
            WAIT_BUYER_RETURN_GOODS:{txt:'退款中',color:'rgba(228,16,16,0.8)',con:'等待买家退货'}
        }//各种退款状态
        // this.log_color ={logisticsStatus
        //     1 未发货 2 已发货 3 已收货 4 已退货 5 部分发货 8 还未创建物流订单
        // }
        // this.handR = this.handR.bind(this);
    }

    /**
    *渲染每一个子订单
    */
    renderItem(item,index,datasource,flag){
        const { visible } = this.state;
        let refundFalg;
        let textFlag = false;
        if(!IsEmpty(item.refund_status)){
            switch (item.refund_status) {
                case '2':
                case 2:refundFalg = {txt:'退款中',color:'rgba(228,16,16,0.8)',con:'售后处理中'};break;
                case '3':
                case 3:refundFalg = {txt:'退款中',color:'rgba(228,16,16,0.8)',con:'退款中'};break;
                case '4':
                case 4:refundFalg = {txt:'退款成功',color:'rgba(228,16,16,0.8)',con:'退款成功'};break;
                default:refundFalg = this.refundColor[item.refund_status];break;
            }
        }
        if(flag){
            textFlag = true;
        }
        let ns_hs = null;
        let itemText='';
        if (item.store_id == 'taobao') {
            //淘宝的sku信息处理一下
            let properties = item.sku_properties_name;
            if (!IsEmpty(properties)) {
                properties = properties.split(';');
                properties.map((prop,key) => {
                    properties[key] = properties[key].split(':');
                    if (key == properties.length - 1) {
                        itemText = itemText + properties[key][1];
                    } else {
                        itemText = itemText + properties[key][1] + ',';
                    }
                });
            }
        } else {
            itemText = item.sku_properties_name;
        }

        let img_src=IsEmpty(item.pic_path)?'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2616206419,4080448290&fm=27&gp=0.jpg':item.pic_path;
        if(this.props.tapstate == '已发货' && item.aiyong_status == '1'){
            ns_hs = (<View style={[styles.status_color,{backgroundColor:'rgba(74,144,226,0.8)'}]}>
                        <Text style={styles.white_text}>已发货</Text>
                    </View>);
        }
        if(this.props.tapstate == '退款中'){
            if(item.aiyong_status == '2'){
                ns_hs = <View style={[styles.status_color,{backgroundColor:'rgba(74,144,226,0.8)'}]}>
                        <Text style={styles.white_text}>已发货</Text>
                    </View>
            }else if(item.status == '1'){
                ns_hs = <View style={[styles.status_color,{backgroundColor:'rgba(66,196,207,0.8)'}]}>
                        <Text style={styles.white_text}>待发货</Text>
                    </View>
            }
        }
        let single = parseFloat(item.payment/item.num); //
        if(single<0.01&&item.payment!=0){
            single = `<¥0.01`;
        }else{
            single = `¥${(item.payment/item.num).toFixed(2)}`;
        }
        console.log('-----render card------',item);
        return(
            <View key={index} style={[styles.line_cell,{marginLeft:index==datasource.length-1?px(0):px(24)}]}>
                <View style={{marginLeft:index==datasource.length-1?px(24):px(0)}}>
                    <View style={{height:px(120),width:px(120),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={"contain"} style={[styles.cell_img]} src={img_src}/>
                        {!IsEmpty(ns_hs)?ns_hs:(
                            <View style={styles.status_color}>
                                {IsEmpty(refundFalg)?(null):(
                                    <View style={[styles.status_color,{backgroundColor:refundFalg.color}]}>
                                        <Text style={styles.white_text}>{refundFalg.txt}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>
                <View style={[styles.item,{flex:1}]}>
                    <View style={styles.text_row}>
                        <Text style={[styles.text_item,{textOverflow:'ellipsis',lines:2,marginLeft:px(16)}]}>{item.title}</Text>
                        <View style={styles.item_momey}>
                            <Text style={styles.text_right28}>{single}</Text>
                            <Text style={[styles.text_right24,{color:'#999999',textDecoration:'line-through'}]}>{`¥${item.price}`}</Text>
                        </View>
                    </View>
                    {IsEmpty(item.outer_iid)?(null):(
                        <Text style={{fontSize:px(24),color:'#333',marginLeft:px(16)}}>{`货号:${item.outer_iid}`}</Text>
                    )}
                    <View style={[styles.text_row,{alignItems:'flex-end'}]}>
                        <View style={{width:px(420)}}>
                            <View style={[styles.view_text,{marginLeft:px(16)}]}>
                                <Text style={[styles.text_content,{color:'#ff6000'}]}>{itemText}</Text>
                            </View>
                        </View>
                        <View style={styles.itemfoot}>
                            <Text style={[styles.text_right28,{color:'#ff6000'}]}>{`x${item.num}`}</Text>
                        </View>
                    </View>
                    {textFlag?(
                        <View style={[styles.text_row,{alignItems:'center',paddingLeft:px(16),paddingRight:px(24)}]}>
                           <View style={{flex:1}}/>
                        </View>
                    ):(null)}
                </View>
            </View>
        )
    }

    render() {
        let self = this;
        const { time } = self.state;
        const {datasource,order,isgod} = self.props;
        return(
            <View>
                {datasource.map((item,key)=>{
                    return self.renderItem(item,key,datasource)
                })}
            </View>
        )
    }
}
