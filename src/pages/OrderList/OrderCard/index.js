import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import Event from 'ay-event';
import TradeNick from '../../../Component/TradeNick';
import TradeSellerMemo from '../../../Component/TradeSellerMemo';
import TradeGoodsList from '../../../Component/TradeGoodsList';
import TradeReceiver from '../../../Component/TradeReceiver';
import TradeButtonsGroup from '../../../Component/TradeButtonsGroup';
import ItemIcon from '../../../Component/ItemIcon';
import {GoToView} from '../../../Public/Biz/GoToView.js';
import {LocalStore} from '../../../Public/Biz/LocalStore.js';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import {ReviewPurcharse} from '../../../Public/Biz/ReviewPurcharse.js';
import styles from './styles.js';
import px from '../../../Biz/px.js';
/**
* @author cy
* 单个订单的显示
**/

export default class OrderCard extends Component{
    constructor(props){
        super(props);
        const { order } = this.props;
        this.state= {
            order:order, //当前订单数据
            tralog:'',
            loginfo:'',
            lastSubOrder:{} //当前操作的采购单
        }
        this.copyTid = this.copyTid.bind(this);//复制tid
        this.GoToDetail = this.GoToDetail.bind(this);
    };
    componentWillReceiveProps(nextProps){
        this.setState({
            order:nextProps.order
        });
    }
    //修改备忘
    ModifyMo(){

    }

    //跳转详情页
    GoToDetail(AllTQ,refund){
        console.log('orderCard--------gotoview');
        let self =this;
        const { order } = self.state;
        GoToView({status:'OrderDetail',query:{orderId:order.tid,shopType:order.store_id}});
    }
    //复制订单号
    copyTid = (text) =>{
        const { order } = this.props;
        Event.emit('App.trclbd',{
            msg:text,
            cal:'订单号已复制'
        })
    }
    //获取订单时间
    calTime(status,testdata){
        let self = this;
        let time;
        let type;
        let disDate;
        switch(status){
            case '0':
                time = testdata.created;
                // disDate = self.formatTime(time,'1',3)+'后关闭';
            break;
            case '1':
                time = testdata.pay_time;
                // disDate = '已付款' + self.formatTime(time,'0',0);
            break;
            case '2':
                time = testdata.consign_time;
                // disDate = self.formatTime(time,'1',15)+'后成功';
            break;
            case '3':
            break;
            default: break;
        }
        return disDate;
    }

    //格式化时间
    formatTime(time,state,day){
        let nowTime = new Date();
        let leftTime;
        time = time.replace(/-/g, "/")
        let createDate = new Date(time);
        if(state=='1'){
            let closeTiem = createDate.getTime() + 86400000 * day;
            closeTiem = new Date(closeTiem);
            leftTime = closeTiem.getTime() - nowTime.getTime();
            // if(leftTime<0){
            //     console.error('超时的订单')
            //     return;
            // }
        }else{
            leftTime = nowTime.getTime() - createDate.getTime();
        }
        let strDay = parseInt(leftTime/86400000);
        let strHour = parseInt((leftTime%86400000)/3600000);
        let strSec = Math.ceil(((leftTime%86400000)%3600000)/60000);
        let strDate = '';

        if(strDay!=0){
            strDate += strDay + '天'
        }
        if(strHour!=0){
            strDate += strHour + '小时'
        }
        if(strSec!=0){
            strDate += strSec + '分'
        }
        return strDate;
    }
    //获取采购单的状态
    getPurcharse = (hasSendedBtns,tabStatus,purchase,idStr,order) =>{
        let purcharseDoms = [];
        if (hasSendedBtns) {
            purchase.map((subOrder,key)=>{
                if (subOrder.isPurchaseOrder == '0') {
                    //已确认的采购单
                    let statusText = '';
                    let priceText = '';
                    switch (subOrder.order.tao_status) {
                        case 'waitbuyerpay':statusText = '';priceText = '待付款';break;
                        case 'waitsellersend':statusText = '待发货';priceText = '已付款';break;
                        case 'waitlogisticstakein':statusText = '待揽件';priceText = '已付款';break;
                        case 'waitbuyerreceive':statusText = '已发货';priceText = '已付款';break;
                        case 'waitbuyersign':statusText = '已发货';priceText = '已付款';break;
                        case 'signinsuccess':statusText = '已收货';priceText = '已付款';break;
                        case 'confirm_goods':statusText = '已收货';priceText = '已付款';break;
                        case 'success':statusText = '已成功';priceText = '已付款';break;
                        case 'cancel':statusText = '已取消';priceText = '';break;
                        case 'terminated':statusText = '已终止';priceText = '已付款';break;
                        default:break;
                    }

                    let sendErrorMsg = subOrder.sendErrorMsg;
                    if (subOrder.sendErrorMsg == 'needAuth') {
                        sendErrorMsg = '爱用交易授权失效，请点击发货按钮';
                        // if (order.store_id == 'pdd') {
                        //     sendErrorMsg = '拼多多授权失效，请点击去授权';
                        // }
                    } else if (subOrder.sendErrorMsg == 'needAuth-gx') {
                        sendErrorMsg = '爱用供销授权失效，请点击发货按钮';
                    } else if (subOrder.sendErrorMsg == 'needAuth-pdd') {
                        sendErrorMsg = '拼多多授权失效，请点击发货按钮';
                    }

                    purcharseDoms.push(
                        <View>
                            <TradeNick loginid={subOrder.order.seller_nick}
                            text={subOrder.order.seller_nick}
                            title={'供 应 商 '}
                            tabStatus={tabStatus}
                            status={subOrder.order.tao_status}
                            orderId={subOrder.order.tid}
                            tid={idStr}
                            shopName={order.shopName}
                            shopId={order.shop_id}
                            />
                            <View style={styles.orderNum}>
                                <Text style={styles.orderText}>采购单号：</Text>
                                <Text style={styles.number}
                                onClick={()=>{
                                    if (!IsEmpty(subOrder.order.tid)) {
                                        Event.emit('App.trclbd',{
                                            msg:subOrder.order.tid,
                                            cal:'订单号已复制'
                                        });
                                    }
                                }}
                                >{subOrder.order.tid ? subOrder.order.tid:'暂无'}</Text>
                                {
                                    statusText != '' ?
                                    <View style={styles.tagBox}>
                                        <Text style={styles.tagText}>{statusText}</Text>
                                    </View>
                                    :
                                    null
                                }
                                {
                                    priceText != '' ?
                                    <View style={{flexDirection:'row',justifyContent:'flex-end',flex:1}}>
                                        <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{priceText}：</Text>
                                        <Text style={{fontSize:px(28),color:'#ff6000'}}>¥{!IsEmpty(subOrder.order.payment) ? parseFloat(subOrder.order.payment).toFixed(2):'暂无'}</Text>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                            {
                                !IsEmpty(sendErrorMsg) ?
                                <View style={styles.errorLine}>
                                    <Text style={[styles.orderText,{color:'#ff6000'}]}>发货失败：</Text>
                                    <Text style={{fontSize:px(24),color:'#ff6000',width:px(600)}}>{sendErrorMsg}</Text>
                                </View>
                                :
                                null
                            }
                        </View>
                    )
                } else {
                    //未确认的采购单
                    let orders = subOrder.order.orderModel.subOrderList;
                    orders.map((list,subkey)=>{
                        let leftText = '待您确认后生成';
                        let rightText = '确认采购单';
                        let fontColor = '#999999';
                        purcharseDoms.push(
                            <View>
                                <TradeNick loginid={list.supplierNickName}
                                text={list.supplierNickName}
                                title={'供 应 商 '}
                                />
                                <View style={styles.orderNum}>
                                    <Text style={styles.orderText}>采购单号：</Text>
                                    <Text style={{fontSize:px(24),color:fontColor}}>{leftText}</Text>
                                </View>
                            </View>
                        );
                    });
                }
            });
        } else {
            //订单若被自行发货
            purcharseDoms.push(
                <View style={styles.orderNum}>
                    <Text style={[styles.orderText,{color:'#ff6000'}]}>当前订单您已自行发货</Text>
                </View>
            );
        }
        return purcharseDoms;
    }


    render(){
        const {index,tabStatus} = this.props;
        const {order,tralog,loginfo} = this.state;

        //数据整理开始
        //订单状态
        let status = order.tao_status;
        let type = order.aiyong_status;
        let disDate = this.calTime(type,order);
        let AllTQ = true;//是否全为退款单
        let quantitySum = 0;
        // if(order.baseInfo.refundStatus || order.baseInfo.refundStatusForAs){
        //     status = 'waitselleragree';
        // }
        let idStr = order.tid;//订单号
        let items = order.orders; //商品信息
        for(let i in items){
            if(IsEmpty(items[i].refund_status) || items[i].refund_status == '1' || items[i].refund_status == 'NO_REFUND' || items[i].refund_status == 'REFUND_CLOSED'){
                AllTQ = false;
            }
        }
        //重组收件人信息
        let phone = IsEmpty(order.receiver_mobile)?order.receiver_phone:order.receiver_mobile;
        if(!IsEmpty(phone)){
            let params = {};
            params[`rep${order.tid}`] = phone;
            LocalStore.Set(params);
        }
        let sellerDiscount='';
        //是否有卖家备注
        if (order.seller_memo) {
            sellerDiscount=<TradeSellerMemo ModifyMo={this.ModifyMo} text={order.sellerMemo} clo={order.seller_flag}/>;
        }

        let totalAmount = parseFloat(order.total_fee).toFixed(2) +"";
        totalAmount = totalAmount.split(".");
        let totalPrice1 = totalAmount[0];
        let totalPrice2 = IsEmpty(totalAmount[1])?"00":totalAmount[1];

        let shopTypePicture = '';
        switch (order.store_id) {
            case 'taobao':{
                shopTypePicture = 'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png';
            } break;
            case 'pdd':{
                shopTypePicture = 'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png';
            } break;
            default: break;
        }
        let isLastOne = false;

        let purchase = ReviewPurcharse(order.subOrderList);
        console.log('purchase',purchase);

        let purchaseStatus = 1;
        let hasPurchase = false;
        let hasNotPay = false;
        let hasSendedBtns = true;
        order.subOrderList.map((pur,pukey)=>{
            if (pur.isPurchaseOrder == '1') {
                hasPurchase = true;
                if (tabStatus == '已发货') {
                    hasSendedBtns = false;
                }
            } else {
                if (pur.order.tao_status == 'waitbuyerpay') {
                    hasNotPay = true;
                }
            }

        });

        let hasNotSp = [];
        order.orders.map((suborder,subkey)=>{
            if (suborder.is_daixiao == '0') {
                hasNotSp.push(suborder.num_iid);
            }
        });

        return (
            <View style={{backgroundColor:'#ffffff',marginBottom:24}}>
                {/*
                    !IsEmpty(order.buyer_nick) ?
                    <TradeNick loginid={order.buyer_nick} text={order.buyer_nick} title={'买家旺旺'} />
                    :
                    null
                */}
                <View style={styles.orderNum}>
                    <Text style={styles.orderText}>订 单 号  ：</Text>
                    <Image src={shopTypePicture} style={{width:px(48),height:px(48)}}/>
                    <Text style={styles.number}>{idStr}</Text>
                    <View onClick={()=>{this.copyTid(order.tid)}}>
                        <Image style={[styles.new,{marginLeft:px(12)}]} src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png' />
                    </View>
                    <View style={{flex:1}}/>
                    {IsEmpty(sellerDiscount)?(
                        <View onClick={this.ModifyMo}>
                            <ItemIcon onClick={this.ModifyMo} code={'\ue61f'} iconStyle={[styles.memoIcon,{color:'#999'}]}/>
                        </View>
                    ):(null)}
                </View>
                {sellerDiscount}
                {items.map((item,index)=>{
                    if (index == items.length-1) {
                        isLastOne = true;
                    }
                    quantitySum = quantitySum + parseInt(item.num);
                    let sku = '';
                    if (order.store_id == 'taobao') {
                        let properties = item.sku_properties_name;
                        if (!IsEmpty(properties)) {
                            properties = properties.split(';');
                            properties.map((prop,key) => {
                                properties[key] = properties[key].split(':');
                                if (key == properties.length - 1) {
                                    sku = sku + properties[key][1];
                                } else {
                                    sku = sku + properties[key][1] + ',';
                                }
                            });
                        }
                    } else {
                        sku = item.sku_properties_name;
                    }


                    let data={
                        allitems:items,
                        name:item.title,
                        picUrl:item.pic_path,
                        sku:sku,
                        itemAmount:parseFloat(item.price).toFixed(2),
                        price:(parseFloat(item.price)*item.num).toFixed(2),
                        num:item.num,
                        status:item.aiyong_status,
                        tid:idStr,
                        refund:item.refund_status,
                        tabStatus:tabStatus,
                        AllTQ:AllTQ,
                        refundId:item.refund_id,
                        subItemIDString:item.oid,
                        productCargoNumber:item.outer_iid,
                        shopType:order.store_id,
                        is_daixiao:item.is_daixiao,
                    };
                    return (<TradeGoodsList key={index} {...data} isLastOne={isLastOne}/>)
                })}
                <View onClick={()=>{this.GoToDetail(AllTQ,item.refund_id)}} style={styles.totals}>
                    <Text style={{color:'#333',fontSize:px(34),paddingBottom:px(2)}}>{items.length} </Text>
                    <Text style={{color:'#333',fontSize:px(24)}}>种货品 共</Text>
                    <Text style={{color:'#333',fontSize:px(34),paddingBottom:px(2)}}> {quantitySum} </Text>
                    <Text style={{color:'#333',fontSize:px(24)}}>件 合计(含运费：¥{parseFloat(order.post_fee).toFixed(2)}):</Text>
                    <Text style={{fontSize:px(34),color:'#ff6000',paddingBottom:px(2)}}> ¥{totalPrice1}</Text>
                    <Text style={{fontSize:px(24),color:'#ff6000',paddingTop:px(4)}}>.{totalPrice2}</Text>
                </View>
                <TradeReceiver data={order} phone={phone}/>
                {
                    this.getPurcharse(hasSendedBtns,tabStatus,purchase,idStr,order)
                }
                <TradeButtonsGroup totalPrice1={totalPrice1} totalPrice2={totalPrice2} data={order} status={tabStatus}
                purchaseStatus={purchaseStatus}
                hasNotSp={hasNotSp} hasPurchase={hasPurchase}
                hasNotPay={hasNotPay}
                sendGood={this.props.sendGood}
                />
            </View>
        )
    }
}
