'use strict';
/**
*author lzy
*传入数据将对应的界面拼接
*/
import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import TradeNick from '../../../Component/TradeNick';
import TradeSellerMemo from '../../../Component/TradeSellerMemo';
import Remark from '../Remark';
import TradeProducts from '../../../Component/TradeProducts';
import CalMoney from '../CalMoney';
import EasyPay from '../EasyPay';
import TradeReceiver from '../../../Component/TradeReceiver';
import BillInfo from '../BillInfo';
import TradeVouch from '../../../Component/TradeVouch';
import RefundEx from '../RefundEx';
import OrderSource from '../OrderSource';
import PurchaseCard from '../PurchaseCard';
import styles from './styles.js';
/*
* @author cy
* 订单卡片
*/
export default class TidCard extends Component {
    constructor(props) {
        super(props);
        const {testdata,status,cardData} = this.props;
        this.state = {
           data:[],
           refundex:{},
           testdata:testdata, //订单信息
           cardData:cardData,
           status:status
        };
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.testdata) {
            this.setState({
                testdata:nextProps.testdata
            });
        }
    }

    //显示tid
    showex = (data) =>{
        this.setState({refundex:data});
        this.props.showex(data.TQID);
    }

    //修改备忘
    ModifyMo = () =>{

    }

    render() {
        const { refundex,testdata } = this.state;
        const { cardData,status} = this.state;
        let delive=false;
        for(let i in cardData['productItems']){
            if(cardData['productItems'][i].aiyong_status!='1'){
                delive=true;
            }
        }

        let hasLogistics = false;
        testdata.orders.map((item,key)=>{
            if (!IsEmpty(item.invoice_no)) {
                hasLogistics = true;
            }
        })
        console.log('-----render detail-----',status);
        switch(status){
            case '待采购':
                return (
                <View style={styles.white_bk}>
                    <TradeReceiver data={testdata}/>
                    <OrderSource shopType={testdata.store_id} shopName={testdata.shopName} orderId={testdata.tid}/>
                    {
                        !IsEmpty(testdata.buyer_nick) ?
                        <TradeNick loginid={testdata.buyer_nick} text={testdata.buyer_nick} title={testdata.store_id=='wc'?'买家昵称':'买家旺旺'} />
                        :
                        null
                    }
                    {!IsEmpty(cardData['buyerFeedback'])?(
                        <Remark remark={cardData['buyerFeedback']}/>
                    ):(null)}
                    {!IsEmpty(testdata.seller_memo)?(
                        <TradeSellerMemo ModifyMo={this.ModifyMo} text={testdata.seller_memo} clo={testdata.seller_flag}/>
                    ):(null)}
                    <TradeProducts order={testdata} tapstate={status} datasource={cardData['productItems']} />
                    <CalMoney data={cardData['money']} products={cardData['productItems']}/>
                    <EasyPay data={testdata} money={cardData['money']} products={cardData['productItems']}/>
                    {!IsEmpty(testdata.has_invoice) && testdata.has_invoice == '1'?(
                        <BillInfo data={testdata}/>
                    ):(null)}
                    <TradeVouch data={testdata} tid={testdata.tid} status={status}/>
                    <PurchaseCard purchase={testdata.subOrderList}
                    tabStatus={status} shopName={testdata.shopName}
                    shopType={testdata.store_id} tid={testdata.tid}
                    shopId={testdata.shop_id} hasRefund={testdata.has_refund}
                    data = {testdata}
                    />
                </View>
            );
            break;
            case '已成功':
                return (
                    <View style={styles.white_bk}>
                        <OrderSource shopType={testdata.store_id} shopName={testdata.shopName} orderId={testdata.tid}/>
                        <TradeNick loginid={testdata.buyer_nick} text={testdata.buyer_nick} title={testdata.store_id=='wc'?'买家昵称':'买家旺旺'} />
                        {!IsEmpty(testdata.seller_memo)?(
                            <TradeSellerMemo ModifyMo={this.ModifyMo} text={testdata.seller_memo} clo={testdata.seller_flag}/>
                        ):(null)}
                        {!IsEmpty(cardData['buyerFeedback'])?(
                            <Remark remark={cardData['buyerFeedback']}/>
                        ):(null)}
                        <TradeProducts order={testdata} tapstate={status} datasource={cardData['productItems']} />
                        <CalMoney data={cardData['money']} products={cardData['productItems']}/>
                        <EasyPay data={testdata} money={cardData['money']} products={cardData['productItems']}/>
                        <TradeReceiver data={testdata}/>
                        {!IsEmpty(testdata.has_invoice) && testdata.has_invoice == '1'?(
                            <BillInfo data={testdata}/>
                        ):(null)}
                        <TradeVouch data={testdata} tid={testdata.tid} status={status}/>
                        <PurchaseCard purchase={testdata.subOrderList}
                        tabStatus={status} shopName={testdata.shopName}
                        shopType={testdata.store_id} tid={testdata.tid}
                        shopId={testdata.shop_id} hasRefund={testdata.has_refund}
                        data = {testdata}
                        />
                    </View>
                )
            break;
            case '待发货':
                return (
                    <View style={styles.white_bk}>
                        <TradeReceiver data={testdata}/>
                        <OrderSource shopType={testdata.store_id} shopName={testdata.shopName} orderId={testdata.tid}/>
                        {
                            !IsEmpty(testdata.buyer_nick) ?
                            <TradeNick loginid={testdata.buyer_nick} text={testdata.buyer_nick} title={testdata.store_id=='wc'?'买家昵称':'买家旺旺'} />
                            :
                            null
                        }
                        {!IsEmpty(testdata.seller_memo)?(
                            <TradeSellerMemo ModifyMo={this.ModifyMo} text={testdata.seller_memo} clo={testdata.seller_flag}/>
                        ):(null)}
                        {!IsEmpty(cardData['buyerFeedback'])?(
                            <Remark remark={cardData['buyerFeedback']}/>
                        ):(null)}
                        {!IsEmpty(testdata.has_invoice) && testdata.has_invoice == '1'?(
                            <View>
                            <BillInfo data={testdata}/>
                            </View>
                        ):(null)}
                        <TradeProducts order={testdata} tapstate={status} datasource={cardData['productItems']} />
                        <CalMoney data={cardData['money']} products={cardData['productItems']}/>
                        <EasyPay data={testdata} money={cardData['money']} products={cardData['productItems']}/>
                        <TradeVouch data={testdata} tid={testdata.tid} status={status}/>
                        <PurchaseCard purchase={testdata.subOrderList}
                        tabStatus={status} shopName={testdata.shopName}
                        shopType={testdata.store_id} tid={testdata.tid}
                        shopId={testdata.shop_id} hasRefund={testdata.has_refund}
                        data = {testdata}
                        />
                    </View>
                )
            break;
            case '已发货':
                return (
                    <View style={styles.white_bk}>
                        <TradeReceiver data={testdata}/>
                        <PurchaseCard purchase={testdata.subOrderList}
                        tabStatus={status} shopName={testdata.shopName}
                        shopType={testdata.store_id} tid={testdata.tid}
                        shopId={testdata.shop_id} hasRefund={testdata.has_refund}
                        data = {testdata}
                        />
                        <OrderSource shopType={testdata.store_id} shopName={testdata.shopName} orderId={testdata.tid}/>
                        {
                            !IsEmpty(testdata.buyer_nick) ?
                            <TradeNick loginid={testdata.buyer_nick} text={testdata.buyer_nick} title={testdata.store_id=='wc'?'买家昵称':'买家旺旺'} />
                            :
                            null
                        }
                        {!IsEmpty(testdata.seller_memo)?(
                            <TradeSellerMemo ModifyMo={this.ModifyMo} text={testdata.seller_memo} clo={testdata.seller_flag}/>
                        ):(null)}
                        {!IsEmpty(cardData['buyerFeedback'])?(
                            <Remark remark={cardData['buyerFeedback']}/>
                        ):(null)}
                        {!IsEmpty(testdata.has_invoice) && testdata.has_invoice == '1'?(
                            <BillInfo data={testdata}/>
                        ):(null)}
                        <TradeProducts order={testdata} tapstate={status} datasource={cardData['productItems']} />
                        <CalMoney data={cardData['money']} products={cardData['productItems']}/>
                        <EasyPay data={testdata} money={cardData['money']} products={cardData['productItems']}/>
                        <TradeVouch data={testdata} tid={testdata.tid} status={status}/>
                        <View style={[styles.grey_view,{flex:1}]}/>
                    </View>
                )
            break;
            case '退款中':
                return (
                    <View style={styles.white_bk}>
                        <OrderSource shopType={testdata.store_id} shopName={testdata.shopName} orderId={testdata.tid}/>
                        {
                            !IsEmpty(testdata.buyer_nick) ?
                            <TradeNick loginid={testdata.buyer_nick} text={testdata.buyer_nick} title={testdata.store_id=='wc'?'买家昵称':'买家旺旺'} />
                            :
                            null
                        }
                        <TradeProducts showex={this.showex} order={testdata} tapstate={status} datasource={cardData['productItems']} />
                        <EasyPay rex={true} data={testdata} products={cardData['productItems']}/>
                        {IsEmpty(refundex)?(null):(
                            <RefundEx exdata={refundex} data={testdata} tid={testdata.tid} status={status}/>
                        )}
                        <TradeReceiver data={testdata}/>
                        {!IsEmpty(testdata.seller_memo)?(
                            <TradeSellerMemo ModifyMo={this.ModifyMo} text={testdata.seller_memo} clo={testdata.seller_flag}/>
                        ):(null)}
                        {!IsEmpty(cardData['buyerFeedback'])?(
                            <Remark remark={cardData['buyerFeedback']}/>
                        ):(null)}
                        {!IsEmpty(testdata.has_invoice) && testdata.has_invoice == '1'?(
                            <BillInfo data={testdata}/>
                        ):(null)}
                        <TradeVouch data={testdata} tid={testdata.tid} status={status}/>
                        <PurchaseCard purchase={testdata.subOrderList}
                        tabStatus={status} shopName={testdata.shopName}
                        shopType={testdata.store_id} tid={testdata.tid}
                        shopId={testdata.shop_id} hasRefund={testdata.has_refund}
                        data = {testdata}
                        />
                    </View>
                )
            break;
            case '已关闭':
                return (
                    <View style={styles.white_bk}>
                        <TradeReceiver data={testdata}/>
                        <OrderSource shopType={testdata.store_id} shopName={testdata.shopName} orderId={testdata.tid}/>
                        {
                            !IsEmpty(testdata.buyer_nick) ?
                            <TradeNick loginid={testdata.buyer_nick} text={testdata.buyer_nick} title={testdata.store_id=='wc'?'买家昵称':'买家旺旺'} />
                            :
                            null
                        }
                        {!IsEmpty(cardData['buyerFeedback'])?(
                            <Remark remark={cardData['buyerFeedback']}/>
                        ):(null)}
                        {!IsEmpty(testdata.seller_memo)?(
                            <TradeSellerMemo ModifyMo={this.ModifyMo} text={testdata.seller_memo} clo={testdata.seller_flag}/>
                        ):(null)}
                        <TradeProducts order={testdata} tapstate={status} datasource={cardData['productItems']} />
                        <CalMoney data={cardData['money']} products={cardData['productItems']}/>
                        <EasyPay data={testdata} money={cardData['money']} products={cardData['productItems']}/>
                        {!IsEmpty(testdata.has_invoice) && testdata.has_invoice == '1'?(
                            <BillInfo data={testdata}/>
                        ):(null)}
                        <TradeVouch data={testdata} tid={testdata.tid} status={status}/>
                        <PurchaseCard purchase={testdata.subOrderList}
                        tabStatus={status} shopName={testdata.shopName}
                        shopType={testdata.store_id} tid={testdata.tid}
                        shopId={testdata.shop_id} hasRefund={testdata.has_refund}
                        data = {testdata}
                        />
                    </View>
                )
            break;
            default: return (null);break;
        }

    }
}
