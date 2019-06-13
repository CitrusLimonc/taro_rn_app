'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View , Text , Image } from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import AyButton from '../../../../Component/AyButton/index';
import Event from 'ay-event';
import {IsEmpty} from '../../../../Public/Biz/IsEmpty.js';
import ItemIcon from '../../../../Component/ItemIcon';
import NumberPicker from '../../../../Component/NumberPicker';
import TradeNick from '../../../../Component/TradeNick';
import ChooseSkuDialog from '../../../../Component/ChooseSkuDialog';
import {LocalStore} from '../../../../Public/Biz/LocalStore.js';
import {GoToView} from '../../../../Public/Biz/GoToView.js';
import {NetWork} from '../../../../Public/Common/NetWork/NetWork.js';
import px from '../../../../Biz/px.js';
import styles from './styles.js';

/*
* @author cy
* 单个采购单卡片
*/
export default class SubCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item:this.props.item, //当前采购单
            invoices:[], //物流信息
            lastSubOrder:{}, //当前采购单
            lastLogist:0,//当前物流
            shopName:this.props.shopName,//店铺名称
            shopType:this.props.shopType,//店铺类型
            tid:this.props.tid,//订单id
            shopId:this.props.shopId,//店铺id
            itemlist:this.props.itemlist,//采购单的子订单
            relationId:this.props.relationId,//订单关系表的id
            suborder:this.props.suborder,//子订单
            data:this.props.data,//当前采购单原信息
            isPurchaseOrder:this.props.isPurchaseOrder,//是否为采购单状态
            tabStatus:this.props.tabStatus,//tab状态
            payment:this.props.payment,//采购单的价格
            totalCount:this.props.totalCount,//采购单商品总数
            tradeNick:this.props.tradeNick,//当前订单的卖家昵称
            orders:this.props.orders,//当前订单信息
            offerId:'',//当前商品id
            specId:''//当前sku的specid
        };
        this.loading = '';
    }

    componentWillMount(){
        const {item} = this.state;
        let tid = item.order.tid;
        let status = item.order.tao_status;
        if (status == 'waitlogisticstakein' || status == 'waitbuyerreceive' || status == 'waitbuyersign'
        || status == 'signinsuccess' || status == 'confirm_goods' || status == 'success') {
            this.getLogistInfo(tid,(data)=>{
                this.setState({
                    invoices:data
                });
            });
        }
    }

    componentWillReceiveProps(nextProps){
        let {item,itemlist,suborder,data,isPurchaseOrder,payment,totalCount,orders,tabStatus} = this.state;
        if (!IsEmpty(nextProps.item)) {item = nextProps.item;}
        if (!IsEmpty(nextProps.itemlist)) {itemlist = nextProps.itemlist;}
        if (!IsEmpty(nextProps.suborder)) {suborder = nextProps.suborder;}
        if (!IsEmpty(nextProps.data)) {data = nextProps.data;}
        if (!IsEmpty(nextProps.isPurchaseOrder)) {isPurchaseOrder = nextProps.isPurchaseOrder;}
        if (!IsEmpty(nextProps.payment)) {payment = nextProps.payment;}
        if (!IsEmpty(nextProps.totalCount)) {totalCount = nextProps.totalCount;}
        if (!IsEmpty(nextProps.orders)) {orders = nextProps.orders;}
        if (!IsEmpty(nextProps.tabStatus)) {tabStatus = nextProps.tabStatus;}

        this.setState({
            item:item,
            itemlist:itemlist,
            suborder:suborder,
            data:data,
            isPurchaseOrder:isPurchaseOrder,
            payment:payment,
            totalCount:totalCount,
            orders:orders,
            tabStatus:tabStatus
        });
    }

    //获取物流信息
    getLogistInfo = (orderId,callback) =>{
        NetWork.Get({
            url:"Distributeproxy/getLogisticsTraceInfo",
            data:{
                webSite:'1688',
                orderId:orderId
            }
        },(rsp)=>{
            console.log('alibaba.trade.getLogisticsTraceInfo.buyerView',rsp);
            if (!IsEmpty(rsp.logisticsTrace)) {
                callback(rsp.logisticsTrace);
            } else {
                callback([]);
            }
        },(error)=>{
            callback([]);
            console.log(error);
        });
    }

    //渲染底部按钮
    renderFoot = (item,tabStatus,tradeNick) =>{
        if (item.isPurchaseOrder == '0') {
            switch (item.order.tao_status) {
                case 'waitbuyerpay':
                    return (
                        <View style={styles.footLine}>
                            <AyButton
                            type="primary"
                            onClick={()=>{this.btnOptions('取消订单')}}
                            style={[styles.footBtns,{borderColor:'#DCDEE3',color:'#5F646E'}]}>
                            取消订单
                            </AyButton>
                            {
                                tabStatus == '已关闭' ?
                                null
                                :
                                <AyButton
                                type="primary"
                                onClick={()=>{this.btnOptions('付款采购')}}
                                style={styles.footBtns}>
                                付款采购
                                </AyButton>
                            }
                        </View>
                    );
                    break;
                case 'waitsellersend':
                    return (
                        <View style={styles.footLine}>
                            <AyButton
                            type="normal"
                            onClick={()=>{this.btnOptions('申请退款')}}
                            style={styles.footBtns}>
                            申请退款
                            </AyButton>
                            <AyButton
                            type="normal"
                            onClick={()=>{this.btnOptions('提醒发货',tradeNick)}}
                            style={styles.footBtns}>
                            提醒发货
                            </AyButton>
                        </View>
                    );
                    break;
                case 'waitlogisticstakein':
                case 'waitbuyerreceive':
                case 'waitbuyersign':
                case 'signinsuccess':
                case 'confirm_goods':
                    return (
                        <View style={styles.footLine}>
                            <AyButton
                            type="normal"
                            onClick={()=>{this.btnOptions('申请退款')}}
                            style={styles.footBtns}>
                            申请退款
                            </AyButton>
                            <AyButton
                            type="normal"
                            onClick={()=>{this.btnOptions('确认收货')}}
                            style={styles.footBtns}>
                            确认收货
                            </AyButton>
                        </View>
                    );
                    break;
                case 'success':
                case 'terminated':{
                    return (
                        <View style={styles.footLine}>
                            <AyButton
                            type="normal"
                            onClick={()=>{this.btnOptions('查看详情')}}
                            style={styles.footBtns}>
                            查看详情
                            </AyButton>
                        </View>
                    );
                } break;
                case 'cancel':{
                    if ((tabStatus == '待采购' || tabStatus == '待发货')) {
                        return (
                            <View style={styles.footLine}>
                                <AyButton
                                type="normal"
                                onClick={()=>{this.btnOptions('查看详情')}}
                                style={styles.footBtns}>
                                查看详情
                                </AyButton>
                                <AyButton
                                type="normal"
                                onClick={()=>{this.btnOptions('重新采购')}}
                                style={styles.footBtns}>
                                重新采购
                                </AyButton>
                            </View>
                        );
                    } else {
                        return (
                            <View style={styles.footLine}>
                                <AyButton
                                type="normal"
                                onClick={()=>{this.btnOptions('查看详情')}}
                                style={styles.footBtns}>
                                查看详情
                                </AyButton>
                            </View>
                        );
                    }
                }
                default:break;
            }
        } else {
            let isMate = true;
            item.order.orderModel.subOrderList.map((product,idx)=>{
                if (IsEmpty(product.innerSpec)) {
                    isMate = false;
                }
            });
            let but = (
                <View style={styles.footLine}>
                    <AyButton
                    type="primary"
                    style={[styles.footBtns,{backgroundColor:'#F5F5F5',borderColor:'#E6E6E6',color:'#BFBFBF'}]}>
                    确认采购单
                    </AyButton>
                </View>
            );
            if (isMate) {
                if(this.state.shopType == 'wc' && IsEmpty(this.state.data.pay_time)){
                    return but;
                }else{
                    return (
                        <View style={styles.footLine}>
                            <AyButton
                            type="primary"
                            onClick={()=>{this.btnOptions('确认采购单')}}
                            style={styles.footBtns}>
                            确认采购单
                            </AyButton>
                        </View>
                    );
                }

            } else {
                return but;
            }
        }
    }

    //按钮操作
    btnOptions = (status,tradeNick) =>{
        if (status != '确认采购单' && status != '查看详情' && status != '提醒发货' && status != '重新采购') {
            Event.emit('App.pay_update_order_1688',{
                tid:this.state.item.order.tid,
                shopId:this.state.shopId,
                taoTid:this.state.tid,
                shopType:this.state.shopType,
                shopName:this.state.shopName,
                updateOrderStatus:status
            });
        }
        switch (status) {
            case '付款采购':{
                let orderIdList = [];
                orderIdList.push(this.state.item.order.tid);
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
                        //呼起支付宝并显示弹窗
                        if (!IsEmpty(orderIdList)) {
                            // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': orderIdList[0], 'sys_page': 1 });
                            // RAP.navigator.push({url: ofurls});
                        } else {
                            Toast.info('暂无可付款的订单', 2);
                        }
                        // RAP.navigator.push({
                        //     url:'',
                        //     title:'付款',
                        //     backgroundColor:'#fff',
                        //     clearTop:false,
                        //     animated:true
                        // }).then((result) => {
                        //     //console.log(result);
                        // }).catch((error) => {
                        //     console.error(error);
                        // });
                //    }
                // },(error)=>{
                //     console.log(error);
                // });
            } break;
            case '申请退款':{
                Event.emit('App.pay_update_order_1688',{
                    tid:this.state.item.order.tid,
                    shopId:this.state.shopId,
                    taoTid:this.state.tid,
                    shopType:this.state.shopType,
                    shopName:this.state.shopName
                });
                // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': this.state.item.order.tid, 'sys_page': 1 });
                // RAP.navigator.push({url: ofurls});
            } break;
            case '确认采购单':{
                let {item,shopName,shopType,tid,shopId,itemlist,relationId,suborder,data} = this.state;
                let confirmOrders = [];
                suborder.relationId = relationId;
                confirmOrders.push(suborder);
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
                let supplierMemberId = item.order.orderModel.supplierId;
                LocalStore.Set({'go_to_confrim_suborder':JSON.stringify(confirmOrders)});
                let orderMsg = {
                    tid:tid,
                    shopType:shopType,
                    shopName:shopName,
                    shopId:shopId,
                    relationId:item.relationId,
                    supplierMemberId:supplierMemberId
                };

                // if (shopType != 'taobao') {
                    orderMsg.addressParam = addressParam;
                // }
                let payment = '';
                payment = parseFloat(this.state.data.payment).toFixed(2);
                payment = payment.split('.');
                LocalStore.Set({'go_to_confrim_orderMsg':JSON.stringify(orderMsg)});
                GoToView({status:'ConfrimSubOrders',query:{type:'one',fromPage:'detail',totalPrice1:payment[0],totalPrice2:payment[1]}});

            } break;
            case '提醒发货':{
                Event.emit('App.openwc',tradeNick);
            } break;
            case '取消订单':{
                // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': this.state.item.order.tid, 'sys_page': 1 });
                // RAP.navigator.push({url: ofurls});
            } break;
            case '查看详情':{
                // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': this.state.item.order.tid, 'sys_page': 1 });

                // console.log('查看详情',ofurls);
                // RAP.navigator.push({url: ofurls});
            } break;
            case '确认收货':{
                // let ofurls = RAP.biz.getBizInfoUrl('orderDetail', { 'orderId': this.state.item.order.tid, 'sys_page': 1 });
                // RAP.navigator.push({url: ofurls});
            } break;
            case '重新采购':{
                this.loading = Toast.loading('加载中...');
                NetWork.Get({
                    url:'Orderreturn/rebuildSubOrder',
                    data:{
                        tid:this.state.tid,
                        relationId:this.state.relationId,
                        shopId:this.state.shopId
                    }
                },(rsp)=>{
                    console.log('Orderreturn/rebuildSubOrder',rsp);
                    //有结果
                    Portal.remove(this.loading);
                    if (!IsEmpty(rsp.code) && rsp.code == 200) {
                        //重新加载订单
                        Event.emit('App.redetail',{});
                        Event.emit('App.update_shop_orders',{});
                        Toast.info('成功', 2);
                    }
                },(error)=>{
                    Portal.remove(this.loading);
                    console.error(error);
                });
            } break;
            default: break;
        }
    }

    //获取状态标志
    getTag = (status) =>{
        let text = '';
        switch (status) {
            case 'waitbuyerpay':
                text = '待付款';
                break;
            case 'waitsellersend':
                text = '待发货';
                break;
            case 'waitlogisticstakein':
                text = '待揽件';
                break;
            case 'waitbuyerreceive':
                text = '待收货';
                break;
            case 'waitbuyersign':
                text = '待签收';
                break;
            case 'signinsuccess':
                text = '已签收';
                break;
            case 'confirm_goods':
                text = '已收货';
                break;
            case 'success':
                text = '已成功';
                break;
            case 'cancel':
                text = '已取消';
                break;
            case 'terminated':
                text = '已终止';
                break;
            default:break;

        }

        console.log('getTag',status,text);
        return (
            <View style={styles.littleTag}>
                <Text style={styles.littleTagText}>{text}</Text>
            </View>
        );
    }

    //选择sku操作，获取一遍1688淘货源详情
    chooseSku = (product,offerId,specId) =>{
        this.setState({
            lastSubOrder:product,
            offerId:offerId,
            specId:specId
        });
        console.log(product,offerId,specId);
        this.refs.skuDialog.show();
    }

    // 修改sku数量
    changeskunum = (e,specId) => {
        const {itemlist} = this.state;
        let tokennum =0;
        for (let i = 0; i < itemlist.length; i++) {
            if (specId == itemlist[i].specId) {
                itemlist[i].buyAmount = e;
                tokennum = tokennum + e;
            }else{
                tokennum = tokennum + itemlist[i].buyAmount;
            }
        }
        if(tokennum==0){
            Toast.info('采购单数量总和不能为0', 2);
        }else{
            this.setState({
                itemlist:itemlist,
            });
        }
    };

    //渲染物流
    renderInvoices = () =>{
        let doms = [];
        let invoices = this.state.invoices;
        let item = this.state.item;
        let orders = item.order.orders;
        if (!IsEmpty(invoices)) {
            if (invoices.length > 1) {
                let logisticName = '';
                orders.map((logist,idx)=>{
                    if (logist.invoice_no == invoices[this.state.lastLogist].logisticsBillNo) {
                        logisticName = logist.logistics_company;
                    }
                });
                let logisticsSteps = invoices[this.state.lastLogist].logisticsSteps;
                return (
                    <View style={{flex:1}}>
                        {
                            invoices.length > 1 ?
                            <View style={{flex:1,flexDirection:'row'}}>
                                {
                                    invoices.map((item,key)=>{
                                        if (key == this.state.lastLogist) {
                                            return (
                                                <View style={styles.tabbarActive} onClick={()=>{this.setState({lastLogist:key})}}>
                                                    <Text style={{color:'#ff6000',fontSize:px(24)}}>运单{key+1}</Text>
                                                </View>
                                            )
                                        } else {
                                            return (
                                                <View style={styles.tabbar} onClick={()=>{this.setState({lastLogist:key})}}>
                                                    <Text style={{color:'#4a4a4a',fontSize:px(24)}}>运单{key+1}</Text>
                                                </View>
                                            )
                                        }
                                    })
                                }
                            </View>
                            :
                            null
                        }
                        <View style={styles.logistCard}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:'#9B9B9B',fontSize:px(24)}}>发货方式:</Text>
                                <Text style={{color:'#4A4A4A',fontSize:px(24)}}>物流公司</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:'#9B9B9B',fontSize:px(24)}}>物流公司:</Text>
                                <Text style={{color:'#4A4A4A',fontSize:px(24)}}>{logisticName}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:'#9B9B9B',fontSize:px(24)}}>运单编号:</Text>
                                <Text style={{color:'#4A4A4A',fontSize:px(24)}}>{invoices[this.state.lastLogist].logisticsBillNo}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:'#9B9B9B',fontSize:px(24)}}>物流状态:</Text>
                                <Text style={{color:'#36AE5E',fontSize:px(24),width:px(560)}}>
                                    {logisticsSteps[logisticsSteps.length-1].remark}
                                </Text>
                            </View>
                        </View>
                    </View>
                )

            } else {
                let logisticName = '';
                orders.map((logist,idx)=>{
                    if (logist.invoice_no == invoices[0].logisticsBillNo) {
                        logisticName = logist.logistics_company;
                    }
                });
                console.log(invoices[0]);
                let logisticsSteps = invoices[0].logisticsSteps;
                return (
                    <View style={styles.logistCard}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#9B9B9B',fontSize:px(24)}}>发货方式:</Text>
                            <Text style={{color:'#4A4A4A',fontSize:px(24)}}>物流公司</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#9B9B9B',fontSize:px(24)}}>物流公司:</Text>
                            <Text style={{color:'#4A4A4A',fontSize:px(24)}}>{logisticName}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#9B9B9B',fontSize:px(24)}}>运单编号:</Text>
                            <Text style={{color:'#4A4A4A',fontSize:px(24)}}>{invoices[0].logisticsBillNo}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#9B9B9B',fontSize:px(24)}}>物流状态:</Text>
                            <Text style={{color:'#36AE5E',fontSize:px(24),width:px(560)}}>
                                {logisticsSteps[logisticsSteps.length-1].remark}
                            </Text>
                        </View>
                    </View>
                );
            }
        }
    }

    //渲染state
    updateStates = (obj) =>{
        this.setState({
            ...obj
        });
    }

    render() {
        let {isPurchaseOrder,tabStatus,lastSubOrder,offerId,specId} = this.state;
        let card = null;
        if (isPurchaseOrder == '0') {
            let {item,payment,totalCount,tradeNick,orders} = this.state;
            card = (
                <View style={styles.card}>
                    <View style={styles.firstLine}>
                        <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{Event.emit('App.trclbd',{msg:item.order.tid,cal:'订单号已复制'});}}>
                            <Text style={{fontSize:px(28),color:'#4A4A4A'}}>采购单号：{item.order.tid}</Text>
                            <Image style={[styles.copyIcon,{marginLeft:px(24)}]}
                            src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png'
                            />
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}} onClick={()=>{this.btnOptions('查看详情')}}>
                            <Text style={{fontSize:px(24),color:'#999999'}}>订单详情</Text>
                            <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(32),color:'#979797'}}/>
                        </View>
                    </View>
                    <View>
                        <View style={{flex:1,marginLeft:px(-24)}}>
                            <TradeNick loginid={tradeNick} text={tradeNick} title={'供 应 商 '} />
                        </View>
                        {
                            orders.map((product,idx)=>{
                                let sku = '';
                                let price = '';
                                let number = 1;
                                let title = '';
                                let offerPicUrl = '';
                                let properties = product.sku_properties_name;
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
                                price = product.price;
                                number = product.num;
                                title = product.title;

                                if (!IsEmpty(product.pic_path)) {
                                    offerPicUrl = product.pic_path;
                                } else {
                                    offerPicUrl = 'https://cbu01.alicdn.com/images/app/detail/public/camera.gif';
                                }


                                console.log('picUrl',offerPicUrl);
                                let opview = '';
                                if(!IsEmpty(product.refund_status) && product.refund_status != 'NO_REFUND' && product.refund_status != 'CLOSED'){
                                    let tab_retxt = '';
                                    let tab_color = '';
                                    if(product.refund_status == 'REFUND_SUCCESS' || product.refund_status == 'SUCCESS'){
                                        tab_retxt = '已退款';
                                        tab_color ='#8B572A';
                                    }else{
                                        tab_retxt = '退款中';
                                        tab_color = '#E41010';
                                    }
                                    opview = <View style={[styles.bo_f,{backgroundColor:tab_color}]}>
                                                <Text style={styles.bo_txt}>{tab_retxt}</Text>
                                            </View>;
                                }

                                return (
                                    <View style={styles.cardLine} onClick={()=>{this.btnOptions('查看详情')}}>
                                        <View style={styles.img}>
                                            <Image resizeMode={"contain"} src={offerPicUrl} style={{width:px(120),height:px(120)}}/>
                                            {opview}
                                        </View>
                                        <View style={{flex:1,marginLeft:px(24)}}>
                                            <View style={{flexDirection:'row'}}>
                                                <Text style={{width:px(400),fontSize:px(24),color:'#333333'}}>{title}</Text>
                                                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                                                    <Text style={{fontSize:px(24),color:'#333333'}}>¥{price}</Text>
                                                </View>
                                            </View>
                                            <View style={{flexDirection:'row',marginTop:px(8)}}>
                                                {
                                                    !IsEmpty(sku) ?
                                                    <Text style={{fontSize:px(24),color:'#ff6000'}}>{sku}</Text>
                                                    :
                                                    null
                                                }
                                                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                                                    <Text style={{fontSize:px(24),color:'#ff6000'}}>x{number}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={styles.priceLineBox}>
                        {
                            this.getTag(item.order.tao_status)
                        }
                        <View style={[styles.priceLine,{flex:1,justifyContent:'flex-end'}]}>
                            <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{orders.length}</Text>
                            <Text style={{fontSize:px(24),color:'#4A4A4A'}}>种货品共</Text>
                            <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{totalCount}</Text>
                            <Text style={{fontSize:px(24),color:'#4A4A4A'}}>件合计(含运费):</Text>
                            <Text style={{fontSize:px(32),color:'#ff6000'}}>¥{payment[0]}</Text>
                            <Text style={{fontSize:px(24),color:'#ff6000'}}>.{payment[1]}</Text>
                        </View>
                    </View>
                    { this.renderInvoices() }
                    {this.renderFoot(item,tabStatus,tradeNick)}
                </View>
            );
        } else {
            let {item,orders,tradeNick,itemlist} = this.state;
            card = (
                <View style={styles.card}>
                    <View style={styles.firstLine}>
                        <Text style={{fontSize:px(28),color:'#4A4A4A'}}>采购单</Text>
                        <Text style={{fontSize:px(28),color:'#FF6000',marginLeft:px(30)}}>确认后生成</Text>
                    </View>
                    <View>
                        <View style={{flex:1,marginLeft:px(-24)}}>
                            <TradeNick loginid={tradeNick} text={tradeNick} title={'供 应 商 '} />
                        </View>
                        {
                            itemlist.map((product,idx)=>{
                                let sku = '';
                                let price = '';
                                let number = 1;
                                let title = '';
                                let offerPicUrl = '';
                                if(!IsEmpty(product.innerSpec)){
                                    for(let i in product.innerSpec){
                                        sku += product.innerSpec[i]+',';
                                    }
                                    sku = sku.slice(0,-1);
                                } else {
                                    sku = '请重新选择商品规格';
                                }

                                if (product.minPrice == product.maxPrice) {
                                    price = '¥' + product.minPrice;
                                } else {
                                    price = '¥' + product.minPrice + '~¥' + product.maxPrice;
                                }
                                number = product.buyAmount;
                                title = product.offerTitle;
                                offerPicUrl = product.offerPicUrl;

                                let picUrl  = 'https://cbu01.alicdn.com/images/app/detail/public/camera.gif';
                                if (!IsEmpty(offerPicUrl)) {
                                    if (offerPicUrl.indexOf('https://cbu01.alicdn.com/') > -1) {
                                        picUrl = offerPicUrl;
                                    } else {
                                        picUrl = 'https://cbu01.alicdn.com/'+offerPicUrl;
                                    }
                                }


                                return (
                                    <View style={styles.cardLine}>
                                        <Image src={picUrl} style={{width:120,height:120}}/>
                                        <View style={{marginLeft:px(12),flex:1}}>
                                            <View style={{width:532}}>
                                                <Text style={{width:532,fontSize:px(24),color:'#4a4a4a'}}>{product.offerTitle}</Text>
                                            </View>
                                            <View style={{marginTop:px(18),flexDirection:'row',alignItems:'center',flex:1}}>
                                                {
                                                    !IsEmpty(product.innerSpec) ?
                                                    <View style={styles.skuTag} onClick={()=>{this.chooseSku(product,product.offerId,product.specId)}}>
                                                        <Text style={{fontSize:px(24),color:'#9a9a9a'}}>{sku}</Text>
                                                        <ItemIcon code={"\ue6a6"} iconStyle={{fontSize:px(24),color:'#9a9a9a'}}/>
                                                    </View>
                                                    :
                                                    <AyButton style={styles.littleBtn} onClick={()=>{this.chooseSku(product,product.offerId)}}>匹配规格</AyButton>
                                                }
                                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                                                    {/* <Text style={{fontSize:px(24),color:'#9a9a9a'}}>x{product.buyAmount}</Text> */}
                                                    <NumberPicker style={{width:px(180),height:px(57)}} min={1} max={99999} value={product.buyAmount} onChange={(e)=>{this.changeskunum(e,product.specId)}} step={1}/>
                                                </View>
                                            </View>
                                            {
                                                !IsEmpty(product.innerSpec)?
                                                <View style={styles.priceTag}>
                                                    <Text style={{fontSize:px(24),color:'#ff6000'}}>{price}</Text>
                                                </View>
                                                :
                                                <View style={styles.noMateTag}>
                                                    <Text style={{fontSize:px(18),color:'#ffffff'}}>规格未匹配</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    {this.renderFoot(item,tabStatus,tradeNick)}
                </View>
            );
        }

        let orderMsg = {
            tid:this.state.tid,
            shopType:this.state.shopType,
            shopName:this.state.shopName
        };

        return (
            <View style={{flex:1}}>
                {card}
                <ChooseSkuDialog ref={"skuDialog"}
                orderMsg={orderMsg}
                offerId={offerId}
                specId={specId}
                lastSubOrder={lastSubOrder}
                updateStates={this.updateStates}
                updateOrder={this.props.updateOrder}
                showLoading={()=>{this.loading = Toast.loading('加载中...');}}
                hideLoading={()=>{Portal.remove(this.loading);}}
                from="one"
                />
            </View>
        )
    }
}
