import Taro, { Component, Config } from '@tarojs/taro';
import { View ,Button} from '@tarojs/components';
import Event from 'ay-event';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {LocalStore} from '../../Public/Biz/LocalStore';
import { UitlsRap } from '../../Public/Biz/UitlsRap.js';
import {ReviewPurcharse} from '../../Public/Biz/ReviewPurcharse.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork';
import px from '../../Biz/px.js';
import styles from './styles.js';

const types=['待采购','待发货','已发货','已成功','退款中','已关闭'];
/**
* @author cy
* 不同订单状态所显示的按钮
* 18.1.3 lzy
**/

export default class ButtonsGroup extends Component{
    constructor(props) {
        super(props);
        this.state={
            status:'', //订单状态
            value:3,
            phone:'', //手机号码
            lastSubOrder:{}, //当前采购单信息
            paytime:'', //付款时间
            dialogMsg:{}
        };
        this.user_nick = '';
        const { data} = this.props;
        const self = this;

        Event.on('App.checkorderok',(res)=>{
            //确定收款
            if(res.tid == data.tid){
                NetWork.Get({
                    url:'Orderreturn/confirmReceive',
                    params:{
                        orderId:data.tid,
                    }
                },(res)=>{
                    if(res.code==200){
                        Taro.showToast({
                            title: '确认付款成功',
                            icon: 'none',
                            duration: 2000
                        });
                        this.setState({
                            paytime:'now',
                        })
                        Event.emit('App.hidecheckorder');
                    }else{
                        Taro.showToast({
                            title: '确认付款失败',
                            icon: 'none',
                            duration: 2000
                        });
                        Event.emit('App.hidecheckorder');
                    }
                });
            }
        });
    };

    componentWillMount(){
        const { data} = this.props;
        let self = this;
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     console.log('getUserInfo',info);
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.user_nick = info.extraInfo.result.loginId;
        //     } else {
        //         self.user_nick = info.nick;
        //     }
            self.user_nick = '萌晓月cy';
            // this.setState({
            //     paytime:data.pay_time,
            // })
        // });
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.data) {
            this.setState({
                paytime:nextProps.data.pay_time,
            })
        }

    }

    /*
    * 底部按钮的操作
    * text 操作类型
    * order 订单信息
    */
    btnOptions = (text,order) =>{
        const { data} = this.props;
        switch (text) {
            case '确认采购单':{
                let orders = [];
                let relationId = '';
                let addressParam = {
                    addressId:null,
                    fullName:data.receiver_name,
                    mobile:data.receiver_mobile,
                    phone:data.receiver_phone,
                    postCode:'000000',
                    cityText:data.receiver_city,
                    provinceText:data.receiver_state,
                    areaText:data.receiver_district,
                    townText:data.receiver_district,
                    address:data.receiver_address,
                    districtCode:null
                };
                let supplierMemberId = '';
                order.map((item,key)=>{
                    if (item.isPurchaseOrder == '1') {
                        item.order.orderModel.subOrderList.map((subOrder,idx)=>{
                            relationId = item.relationId;
                            subOrder.relationId = relationId;
                            orders.push(subOrder);
                        });
                        supplierMemberId = item.order.orderModel.supplierId;
                    }
                });
                LocalStore.Set({'go_to_confrim_suborder':JSON.stringify(orders)});
                let orderMsg = {
                    tid:data.tid,
                    shopType:data.store_id,
                    shopName:data.shopName,
                    shopId:data.shop_id,
                    relationId:relationId,
                    supplierMemberId:supplierMemberId
                };
                // if (data.store_id != 'taobao') {
                    orderMsg.addressParam = addressParam;
                // }
                LocalStore.Set({'go_to_confrim_orderMsg':JSON.stringify(orderMsg)});
                GoToView({status:'ConfrimSubOrders',query:{type:'all',fromPage:'list',totalPrice1:this.props.totalPrice1,totalPrice2:this.props.totalPrice2}});
            } break;
            case '向供应商付款':{
                let orderIdList = [];
                let subOrderList = data.subOrderList;
                for (var i = 0; i < subOrderList.length; i++) {
                    if (subOrderList[i].isPurchaseOrder == '0') {
                        if (subOrderList[i].order.tao_status == 'waitbuyerpay') {
                            orderIdList.push(subOrderList[i].order.tid);
                        }
                    }
                }
                //获取支付宝支付链接
                // RAP.aop.request({
                //     isOpenApi:true,
                //     namespace:'com.alibaba.trade',
                //     api:'alibaba.alipay.url.get',
                //     version:1,
                //     params:{
                //         orderIdList:orderIdList
                //     }
                // },(rsp)=>{
                //     console.log('alibaba.alipay.url.get',rsp);
                //     if (!IsEmpty(rsp.success) && (rsp.success == true || rsp.success == 'true')) {
                if (!IsEmpty(orderIdList)) {
                    Event.emit('App.update_lastPayOrders',{
                        lastPayOrders:orderIdList[0],
                        lastTaoTid:data.tid,
                        lastShopId:data.shop_id,
                        lastShopName:data.shopName,
                        updateOrderStatus:'向供应商付款'
                    });
                    console.log('firstOrder',firstOrder);
                    // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': orderIdList[0], 'sys_page': 1 });
                    // RAP.navigator.push({url: ofurls});
                } else {
                    Taro.showToast({
                        title: '暂无可付款的订单',
                        icon: 'none',
                        duration: 2000
                    });
                }
                        //呼起支付宝并显示弹窗
                        // RAP.navigator.push({
                        //     url:rsp.payUrl,
                        //     title:'授权',
                        //     backgroundColor:'#fff',
                        //     clearTop:false,
                        //     animated:true
                        // }).then((result) => {
                        //     //console.log(result);
                        // }).catch((error) => {
                        //     console.error(error);
                        // });

                    // }
                // },(error)=>{
                //     console.log(error);
                // });
            } break;
            case '查看详情':{
                GoToView({status:'OrderDetail',query:{orderId:data.tid,shopType:data.store_id}});
            } break;
            case '提醒供应商发货':{
                let orgignNick = '';
                let subOrderList = data.subOrderList;
                for (var i = 0; i < subOrderList.length; i++) {
                    if (subOrderList[i].isPurchaseOrder == '0') {
                        orgignNick = subOrderList[i].order.seller_nick;
                        break;
                    } else {
                        orgignNick = subOrderList[i].order.seller_nick;
                        break;
                    }
                }
                UitlsRap.openChat(orgignNick);
            } break;
            case '申请退款':{
                let orderId = '';
                let subOrderList = data.subOrderList;
                for (var i = 0; i < subOrderList.length; i++) {
                    if (subOrderList[i].isPurchaseOrder == '0') {
                        if (subOrderList[i].order.tao_status != 'waitbuyerpay') {
                            orderId = subOrderList[i].order.tid;
                            break;
                        }
                    }
                }
                if (orderId!='') {
                    Event.emit('App.update_lastPayOrders',{
                        lastPayOrders:orderId,
                        lastTaoTid:data.tid,
                        lastShopId:data.shop_id,
                        lastShopName:data.shopName,
                        updateOrderStatus:'申请退款'
                    });
                    // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': orderId, 'sys_page': 1 });
                    // RAP.navigator.push({url: ofurls});
                } else {
                    Taro.showToast({
                        title: '暂无可退款的订单',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } break;
            case '确认收货':{
                let orderId = '';
                let subOrderList = data.subOrderList;
                for (var i = 0; i < subOrderList.length; i++) {
                    if (subOrderList[i].isPurchaseOrder == '0') {
                        if (subOrderList[i].order.tao_status == 'waitbuyerreceive' ||
                        subOrderList[i].order.tao_status == 'waitbuyersign' ||
                        subOrderList[i].order.tao_status == 'signinsuccess') {
                            orderId = subOrderList[i].order.tid;
                            break;
                        }
                    }
                }
                if (orderId!='') {
                    Event.emit('App.update_lastPayOrders',{
                        lastPayOrders:orderId,
                        lastTaoTid:data.tid,
                        lastShopId:data.shop_id,
                        lastShopName:data.shopName,
                        updateOrderStatus:'确认收货'
                    });
                    // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': orderId, 'sys_page': 1 });
                    // RAP.navigator.push({url: ofurls});
                } else {
                    Taro.showToast({
                        title: '暂无可确认收货的订单',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } break;
            case '评价':{
                let orderId = '';
                let subOrderList = data.subOrderList;
                for (var i = 0; i < subOrderList.length; i++) {
                    if (subOrderList[i].isPurchaseOrder == '0') {
                        if (subOrderList[i].order.tao_status == 'success' ||
                        subOrderList[i].order.tao_status == 'confirm_goods') {
                            orderId = subOrderList[i].order.tid;
                            break;
                        }
                    }
                }
                if (orderId!='') {
                    Event.emit('App.update_lastPayOrders',{
                        lastPayOrders:orderId,
                        lastTaoTid:data.tid,
                        lastShopId:data.shop_id,
                        lastShopName:data.shopName,
                        updateOrderStatus:'评价'
                    });
                    // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': orderId, 'sys_page': 1 });
                    // RAP.navigator.push({url: ofurls});
                } else {
                    Taro.showToast({
                        title: '暂无可评价的订单',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } break;
            case '关闭订单':{
                // this.refs.closeorderone.show();
                Event.emit('App.opencloseorder',{tid:data.tid});
            } break;
            case '确认已收款':{
                // this.refs.checkorderone.show();
                Event.emit('App.opencheckorder',{tid:data.tid});
            } break;
            default:break;
        }
    }


    //渲染按钮
    showbutton(){
        const { data,status,purchaseStatus,hasNotSp,hasPurchase,hasNotPay } = this.props;
        let btnStatus = status;
        if (status == '退款中') {
            btnStatus = types[data.aiyong_status];
        }
        let subOrderList = ReviewPurcharse(data.subOrderList);
        let hasSendedBtns = true;
        if (btnStatus == '已发货') {
            subOrderList.map((item,key)=>{
                if (item.isPurchaseOrder == '1') {
                    hasSendedBtns = false;
                }
            });
        }
        if(IsEmpty(this.state.paytime)&&data.store_id=='wc'){
            return <Button style={[styles.button,{marginLeft:px(24),color:'#ff6000',borderColor:'#ff6000'}]} onClick={()=>{this.btnOptions('确认已收款',subOrderList)}}>确认已收款</Button>
        }else {
            if(purchaseStatus == 0){
               return <Button style={[styles.button,{marginLeft:px(24),color:'#BFBFBF',borderColor:'#E5E5E5',backgroundColor:'#F5F5F5'}]}>确认采购单</Button>
            }else{
                if(hasPurchase){
                   return <Button style={[styles.button,{marginLeft:px(24),color:'#ff6000',borderColor:'#ff6000'}]}
                    onClick={()=>{this.btnOptions('确认采购单',subOrderList)}}
                    >确认采购单</Button>
                }else{
                    if(hasNotPay){
                        return <Button style={[styles.button,{marginLeft:px(24),color:'#ff6000',borderColor:'#ff6000'}]}
                        onClick={()=>{this.btnOptions('向供应商付款',subOrderList)}}
                        >向供应商付款</Button>
                    }else{
                        return null
                    }
                }
            }
        }

    }

    sendGoods = (data,sendType) =>{
        let tid = data.tid;

        if (sendType == 'needAuth') {
            Event.emit('App.showReAuthDialog',{
                'title':'开启自动发货',
                'cancelText':'手动发货',
                'okText':'授权“爱用交易”',
                'content':'请您授权“爱用交易”，获取淘宝店铺订单，同步采购单物流状态'
            });
        } else if (sendType == 'needAuth-gx' || sendType == 'needAuth-pdd') {
            Event.emit('App.choose_send_tid',{tid:tid});
        } else {
            //直接发货
            this.props.sendGood(tid);
        }
    }


    /**根据订单状态显示按钮，列表与详情不同*/
    render(){
        const { data,status,hasNotSp } = this.props;
        let btnStatus = status;
        if (status == '退款中') {
            btnStatus = types[data.aiyong_status];
        }
        let subOrderList = ReviewPurcharse(data.subOrderList);
        let hasSendedBtns = true;
        let isclose = false;
        if (btnStatus == '已发货') {
            subOrderList.map((item,key)=>{
                if (item.isPurchaseOrder == '1') {
                    hasSendedBtns = false;
                }
            });
        }

        let needSend = false;
        let sendType = 'normal';
        subOrderList.map((item,key)=>{
            if (btnStatus == '待发货') {//cancel,terminated
                let orderStatus = item.order.tao_status;
                if (item.isPurchaseOrder == '0' && status == '待发货' && orderStatus != 'waitbuyerpay' && orderStatus != 'waitsellersend' && orderStatus != 'waitsellersend_but_not_fund' && orderStatus != 'cancel' && orderStatus != 'terminated') {
                    needSend = true;
                }
                if (!IsEmpty(item.sendErrorMsg) && item.sendErrorMsg.indexOf("needAuth") != -1) {
                    sendType = item.sendErrorMsg;
                }
            }
            if (item.isPurchaseOrder == '0') {
                if(item.order.tao_status == 'cancel' || item.order.tao_status == 'terminated'){
                    isclose = true;
                }
            }
        });


        switch (btnStatus) {
            //待付款状态
            case '待采购':{
                return (
                    <View style={styles.buttons}>
                        {
                        //    data.store_id=='wc'?(
                        //         hasPurchase?(<Button style={[styles.button,{marginRight:24}]} onClick={()=>{this.btnOptions('关闭订单',subOrderList)}}>关闭订单</Button>):(
                        //             isclose?(<Button style={[styles.button,{marginRight:24}]} onClick={()=>{this.btnOptions('关闭订单',subOrderList)}}>关闭订单</Button>):('')
                        //         )
                        //    ):''
                        }
                        <Button style={styles.button} onClick={()=>{this.btnOptions('查看详情',subOrderList)}}>查看详情</Button>
                        {
                            this.showbutton()
                        }
                        {
                            !IsEmpty(hasNotSp) ? //有未代销货品，暂无
                            ''
                            :
                            ''
                        }
                    </View>
                );
            }
            //待发货状态，添加物流卡片状态 3.8添加待发货异常状态
            case '待发货':
            return (
                <View style={styles.buttons}>
                    <Button style={styles.button} onClick={()=>{this.btnOptions('查看详情',subOrderList)}}>查看详情</Button>
                    {
                        needSend ?
                        <Button style={[styles.button,{marginLeft:px(24),color:'#ff6000',borderColor:'#ff6000'}]} onClick={()=>{this.sendGoods(data,sendType)}}>发货</Button>
                        :
                        <Button style={[styles.button,{marginLeft:px(24)}]} onClick={()=>{this.btnOptions('提醒供应商发货',subOrderList)}}>提醒供应商发货</Button>
                    }
                </View>
            );
            //已发货状态，添加延时发货mask
            case '已发货':
            return (
                <View style={styles.buttons}>
                    <Button style={styles.button} onClick={()=>{this.btnOptions('查看详情',subOrderList)}}>查看详情</Button>
                    {
                        hasSendedBtns ?
                        <Button style={[styles.button,{marginLeft:px(24)}]} onClick={()=>{this.btnOptions('申请退款',subOrderList)}}>申请退款</Button>
                        :
                        ''
                    }
                    {
                        hasSendedBtns ?
                        <Button style={[styles.button,{marginLeft:px(24)}]} onClick={()=>{this.btnOptions('确认收货',subOrderList)}}>确认收货</Button>
                        :
                        ''
                    }
                </View>
            );
            case '待评价':
            return (
                <View style={styles.buttons}>
                    <Button style={[styles.button,{marginLeft:px(10)}]}>旺旺催好评</Button>
                    <Button style={[styles.button,{marginLeft:px(10)}]}>立即评价</Button>
                </View>
            )
            case '退款中':
            return '';
            case 'refundStatusForAs':
            return (
                <View style={styles.buttons}>
                    <Button style={styles.button}>发货提醒</Button>
                    <Button style={[styles.button,{marginLeft:px(24)}]}>延时收货</Button>
                </View>
            );
            case '已成功':
            return (
                <View style={styles.buttons}>
                    <Button style={styles.button} onClick={()=>{this.btnOptions('查看详情',subOrderList)}}>查看详情</Button>
                </View>
            );
            case '已关闭':
            return (
                <View style={styles.buttons}>
                    <Button style={styles.button} onClick={()=>{this.btnOptions('查看详情',subOrderList)}}>查看详情</Button>
                </View>
            );
            case '双方未评':
                return (
                    <View style={styles.buttons}>
                        <Button style={[styles.button]}>旺旺催好评</Button>
                    </View>
                )
            case '买家已评':
                return (
                    <View style={styles.buttons}>
                        <Button style={[styles.button]}>旺旺催好评</Button>
                    </View>
                )
            default:
                return ''
        };
    }
}
