
import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text,Image} from '@tarojs/components';
import Event from 'ay-event';
import OrderStatus from './OrderStatus';
import OrderCard from './OrderCard';
import NoList from './NoList';
import Header from './Header';
import AiyongDialog from '../../Component/AiyongDialog';
import SureDialog from '../../Component/SureDialog';
import SideDialog from './SideDialog';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import styles from './styles.js';
import { LocalStore } from '../../Public/Biz/LocalStore';
import { Parse2json } from '../../Public/Biz/Parse2json';
import {DoBeacon} from '../../Public/Biz/DoBeacon';
import { GoToView } from '../../Public/Biz/GoToView';
import px from '../../Biz/px.js';

/**
* @author cy
* 订单列表
**/
export default class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],//列表参数
            total:0,//当前tab总数
            tabStatus:'待采购',//订单状态
            bonepng:true, //显示占位图
            isRefreshing: false, //是否下拉刷新
            refreshText: '↓ 下拉刷新',
            loadmore: false, //是否显示加载更多
            keyWord:'', //关键字
            shopType:'taobao', //当前店铺类型
            shopList:[], //店铺列表
            lastPayOrders:[],//暂时只有一个，不是数组，跳转详情页之后进行数据更新
            lastShopId:'', //当前店铺的id
            lastShopName:'', //当前店铺的名字
            lastTaoTid:'', //当前需要操作的订单id
            updateOrderStatus:'', //更新1688订单的类型，支付、取消等
            choseshopid:'',
            dialogMsg:{},
            authType:''
        };

        this.pageNo = 1; //页码
        this.pageSize = 10; //页数
        this.retry = 0;
        this.authorizationLink = '';
        this.closetid = '';
        this.userNick = '';
        this.checktid = '';
        this.lastSendTid = '';

        let self = this;
        //打开聊天
        Event.on('App.openwc',(data)=>{
            // UitlsRap.openChat(data);
        });
        //复制内容
        Event.on('App.trclbd',(data)=>{
            UitlsRap.clipboard(data.msg,(result)=>{
                if(data.cal){
                    Taro.showToast({
                        title: data.cal,
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        });
        //更新支付订单
        Event.on('App.update_lastPayOrders',(data)=>{
            self.setState({
                lastPayOrders:data.lastPayOrders,
                lastTaoTid:data.lastTaoTid,
                lastShopId:data.lastShopId,
                lastShopName:data.lastShopName,
                updateOrderStatus:data.updateOrderStatus
            });
            self.refs.surePayDialog.show();
        });
        //刷新订单列表
        Event.on('App.update_shop_orders',(data)=>{
            Taro.showLoading({ title: '加载中...' });
            self.getTradeList(1,{},(result)=>{
                self.setState({
                    dataSource:result,
                    bonepng:false
                });
                Taro.hideLoading();
            });
        });
        //进入页面带参，修改当前状态
        this.catchflag = true;
        Event.on('App.getcon2',(data)=>{
            self.state.choseshopid = '';
            this.catchflag = false;
            if(IsEmpty(data)){
                self.changeStatus('待采购');
            }else{
                LocalStore.Remove(['tradecon']);
                self.changeStatus(data.split(',')[0]);
                self.state.choseshopid = data.split(',')[1];
                if(!IsEmpty(self.state.choseshopid)){
                    self.submitFilter('',self.state.choseshopid);
                }
            }
        });
        //打开关闭订单弹窗
        Event.on('App.opencloseorder',(data)=>{
            this.closetid = data.tid;
            this.refs.closeorderone.show();
        });
        //隐藏关闭订单弹窗
        Event.on('App.hidecloseorder',(data)=>{
            this.refs.closeorderone.hide();
        });
        //打开确认收款弹窗
        Event.on('App.opencheckorder',(data)=>{
            this.checktid = data.tid;
            this.refs.checkorderone.show();
        });
        //隐藏确认收款弹窗
        Event.on('App.hidecheckorder',(data)=>{
            this.refs.checkorderone.hide();
        });
        //授权成功告知用户正在同步订单
        Event.on('App.reSynOrders',(data)=>{
            this.handleRefresh();
        });

        Event.on('App.showReAuthDialog',(data)=>{
            this.setState({
                dialogMsg:data
            });
            //弹出确认弹窗
            this.refs.reAuthTrade.show();
        });
        Event.on('App.choose_send_tid',(data)=>{
            this.lastSendTid = data.tid;
            this.sureAccess('sendGoods',false);
        });

        if(this.catchflag){
            LocalStore.Get(['tradecon'],(result) => {
                if(!IsEmpty(result)){
                    LocalStore.Remove(['tradecon']);
                    let str = Parse2json(result['tradecon']);
                    console.log('tradecon',str);
                    self.changeStatus(str.split(',')[0]);
                    self.state.choseshopid = str.split(',')[1];
                    if(!IsEmpty(self.state.choseshopid)){
                        self.submitFilter('',self.state.choseshopid);
                    }
                }else{
                    self.changeStatus('待采购');
                }

            })
        }//初始化时获取列表备用
    }

    // config: Config = {
    //     navigationBarTitleText: '订单'
    // }

    componentDidMount(){
        let self = this;
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     console.log('getUserInfo',info);
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.userNick = info.extraInfo.result.loginId;
        //     } else {
        //         self.userNick = info.nick;
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // });
        self.loadData();
    }

    //初始化数据
    loadData = () =>{
        let self = this;
        Taro.showLoading({ title: '加载中...' });
        //获取店铺列表
        self.getShopLists((shopList)=>{
            let lastShopId = '';
            let shopType = 'taobao';
            let lastShopName = '';
            if (!IsEmpty(shopList)) {
                lastShopId = shopList[0].id;
                shopType = shopList[0].shop_type;
                lastShopName = shopList[0].shop_name;
                //是否有需要默认选中的店铺
                if (this.state.choseshopid != '') {
                    shopList.map((item,key)=>{
                        if (this.state.choseshopid == item.id) {
                            lastShopId = item.id;
                            shopType = item.shop_type;
                            lastShopName = item.shop_name;
                        }
                    });
                }
                let params = {
                    shopId:lastShopId,
                    shopType:shopType,
                    shopName:lastShopName
                };
                //获取订单列表
                self.getTradeList(1,params,(result)=>{
                    self.setState({
                        lastShopName:lastShopName,
                        lastShopId:lastShopId,
                        shopType:shopType,
                        shopList:shopList,
                        dataSource:result,
                        bonepng:false,
                        isRefreshing: false,
                        refreshText: '↓ 下拉刷新'
                    });
                    Taro.hideLoading();
                });
            } else {
                self.setState({
                    bonepng:false,
                    isRefreshing: false,
                    refreshText: '↓ 下拉刷新'
                });
                Taro.hideLoading();
            }
        });
    }

    //获取店铺列表
    getShopLists = (callback) =>{
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{}
        },(rsp)=>{
            console.log('Distributeproxy/getProxyShopInfo',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                callback(rsp.result);
            } else {
                callback([]);
            }
        },(error)=>{
            callback([]);
            alert(JSON.stringify(error));
        });
    }

    //切换状态并显示列表
    showList = (tabStatus) =>{
        //获取不同状态的列表
        if (this.state.tabStatus != tabStatus) {
            Taro.showLoading({ title: '加载中...' });
            this.setState({
                total:0,
                tabStatus:tabStatus,
                bonepng:true
            });
            this.getTradeList(1,{},(result)=>{
                this.setState({
                    dataSource:result,
                    bonepng:false
                });
                Taro.hideLoading();
            });
        }
    }

    //获取订单列表
    getTradeList = (pageNo,params,callback) =>{
        this.pageNo = pageNo;
        if (IsEmpty(params.shopType)) {
            params.shopType = this.state.shopType;
        }
        if (IsEmpty(params.shopId)) {
            params.shopId = this.state.lastShopId;
        }
        if (IsEmpty(params.shopName)) {
            params.shopName = this.state.lastShopName;
        }

        if (!IsEmpty(this.state.keyWord)) {
            params.keyWord = this.state.keyWord;
        }
        params.pageNo = this.pageNo;
        params.pageSize = this.pageSize;

        switch (this.state.tabStatus) {
            case '待采购':{
                params.orderStatus = '0';
            } break;
            case '待发货':{
                params.orderStatus = '1';
            } break;
            case '已发货':{
                params.orderStatus = '2';
            } break;
            case '已成功':{
                params.orderStatus = '3';
            } break;
            case '退款中':{
                params.orderStatus = '4';
            } break;
            case '已关闭':{
                params.orderStatus = '5';
            } break;
            default: break;
        }
        NetWork.Get({
            url:'Orderreturn/getOrderList',
            data:params
        },(rsp)=>{
            console.log('Orderreturn/getOrderList',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                this.state.total = rsp.totalRecord;
                callback(rsp.result);
            }
        },(error)=>{
            callback([]);
            alert(JSON.stringify(error));
        });
    }

    //点击订单状态tab的回调
    changeStatus = (status) =>{
        this.pageNo = 1;
        this.showList(status);
    }
    //确定关闭订单
    closeok =()=>{
        const self = this;
        NetWork.Get({
            url:'Orderreturn/closeOrder',
            params:{
                orderId:self.closetid,
                shopType:'wc',
            }
        },(res)=>{
            if(res.code==200){
                Taro.showToast({
                    title: '关闭成功',
                    icon: 'none',
                    duration: 2000
                });
                Event.emit('App.hidecloseorder');
                self.getTradeList(1,{},(result)=>{
                    self.setState({
                        dataSource:result,
                    });
                });
            }else{
                Taro.showToast({
                    title: '关闭失败',
                    icon: 'none',
                    duration: 2000
                });
                Event.emit('App.hidecloseorder');
            }
        });

    }

    //下拉刷新 同步订单
    handleRefresh = () => {
        let self = this;
        let {lastShopId,lastShopName,shopType,shopList} = this.state;
        self.setState({
            isRefreshing: true,
            refreshText: '订单同步中...'
        });
        if (IsEmpty(shopList)) {
            self.loadData();
            return;
        }

        // self.getTradeList(1,{},(result)=>{
        //     self.setState({
        //         dataSource:result,
        //         isRefreshing: false,
        //         refreshText: '↓ 下拉刷新'
        //     });
        // });
        let orderStatus = '0';
        switch (self.state.tabStatus) {
            case '待采购':{orderStatus = '0';} break;
            case '待发货':{orderStatus = '1';} break;
            case '已发货':{orderStatus = '2';} break;
            case '已成功':{orderStatus = '3';} break;
            case '退款中':{orderStatus = '4';} break;
            case '已关闭':{orderStatus = '5';} break;
            default: break;
        }
        NetWork.Get({
            url:'Orderreturn/synchroOrders',
            data:{
                shopName:lastShopName,
	            shopType:shopType,
                shopId:lastShopId,
                orderStatus:orderStatus
            }
        },(rsp)=>{
            console.log('Orderreturn/synchroOrders',rsp);
            //有结果
            if (!IsEmpty(rsp.code)) {
                if (rsp.code == '200') {
                    //定时器  获取订单同步状态
                    self.interval = setInterval(() => {
                        NetWork.Get({
                            url:'Orderreturn/getProgress',
                            data:{
                                shopId:lastShopId,
                                orderStatus:orderStatus
                            }
                        },(rsp)=>{
                            console.log('Orderreturn/getProgress',rsp);
                            if (!IsEmpty(rsp.isend)) {
                                if (rsp.isend == 'true' || rsp.isend == true) {
                                    clearInterval(self.interval);
                                    self.getTradeList(1,{},(result)=>{
                                        self.setState({
                                            dataSource:result,
                                            isRefreshing: false,
                                            refreshText: '↓ 下拉刷新'
                                        });
                                        self.refs.orderHead.loadData();
                                        Taro.hideLoading();
                                    });
                                }
                            } else {
                                Taro.showToast({
                                    title: '同步出错啦，请稍候重试哦',
                                    icon: 'none',
                                    duration: 2000
                                });
                                Taro.hideLoading();
                                clearInterval(self.interval);
                            }
                        },(error)=>{
                            console.log(JSON.stringify(error));
                            Taro.hideLoading();
                        });
                    },3000);
                } else if (rsp.code == '500') {
                    Taro.hideLoading();
                    self.setState({
                        isRefreshing: false,
                        refreshText: '↓ 下拉刷新'
                    });
                    if (rsp.from == 'distributor') {
                        // RAP.sso.goAuth(8869440);
                    } else {
                        self.sureAccess('handleRefresh');
                    }
                }
            } else {
                Taro.showToast({
                    title: '同步出错啦，请稍候重试哦',
                    icon: 'none',
                    duration: 2000
                });
                Taro.hideLoading();
            }
        },(error)=>{
            alert(JSON.stringify(error));
        });
    }

    //渲染头部的下拉刷新
    renderHeader = () => {
        return (
            <RefreshControl refreshing={this.state.isRefreshing} style={styles.itemRefresh} onRefresh={this.handleRefresh}>
                <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.state.refreshText}</Text>
            </RefreshControl>
        );
    }

    //渲染底部的加载更多
    renderFooter = () => {
        return this.state.loadmore ? (
                <View style={styles.loadmore_view}>
                    <Text style={styles.loadmore_text}>加载更多</Text>
                </View>
            ):(null)
    }

    //获取下一页数据
    getMore = () => {
        if(this.state.total == this.state.dataSource.length || this.state.dataSource.length == 0 || this.state.dataSource.length<5){
            return;
        } //如果数据比20个小就不加载下一页
        let self = this;
        self.pageNo++;
        self.setState({loadmore:true});
        self.getTradeList(self.pageNo,{},(result)=>{
            self.setState({
                dataSource:self.state.dataSource.concat(result),
                loadmore: false
            });
            self.refs.vscroller.resetLoadmore();
        });
    }
    //渲染订单卡片
    renderItem = (order,index) => {
        const {tabStatus,shopType} = this.state;
        return (
            <OrderCard
            key = {index}
            tabStatus = {tabStatus}
            index = {index}
            order = {order}
            shopType = {shopType}
            sendGood = {this.sendGood}
            />
        );
    }
    //确认筛选
    submitFilter = (keyWord,shopId) =>{
        this.state.choseshopid = shopId;
        Taro.showLoading({ title: '加载中...' });
        let params = {};
        if (!IsEmpty(keyWord)) {
            params.keyWord = keyWord;
        }

        if (!IsEmpty(shopId)) {
            this.state.shopList.map((subShop,idx)=>{
                if (shopId == subShop.id) {
                    params.shopType = subShop.shop_type;
                    params.shopId = subShop.id;
                    params.shopName = subShop.shop_name;
                }
            });
        }
        this.getTradeList(1,params,(result)=>{
            this.setState({
                dataSource: result,
                loadmore: false,
                keyWord: keyWord,
                shopType: params.shopType,
                lastShopId:params.shopId,
                lastShopName:params.shopName,
            });
            Taro.hideLoading();
        });
    }
    //删除关键字
    deleteSubjectKey = () =>{
        this.setState({
            keyWord: ''
        });
    }
    //重置筛选条件
    reset = () =>{
        this.setState({
            keyWord: '',
            shopType: ''
        });
    }

    //更新1688订单
    updateOrder = () =>{
        const {lastPayOrders,lastShopId,lastTaoTid,shopType,lastShopName,updateOrderStatus} = this.state;
        Taro.showLoading({ title: '加载中...' });
        NetWork.Get({
            url:'Orderreturn/updateOrder1688',
            data:{
                orderId:lastPayOrders,
                shopId:lastShopId,
                taoTid:lastTaoTid,
                shopName:lastShopName,
                shopType:shopType
            }
        },(rsp)=>{
            console.log('Orderreturn/updateOrder1688',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                if (updateOrderStatus == '向供应商付款'){
                    if (rsp.status != 'waitbuyerpay') {
                        Taro.showToast({
                            title: '支付成功',
                            icon: 'none',
                            duration: 2000
                        });
                    } else {
                        Taro.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
                this.loadData();
            }
            Taro.hideLoading();
            this.refs.surePayDialog.hide();
        },(error)=>{
            callback([]);
            alert(JSON.stringify(error));
        });

    }
    //点击筛选按钮
    clickfiter = ()=>{
        DoBeacon('TD20181012161059','orderlist_btnfilter',this.userNick);
        this.refs.slideDialog.show()
    }

    //授权操作
    sureAccess = (from,isDialog) =>{
        let self = this;
        let {lastShopId,lastShopName,shopType} = self.state;
        let params = {
            shopType:shopType,
            shopId:lastShopId,
            shopName:lastShopName
        };

        if (isDialog) {
            self.refs.sureDialog.hide();
        }

        if (this.retry <= 3) {
            this.retry++;
            NetWork.Get({
                url:'Distributeproxy/proxyGetAiyongAuthorization',
                data:params
            },(rsp)=>{
                console.log('Distributeproxy/proxyGetAiyongAuthorization',rsp);
                //有授权 添加店铺
                if (!IsEmpty(rsp)) {
                    if(rsp.code=='200'){
                        //完成后获取
                        if (from == 'handleRefresh') {
                            self.handleRefresh();
                        } else if (from == 'sendGoods'){
                            //发货
                            self.sendGood();
                        }
                    } else if (rsp.code == '404') {
                        self.refs.sureDialog.show();
                        self.authorizationLink = rsp;
                        GoToView({status:rsp.authorLink,page_status:'special'});
                    }
                }
            },(error)=>{
                alert(JSON.stringify(error));
            });
        } else {
            this.retry = 0;
        }
    }

    //弹窗确认操作
    submitSend = () =>{
        let { lastShopId } = this.state;
        if (this.state.dialogMsg.title == '开启自动发货') {
            //打开交易授权链接
            this.getAuthTrade(lastShopId,(res)=>{
                this.setState({
                    authType:res.msg,
                    dialogMsg:{
                        'title':'是否完成授权？',
                        'cancelText':'遇到问题',
                        'okText':'完成授权',
                        'content':'授权完成后，请根据情况点击下面按钮'
                    }
                });
                if (res.code == 500) {
                    let title = '授权爱用交易';
                    if (res.msg = 'hasNoOrder') {
                        title = '订购爱用交易';
                    }
                    this.goToLink(res.url,title);
                } else {
                    this.refs.reAuthTrade.hide();
                    Taro.showToast({
                        title: '授权成功,正在同步订单，请稍候~',
                        icon: 'none',
                        duration: 2000
                    });
                    //同步下订单
                    Taro.showLoading({ title: '加载中...' });
                    Event.emit('App.reSynOrders',{});
                }
            });

        } else if (this.state.dialogMsg.title == '是否完成授权？') {
            //判断下是否有爱用交易授权
            this.refs.reAuthTrade.hide();
            this.getAuthTrade(lastShopId,(res)=>{
                if (res.code == 200) {
                    this.refs.reAuthTrade.hide();
                    Taro.showToast({
                        title: '授权成功,正在同步订单，请稍候~',
                        icon: 'none',
                        duration: 2000
                    });
                    //同步下订单
                    Taro.showLoading({ title: '加载中...' });
                    Event.emit('App.reSynOrders',{});
                } else {
                    if (this.state.authType == "hasNoOrder" && res.msg == "hasNoAuth") {
                        this.setState({
                            authType:"hasNoAuth"
                        });
                        this.goToLink(res.url,"授权爱用交易");
                    } else {
                        this.refs.reAuthTrade.hide();
                        Taro.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        }

    }

    goToLink = (url,title) =>{
        GoToView({status:url,page_status:'special'});
    }

    //取消操作
    cancelSend = () =>{
        this.refs.reAuthTrade.hide();
        if (this.state.dialogMsg.title == '开启自动发货') {
        } else if (this.state.dialogMsg.title == '是否完成授权？') {
            UitlsRap.sendMessage({
                loginid:'爱用科技1688',
                message:'爱用交易授权失败'
            });
            UitlsRap.openChat('爱用科技1688');
        }
    }

    //判断是否有爱用交易授权
    getAuthTrade = (shopId,callback) =>{
        NetWork.Get({
            url:'Orderreturn/authorTrade',
            params:{shopId}
        },(res)=>{
            if(res.code==200){
                if (callback) {
                    callback(res);
                } else {
                    Taro.showToast({
                        title: '授权成功,正在同步订单，请稍候~',
                        icon: 'none',
                        duration: 2000
                    });
                    //同步下订单
                    Taro.showLoading({ title: '加载中...' });
                    Event.emit('App.reSynOrders',{});
                }
            }else{
                if (callback) {
                    callback(res);
                } else {
                    Taro.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    }

    //发货
    sendGood = (tid) =>{
        Taro.showLoading({ title: '加载中...' });
        if (IsEmpty(tid)) {
            tid = this.lastSendTid;
        }
        let self = this;
        let {lastShopId} = self.state;
        let params = {
            shopId:lastShopId,
            tid:tid
        };

        NetWork.Post({
            url:'Orderreturn/reSendGoods',
            params:params
        },(res)=>{
            if (!IsEmpty(res) && !IsEmpty(res.code)) {
                self.getTradeList(1,{},(result)=>{
                    self.setState({
                        dataSource:result
                    });
                    self.refs.orderHead.loadData();
                });
                if (res.code == '200') { //成功 刷新列表 
                    Taro.showToast({
                        title: '发货成功',
                        icon: 'none',
                        duration: 2000
                    });
                } else {
                    Taro.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
                Taro.hideLoading();
            } else {
                Taro.showToast({
                    title: '发货失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        },(error)=>{
            console.error(error);
            Taro.showToast({
                title: '网络错误，请稍候重试',
                icon: 'none',
                duration: 2000
            });
            Taro.hideLoading();
        });

    }

    render(){
        const {tabStatus,dataSource,total,bonepng,isRefreshing,refreshText,shopList,keyWord,dialogMsg,lastShopId,shopType} = this.state;
        let type= 'order';
        let list = '';
        if(bonepng){
            list = <Image src={'https://q.aiyongbao.com/1688/bone.png'} style={{width:px(750),height:px(1024)}}/>;
        }else{
            if(IsEmpty(dataSource)){
                let noListType = 'normal';
                if (IsEmpty(shopList)) {
                    noListType = 'noshops';
                }
                list = <NoList isRefreshing={isRefreshing} type={noListType} refreshText={refreshText} onRefresh={this.handleRefresh}/>;
            } else {
                list = (
                   <ListView
                       ref="vscroller"
                       style={styles.vscroller}
                       renderHeader={this.renderHeader}
                       renderFooter={this.renderFooter}
                       renderRow={this.renderItem}
                       dataSource={dataSource}
                       onEndReached={this.getMore}
                       onEndReachedThreshold={800}
                   />
               );
            }
        }
        return (
            <View>
                <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                    {/* <View onClick={()=>{}} style={{backgroundColor:'#FFF1E6',paddingLeft:24,paddingRight:24,width:px(750),height:100,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <Text style={{fontSize:28,color:'#666666',paddingLeft:24}}>上次同步时间2018-12-24 15:10:32</Text>
                        <Text style={{flex:1,fontSize:28,color:'blue',paddingLeft:24}}>下拉更新同步</Text>
                        <ItemIcon code={"\ue69a"}  iconStyle={{fontSize:32,color:'#999999'}}/>
                    </View> */}
                    <Header ref="orderHead" shopId={lastShopId}/>
                    <OrderStatus
                    tabStatus={tabStatus}
                    tabNum={total}
                    changeStatus={this.changeStatus}
                    shopType={shopType}
                    showSideDialog={()=>{this.clickfiter()}}
                    hideSideDialog={()=>{this.refs.slideDialog.hide()}}
                    />
                    {list}
                </View>
                <SideDialog
                ref='slideDialog'
                deleteSubjectKey={this.deleteSubjectKey}
                keyWord={keyWord}
                reset={this.reset}
                submitFilter={this.submitFilter}
                shopList={this.state.shopList}
                shopid = {this.state.choseshopid}
                ></SideDialog>
                <AiyongDialog
                ref={"surePayDialog"}
                maskClosable={true}
                cancelText={"遇到问题"}
                okText={"完成操作"}
                content={"操作完成后，请根据情况点击下面按钮"}
                onSubmit={this.updateOrder}
                onCancel={()=>{UitlsRap.openChat('爱用科技1688')}}
                onHide={this.updateOrder}
                />
                <SureDialog
                    ref={"sureDialog"}
                    onSubmit={()=>{this.sureAccess('handleRefresh',true)}}
                    lastShopType={shopType}
                    authorizationLink={this.authorizationLink}
                />
                 <AiyongDialog
                    ref={"closeorderone"}
                    title={"确定关闭订单？"}
                    cancelText={'再想想'}
                    okText={'确定关闭订单'}
                    content={'关闭订单后将无法采购，因此引发的买家投诉或赔偿将由您自行承担'}
                    onSubmit={()=>{this.closeok()}}
                    onCancel={()=>{this.refs.closeorderone.hide();}}
                    />
                <AiyongDialog
                    ref={"checkorderone"}
                    title={"确认已收到买家付款"}
                    cancelText={'再核对一下'}
                    okText={'是，我已收到付款'}
                    content={'请认真核对是否已收到买家的付款'}
                    onSubmit={()=>{Event.emit('App.checkorderok',{tid:this.checktid});}}
                    onCancel={()=>{this.refs.checkorderone.hide();}}
                    />
                <AiyongDialog
                ref={"reAuthTrade"}
                maskClosable={true}
                title={dialogMsg.title}
                cancelText={dialogMsg.cancelText}
                okText={dialogMsg.okText}
                content={dialogMsg.content}
                onSubmit={()=>{this.submitSend();}}
                onCancel={()=>{this.cancelSend();}}
                />
            </View>
        )
    }
}