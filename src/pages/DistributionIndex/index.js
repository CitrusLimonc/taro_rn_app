import Taro, { Component, Config } from '@tarojs/taro';
import { View , Text , ScrollView } from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import { FlatList , RefreshControl}  from 'react-native';
import Event from 'ay-event';
import { IsEmpty } from '../../Public/Biz/IsEmpty.js';
import AiyongDialog from '../../Component/AiyongDialog';
import Back from './back';
import Head from './head';
import Body from './body';
import List from './list';
import Course from './course';
import Tool from './tool';
import { NetWork } from '../../Public/Common/NetWork/NetWork.js';
// import {ToQueryString} from '../../Public/Biz/ToQueryString';
// import AlertBanner from '../../Public/Components/AlertBanner/index.js';
// import Floattop from '../../Public/Components/Floattop';
import { Modal } from '../../Public/Components/Modal/index.js';
import { LocalStore } from '../../Public/Biz/LocalStore.js';
import GetTimeString from '../../Public/Biz/GetTimeString.js';
// import {DoBeacon} from '../../Public/Biz/DoBeacon.js';
import { GoToView } from '../../Public/Biz/GoToView.js';
import px from '../../Biz/px.js';

/**
 @aythor lzy
  首页
*/
export default class DistributionIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loginId:'', //用户名
            isRefreshing: false, //是否下拉刷新
            refreshText: '↓ 下拉刷新', //下拉刷新文字
            dialogMsg:{
                'title':'',
                'cancelText':'',
                'okText':'',
                'content':''
            },
            authType:''
        }
        this.vipflag = '';
        this.loading = '';
    }

    config = {
        navigationBarTitleText: '首页'
    }

    componentWillMount(){
        let self = this;
        
        //获取用户基本信息
        // let params = info.extraInfo.result;
        // params.from = mobile;
        // params.ver = 'x.x.x';
        // params.apptype = 'distribute';
        // let queryString = ToQueryString(params);
        // //入口存储用户信息
        // NetWork.GetSpe({
        //     url: "https://zk1688.aiyongbao.com/tc/entry?" + queryString
        // }, (rsp) => {
        //     self.vipflag = rsp.vipflag;
        // }, (error) => {
        //     console.error(error);
        // });

        // LocalStore.Get(['has_show_trade_auth'],(result) => {
        //     console.log('has_show_trade_auth',result);
        //     let nowTime = GetTimeString('YY-MM-DD hh:mm:ss');
        //     if(!IsEmpty(result)){
        //         let hasShowTradeAuth = result.has_show_trade_auth;
        //         let leftDays = this.getDays(hasShowTradeAuth,nowTime);
        //         if (leftDays >= 1) {
        //             this.alertAuthBanner();
        //             LocalStore.Set({'has_show_trade_auth':nowTime});
        //         }
        //     }else{
        //         this.alertAuthBanner();
        //         LocalStore.Set({'has_show_trade_auth':nowTime});
        //     }

        // });
    }

    componentDidMount(){
        Event.on('APP.testShowEvent',(data)=>{
            Toast.info('componentDidMount', 1);
        });
        // Event.emit('APP.testShowEvent',{});
        // let currentPages = Taro.getCurrentPages();
        // let lastPage = currentPages[currentPages.length];
        
        this.loading = Toast.loading('加载中...');
        let self = this;
        setTimeout(function(){
            Portal.remove(self.loading);
        },2000);

        
       
    }

    //获取两个日期间相差的天数
    getDays = (dateString1,dateString2) =>{
        var  startDate = Date.parse(dateString1.replace('/-/g','/'));
        var  endDate = Date.parse(dateString2.replace('/-/g','/'));
        var  diffDate = (endDate-startDate)+1*24*60*60*1000;
        var  days = diffDate/(1*24*60*60*1000);
        return  days;
    }

    //弹出交易授权
    alertAuthBanner = () =>{
        this.getAuthTrade('null',(res)=>{
            //没有交易授权
            if (res.code != 200) {
                Modal.alert({
                    element:this.refs.aydialog,
                    pic_url:'https://q.aiyongbao.com/1688/web/img/authTradeTao.png',
                    type:'AD',
                    onClick:()=>{
                        this.refs.aydialog.hide();
                        this.setState({
                            authType:res.msg,
                            dialogMsg:{
                                'title':'是否完成授权？',
                                'cancelText':'遇到问题',
                                'okText':'完成授权',
                                'content':'授权完成后，请根据情况点击下面按钮'
                            }
                        });
                        this.refs.reAuthTrade.show();
                        let title = '授权爱用交易';
                        if (res.msg = 'hasNoOrder') {
                            title = '订购爱用交易';
                        }
                        this.goToLink(res.url,title);
                    },
                    onCancel:()=>{}
                });
            }
        });
    }

    //判断是否有爱用交易授权
    getAuthTrade = (shopId,callback) =>{
        NetWork.Get({
            url:'Orderreturn/authorTrade',
            params:{
                shopId:shopId
            }
        },(res)=>{
            console.log('Orderreturn/authorTrade',res);
            if(res.code==200){
                if (callback) {
                    callback(res);
                } else {
                    Toast.info('授权成功', 2);
                }
            }else{
                if (callback) {
                    callback(res);
                } else {
                    Toast.info('授权失败', 2);
                }
            }
        });
    }

    //下拉刷新操作
    handleRefresh = () => {

        Toast.info('加载中', 1);

        this.setState({
            isRefreshing: true,
            refreshText: '加载中...',
        });

        console.log('this',this);
        this.refs.listView.refs.homeHead.resettoken();
        this.refs.listView.refs.homeHead.loadData();
        this.refs.listView.refs.homeBody.loadData();
        this.refs.listView.refs.homeList.loadData();
        Event.emit('APP.render_shop_card',{});
        let self = this;
        setTimeout(() => {
            self.setState({
                isRefreshing: false,
                refreshText: '↓ 下拉刷新',
            });
        }, 2000);
    }

    //渲染头部
    renderHeader = () =>{
        return (
            <RefreshControl 
            refreshing={this.state.isRefreshing} 
            style={{width:px(750),height:px(100),alignItems:'center',justifyContent:'center'}} 
            onRefresh={this.handleRefresh}
            title={this.state.refreshText}
            titleColor="#ff6000"
            />
        );
    }
    //打开vip弹窗
    openvip=()=>{
        this.refs.vipDialog.show();
    }
    //跳转购买vip
    tobuyvip =()=>{
        // RAP.navigator.push({
        //     url:"https://page.1688.com/html/fa9028cc.html",
        //     clearTop:false,
        //     animated:true,
        // }).then((result) => {
        //     //console.log(result);
        // }).catch((error) => {
        //     console.error(error);
        // });
        this.refs.vipDialog.hide();

    }

    //弹窗确认操作
    submitSend = () =>{
        if (this.state.dialogMsg.title == '是否完成授权？') {
            //判断下是否有爱用交易授权
            this.getAuthTrade('null',(res)=>{
                if (res.code == 200) {
                    this.refs.reAuthTrade.hide();
                    Toast.info('授权成功', 2);
                } else {
                    if (this.state.authType == "hasNoOrder" && res.msg == "hasNoAuth") {
                        this.setState({
                            authType:"hasNoAuth"
                        });
                        this.goToLink(res.url);
                    } else {
                        this.refs.reAuthTrade.hide();
                        Toast.info('授权失败', 2);
                    }
                }
            });
        }

    }

    //取消操作
    cancelSend = () =>{
        this.refs.reAuthTrade.hide();
        if (this.state.dialogMsg.title == '是否完成授权？') {
            
        }
    }

    goToLink = (url) =>{
        GoToView({status:url,page_status:'specail'});
    }

    renderItem = (item) =>{
        let doms = [];
        let key = item.index;
        let value = item.item;

        doms.push(
            <Back key={0} ref="Back"/>
        );
        doms.push(
            <Head key={1} ref="homeHead"/>
        );
        doms.push(
            <View key={2} style={{marginLeft: px(24),marginRight: px(24),marginTop: px(24)}}>
                <Body ref="homeBody"/>
            </View>
        );
        doms.push(
            <Text key={3} style={{fontSize:px(28),color:'#222',marginTop:px(42),marginLeft:px(56)}}>我的店铺</Text>
        );
        doms.push(
            <View key={4} style={{paddingLeft:px(24),paddingRight:px(24)}}>
                <List ref="homeList"/>
            </View>
        );
        doms.push(
            <View key={5} style={{paddingLeft:px(24),paddingRight:px(24)}}>
                <Tool ref="tool" vipflag={this.vipflag} openvip={this.openvip}/>
            </View>
        );
        doms.push(
            <View key={6} style={{paddingLeft:px(24),paddingRight:px(24)}}>
                <Course ref="course"/>
            </View>
        );
        doms.push(
            <View key={7} style={{height:px(30)}}></View>
        );

        return doms;
    }

    render(){
        let {dialogMsg} = this.state;
        return (
            <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                {/* <Floattop /> */}
                {/* <AlertBanner where='index'/> */}
                <FlatList
                    ref="listView"
                    data={['null']}
                    horizontal={false}
                    renderItem={this.renderItem}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleRefresh}
                    keyExtractor={(item, index) => (index + '1')}
                />
                <AiyongDialog
                    ref={"vipDialog"}
                    title={"该功能是付费功能"}
                    cancelText={'取消'}
                    okText={'去订购'}
                    content={'该功能是付费功能，您需要订购高级版才能使用'}
                    onSubmit={()=>{this.tobuyvip()}}
                    onCancel={()=>{this.refs.vipDialog.hide();}}
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
                {/* <Modal.AyDialog ref='aydialog'/> */}
            </View>
        );
    }
}