import Taro, { Component, Config } from '@tarojs/taro';
import {ScrollView,Switch,View,Text,Radio} from '@tarojs/components';
import ItemIcon from '../../Component/ItemIcon';
import SureDialog from '../../Component/SureDialog';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import GetTimeString from '../../Public/Biz/GetTimeString.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import styles from './styles';
import { GetSyncSetting } from '../../Biz/Apis';
import {Domain} from '../../Env/Domain';
import ShopItem from './ShopItem';
import {DoBeacon} from '../../Public/Biz/DoBeacon';


/*
 * 库存预警
 * @author wzm
 */
export default class SyncNumber extends Component {
    constructor(props) {
        super(props);
        this.state={
            shopList:[],  /* 店铺列表 */
            lastShopType:'taobao', /* 当前所选店铺类型 */
            chooseList:[],   /* 当前选中的店铺列表 */
            isLoading:true, //是否正在加载中
            isRefreshing:false, //是否正在下拉刷新
            refreshText:'↓ 下拉刷新', //下拉刷新的文字
            zerogroup:'1', //是否需要下架或删除
            timeGroup:'7', //同步周期
            from:'',
            lastsynctime:'',
            switchbutton:undefined,
            switchdisable:true,
            inputname:''
        }
        //用户信息
        this.userNick = '';
        this.userId = '';
        this.memberId = '';
        this.retry = 0; //授权失败重试，重试最多三次
        this.lastTime = '';
        this.lastShopId = ''; //当前店铺id
        this.authorizationLink = '';
        const self = this;
        // RAP.on('back',function(e){
        //     let swibutton = self.state.switchbutton;
        //     self.savesetting(swibutton,function(rsp){
        //         Taro.showToast({
		// 			title: rsp.value,
		// 			icon: 'none',
		// 			duration: 2000
		// 		});
        //         GoToView({page_status:'pop'});
        //     });
        // });
    }

    // config: Config = {
    //     navigationBarTitleText: '库存预警'
    // }

    componentWillMount(){
        //获取用户设置信息
        let self = this;
        self.state.from = GetQueryString({name:'from'});
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     console.log('getUserInfo',info);
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.userNick = info.extraInfo.result.loginId;
        //         self.userId = info.extraInfo.result.userId;
        //         self.memberId = info.extraInfo.result.memberId;
        //     } else {
        //         self.userNick = info.nick;
        //         self.userId = info.userId;
        //     }
            self.getlastlog();
            //获取用户设置
            GetSyncSetting({
                userNick:self.userNick,
                SuccessCallBack:(rsp)=>{
                    if(rsp.code == 200){
                        let isopen = false;
                        let shopids = [];
                        let zero_option = '1';
                        let cycle = '7';
                        if(rsp.value.is_open == '1'){
                            isopen = true;
                        }
                        if(!IsEmpty(rsp.value.shopids)){
                            shopids = rsp.value.shopids;
                        }
                        if(!IsEmpty(rsp.value.zero_option)){
                            zero_option = rsp.value.zero_option;
                        }
                        if(!IsEmpty(rsp.value.cycle)){
                            cycle = rsp.value.cycle;
                        }
                        Taro.hideLoading();
                        let switchdisable = false;
                        if(IsEmpty(shopids)){
                            switchdisable = true;
                        }
                        //获取店铺列表
                        // 判断库里是否有店铺列表数据
                        self.getShops((result)=>{
                            if (!IsEmpty(result)) {
                                self.setState({
                                    shopList:result,
                                    isLoading:false,
                                    switchbutton:isopen,
                                    zerogroup:zero_option,
                                    timeGroup:cycle,
                                    chooseList:shopids,
                                    switchdisable:switchdisable
                                });
                            } else {
                                //没有数据  判断授权
                                self.sureAccess('taobao',false,true);
                            }
                        })
                    }else{
                        Taro.showToast({
                            title: '获取数据失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            })
        // }).catch((error) => {
        //     self.setState({
        //         shopList:[],
        //         isLoading:false
        //     });
        //     console.log(error);
        // });

    }

    componentDidMount(){
        DoBeacon('TD20181012161059','stockwarning_show',this.userNick);
    }
    //获取最后一条日志
    getlastlog=()=>{
        const self = this;
        let param = {};
        param.shopId = 'all';
        param.user_id = this.userId;
        param.search_txt = '';
        param.is_success = 'all';
        param.search_time = 10000;
        param.pagenum = 1;
        param.pageNo = 1;
        NetWork.Get({
            url:'dishelper/getsynclog',
            host:Domain.WECHART_URL,
            data:param
        },(rsp)=>{
            //有结果
            if(!IsEmpty(rsp.value)){
                self.setState({
                    lastsynctime:rsp.value[0].start_time,
                })
            }else{
                self.setState({
                    lastsynctime:'无',
                })
            }
        },(error)=>{
            Taro.showToast({
                title: '获取最近一次日志失败',
                icon: 'none',
                duration: 2000
            });
            self.setState({
                lastsynctime:'无',
            })
        });
    }
    //获取店铺列表
    getShops = (callback) =>{
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{}
        },(shopRes)=>{
            console.log('distribution/getProxyShopInfo',shopRes);
            //有数据
            if(!IsEmpty(shopRes.result)){
                let shopList = shopRes.result;
                let shopIds = [];
                shopList.map((item,key)=>{
                    shopIds.push(item.id);
                });
                //获取店铺授权信息
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
                    callback(shopList);
                },(error)=>{
                    alert(JSON.stringify(error));
                    callback(shopList);
                    Taro.hideLoading();
                });
            } else {
                callback([]);
            }

        },(error)=>{
            callback([]);
            alert(JSON.stringify(error));
            Taro.hideLoading();
        });
    }

    //渲染店铺列表
    renderRow = () =>{
        const { from , chooseList,shopList} = this.state;
        let doms = [] ;
        this.state.shopList.map((item,key) =>{
            let isChecked = false;
            for (let i = 0; i < chooseList.length; i++) {
                if (item.id == chooseList[i]) {
                    isChecked = true;
                    break;
                }
            }

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
                diaabledone = {diaabledone}
                checkboxStyle = {checkboxStyle}
                isChecked = {isChecked}
                checkboxOnChange = {this.checkboxOnChange}
                sureAccess = {this.sureAccess}
                hasAuth = {hasAuth}
                item = {item}
                />
            );
        });
        return doms;
    }

    //修改开关
    changeswitch = (value) =>{
        let self = this;
        if(value){
            DoBeacon('TD20181012161059','storkwarning_on',self.userNick);
        }
        this.setState({
            switchbutton:value
        })
        this.savesetting(value,function(rsp){
            Taro.showToast({
                title: rsp.value,
                icon: 'none',
                duration: 2000
            });
        });
    }

    //保存当前设置
    savesetting = (value,callback) =>{
        const self = this;
        let shopidsdata =[];
        for(let i=0;i<self.state.shopList.length;i++){
            let shopidsdataone ={};
            shopidsdataone.shopId = self.state.shopList[i].id;
            if(value){
                let index = self.state.chooseList.indexOf(shopidsdataone.shopId);
                if(index>-1){
                    shopidsdataone.isopen = 1;
                }else{
                    shopidsdataone.isopen = 0;
                }
            }else{
                shopidsdataone.isopen = 0;
            }
            shopidsdata.push(shopidsdataone);
        }
        var last=JSON.stringify(shopidsdata);
        NetWork.Post({
            url:'dishelper/putsyncsetting',
            host:Domain.WECHART_URL,
            params:{
                nick:self.userNick,
                userid:self.userId,
                shopids:last,
                cycle:self.state.timeGroup,
                zero_option:self.state.zerogroup,
            }
        },(rsp)=>{
            if(rsp.code == 200){
                callback(rsp);
            }else{
                Taro.showToast({
                    title: '获取数据失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    }
    //授权操作
    sureAccess = (shopType,isDialog,isFirst,shopId) =>{
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
                    Taro.showToast({
                        title: '暂支持添加当前登录账号绑定的淘宝店铺',
                        icon: 'none',
                        duration: 2000
                    });
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
                            Taro.hideLoading();
                        })
                    } else if (rsp.code == '404') {
                        Taro.hideLoading();
                        if (!isFirst) {
                            self.refs.sureDialog.show();
                            self.authorizationLink = rsp;
                            GoToView({status:rsp.authorLink,page_status:'special'});
                        } else {
                            self.setState({
                                isLoading:false
                            });
                        }
                    } else {
                        Taro.hideLoading();
                    }
                } else {
                    self.setState({
                        isLoading:false
                    });
                    Taro.hideLoading();
                }
            },(error)=>{
                alert(JSON.stringify(error));
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
        if(IsEmpty(chooseList)){
            this.setState({
                chooseList:chooseList,
                switchdisable:true,
            })
            if (this.state.switchbutton) {
                Taro.showToast({
                    title: '请至少选择一个店铺',
                    icon: 'none',
                    duration: 2000
                });
            }
        }else{
            this.setState({
                chooseList:chooseList,
                switchdisable:false,
            })
        }
    }
    //选择为0的操作
    zerogroup = (value) => {
        this.setState({
            zerogroup:value
        });
    }
    //选择同步周期
    timeGroup = (value) => {
        this.setState({
            timeGroup:value
        });
    }

    switchOnClick = () =>{
        console.log('switchOnClick',this.state.switchdisable,this.state.switchbutton);
        if (this.state.switchdisable) {
            Taro.showToast({
                title: '请至少选择一个店铺',
                icon: 'none',
                duration: 2000
            });
        }
    }
    render() {
        return (
            <View>
            <ScrollView style={{backgroundColor:'#f5f5f5'}}>
                <View style={styles.topswitch}>
                    <Text style={styles.topswitchText}>代销货品库存预警</Text>
                    {
                        this.state.switchbutton == undefined?'':(
                            <View style={styles.switchBox}>
                                <Switch
                                disabled={this.state.switchdisable}
                                checked={this.state.switchbutton}
                                onValueChange={this.changeswitch}
                                />
                                {
                                    this.state.switchdisable ?
                                    <View onClick={this.switchOnClick} style={styles.switchBoxDisable}></View>
                                    :
                                    ''
                                }
                            </View>
                        )
                    }

                </View>
                <Text style={styles.blocktext}>选择要开启库存预警的店铺</Text>
                {this.renderRow()}
                <Text style={styles.blocktext}>货源库存为0时，店铺中与该货源对应的分销商品如何处理</Text>
                <Radio.Group style={styles.groupWrap} onChange = {this.zerogroup} value={this.state.zerogroup}>
                    <View style={styles.groupitem}>
                        <Radio type="dot" value="1"></Radio>
                        <Text style={{fontSize:28,color:'#333333'}}>下架</Text>
                    </View>
                    <View style={styles.groupitem}>
                        <Radio type="dot" value="2"></Radio>
                        <Text style={{fontSize:28,color:'#333333'}}>删除并取消代销关系</Text>
                    </View>
                </Radio.Group>
                <Text style={styles.blocktext}>选择库存同步周期</Text>
                <Radio.Group style={styles.groupWrap} onChange = {this.timeGroup} value={this.state.timeGroup}>
                    <View style={styles.groupitem}>
                        <Radio type="dot" value="1"></Radio>
                        <Text style={{fontSize:28,color:'#333333'}}>每天</Text>
                        <Text style={{fontSize:24,color:'#999999',marginLeft:24}}>每天进行一次同步</Text>
                    </View>
                    <View style={styles.groupitem}>
                        <Radio type="dot" value="7"></Radio>
                        <Text style={{fontSize:28,color:'#333333'}}>每7天</Text>
                        <Text style={{fontSize:24,color:'#999999',marginLeft:24}}>开启同步功能后每7天进行一次同步</Text>
                    </View>
                </Radio.Group>
                <Text style={styles.blocktext}>开启微信通知</Text>
                <View style={[styles.topswitch,{marginTop:0}]} onClick={()=>{GoToView({status:'WechartMsg'});}}>
                    <Text style={styles.topswitchText}>关注“代发助手服务号”，接收库存预警通知</Text>
                    <View style={{flexDirection:'row',alignItems:'center',}} onClick={()=>{GoToView({status:'SyncLoglist'});}}>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#999999'}}/>
                    </View>
                </View>
                <View style={styles.topswitch}>
                    <Text style={styles.topswitchText}>同步日志</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{GoToView({status:'SyncLoglist'});}}>
                        <Text style={{fontSize:24,color:'#666666'}}>最近一次同步:{this.state.lastsynctime}</Text>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#999999'}}/>
                    </View>
                </View>
                <SureDialog
                ref={"sureDialog"}
                onSubmit={()=>{this.sureAccess(this.state.lastShopType,'sure',false,this.lastShopId)}}
                lastShopType={this.state.lastShopType}
                authorizationLink={this.authorizationLink}
                />
            </ScrollView>
            </View>
        );
  }
}