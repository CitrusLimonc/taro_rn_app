'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View} from '@tarojs/components';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import {ReviewPurcharse} from '../../../Public/Biz/ReviewPurcharse.js';
import SubCard from './SubCard';
import styles from './styles.js';
import px from '../../Biz/px.js';
/*
* @author cy
* 采购单
*/
export default class PurchaseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:this.props.purchase, //采购单信息
            purchase:this.props.purchase, //处理过的采购单信息
            allData:this.props.data,
            invoices:[]
        }
    }

    componentWillMount(){
        let data = this.state.data;
        let purchase = ReviewPurcharse(data);
        console.log("purchase",data,purchase);
        this.setState({
            purchase:purchase
        });
    }

    componentWillReceiveProps(nextProps){
        if (!IsEmpty(nextProps.purchase)) {
            let data = nextProps.purchase;
            let purchase = ReviewPurcharse(data);
            console.log("purchase",purchase);
            this.setState({
                data:nextProps.purchase,
                purchase:purchase,
                allData:nextProps.data
            });
        }
    }

    //更新采购单
    updateOrder = (lastSubOrder) =>{
        let purchase = this.state.purchase;
        console.log("purchase",lastSubOrder,purchase);
        let itemlist = [];
        for (let k = 0; k < purchase.length; k++) {
            let item = purchase[k];
            let itemlist = [];
            for (var i = 0; i < item.order.orderModel.subOrderList.length; i++) {
                if (!IsEmpty(item.order.orderModel.subOrderList[i].itemlist)) {
                    itemlist = item.order.orderModel.subOrderList[i].itemlist;
                    for (var j = 0; j < itemlist.length; j++) {
                        if (lastSubOrder.orderId == itemlist[j].orderId) {
                            purchase[k].order.orderModel.subOrderList[i].itemlist[j] = lastSubOrder;
                            break;
                        }
                    }
                } else {
                    if (lastSubOrder.orderId == purchase[k].order.orderModel.subOrderList[i].orderId) {
                        purchase[k].order.orderModel.subOrderList[i] = lastSubOrder;
                        break;
                    }
                }

            }

        }

        console.log("purchase",lastSubOrder,purchase);
        this.setState({
            purchase:purchase
        });
    }

    render() {
        let {purchase,allData} = this.state;
        const {tabStatus,shopName,shopType,tid,shopId,hasRefund } = this.props;
        return (
            <View style={styles.cardBack}>
                {
                    purchase.map((item,key)=>{
                        let orderId = '';
                        let orders = [];
                        let tradeNick = '';
                        if (item.isPurchaseOrder == '1') {
                            orders = item.order.orderModel.subOrderList;
                            tradeNick = item.order.orderModel.subOrderList[0].supplierNickName;
                            let doms = [];
                            orders.map((suborder,subkey)=>{
                                let itemlist = [];
                                if (!IsEmpty(suborder.itemlist)) {
                                    itemlist = suborder.itemlist;
                                } else {
                                    itemlist = [];
                                    itemlist.push(suborder);
                                }
                                doms.push(
                                    <SubCard item = {item}
                                    orders = {orders}
                                    tradeNick = {tradeNick}
                                    isPurchaseOrder = {item.isPurchaseOrder}
                                    itemlist = {itemlist}
                                    tabStatus = {tabStatus}
                                    shopName = {shopName}
                                    shopType = {shopType}
                                    tid = {tid}
                                    shopId = {shopId}
                                    updateOrder = {this.updateOrder}
                                    suborder = {suborder}
                                    data = {allData}
                                    relationId = {item.relationId}
                                    />
                                 );
                            });
                            return doms;
                        } else {
                            orders = item.order.orders;
                            tradeNick = item.order.seller_nick;
                            let totalCount = 0;
                            orders.map((product,idx)=>{
                                totalCount = totalCount + parseInt(product.num);
                            });
                            let payment = parseFloat(item.order.payment).toFixed(2);
                            payment = payment.split('.');
                            return (
                                <SubCard item = {item}
                                isPurchaseOrder = {item.isPurchaseOrder}
                                payment = {payment}
                                totalCount = {totalCount}
                                tradeNick = {tradeNick}
                                orders = {orders}
                                tabStatus = {tabStatus}
                                shopName = {shopName}
                                shopType = {shopType}
                                tid = {tid}
                                shopId = {shopId}
                                hasRefund = {hasRefund}
                                data = {allData}
                                relationId = {item.relationId}
                                />
                            );
                        }
                    })
                }
            </View>
        );
    }
}
