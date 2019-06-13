import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Image,Input,ScrollView} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import AyButton from '../../Component/AyButton/index';
import { FlatList }  from 'react-native';
import Dialog from '../../Component/Dialog';
import Event from 'ay-event';
import ItemIcon from '../../Component/ItemIcon';
import AiyongDialog from '../../Component/AiyongDialog';
import SureDialog from '../../Component/SureDialog';
import ChooseSkuDialog from '../../Component/ChooseSkuDialog';
import Floattop from '../../Public/Components/Floattop';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import GetTimeString from '../../Public/Biz/GetTimeString.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import styles from './styles';
import { Modal } from '../../Public/Components/Modal';
// import { LuaEntry } from '../../Biz/LuaEntry.js';
import {Domain} from '../../Env/Domain';
import {DoBeacon} from '../../Public/Biz/DoBeacon';
import ShopItem from './ShopItem';
// import AlertBanner from '../../Public/Components/AlertBanner/index.js';
import px from '../../Biz/px.js';

/*
 * 铺货-店铺列表页面
 * @author cy
 *    判断库里是否有店铺列表数据
 *        /                \
 *       否                是
 *    判断是否授权爱用商品     \
 *       /          \     铺货设置或铺货
 *      是          否
 *      /            \
 *    显示一个淘宝     授权订购爱用商品
 *    店铺并保存到库     \
 *      /            用户确定是否完成
 *    添加店铺、          /      \
 *    铺货设置、         是      否
 *    铺货              /        \
 *                 再次判断授权   呼出旺旺
 */
export default class DistributionShops extends Component {
    constructor(props) {
        super(props);
        this.state={
            shopList:[
                // {
                //     id:"1",
                //     pic_url:'https://cbu01.alicdn.com/club/upload/pic/user/b/2/b/-/b2b-354479820003246_s.jpeg',
                //     shop_name:'蓉萱工厂店'
                // },
                // {
                //     id:"2",
                //     pic_url:'https://cbu01.alicdn.com/club/upload/pic/user/b/2/b/-/b2b-354479820003246_s.jpeg',
                //     shop_name:'蓉萱服饰'
                // }
            ],  /* 店铺列表 */
            shopTypeList:[

            ],  /* 店铺类型列表 */
            lastShopType:'taobao', /* 当前所选店铺类型 */
            chooseList:[],   /* 当前选中的店铺列表 */
            isLoading:true,
            isRefreshing:false,
            refreshText:'↓ 下拉刷新',
            fromPage:'',
            from:GetQueryString({name:'from',self:this}),
            notChooseSpecs:'',
            inputname:'',
            lotskuLeftText:'',
            lotskuRightText:'',
            lotskuReson:'',
            questionnaireMsg:{
                'show':false,
                'pic':'',
                'message':'',
                'buttons':[]
            },
            showWarning:false,
            imageUrl:''
        }
        this.userNick = '';
        this.userId = '';
        this.memberId = '';
        this.retry = 0; //授权失败重试，重试最多三次
        this.offerId = '';
        this.lastTime = '';
        this.lastShopId = '';
        this.supplierMemberId = '';
        this.authorizationLink = '';
        this.openelldialog = '';
        this.isfromself = '';
        this.type = "";
        this.loading = '';
        this.itemKey = 0;
        let self = this;
        Event.on('back',function(e){
            if (self.state.fromPage == 'orderList') {
                Event.emit('App.update_shop_orders',{});
            }
            self.openQuestionnaire();
            // GoToView({page_status:'pop'});
        });
        Event.on('App.getrunning',(data) => {
            let self = this;
            self.setState({
                chooseList:[],
            })
        });

    }

    config = {
        navigationBarTitleText: '选择店铺'
    }

    componentWillMount(){
        const self = this;
        // LuaEntry(); //保存用户信息
        // this.getWarningStatus((showWarning)=>{
        //     this.setState({
        //         showWarning:showWarning
        //     });
        //     if (!showWarning) {
                this.gettypeshoplist();
        //     }
        // });
    }

    componentDidMount(){
        let self = this;
        self.state.from = GetQueryString({name:'from',self:this});

        // if (self.state.showWarning) {
        //     console.log(self.state.showWarning,'return--did');
        //     return ;
        // }
        let isfromself = GetQueryString({name:'isfromself',self:this});
        this.isfromself = isfromself;
        let iswd = GetQueryString({name:'iswd',self:this});
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
            // console.log('getUserInfo',info);
            // if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
            //     self.userNick = info.extraInfo.result.loginId;
            //     self.userId = info.extraInfo.result.userId;
            //     self.memberId = info.extraInfo.result.memberId;
            // } else {
                // self.userNick = info.nick;
                // self.userId = info.userId;
            // }
            self.userNick = '萌晓月cy';
            self.userId = '2190174972';
            if(IsEmpty(isfromself)){
                DoBeacon('TD20181012161059','shoplist_show',self.userNick);
            }
            self.offerId = GetQueryString({name:'offerId',self:this});
            self.type = GetQueryString({name: 'type',self:this});
            self.supplierMemberId = GetQueryString({name:'supplierMemberId',self:this});
            // self.offerId = '578897732596';
            //判断授权
            NetWork.Get({
                url:'Orderreturn/authorDistribute',
                data:{
                    sellernick:self.userNick,
                }
            },(rsp)=>{
                console.log('Orderreturn/authorDistribute',rsp);
                //有结果
                if (!IsEmpty(rsp.code) && rsp.code=='200') {
                    self.loading = Toast.loading('加载中...');
                    // 判断库里是否有店铺列表数据
                    self.getShops((result)=>{
                        if (!IsEmpty(result)) {
                            self.setState({
                                shopList:result,
                                fromPage:GetQueryString({name:'fromPage',self:this}),
                                isLoading:false
                            });
                            if(iswd==1){
                                Event.emit('App.checkwc');
                                let chooseList = [];
                                chooseList = self.state.chooseList;
                                let shopdata = result;
                                for(let i=0;i<shopdata.length;i++){
                                    if(shopdata[i].shop_type=='taobao'){
                                        let number = chooseList.indexOf(shopdata[i].id);
                                        if( number > -1){
                                            chooseList.splice(number,1);
                                        }
                                    }else if(shopdata[i].shop_type=='wc'){
                                        chooseList.push(shopdata[i].id);
                                    }
                                }
                                this.setState({
                                    chooseList:chooseList
                                })
                            }
                            Portal.remove(self.loading);
                        } else {
                            //没有数据  判断授权
                            self.sureAccess('taobao',false,true);
                        }
                    })
                } else {
                    self.setState({
                        shopList:[],
                        fromPage:GetQueryString({name:'fromPage',self:this}),
                        isLoading:false
                    });
                    // RAP.sso.goAuth(8869440);
                }
            },(error)=>{
                self.setState({
                    shopList:[],
                    fromPage:GetQueryString({name:'fromPage',self:this}),
                    isLoading:false
                });
                console.error(error);
            });
        // }).catch((error) => {
        //     self.setState({
        //         shopList:[],
        //         fromPage:GetQueryString({name:'fromPage',self:this}),
        //         isLoading:false
        //     });
        //     console.log(error);
        // });

        this.setState({
            from:self.state.from
        });


        //选中微店,去掉淘宝店选择
        Event.on('App.checkwc',(data) => {
            let chooseList = [];
            chooseList = self.state.chooseList;
            let shopdata = self.state.shopList;
            for(let i=0;i<shopdata.length;i++){
                if(shopdata[i].shop_type=='taobao'){
                    let number = chooseList.indexOf(shopdata[i].id);
                    if( number > -1){
                        chooseList.splice(number,1);
                    }
                }else if(shopdata[i].shop_type=='wc'){
                    chooseList.push(shopdata[i].id);
                }
            }
            this.setState({
                chooseList:chooseList
            })
        });

    }
    //获取店铺类型的列表
    gettypeshoplist=()=>{
        const self = this;
        NetWork.Get({
			url:'Orderreturn/getShopTags',
        },(rsp)=>{
			if(!IsEmpty(rsp)){
                console.log('kankantypelist',rsp)
                self.setState({
                    shopTypeList:rsp,
                })
			}else{
                Toast.info('获取店铺类型列表数据失败', 2);
			}
        },(error)=>{
            Toast.info(JSON.stringify(error), 2);
        });
    }
    //获取店铺列表
    getShops = (callback) =>{
        const self = this;
        self.loading = Toast.loading('加载中...');
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{}
        },(shopRes)=>{
            console.log('Orderreturn/getProxyShopInfo',shopRes);
            //有数据
            if(!IsEmpty(shopRes.result)){
                let shopList = shopRes.result;
                let shopIds = [];
                shopList.map((item,key)=>{
                    shopIds.push(item.id);
                });
                //获取店铺的授权信息
                NetWork.Get({
                    url:'Distributeproxy/getAuthInfoByShopIds',
                    data:{
                        shopIds:shopIds.join(',')
                    }
                },(authRes)=>{
                    console.log('distribution/getAuthInfoByShopIds',authRes);
                    //有数据
                    if(!IsEmpty(authRes.result)){
                        shopList.map((item,key)=>{
                            let hasAuth = true;
                            for (let i = 0; i < authRes.result.length; i++) {
                                if (authRes.result[i] == item.id) {
                                    hasAuth = false;
                                }
                            }
                            shopList[key].hasAuth = hasAuth;
                        });
                    }
                    Portal.remove(self.loading);
                    callback(shopList);
                },(error)=>{
                    console.error(error);
                    Portal.remove(self.loading);
                    callback(shopList);
                });
            } else {
                Portal.remove(self.loading);
                callback([]);
            }

        },(error)=>{
            callback([]);
            console.error(error);
            Portal.remove(self.loading);
        });
    }

    //删除旺铺时
    isdisabled=(diaabledone,shoptype,isrunning)=>{
        if(diaabledone){
            if(shoptype == 'wc'&&isrunning == '0'){
                Toast.info('删除旺铺请联系客服', 2);
            }
        }
    }

    //渲染店铺列表
    renderRow = (items) =>{
        let key = items.index;
        let item = items.item;
        const { from , chooseList,shopList} = this.state;
        const self = this;
        let isChecked = false;
        for (let i = 0; i < chooseList.length; i++) {
            if (item.id == chooseList[i]) {
                isChecked = true;
                break;
            }
        }
        let isrunning = '0';
        let starttime = '';
        let hasAuth = true;
        if (item.hasAuth == false) {
            hasAuth = false;
        }

        let checkboxStyle = {};
        if (from == 'my') {
            checkboxStyle = {};
        } else {
            if (hasAuth) {
                checkboxStyle = {};
            } else {
                checkboxStyle = {backgroundColor:'#e5e5e5'};
            }
        }
        console.log(from,hasAuth,checkboxStyle);

        let doms = [] ;
        let diaabledone = false;
        if(from=='my'){
            if(item.shop_type == 'wc'){
                diaabledone = true;
            }
        }else{
            diaabledone = !hasAuth;
        }
        doms.push(
            <ShopItem
            key={key}
            isdisabled = {this.isdisabled}
            diaabledone = {diaabledone}
            checkboxStyle = {checkboxStyle}
            isChecked = {isChecked}
            checkboxOnChange = {this.checkboxOnChange}
            sureAccess = {this.sureAccess}
            goToPage = {this.goToPage}
            hasAuth = {hasAuth}
            item = {item}
            productid = {this.offerId}
            />
        );
        if (key == shopList.length -1) {
            doms.push(
                <View key={key + 1} style={{marginTop:px(56),flexDirection:'row',alignItems:'center',justifyContent:'center'}} onClick={()=>{UitlsRap.openChat('爱用科技1688');}}>
                    <Text style={{fontSize:px(28),color:'#999999'}}>添加店铺遇到问题？</Text>
                    <Text style={{fontSize:px(28),color:'#2357ff',marginLeft:px(6)}}>联系我们</Text>
                    <ItemIcon code={"\ue6ba"} iconStyle={[styles.addIcon,{fontSize:px(32)}]} boxStyle={{marginLeft:px(5)}}/>
                </View>
            );
        }
        return doms;
    }

    //跳转到设置页面
    goToPage = (shopId) =>{
        GoToView({status:'DistributionSetting',query:shopId});
    }

    //下拉刷新
    handleRefresh = () => {
        let self = this;
        //显示加载中
        this.setState({
           isRefreshing: true,
           refreshText: '加载中...'
        });

        //重新获取数据
        self.getShops((result)=>{
            Event.emit('App.getrunning');
            self.setState({
                shopList:result,
                isRefreshing:false,
                refreshText:'↓ 下拉刷新'
            });
        })

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

    //渲染空列表
    renderNull = (items) =>{
        let index = items.index;
        let item = items.item;
        return (
            <View key={0} style={{flexDirection:'column',width:px(750),height:px(750),alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:px(32),color:'#4a4a4a'}}>请添加您的第一个店铺</Text>
                <View style={styles.addBtn} onClick={()=>{this.addShops()}}>
                    <ItemIcon code={"\ue6b9"} iconStyle={styles.addIcon} onClick={()=>{this.addShops()}}/>
                    <Text style={{fontSize:px(32),color:'#2357ff'}} onClick={()=>{this.addShops()}}>添加店铺</Text>
                </View>
                <View style={{marginTop:px(120),flexDirection:'row',alignItems:'center'}} onClick={()=>{UitlsRap.openChat('爱用科技1688');}}>
                    <Text style={{fontSize:px(28),color:'#999999'}}>添加店铺遇到问题？</Text>
                    <Text style={{fontSize:px(28),color:'#2357ff',marginLeft:px(6)}}>联系我们</Text>
                    <ItemIcon code={"\ue6ba"} iconStyle={[styles.addIcon,{fontSize:px(32)}]} boxStyle={{marginLeft:px(5)}}/>
                </View>
            </View>
        );
    }

    //选择店铺类型
    changShopType = (name,isOk) =>{
        let self = this;
        console.log('kankantype',name,isOk);
        if(name == 'custom'){
            DoBeacon('TD20181012161059','ownshop_icon_click',self.userNick);
            GoToView({status:'Gocum'});
        }
        if (isOk) {
            this.setState({
                lastShopType:name
            });
        }
    }

    //渲染店铺类型列表
    renderShopTags = () =>{
        console.log('店铺列表',this.state.shopTypeList,this.state.lastShopType);
        let tagDom = [];
        if(!IsEmpty(this.state.shopTypeList)){
            this.state.shopTypeList.map((item,key)=>{
                let imgSrc = '';
                if(item.isOk){
                    imgSrc = item.url;
                } else {
                    imgSrc = item.urlgray;
                }
                tagDom.push(
                    <View key={key} style={[this.state.lastShopType == item.name ? styles.tagImageActive:styles.tagImage,key==4?{marginRight:px(0)}:{}]}
                    onClick={()=>{this.changShopType(item.name,item.isOk)}}>
                        <Image src={imgSrc} style={{width:px(76),height:px(76)}}/>
                    </View>
                );
            });

            return tagDom;
        }

    }

    //显示添加店铺弹窗
    addShops = () =>{
        let self = this;
        this.refs.addDialog.show();
        DoBeacon('TD20181012161059','good_addshop_click',self.userNick);
    }

    //隐藏添加店铺的弹窗
    hideAddShopDialog = () =>{
        this.refs.addDialog.hide();
    }
    //创建微信店铺
    creatWD =()=>{
        let self = this;
        setTimeout(()=>{
            if(self.state.from=='my'){
                DoBeacon('TD20181012161059','mine_wcshop_create',self.userNick);
            }else{
                DoBeacon('TD20181012161059','good_wcshop_create',self.userNick);
            }
            self.loading = Toast.loading('加载中...');
            NetWork.Get({
                url:'Distributeproxy/bindShopInfoWC',
                // host:Domain.ITEM_TEST_URL,
                data:{
                    shopType:'wc',
                    shopName:this.state.inputname,
                }
            },(data)=>{
              if(data.code == 200){
                self.getShops((result)=>{
                    if (!IsEmpty(result)) {
                        self.setState({
                            shopList:result
                        });
                        let shopid='';
                        let shopname = '';
                        for(let i=0;i<result.length;i++){
                            if(result[i].shop_type=='wc'){
                                shopid = result[i].id;
                                shopname = result[i].shop_name;
                            }
                        }
                        let shopnamenew = encodeURI(shopname);
                        GoToView({status:'Openwd',query:{shopid:shopid,shopname:shopnamenew}});
                    }
                    self.refs.addDialog.hide();
                    Portal.remove(self.loading);
                })
              }else{
                Toast.info(data.msg, 2);
                Portal.remove(self.loading);
              }
            },(error)=>{
                Portal.remove(self.loading);
            });
        },1000);

    }
    //授权操作
    sureAccess = (shopType,isDialog,isFirst,shopId) =>{
        if (shopType == 'taobao' || shopType == 'pdd') {
            if(isDialog == 'add'){ //添加店铺埋点
                if(this.state.from=='my'){
                    DoBeacon('TD20181012161059','mine_shop_' + shopType + '_click',this.userNick);
                }else{
                    DoBeacon('TD20181012161059','good_add_' + shopType + '_click',this.userNick);
                }
            } else if (isDialog == 'sure'){
                DoBeacon('TD20181012161059',shopType + 'shop_re_authorize',this.userNick);
            }
        }
        let self = this;

        let params = {
            shopType:shopType
        };
        if (isDialog) {
            if (isDialog == 'sure') {
                if (!IsEmpty(shopId)) {
                    params.shopId = shopId;
                    this.state.shopList.map((item,key)=>{
                        if (shopId == item.id) {
                            params.shopType = item.shop_type;
                        }
                    });
                } else {
                    params.lastTime = this.lastTime;
                }
                this.refs.sureDialog.hide();
            } else {
                let hasTaoShop = false;
                this.state.shopList.map((item,key)=>{
                    if (item.shop_type == "taobao") {
                        hasTaoShop = true;
                    }
                });
                if (hasTaoShop && shopType == 'taobao') {
                    Toast.info('暂支持添加当前登录账号绑定的淘宝店铺', 2);
                    return ;
                }
                this.lastTime = GetTimeString('YY-MM-DD hh-mm-ss');
                //隐藏添加店铺的弹窗
                this.refs.addDialog.hide();
                //先显示确认弹窗
                this.refs.sureDialog.show();
            }
        }

        if (!IsEmpty(shopId)) {
            params.shopId = shopId;
            this.lastShopId = shopId;
            this.state.shopList.map((item,key)=>{
                if (shopId == item.id) {
                    params.shopType = item.shop_type;
                }
            });
        }
        if (this.retry <= 3) {
            this.retry++;
            //获取授权信息
            NetWork.Get({
                url:'Distributeproxy/proxyGetAiyongAuthorization',
                data:params
            },(rsp)=>{
                console.log('Distributeproxy/proxyGetAiyongAuthorization',rsp);
                //有授权 添加店铺
                if (!IsEmpty(rsp)) {
                    if(rsp.code=='200'){
                        //完成后获取
                        self.lastShopId = '';
                        self.getShops((result)=>{
                            if (!IsEmpty(result)) {
                                self.setState({
                                    shopList:result
                                });
                            }
                            Portal.remove(self.loading);
                        })
                    } else if (rsp.code == '404') {
                        Portal.remove(self.loading);
                        if (!isFirst) {
                            self.refs.sureDialog.show();
                            self.authorizationLink = rsp;
                            GoToView({status:rsp.authorLink,page_status:'special'});
                        } else {
                            self.setState({
                                fromPage:GetQueryString({name:'fromPage',self:this}),
                                isLoading:false
                            });
                        }
                    } else {
                        Portal.remove(self.loading);
                    }
                } else {
                    self.setState({
                        fromPage:GetQueryString({name:'fromPage',self:this}),
                        isLoading:false
                    });
                    Portal.remove(self.loading);
                }
            },(error)=>{
                console.error(error);
            });
        } else {
            this.retry = 0;
        }
    }

    //店铺的选择
    checkboxOnChange = (value,hasAuth,shopType) =>{
        if (hasAuth == false && this.state.from != 'my') {
            this.sureAccess(shopType,false,false,value);
            return ;
        }
        let chooseList = [];
        chooseList = this.state.chooseList;
        let index = chooseList.indexOf(value);
        if( index > -1){
            chooseList.splice(index,1);
        } else {
            chooseList.push(value);
        }
        this.setState({
            chooseList:chooseList
        })
    }

    //问卷调查按钮点击
    questionnaireClick = (type)=>{
        const self = this;
        let {questionnaireMsg} = this.state;
        NetWork.Post({
            url:'Orderreturn/clickQuestionnaire',
            params:{
                type:type,
            }
        },(rsp)=>{
            console.log('clickQuestionnaire',rsp);
        });

        self.refs.questionnaire.hide();
        if (type == 'close') {
            DoBeacon(questionnaireMsg.close.doBeaconId,questionnaireMsg.close.doBeaconName,self.userNick);
            GoToView({page_status:'pop'});
        } else {
            let buttons = questionnaireMsg.buttons;
            for (let i = 0; i < buttons.length; i++) {
                if (type == buttons[i].id) {
                    DoBeacon(buttons[i].doBeaconId,buttons[i].doBeaconName,self.userNick);
                    if (!IsEmpty(buttons[i].goToView)) {
                        let query = {};
                        if (!IsEmpty(buttons[i].query)) {
                            query = Parse2json(buttons[i].query);
                        }
                        GoToView({status:buttons[i].goToView,clearTop:true,query:query});
                    } else {
                        GoToView({page_status:'pop'});
                    }
                    break;
                }
            }
        }
    }

    //是否打开问卷调查逻辑
    openQuestionnaire = ()=>{
        const self = this;
        NetWork.Post({
            url:'Orderreturn/getQuestionnaire',
            params:{
                type:Domain.Product,
            }
        },(rsp)=>{
            console.log('getQuestionnaire',rsp);
            if (!IsEmpty(rsp.show)) {
                if (rsp.show == '1') {
                    this.setState({
                        questionnaireMsg:rsp
                    });
                    self.refs.questionnaire.show();
                } else {
                    GoToView({page_status:'pop'});
                }
            } else {
                GoToView({page_status:'pop'});
            }
        },(error)=>{
            console.log(error);
            GoToView({page_status:'pop'});
        });
    }
    //更新state sku的弹窗用
    updateStates = (obj) =>{
        this.setState({
            ...obj
        });
    }
    //开始铺货
    startDistributing = () =>{
        const self = this;
        let istelldialog = 0;
        let list =[];
        let tokenbumber = 0;
        this.state.shopList.map((val,idx)=>{
            let flag = false;
            this.state.chooseList.map((item,key)=>{
                if (item == val.id) {
                    flag = true;
                }
            });
            if (flag) {
                list.push(val);
            }
        });

        let hasPdd = false;
        let pddShopId = [];
        let pddshops = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].shop_type == 'pdd') {
                hasPdd = true;
                pddShopId.push(list[i].id);
                pddshops.push({shopid:list[i].id,shopname:list[i].shop_name})
            }
        }

        // if(self.openelldialog != 1){
            LocalStore.Set({'go_to_distribution_list':JSON.stringify(list)});
            //含有拼多多需要判断是否有未进行铺货设置的店铺
            if (hasPdd) {
                self.loading = Toast.loading('加载中...');
                let isSetted = false;
                let notSetShop = [];
                //判断是否有未进行铺货设置的店铺，有则返回shopIds
                NetWork.Get({
                    url:'Distributeproxy/getNotSetByids',
                    data:{
                        shopIds:pddShopId.join(',')
                    }
                },(rsp)=>{
                    console.log('Distributeproxy/getNotSetByids',rsp);
                    //有数据
                    Portal.remove(self.loading);
                    //有结果，先设置
                    if (!IsEmpty(rsp.result)) {
                        notSetShop = rsp.result;
                        let query = {
                            resShopId:notSetShop.join(','),
                            offerId:self.offerId
                        };
                        GoToView({status:'DistributionSetting',query:query});
                    } else {
                        // if(self.openelldialog == 1){
                        //     let chooseListnew = self.state.chooseList;
                        //     for (let j = 0; j < pddshops.length; j++) {
                        //         let shoplistid = pddshops[j].shopid
                        //             NetWork.Get({
                        //                 url:'Distributeproxy/getTemplateModel',
                        //                 data:{
                        //                     pageNo:1,
                        //                     shopType:'pdd',
                        //                     shopName:pddshops[j].shopname
                        //                 }
                        //             },(rsp)=>{
                        //                 console.log('distribution/getTemplateModel',rsp);
                        //                 tokenbumber++;
                        //                 //无数据
                        //                 if (IsEmpty(rsp.result)) {
                        //                 // if (!IsEmpty(rsp.result)) {
                        //                     let number = chooseListnew.indexOf(shoplistid);
                        //                     if( number > -1){
                        //                         chooseListnew.splice(number,1);
                        //                     }
                        //                     istelldialog++;
                        //                 }
                        //                 if(tokenbumber >= pddshops.length){
                        //                     if(istelldialog > 0){
                        //                         self.refs.tellDialog.show();
                        //                         self.setState({
                        //                             chooseList:chooseListnew,
                        //                         })
                        //                     }else{
                        //                         //没有则直接铺货
                        //                         GoToView({status:'DistributionResult',query:{offerId:self.offerId,supplierMemberId:self.supplierMemberId,isfromself:this.isfromself,}});
                        //                     }
                        //                 }
                        //             },(error)=>{
                        //                 console.error(error);
                        //             });
                        //     }
                        // }else{
                            NetWork.Post({
                                url:'dishelper/get1688skuinfo',
                                host:Domain.WECHART_URL,
                                data:{
                                    productid:self.offerId
                                }
                            },(rsp)=>{
                                console.log('kankanshifouchai',rsp);
                                //测试时改为不等于1，实际上是等于1
                                if(IsEmpty(rsp)){
                                    GoToView({status:'DistributionResult',query:{offerId:self.offerId,supplierMemberId:self.supplierMemberId,isfromself:self.isfromself,}});
                                }else{
                                    if(rsp.splitgoodsnumber == 1){
                                        GoToView({status:'DistributionResult',query:{offerId:self.offerId,supplierMemberId:self.supplierMemberId,isfromself:self.isfromself,}});
                                    }else{
                                        if(rsp.value=='out'){
                                            self.setState({
                                                lotskuLeftText:'忽略',
                                                lotskuRightText:'手动选择规格铺货',
                                                lotskuReson:'该商品规格值过多，超过拼多多发布商品限制，请手动选择规格',
                                            })
                                            self.refs.lotsku.show()
                                        }else if(rsp.value=='split'){
                                            self.setState({
                                                lotskuLeftText:'手动选择规格铺货',
                                                lotskuRightText:'自动拆分铺货铺货',
                                                lotskuReson:'该商品规格值过多，超过拼多多发布商品限制，是否自动拆分为'+rsp.splitgoodsnumber+'个商品进行铺货',
                                            })
                                            self.refs.lotsku.show()
                                        }else{
                                            Toast.info('获取1688规格值失败', 2);
                                        }
                                    }
                                }
                            },(error)=>{
                                GoToView({status:'DistributionResult',query:{offerId:self.offerId,supplierMemberId:self.supplierMemberId,isfromself:self.isfromself,}});
                                console.log('获取规格值失败');
                            });
                        // }
                    }
                },(error)=>{
                    Portal.remove(self.loading);
                    console.error(error);
                });
            } else {
            //没有则直接铺货
                GoToView({status:'DistributionResult',query:{offerId:this.offerId,supplierMemberId:this.supplierMemberId,isfromself:this.isfromself,type:this.type}});
            }
        // }


    }
    //获取当前商品已铺货过的sku
    getNotChooseSkus = (offerId,callback) =>{
        NetWork.Get({
            url:'Distributeproxy/getNotHaveRelationSkus',
            data:{
                productId:offerId
            }
        },(rsp)=>{
            console.log('distribution/notChooseSpecs',rsp);
            //有数据
            let notChooseSpecs = '';
            if (!IsEmpty(rsp.skus)) {
                notChooseSpecs = rsp.skus;
            }
            callback(notChooseSpecs);
        },(error)=>{
            console.log(JSON.stringify(error));
            callback('');
        });
    }
    //弹出选择窗口
    openskuchoose=()=>{
        const self = this;
        self.getNotChooseSkus(self.offerId,(notChooseSpecs)=>{
            console.log('kankan选择规格铺货--notChooseSpecs',notChooseSpecs);
            self.setState({
                notChooseSpecs:notChooseSpecs.split(','),
            });
            self.refs.skuDialog.show();
        });
    }
    //sku弹窗右边事件
    lotskuSubmit=(data)=>{
        const self = this;
        self.refs.lotsku.hide()
        if(data=='自动拆分铺货铺货'){
            GoToView({status:'DistributionResult',query:{offerId:self.offerId,supplierMemberId:self.supplierMemberId,isfromself:self.isfromself,}});
        }else if(data=='手动选择规格铺货'){
            self.openskuchoose();
        }
    }
    //sku弹窗左边事件
    lotskuCancel=(data)=>{
        const self = this;
        self.refs.lotsku.hide()
        if(data=='忽略'){
            GoToView({status:'DistributionResult',query:{offerId:self.offerId,supplierMemberId:self.supplierMemberId,isfromself:self.isfromself,}});
        }else if(data=='手动选择规格铺货'){
            self.openskuchoose();
        }

    }
    //sku弹窗确定按钮回调
    skuDistribute = (skus) =>{
        const self = this;
        this.refs.skuDialog.hide();

        LocalStore.Get(['go_to_distribution_list'],(result) => {
            console.log('kankango_to_distribution_list',result);
            let distributList = Parse2json(result.go_to_distribution_list);
            for(let i=0;i<distributList.length;i++){
                if(distributList[i].shop_type == 'pdd'){
                    distributList[i].choosedSkus=skus;
                    distributList[0].ischoosedSkus=1;
                }
            }
            console.log('kankangaigoulist',distributList);
            LocalStore.Set({'go_to_distribution_list':JSON.stringify(distributList)});
        });
        GoToView({status:'DistributionResult',query:{offerId:self.offerId,supplierMemberId:self.supplierMemberId,isfromself:self.isfromself,}});

    }
    //删除店铺
    deleteshop=()=>{
        let self = this;
        self.loading = Toast.loading('加载中...');
        const { chooseList } = this.state;
        NetWork.Get({
            url:'Orderreturn/deleteShop',
            data:{
                shopIds:chooseList.join(',')
            }
        },(rsp)=>{
            Portal.remove(self.loading);
            Toast.info('删除成功', 2);
            this.state.chooseList = [];
            self.handleRefresh();
        },(error)=>{
            Portal.remove(self.loading);
            console.error(error);
        });
    }
    //修改店铺名称
    inputname = (value) =>{
        this.state.inputname = value;
    }

    getWarningStatus = (callback) =>{
        let nowTime = (new Date()).getTime();
        let oneStartTime = (new Date('2019/05/15 00:00:00')).getTime();
        let oneEndTime = (new Date('2019/05/30 23:59:59')).getTime();

        let showWarning = false;
        if (nowTime > oneStartTime && nowTime < oneEndTime) {
            NetWork.Get({
                url:'Orderreturn/getWarningSetting',
                data:{}
            },(rsp)=>{
                console.log('Orderreturn/getWarningSetting',rsp);
                if (!IsEmpty(rsp.showWarning)) {
                    showWarning = rsp.showWarning == '0' ? false:true;
                    this.state.imageUrl = rsp.imageUrl;
                    callback(showWarning);
                }
            },(error)=>{
                console.log(error);
                callback(showWarning);
            });
        } else {
            callback(showWarning);
            console.log('Orderreturn/getWarningSetting',nowTime,oneStartTime,oneEndTime);
        }
    }


    render() {
        let foot = (
            <View  style={{height:px(90),flexDirection: 'row',borderTopWidth: px(1),borderTopColor:'#e5e5e5'}}>
                <View onClick={()=>{this.refs.aydialog.hide();}} style={{backgroundColor:'#fff',borderBottomLeftRadius: px(10),justifyContent:'center',alignItems: 'center',flex:1}}>
                    <Text style={{fontSize:px(32)}}>取消</Text>
                </View>
                <View onClick={()=>{this.refs.aydialog.hide();this.deleteshop()}} style={{backgroundColor:'#FF6000',borderBottomRightRadius: px(10),justifyContent:'center',alignItems: 'center',flex:1}}>
                    <Text style={{fontSize:px(32),color:'#fff'}}>删除店铺</Text>
                </View>
            </View>
        );
        let listDom = null;
        let foots = null;
        let {shopList,lastShopType,chooseList,isLoading,fromPage,from,questionnaireMsg,showWarning,imageUrl} = this.state;
        if (isLoading) {
            listDom = null;
        } else {
            if (IsEmpty(shopList)) {
                listDom =
                <FlatList
                ref="mylist"
                style={{flex:1,backgroundColor:'#ffffff'}}
                data={['null']}
                horizontal={false}
                renderItem={this.renderNull}
                refreshing={this.state.isRefreshing}
                onRefresh={()=>{this.handleRefresh()}}
                keyExtractor={(item, index) => (index + '1')}
                />;
            } else {
                listDom =
                <FlatList
                ref="mylist"
                style={{flex:1,backgroundColor:'#ffffff'}}
                data={shopList}
                horizontal={false}
                renderItem={this.renderRow}
                refreshing={this.state.isRefreshing}
                onRefresh={()=>{this.handleRefresh()}}
                keyExtractor={(item, index) => (index + '1')}
                />;
            }

            if (fromPage == 'orderList') {
                foots =
                <View style={styles.footRight} onClick={()=>{
                    Event.emit('App.update_shop_orders',{});
                    GoToView({page_status:'pop'});
                }}>
                    <Text style={{fontSize:px(32),color:'#ffffff'}}>返回</Text>
                </View>;
            } else {
                if (chooseList.length > 0) {
                    foots =
                    <View style={styles.footRight} onClick={()=>{
                        if(from=='my'){
                            Modal.alert({
                                element:this.refs.aydialog,
                                body:'您确定要删除所选的'+chooseList.length+'个店铺吗？删除后再次添加必须重新授权。',
                                head:'删除店铺',
                                foot:foot,
                            });
                        }else{
                            this.startDistributing();
                        }
                    }}>
                        <Text style={{fontSize:px(32),color:'#ffffff'}}>{from=='my'?'删除店铺':'开始铺货'}</Text>
                    </View>;
                } else {
                    foots =
                    <View style={[styles.footRight,{backgroundColor:'#e8e8e8'}]}>
                        <Text style={{fontSize:px(32),color:'#BFBFBF'}}>{from=='my'?'删除店铺':'开始铺货'}</Text>
                    </View>;
                }

            }
        }

        let shopTagName = '淘宝';
        switch (this.state.lastShopType) {
            case 'taobao':shopTagName = '淘宝'; break;
            case 'pdd':shopTagName = '拼多多'; break;
            default: break;
        }
        if (showWarning) {
            return (
                <View>
                    <View style={{alignItems:'center',backgroundColor:'#fff',flex:1}}>
                    {
                        !IsEmpty(imageUrl) ? 
                        <Image src={imageUrl} style={{width:px(750),height:px(992)}}/>
                        :
                        null
                    }
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{flex:1,backgroundColor:'#ffffff'}}>
                    {/* <Floattop/> */}
                    {/* <AlertBanner where='shop'/> */}
                    <View style={styles.topLine}>
                        <Text style={{fontSize:px(32),color:'#4a4a4a'}}>{from=='my' ? '管理您要铺货的店铺' : '请选择要铺货的店铺'}</Text>
                        <View style={{flex:1,alignItems:'flex-end'}} onClick={()=>{this.addShops()}}>
                            <ItemIcon code={"\ue6b9"} iconStyle={styles.addIcon} onClick={()=>{this.addShops()}}/>
                        </View>
                    </View>
                    {/* <Modal.AyDialog ref='aydialog'/> */}
                    {listDom}
                    <View style={styles.footLine}>
                        {/*<View style={styles.footLeft}>
                            <Text style={{fontSize:px(32),color:'#4a4a4a'}}>保存草稿</Text>
                        </View>*/}
                        {foots}
                    </View>
                    <Dialog ref={"addDialog"} contentStyle={styles.modal2Style} maskClosable={false}>
                        <View style={styles.dialogContent}>
                            <View style={styles.dialogBody}>
                                <Text style={{fontSize:px(28),color:'#787993'}}>选择店铺类型</Text>
                                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                                    {this.renderShopTags()}
                                </View>
                                {
                                        this.state.lastShopType == 'wc'?(<View style={styles.WDinputout}><ItemIcon code={"\ue6e7"} iconStyle={{fontSize:px(40),color:'#999999',marginRight:px(24),marginLeft:px(10)}}/><Input ref={'creatWD'} maxLength={12} onChange={(value,e)=>{this.inputname(value)}} placeholder={'请给您的爱用旺铺起个名字'} style={styles.WDinput}></Input></View>):(null)
                                }
                                <View style={styles.borderLine}>
                                    <Text style={{fontSize:px(24),color:'#999999'}}>{this.state.lastShopType == 'wc'? '什么是爱用旺铺？':'授权提醒'}</Text>
                                </View>
                                <View style={{marginTop:px(12),paddingBottom:px(24)}}>
                                {this.state.lastShopType == 'wc'?
                                    (<Text style={{fontSize:px(28),color:'#666666',lineHeight:px(40)}}>
                                    爱用旺铺是代发助手为您创建的微信专属店铺，铺货到爱用旺铺后，您可以通过微信小程序分享商品给好友和朋友圈，支持创建采购单，下单后由供应商进行代发服务
                                    </Text>)
                                    :
                                    (<Text style={{fontSize:px(28),color:'#666666',lineHeight:px(40)}}>
                                    点击授权添加，进入授权页面，登陆您的{shopTagName}店铺账号并点击“授权”，此过程中可能要求您免费订购爱用供销，授权成功后返回该页面，点击“完成授权”按钮完成店铺添加
                                    </Text>)}
    
                                </View>
                            </View>
                            <View style={styles.foot}>
                                <View style={styles.cancelBtn} onClick={()=>{this.hideAddShopDialog()}}>
                                    <Text style={styles.fontStyle}>取消</Text>
                                </View>
                                {this.state.lastShopType == 'wc'?
                                    (<View style={[styles.submitBtn,{backgroundColor:"#ff6000"}]} onClick={()=>{this.creatWD()}}>
                                        <Text style={[styles.fontStyle,{color:"#ffffff"}]}>{'创建店铺'}</Text>
                                    </View>):
                                    (<View style={[styles.submitBtn,{backgroundColor:"#ff6000"}]} onClick={()=>{this.sureAccess(lastShopType,'add')}}>
                                        <Text style={[styles.fontStyle,{color:"#ffffff"}]}>{'授权添加'}</Text>
                                    </View>)}
                            </View>
                        </View>
                    </Dialog>
                    <AiyongDialog
                    maskClosable={true}
                    ref={"lotsku"}
                    title={"规格值过多"}
                    cancelText={this.state.lotskuLeftText}
                    okText={this.state.lotskuRightText}
                    content={this.state.lotskuReson}
                    onSubmit={()=>{this.lotskuSubmit(this.state.lotskuRightText)}}
                    onCancel={()=>{this.lotskuCancel(this.state.lotskuLeftText)}}
                    />
                    <SureDialog
                    ref={"sureDialog"}
                    onSubmit={()=>{this.sureAccess(this.state.lastShopType,'sure',false,this.lastShopId)}}
                    lastShopType={this.state.lastShopType}
                    authorizationLink={this.authorizationLink}
                    />
                    <ChooseSkuDialog ref={"skuDialog"}
                    offerId={this.offerId}
                    updateStates={this.updateStates}
                    from="chooseMore"
                    notChooseSpecs={this.state.notChooseSpecs}
                    showLoading={()=>{this.loading = Toast.loading('加载中...');}}
                    hideLoading={()=>{Portal.remove(this.loading);}}
                    skuDistribute = {this.skuDistribute}
                    />
                    <Dialog ref={"tellDialog"} contentStyle={styles.modal2Style}>
                        <View style={styles.dialogContent}>
                            <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{marginTop:px(15),fontSize:px(38),color:'#4A4A4A'}}>锁定运费模板公告</Text>
                            </View>
                            <View style={styles.tokenBody}>
                                <Text style={{fontSize:px(32),color:'#4A4A4A'}}>拼多多平台在11月30日16点至12月13日0点，不支持创建运费模板，请前往拼多多商家后台发布任意商品后再铺货</Text>
                            </View>
                            <View style={styles.foot}>
                                <View style={[styles.submitBtnall,{backgroundColor:"#ff6000"}]} onClick={()=>{this.refs.tellDialog.hide()}}>
                                    <Text style={[styles.fontStyle,{color:"#ffffff"}]}>我知道了</Text>
                                </View>
                            </View>
                        </View>
                    </Dialog>
                    <Dialog ref={"questionnaire"} maskClosable={false} contentStyle={styles.modalStyle}>
                        <View style={{flex:1,borderRadius: px(8),backgroundColor: '#fff',width: px(590),alignItems:'center',paddingBottom:px(24)}}>
                            <Image src={questionnaireMsg.pic} style={{height:238,width:590}}></Image>
                            {
                                !IsEmpty(questionnaireMsg.message) ?
                                <View style={{height:px(92),width:px(526),marginTop:px(24),marginBottom:px(24)}}>
                                    <Text style={{fontSize:px(32),color:'#333333',lineHeight:px(40),fontWeight:700}}>{questionnaireMsg.message}</Text>
                                </View>
                                :
                                null
                            }
                            {
                                questionnaireMsg.buttons.map((item,key)=>{
                                    return <AyButton style={styles.questionnairebutton} onClick={()=>{this.questionnaireClick(item.id)}}>{item.name}</AyButton>
                                })
                            }
                        </View>
                        <View style={styles.closeout} onClick={()=>{this.questionnaireClick('close');}}>
                            <ItemIcon code={"\ue69a"}  iconStyle={styles.close}/>
                        </View>
                    </Dialog>
                </View>
            );
        }
    }
}
// {
//     name:'taobao',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png',
//     isOk:true,
//     color:'#fd9028'
// },
// {
//     name:'wc',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/weichatLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/weichatLogo.png',
//     isOk:true,
//     color:'#595959'
// },
// {
//     name:'pdd',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png',
//     isOk:true,
//     color:'#cf1e26'
// },
// {
//     name:'LAZADA',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/lazadaLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/lazadaLogo_gray.png',
//     isOk:false,
//     color:'#595959'
// },
// {
//     name:'amazon',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/amazonLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/amazonLogo_gray.png',
//     isOk:false,
//     color:'#555555'
// },
// {
//     name:'Shopee',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/shopeeLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/shopeeLogo_gray.png',
//     isOk:false,
//     color:'#ff5923'
// },
// {
//     name:'facebook',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/facebookLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/facebookLogo_gray.png',
//     isOk:false,
//     color:'#2c7dd1'
// },
// {
//     name:'custom',
//     url:'https://q.aiyongbao.com/1688/web/img/preview/mySpaceLogo.png',
//     urlgray:'https://q.aiyongbao.com/1688/web/img/preview/mySpaceLogo_grey.png',
//     isOk:false,
//     color:'#2c7dd1'
// }
