import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Image} from '@tarojs/components';
import { Toast,Portal} from '@ant-design/react-native';
import { FlatList , RefreshControl}  from 'react-native';
import Event from 'ay-event';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import styles from './styles';
import ItemIcon from '../../Component/ItemIcon';
import AiyongDialog from '../../Component/AiyongDialog';
import AyToast from '../../Component/AyToast';
import OrderCard from './OrderCard';
import SideDialog from './SideDialog';
import ChooseStatus from './ChooseStatus';
import Foot from './Foot';
import { GoToView } from '../../Public/Biz/GoToView.js';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 批量付款
 */
export default class BatchPay extends Component {
    constructor(props){
        super(props);
        this.state={
            dataSource:[], //所有品牌数据
            shopId:'-1',
            shopUrl:'',
            isRefreshing:false, //是否下拉刷新
            refreshText:'↓ 下拉刷新', //下拉刷新文字
            isLoading:false, //是否正在加载中
            headType:false,//搜索栏显示或全选栏显示
            chooseItem:[],//当前勾选产品集合
            showLoading:true,
            progress:-1,
        }
        this.pageNo = 1; //页码
        this.pageSize = 10; //页数
        this.chooseTotal = 0;//选择的产品数量
        this.chooseTotalBf = 0;
        this.chooseItems = []; //选择的商品
        this.totalPrice = 0.00;
        this.loading = '';
    }

    config = {
        navigationBarTitleText: '批量付款'
    }

    componentDidMount(){
        this.loading = Toast.loading('加载中...');
        this.getOrderList({pageNo:1},(result)=>{
            this.setState({
                ...result,
                showLoading:false
            });
        });
        
    }

    //获取订单列表
    getOrderList = (param,callback) => {
        let {dataSource} = this.state;
        if (this.state.shopId != '-1') {
            param.shopId = this.state.shopId;
        }
        if (IsEmpty(param.pageNo)) {
            param.pageNo = this.pageNo;
        }
        param.pageSize = this.pageSize;
        NetWork.Get({
            url:'Orderreturn/getWaitPayOrders',
            data:param
        },(rsp)=>{
            Portal.remove(this.loading);
            if (!IsEmpty(rsp)) {
                if (param.pageNo > 1) {
                    dataSource = this.state.dataSource.concat(rsp.result);
                } else {
                    dataSource = rsp.result;
                }
                if (callback) {
                    callback({
                        dataSource:dataSource,
                        totalRecord:rsp.totalRecord
                    });
                } else {
                    this.setState({
                        dataSource:dataSource,
                        totalRecord:rsp.totalRecord
                    });
                }
            }
        },(error)=>{
            Portal.remove(this.loading);
        });
    }

    //确认筛选
    submitFilter = (shopInfo) =>{
        this.loading = Toast.loading('加载中...');
        this.pageNo = 1;
        console.log('shopInfo',shopInfo);
        this.state.shopId = shopInfo.id;
        this.getOrderList({},(result)=>{
            this.setState({
                ...result,
                shopId:shopInfo.id,
                shopUrl:shopInfo.pic_url
            });
        });
    }

    //获取所有品牌
    renderRow = (items) =>{
        let isLastOne = false;
        let index = items.index;
        let item = items.item;
        return (
            <OrderCard
            order = {item} 
            chooseNum = {this.chooseNum}
            isLastOne = {isLastOne}
            headType = {this.state.headType}
            />
        );
    }

    goToPay = () =>{
        //获取支付宝支付链接
        NetWork.Post({
            url:"Distributeproxy/alipayUrlGet",
            data:{
                orderIdList:this.state.chooseItem
            }
        },(rsp)=>{
            console.log('alibaba.alipay.url.get',rsp);
            if (!IsEmpty(rsp.success) && (rsp.success == true || rsp.success == 'true')) {
                let url = rsp.payUrl;
                // let url = "https://trade.1688.com/order/cashier.htm?orderId=";
                // let orderIds = this.state.chooseItem.join(';');
                // url = url + orderIds;
                // UitlsRap.clipboard(url,(result)=>{
                //     Toast.info('链接已复制', 2);
                // });
                this.refs.surePayDialog.show();
                GoToView({status:url,page_status:'special'});
            } else {
                alert(rsp.erroMsg);
            }
        },(error)=>{
            console.log(error);
        });
    }

    //下拉刷新
    handleRefresh = () => {
        //显示加载中
        this.setState({
           isRefreshing: true,
           refreshText: '加载中...'
        });

        //获取第一页数据
        this.pageNo = 1;
        this.getOrderList({},(result)=>{
            this.setState({
                ...result,
                isRefreshing:false,
                refreshText:'↓ 下拉刷新'
            });
        });
        // if (this.state.dataSource.length>0) {
        //     this.refs.mylist.resetLoadmore();
        // }
    }

    //下拉刷新头部
    renderHeader = () =>{
        let text='';

        if (this.state.isRefreshing) {
            text=this.state.refreshText;
        } else {
            text='↓ 下拉刷新';
        }

        return (
            <RefreshControl
            style={styles.refresh}
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleRefresh}
            >
                <Text style={styles.loadingText}>{text}</Text>
            </RefreshControl>
        );
    }

    /* 底部文本 */
    renderFooter = () =>{
        if(this.state.isLoading){
            return(
                <View style={{width:px(750),height:px(74),flexDirection:'row',backgroundColor:'#f5f5f5',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color: '#cccccc',fontSize: px(24)}}>加载中...</Text>
                 </View>
            );
        }
    }

    /* 无限滚动 */
    onEndReached = () =>{
        this.setState({
            isLoading:true
        });
        this.pageNo++;
        let self = this;
        
        self.getOrderList({},(result)=>{
            this.setState({
                ...result,
                isLoading:false,
            });
        });
    }

    //空列表的内部
    renderNull = (items) =>{
        let index = items.index;
        let item = items.item;
        return (
            <View style={{flex:1}}>
                <View style={styles.midContent}>
                    <Image src='https://q.aiyongbao.com/1688/web/img/preview/orderNull.png'  style={{width:px(226),height:px(124)}}/>
                    <Text style={{fontSize:px(24),color:'#666',marginTop:px(40)}}>您还没有待付款的采购单</Text>
                    <Text style={{fontSize:px(28),color:'#3089DC',marginTop:px(24)}} onClick={()=>{
                        Event.emit('App.Simple',{activeKey:{key:'order'},state:'待采购'});
                        GoToView({page_status:'pop'});
                    }}>查看待确认的采购单</Text>
                </View>
            </View>
        );
    }

    //显示是否为批量操作状态
    showBatch = () => {
        this.setState({
            headType:true
        });
    }

    //Checkbox的选择操作
    chooseNum = (order,checked,callback) => {
        let arr = this.state.chooseItem; //当前选择项
        let allMessArr = this.chooseItems;
        if (checked && this.chooseTotal >= 10) {
            Toast.info('一次最多只可选择10笔订单', 2);
            callback(this.chooseTotal,false);
            return ;
        }
        //判断当前勾选状态，选中则添加到数组中，取消则移除
        if (checked) {
            this.chooseTotal++;
            arr.push(order.tid);
            allMessArr.push(order);
            this.totalPrice = parseFloat(this.totalPrice) + parseFloat(order.payment);
        }else {
            this.chooseTotal--;
            arr = [];
            allMessArr = [];
            this.state.chooseItem.map((item,key)=>{
                if (item!=order.tid) {
                    arr.push(item);
                }
            });
            this.chooseItems.map((item,key)=>{
                if (item.tid!=order.tid) {
                    allMessArr.push(item);
                }
            });
            this.totalPrice = parseFloat(this.totalPrice) - parseFloat(order.payment);
        }

        console.log('totalPrice',this.totalPrice);
        
        this.totalPrice = this.totalPrice.toFixed(2);
        //改变但是不触发渲染
       
        this.state.chooseItem = arr;
        this.chooseItems = allMessArr;
        //需要触发setState更新的数据
        if(!this.state.headType){
            this.setState({
                headType:true
            });
        }
        this.refs.ChooseStatus.setState({
            chooseNum:this.chooseTotal
        });
        this.refs.footButton.setState({
            totalPrice:this.totalPrice
        });

        if (callback) {
            callback(this.chooseTotal,true);
        }
    }


    //取消批量操作状态
    cancelBatch = () =>{
        //重置数据
        this.chooseTotal = 0;
        this.totalPrice = 0.00;
        this.chooseItems = [];
        this.setState({
            chooseItem:[],
            headType:false
        });
    }

    //更新1688订单
    updateOrder = () =>{
        let {chooseItem} = this.state;
        this.refs.successToast.show();
        this.refs.surePayDialog.hide();
        this.chooseTotalBf = this.chooseTotal;
        this.setState({
            progress:0
        });
        this.updateOrderOne(chooseItem,0,'',(msg)=>{
            //结束
            this.pageNo = 1;
            this.chooseTotal = 0;
            this.totalPrice = 0.00;
            this.chooseItems = [];
            Toast.info(msg, 2);
            this.refs.successToast.hide();
            this.getOrderList({},(result)=>{
                this.setState({
                    ...result,
                    chooseItem:[],
                    headType:false,
                    progress:-1
                });
                this.chooseTotalBf = 0;
            });
        });
    }

    updateOrderOne = (chooseItem,index,result,callback) =>{
        if (index < chooseItem.length) {
            NetWork.Get({
                url:'Orderreturn/batchUpdateOrder',
                data:{
                    lastPayOrders:chooseItem[index],
                    shopId:this.state.shopId
                }
            },(rsp)=>{
                console.log('Orderreturn/batchUpdateOrder',rsp);
                //有结果
                index = index + 1;
                result = rsp.msg;
                this.setState({
                    progress:index
                });
                this.updateOrderOne(chooseItem,index,result,callback);
            },(error)=>{
                console.error(error);
            });
        } else {
            callback(result);
        }
       
    }

    render(){
        let {dataSource,shopUrl,headType,showLoading,progress} = this.state;
        let content = null;
        console.log('shop_pic',shopUrl);
        console.log('headType------------BatchPay',headType);
        
        if (showLoading) {
            content = null;
        } else {
            if (IsEmpty(dataSource)) {
                content =
                <FlatList
                ref="mylist"
                style={{flex:1}}
                data={['null']}
                horizontal={false}
                renderItem={this.renderNull}
                refreshing={this.state.isRefreshing}
                onRefresh={()=>{this.handleRefresh()}}
                keyExtractor={(item, index) => (index + '1')}
                />;
            } else {
                content =
                <FlatList
                ref="mylist"
                style={{flex:1,backgroundColor:'#f5f5f5'}}
                data={dataSource}
                horizontal={false}
                renderItem={this.renderRow}
                refreshing={this.state.isRefreshing}
                onRefresh={()=>{this.handleRefresh()}}
                onEndReached={()=>{this.onEndReached()}}
                onEndReachedThreshold={300}
                keyExtractor={(item, index) => (index + '1')}
                />;
            }
        }

        let headSelect = null;
        let footButton = null;

        //批量状态的头部
        if (headType) {
            let length=this.chooseTotal;
            headSelect=
            <ChooseStatus
            ref="ChooseStatus"
            cancelBatch={this.cancelBatch}
            chooseNum={length}
            />;
            footButton=(<Foot ref="footButton" totalPrice={this.totalPrice} goToPay = {this.goToPay}/>);
        }else {
            headSelect= (
            <View style={styles.selectView}>
                <View style={styles.selectLeft}>
                    <View style={styles.tabBox}>
                        <Text style={styles.tabText}>待付款采购单</Text>
                    </View>
                </View>
                <View style={styles.arrowDown} onClick={()=>{this.refs.slideDialog.show()}}>
                {
                    !IsEmpty(shopUrl) ?
                    <Image src={shopUrl}
                    style={{width:px(60),height:px(60)}}
                    onClick={()=>{this.refs.slideDialog.show()}}
                    />
                    :
                    <ItemIcon onClick={()=>{this.refs.slideDialog.show()}}
                    iconStyle={{color:'#ff6000',fontSize:px(32)}}
                    code={"\ue6f1"}
                    />
                }
                </View>
            </View>);
           
        }

        return (
            <View>
                <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                    {headSelect}
                    {content}
                    {footButton}
                </View>
                <SideDialog
                ref='slideDialog'
                submitFilter={this.submitFilter}
                ></SideDialog>
                <AiyongDialog
                ref={"surePayDialog"}
                maskClosable={true}
                title={"是否完成支付"}
                cancelText={"支付遇到问题"}
                okText={"支付完成"}
                content={"请根据付款情况点击下面按钮"}
                onSubmit={this.updateOrder}
                onCancel={this.updateOrder}
                onHide={this.updateOrder}
                />
                <Toast
                ref='successToast'
                type='warning'
                content={'订单更新中，请务关闭当前页面，正在处理 ' + progress + ' / ' + this.chooseTotal}
                ></Toast>
            </View>
        );
    }
}

