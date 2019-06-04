'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Event from 'ay-event';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import {GoToView} from '../../../Public/Biz/GoToView.js';
import {LocalStore} from '../../../Public/Biz/LocalStore.js';
import {ReviewPurcharse} from '../../../Public/Biz/ReviewPurcharse.js';
import AiyongDialog from '../../../Component/AiyongDialog/index';
import {NetWork} from '../../../Public/Common/NetWork/NetWork';
import styles from './styles.js';
const daydata = [{name:'请选择延长时间'},{name:'3天',val:3},{name:'5天',val:5},{name:'7天',val:7},{name:'10天',val:10},{name:'30天',val:30}];
/*
* @author cy
* 订单详情的底部按钮
*/
export default class Foot extends Component {
    constructor(props) {
        super(props);
        this.state={
            value:'',
            delayday:0,
            data:this.props.data, //订单信息
            paytime:'', //付款时间
        }
        this.diffStatus = this.diffStatus.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (!IsEmpty(nextProps.data)) {
            this.setState({
                data:nextProps.data
            });

        }
    }
    //确定收款
    checkok=()=>{
        const { data} = this.state;
        const self = this;
        console.log('kankanshoukuan',data);
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
                let datas = self.state.data;
                datas.pay_time = 'now';
                self.setState({
                    data:datas,
                })
                self.refs.checkorderone.hide();
                Event.emit('App.update_shop_orders',{});
            }else{
                Taro.showToast({
                    title: '确认付款失败',
                    icon: 'none',
                    duration: 2000
                }); 
                self.refs.checkorderone.hide();
            }

        });
    }

    //渲染按钮
    diffStatus(status){
        let purchase = ReviewPurcharse(this.state.data.subOrderList);
        let purchaseStatus = 1;
        let hasPurchase = false;
        let firstPayOrderId = '';
        let hasNotPay = false;
        purchase.map((subOrder,pukey)=>{
            if (subOrder.isPurchaseOrder == '1') {
                hasPurchase = true;
            } else {
                if (subOrder.order.tao_status == 'waitbuyerpay') {
                    firstPayOrderId = subOrder.order.tid;
                    hasNotPay = true;
                }
            }

        });

        let hasNotSp = [];
        this.state.data.orders.map((suborder,subkey)=>{
            if (suborder.is_daixiao == '0') {
                hasNotSp.push(suborder.num_iid);
            }
        });

        switch(status){
            case '待采购':
            let footRight = this.state.data.store_id == 'wc' &&IsEmpty(this.state.data.pay_time)?(
                    <View style={styles.right} onClick={()=>{this.btnOptions('确认已收款')}}>
                        <Text style={styles.right_text}>确认已收款</Text>
                    </View>):
                    (
                        purchaseStatus == 0 ? (
                            <View style={styles.right} onClick={()=>{this.btnOptions('确认采购单')}}>
                                <Text style={styles.right_text}>确认采购单</Text>
                            </View>
                        )
                        :
                        (
                            hasPurchase ? (
                                <View style={styles.right} onClick={()=>{this.btnOptions('确认采购单')}}>
                                    <Text style={styles.right_text}>确认采购单</Text>
                                </View>
                            )
                            :
                            (
                                hasNotPay ? (
                                    <View style={styles.right} onClick={()=>{this.btnOptions('向供应商付款',firstPayOrderId)}}>
                                        <Text style={styles.right_text}>向供应商付款</Text>
                                    </View>
                                )
                                :
                                ''
                            )
                        )
                    )


            if (footRight == '') {
                return '';
            } else {
                return (
                    <View style={styles.foot}>
                        {
                            !IsEmpty(hasNotSp) ? //有未代销的商品，留着
                            ''
                            :
                            ''
                        }
                        {
                            footRight
                        }
                    </View>
                );
            }

            break;
            case '待发货':
                return ''
            break;
            case '已发货':
                return(
                    <View style={styles.foot}>
                        <View style={styles.left} onClick={()=>{this.btnOptions('申请退款')}}>
                            <Text style={styles.left_text}>申请退款</Text>
                        </View>
                        <View style={styles.right} onClick={()=>{this.btnOptions('确认收货')}}>
                            <Text style={styles.right_text}>确认收货</Text>
                        </View>
                    </View>
                )
            break;
            case '退款中':
                return(
                    <View style={styles.foot}>
                        <View onClick={()=>{
                            // RAP.navigator.push({url: `https://trade.1688.com/order/refund/assure_refund_detail.htm?spm=a360q.8234005.0.0.QVqovp&refund_id=${this.props.TQ}&user_type=seller`,})
                        }}  style={styles.right}>
                            <Text style={styles.right_text32}>同意退款</Text>
                        </View>
                    </View>
                )
            break;
            case '已关闭':
            default:
            return (null)
            break;
        }
    }

    //按钮操作
    btnOptions = (status,firstPayOrderId) =>{
        let data = this.state.data;
        let payment = '';
        switch (status) {
            case '确认采购单':{
                let orders = [];
                let relationId = '';
                let order = data.subOrderList;
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
                }

                // if (data.store_id != 'taobao') {
                    orderMsg.addressParam = addressParam;
                // }

                LocalStore.Set({'go_to_confrim_orderMsg':JSON.stringify(orderMsg)});
                payment = parseFloat(this.state.data.payment).toFixed(2);
                payment = payment.split('.');
                GoToView({status:'ConfrimSubOrders',query:{type:'all',fromPage:'detail',totalPrice1:payment[0],totalPrice2:payment[1]}});

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
                    Event.emit('App.pay_update_order_1688',{
                        tid:firstPayOrderId,
                        shopId:data.shop_id,
                        taoTid:data.tid,
                        shopType:data.shop_type,
                        shopName:data.shopName,
                        updateOrderStatus:'向供应商付款'
                    });
                    // // console.log('firstOrder',firstOrder);
                    // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': firstPayOrderId, 'sys_page': 1 });
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
                    Event.emit('App.pay_update_order_1688',{
                        tid:orderId,
                        shopId:data.shop_id,
                        taoTid:data.tid,
                        shopType:data.shop_type,
                        shopName:data.shopName,
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
                        if (subOrderList[i].order.tao_status != 'waitbuyerpay' && subOrderList[i].order.tao_status != 'cancel' && subOrderList[i].order.tao_status != 'success') {
                            orderId = subOrderList[i].order.tid;
                            break;
                        }
                    }
                }
                if (orderId!='') {
                    Event.emit('App.pay_update_order_1688',{
                        tid:orderId,
                        shopId:data.shop_id,
                        taoTid:data.tid,
                        shopType:data.shop_type,
                        shopName:data.shopName,
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
            case '确认已收款':{
                this.refs.checkorderone.show();
            } break;
            default: break;
        }
    }

    render() {
        const { status } = this.props;
        const self = this;
        return (
            <View>
                <View>
                    {this.diffStatus(status)}
                </View>
                <AiyongDialog
                    ref={"checkorderone"}
                    title={"确认已收到买家付款"}
                    cancelText={'再核对一下'}
                    okText={'是，我已收到付款'}
                    content={'请认真核对是否已收到买家的付款'}
                    onSubmit={()=>{self.checkok()}}
                    onCancel={()=>{self.refs.checkorderone.hide();}}
                />
            </View>
        );
    }
}
