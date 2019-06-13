import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import { FlatList , RefreshControl}  from 'react-native';
import Event from 'ay-event';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import Foot from './Foot';
import TidCard from './TidCard';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import AiyongDialog from '../../Component/AiyongDialog';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import styles from './styles.js';
import px from '../../Biz/px.js';
const types=['待采购','待发货','已发货','已成功','退款中','已关闭'];
const reTypes={
    refundsuccess:{txt:'已退款',color:'rgba(139,87,42,0.5)'},
    refundclose:{txt:'已退款',color:'rgba(139,87,42,0.5)'},
};
/*
* @author cy
* 订单详情
*/
export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type : '',
            desc : '',
            time : 0,
            cardData : [],
            tiddata:[], //订单信息
            showRe:'',//处理退款
            isRefreshing: false,
            refreshText: '↓ 下拉刷新',
            updateMsg:{}
        };
        this.loading = '';
        let self = this;

        //刷新1688订单
        Event.on('App.pay_update_order_1688',(data)=>{
            self.setState({updateMsg:data});
            self.refs.surePayDialog.show();
        });

        //重新加载
        Event.on('App.redetail',(data)=>{
            self.redetail();
        });
    }

    config = {
        navigationBarTitleText: '订单详情'
    }

    componentDidMount(){
        let self = this;
        let orderId = GetQueryString({name:'orderId',self:this});
        // RAP.biz.getIdentity().then((data)=> {
        //     let jflag = data.isBuyer;
        //     if(jflag){
        //         let fourls = RAP.biz.getBizInfoUrl('orderDetail',{'orderId':orderId,'sys_page':1});
        //         RAP.navigator.push({url:fourls,clearTop:true});
        //     }else{
                self.redetail();
        //     }
        // });
    }

    //下拉刷新
    handleRefresh = () =>{
        let self = this;
        self.setState({
            isRefreshing: true,
            refreshText: '加载中',
        });
        let refresh=()=>{
            self.setState({
                isRefreshing: false,
                refreshText: '↓ 下拉刷新',
            });
        }
        self.redetail(refresh);
    }


    //加载订单详情
    redetail = (callback) =>{
        let self = this;
        self.loading = Toast.loading('加载中...');
        let orderId = GetQueryString({name:'orderId',self:this});
        let refundFlag = GetQueryString({name:'refundId',self:this});
        let shopType = GetQueryString({name:'shopType',self:this});

        //获取订单详情

        NetWork.Get({
            url:'Orderreturn/getOneOrder',
            data:{
                tid:orderId,
                shopType:shopType
            }
        },(data)=>{
            console.log('Orderreturn/getOrderList',data);
            Portal.remove(self.loading);
            if(!IsEmpty(data.errorCode)||IsEmpty(data)){
                alert(data.errorMessage)
                return;
            }
            if(IsEmpty(data.has_refund) || data.has_refund == '0'){
                let status= types[data.aiyong_status];
                let cardData = self.packData(data);
                self.calTime(status,data);
                self.setState({cardData:cardData,tiddata:data});
            }else{
                if(data.aiyong_status == '5'){
                    let status= types[data.aiyong_status];
                    let cardData = self.packData(data);
                    self.calTime(status,data);
                    self.setState({cardData:cardData,tiddata:data});
                } else {
                    let status='退款中';
                    let cardData = self.packData(data);
                    self.calTime(status,data);
                    self.setState({cardData:cardData,tiddata:data});

                }
            }
            if(callback){
                callback();
            }
        },(error)=>{
            if(callback){
                callback();
            }
            console.error(error);
        });
    }

    //打包数据，不直接用原始数据为了减少判断逻辑
    packData = (testdata) =>{
        let self = this;
        let cardData={};
        cardData['buyerContact'] = {

        };//买家信息
        cardData['sellerContact'] = {

        };//卖家信息
        cardData['buyerFeedback'] = '';//买家留言
        cardData['productItems'] = testdata.orders;//商品信息
        cardData['money'] = [];//钱相关
        cardData['money']['shippingFee'] = testdata.post_fee;//运费
        cardData['money']['totalAmount'] = testdata.total_fee;//明细总金额
        cardData['money']['sumProductPayment'] = testdata.payment;//产品总金额
        cardData['money']['discount'] = testdata.discount_fee;//折扣信息
        return cardData;
    }
    //signinsuccess:买家已签收;confirm_goods:已收货;success:交易成功;cancel:交易取消;terminated:交易终止;

    //获取订单时间
    calTime = (status,testdata) =>{
        console.log('-------calTime-------',status);
        let self = this;
        let time;
        let disDate;
        let type;
        switch(status){
            case '退款中':
                type = types[testdata.aiyong_status]; //需要申请退款时间
                // if(type == '已发货'){
                //
                // }else if(type == '待发货'){
                //
                // }
                self.setState({type:status,time:''})
            break;
            case '待采购':
                time = testdata.created.split('+');
                // disDate = self.formatTime(time[0],'1',3);
                self.setState({type:status,time:disDate+'后自动关闭'})
            break;
            case '待发货':
                time = testdata.pay_time.split('+');
                // disDate = self.formatTime(time[0],'0',0);
                self.setState({type:status,time:'已付款'+disDate})
            break;
            case '已发货':
                time = testdata.consign_time.split('-');
                // disDate = self.formatTime(time[0],'1',15);
                self.setState({type:status,time:disDate+'后自动确认收货'})
            break;
            case '已成功':
                type = '已成功';
                disDate = '双方已评';
                let rateF = 0;//计算评价
                let rateE = 0;
                if(testdata.buyer_rate == '1'){//买家未评价receivingTime
                    type = '已成功';
                    disDate = '买家未评' ;
                    rateF++;
                }
                if(testdata.seller_rate == '1'){//卖家未评价 买家已评（或双方未评）
                    type =rateF==1?'双方未评':'买家已评';
                    time = testdata.rate_time.split('+');
                    // disDate = self.formatTime(time[0],'1',15);
                    rateE++;
                }
                self.setState({type:type,time:rateE==0?disDate:disDate+'后默认好评'})
            break;
            case '已关闭':
                type = '已关闭';
                self.setState({type:status});
                break;
            default:
            break;
        }
    }
    //显示
    showex = (TQID) => {
        this.setState({showRe:TQID});
    }

    //显示时间
    formatTime = (time,state,day) =>{
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

    //刷新1688订单
    updateOrder1688 = () =>{
        this.loading = Toast.loading('加载中...');
        NetWork.Get({
            url:'Orderreturn/updateOrder1688',
            data:{
                orderId:this.state.updateMsg.tid,
                shopId:this.state.updateMsg.shopId,
                taoTid:this.state.updateMsg.taoTid,
                shopName:this.state.updateMsg.shopName,
                shopType:this.state.updateMsg.shopType
            }
        },(rsp)=>{
            console.log('Orderreturn/updateOrder1688',rsp);
            //有结果
            Portal.remove(this.loading);
            if (!IsEmpty(rsp)) {
                if (this.state.updateMsg.updateOrderStatus == '付款采购' || this.state.updateMsg.updateOrderStatus == '向供应商付款') {
                    if (rsp.status != 'waitbuyerpay') {
                        Toast.info('支付成功', 2);
                    } else {
                        Toast.info('支付失败', 2);
                    }
                }
                this.redetail();
                Event.emit('App.update_shop_orders',{});
            } else {
                Toast.info('操作失败', 2);
            }
            this.refs.surePayDialog.hide();
        },(error)=>{
            Portal.remove(this.loading);
            console.error(error);
        });
    }

    //渲染头部的下拉刷新
    renderHeader = () =>{
        return (
            <RefreshControl refreshing={this.state.isRefreshing} style={styles.itemRefresh} onRefresh={this.handleRefresh}>
                <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.state.refreshText}</Text>
            </RefreshControl>
        );
    }

    //渲染头部
    renderRow = () =>{
        const { time,cardData,tiddata,type,showRe } = this.state;
        if (IsEmpty(this.state.tiddata)) {
            return (
                <View style={styles.head}>
                    <Text style={[styles.headText,{fontSize:px(40)}]}>请稍等</Text>
                    <Text style={[styles.headText,{marginTop:px(12),fontSize:px(30)}]}>请稍等</Text>
                </View>
            );
        } else {
            return (
                <View style={{flex:1}}>
                    {type=='退款中'?(
                        <View style={styles.head}>
                            <View style={styles.line_view}>
                            <Text style={[styles.headText,{fontSize:px(32)}]}>{ type }</Text>
                            <Text style={[styles.headText,{marginLeft:px(15),fontSize:px(28)}]}>等待卖家确认退款协议</Text>
                            </View>

                        </View>
                    ):(
                        <View style={styles.head}>
                            <Text style={[styles.headText,{fontSize:px(32)}]}>{ type }</Text>
                        </View>
                    )}

                    <TidCard showex={this.showex}
                    testdata={tiddata} cardData={cardData}
                    status={ type }
                    />
                </View>
            );
        }
    }

    render() {
        const { time,cardData,tiddata,type,showRe } = this.state;
        let allpay = '';
        if(IsEmpty(tiddata)){
            return null;
        }else{
            return (
                <View>
                    <View style={{flex:1}}>
                        <FlatList
                        style={styles.vescro}
                        data={['null']}
                        horizontal={false}
                        renderItem={this.renderRow}
                        refreshing={this.state.isRefreshing}
                        onRefresh={()=>{this.handleRefresh()}}
                        keyExtractor={(item, index) => (index + '1')}
                        />
                        {type=='退款中'?(
                            <View>
                                {IsEmpty(showRe)?(null):(
                                    <Foot data={tiddata} TQ={showRe} status={type}/>
                                )}
                            </View>
                        ):(
                            <View>
                                {allpay}
                                <Foot data={tiddata} status={type}/>
                            </View>
                        )}
                    </View>
                    <AiyongDialog
                    ref={"surePayDialog"}
                    cancelText={"遇到问题"}
                    okText={"完成操作"}
                    content={"操作完成后，请根据情况点击下面按钮"}
                    onSubmit={this.updateOrder1688}
                    onCancel={()=>{UitlsRap.openChat('爱用科技1688')}}
                    maskClosable={true}
                    onHide={this.updateOrder1688}
                    />
                </View>
            );
        }

    }
}
/**
  交易状态，waitbuyerpay:等待买家付款;
  waitsellersend:等待卖家发货;
  waitlogisticstakein:等待物流公司揽件;
  waitbuyerreceive:等待买家收货;
  waitbuyersign:等待买家签收;
  signinsuccess:买家已签收;
  confirm_goods:已收货;
  success:交易成功;
  cancel:交易取消;
  terminated:交易终止;
  未枚举:其他状态
    <Text style={[styles.headText,{marginTop:px(12),fontSize:px(30)}]}>{`${time}`}</Text>
    <Text style={[styles.headText,{marginTop:px(12),fontSize:px(30)}]}>{`${time}`}</Text>//时间注释
  */
