import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Image, Dialog, Input, Button } from '@tarojs/components';
import ChooseSkuDialog from '../../Component/ChooseSkuDialog';
import SideDialog from './SideDialog';
import ItemIcon from '../../Component/ItemIcon';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import { UitlsRap } from '../../Public/Biz/UitlsRap.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import SureDialog from '../../Component/SureDialog';
import styles from './styles';
import {Domain} from '../../Env/Domain';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 批量修改库存日志
 */
export default class DistributionLog extends Component {
    constructor(props) {
        super(props);
        let logStatus = GetQueryString({name:'status'});
        this.state={
            dataSource:[], //日志数据
            isLoading:false,
            showLoading:true,
            isRefreshing: false,
            refreshText: '↓ 下拉刷新',
            pageStatus:[ //铺货状态
                {name:'铺货中',itemTotal:0,status:'distributing'},
                {name:'铺货成功',itemTotal:0,status:'distributeSuccess'},
                {name:'铺货失败',itemTotal:0,status:'distributeFaild'},
                // {name:'关联成功',itemTotal:0,status:'relatedSuccess'},
                // {name:'关联失败',itemTotal:0,status:'relatedFaild'},
            ],
            iscreateWd:false,
            nowPageStatus:logStatus == '0' ? {name:'铺货失败',itemTotal:0,status:'distributeFaild'} : {name:'铺货成功',itemTotal:0,status:'distributeSuccess'},
            notChooseSpecs:'',
            lastChooseLog:{},
            choosedSkus:'',
            offerId:'',
            supplierMemberId:'',
        };
        this.isRestoring = false;       /* 是否正在还原中 一次还原一个 */
        this.keyWord = undefined;       /* 搜索的关键词 */
        this.dataSourceTotal = 0;       /* 满足条件记录总条数 */
        this.pageNo = 1;                /* 页码 */
        this.hasFilter = false;         /* 是否使用过筛选功能 */
        this.filterList = [];           /* 筛选数据 */
        this.dataSourceIsEmpty = false; /* 记录为空 */
        this.reAuthoration = {};
        this.retry = 0;
        this.authorizationLink = '';
        this.fromPage = '';
        this.shopList=[];
        let self = this;
        //修改完属性同步信息
        // RAP.on('App.change_attr_log',(data) => {
        //     self.setState({
        //         showLoading:true
        //     });
        //     Taro.showLoading({ title: '加载中...' });
        //     self.getDistributeLog(1,(result)=>{
        //         if(IsEmpty(result.result)){
        //             self.dataSourceIsEmpty = true;
        //         }
        //         self.setState({
        //             dataSource : result.result,
        //             showLoading:false
        //         });
        //         Taro.hideLoading();
        //     });
        // });

        //返回操作
        // RAP.on('back',function(e){
        //     if(self.fromPage == 'distributionresult'){
        //         GoToView({page_status:'popTo',pop_index:2});
        //     }else{
        //         GoToView({page_status:'pop'});
        //     }
        // });

    }

    // config: Config = {
    //     navigationBarTitleText: '铺货日志'
    // }

    componentWillMount(){
        let fromPage = GetQueryString({name:'fromPage'});
        this.fromPage = fromPage;
    }

    componentDidMount(){
        let self = this;
        let iscreateWd = false;
        Taro.showLoading({ title: '加载中...' });
        let logStatus = GetQueryString({name:'status'});
        if (!IsEmpty(logStatus)) {
            if (logStatus == '0') {
                this.state.nowPageStatus = this.state.pageStatus[2];
            }else if(logStatus == '2'){
                this.state.nowPageStatus = this.state.pageStatus[0];
            }
        }
        /* 获取日志 */
        self.getDistributeLog(1,(result)=>{
            if(IsEmpty(result.result)){
                self.dataSourceIsEmpty = true;
            }
            let resultData = result.result;
            self.getShops((data)=>{
                if (!IsEmpty(data)) {
                    let token = 0;
                    for(let i=0;i<data.length;i++){
                        if(data[i].shop_type == 'wc'){
                            token++;
                        }
                    }
                    if(token==0){
                        iscreateWd = false;
                    }else{
                        iscreateWd = true;
                    }
                } else {
                }
                self.setState({
                    dataSource : resultData,
                    showLoading:false,
                    iscreateWd:iscreateWd
                });
                // Taro.hideLoading();
            })

        });
    }


    //获取店铺列表
    getShops = (callback) =>{
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{
                // userId:this.userId,
                // userNick:this.userNick
            }
        },(shopRes)=>{
            console.log('distribution/getProxyShopInfo',shopRes);
            //有数据
            if(!IsEmpty(shopRes.result)){
                let shopList = shopRes.result;
                let shopIds = [];
                shopList.map((item,key)=>{
                    shopIds.push(item.id);
                });
                callback(shopList);
            } else {
                callback([]);
            }
            Taro.hideLoading();

        },(error)=>{
            callback([]);
            alert(JSON.stringify(error));
            Taro.hideLoading();
        });
    }

    //获取日志
    getDistributeLog=(pageNo,callback)=>{
        this.pageNo = pageNo;
        let self = this;
        let params = {
            pageNo:pageNo,
            modifiedTime:3,
        };
        this.filterList.forEach((e,i)=>{
            switch(e.name){
                case '铺货店铺':
                    switch(e.active){
                        /* 修改成功 */
                        case 1: params.shopType='taobao'; break;
                        /* 修改失败 */
                        case 2: params.shopType='pdd'; break;
                        case 3: params.shopType='wc'; break;
                    }
                    break;
                case '修改时间':
                    switch(e.active){
                        /* 近3天 */
                        case 0: params.modifiedTime=3; break;
                        /* 近7天 */
                        case 2: params.modifiedTime=7; break;
                        /* 近30天 */
                        case 3: params.modifiedTime=30; break;
                        /* 近90天 */
                        case 4: params.modifiedTime=90; break;
                    }
                    break;
            }
        });
        if(this.keyWord){
            params.keyWords=this.keyWord;
        }
        /* 判断是否使用了筛选功能 */
        if(!IsEmpty(params.shopType) || !IsEmpty(params.time)){
            this.hasFilter = true;
        }

        // if (this.state.nowPageStatus.status == 'distributeSuccess') {
        //     params.type = '1';
        // } else {
        //     params.type = '0';
        // }

        switch(this.state.nowPageStatus.status){
            case 'distributeSuccess':{
                params.type = '1';
            } break;
            case 'distributeFaild':{
                params.type = '0';
            } break;
            case 'distributing':{
                params.type = '2';
            } break;
            default: break;
        };

        // -------修改--------
        NetWork.Get({
            url:'Distributeproxy/getPropxDistributeLog',
            data:params
        },(rsp)=>{
            console.log('distribution/getPropxDistributeLog',rsp);
            if(!IsEmpty(rsp.results)){
                let result = rsp.results
                self.state.pageStatus.map((item,key)=>{
                    if (this.state.nowPageStatus.name == item.name) {
                        let count = rsp.results.count;
                        if(self.state.nowPageStatus.status=='distributing'){
                            LocalStore.Get(['movetoback_stopandreopen'],(backdata) => {
                                if(IsEmpty(backdata)||IsEmpty(backdata.movetoback_stopandreopen)||backdata.movetoback_stopandreopen=='[]'){

                                }else{
                                    let params = Parse2json(backdata.movetoback_stopandreopen);
                                    count = count*1+params.length*1;
                                }
                                self.state.pageStatus[key].itemTotal = count;
                                self.state.nowPageStatus.itemTotal = count;
                            });
                        }else{
                            self.state.pageStatus[key].itemTotal = count;
                            self.state.nowPageStatus.itemTotal = count;
                        }


                    }
                });
                if(self.state.nowPageStatus.status=='distributing'&&pageNo == 1){
                    LocalStore.Get(['movetoback_stopandreopen'],(backdata) => {
                        console.log('movetoback_stopandreopen',backdata);
                        if(IsEmpty(backdata)||IsEmpty(backdata.movetoback_stopandreopen)||backdata.movetoback_stopandreopen=='[]'){
                            callback(result);
                        }else{
                            let params = Parse2json(backdata.movetoback_stopandreopen);
                            let newparams = [];
                            let token = 0;
                            for(let i =0;i<params.length;i++){
                                let paramone = params[i];
                                NetWork.Get({
                                    url:'dishelper/getproinfo',
                                    host:Domain.WECHART_URL,
                                    params:{
                                        productid:params[i].productId,
                                    }
                                },(rsp)=>{
                                    //有结果
                                    if(!IsEmpty(rsp.value)){
                                        paramone.pic_url = rsp.value.image_path;
                                        paramone.title = rsp.value.name;
                                        paramone.createtime = params[i].startTime;
                                        paramone.reopen = 1;
                                        newparams.push(paramone);
                                    }
                                    token++;
                                    if(token >=params.length){
                                        let resultnew={
                                            result:newparams.concat(result.result)
                                        }
                                        callback(resultnew);
                                    }
                                },(error)=>{
                                    token++;
                                    if(token >=params.length){
                                        let resultnew={
                                            result:newparams.concat(result.result)
                                        }
                                        callback(resultnew);
                                    }
                                });

                            }
                        }

                    });
                }else{
                    callback(result);
                }

            }
            else {
                callback({result:[],count:0});
            }
            Taro.hideLoading();

        },(error)=>{
            alert(JSON.stringify(error));
            Taro.hideLoading();
            if (self.state.isRefreshing) {
                self.setState({
                    isRefreshing:false,
                    refreshText:'↓ 下拉刷新'
                });
            } else if(self.state.isLoading){
                self.setState({
                    isLoading:false
                });
            }
            callback({result:[],count:0});
        });
    }

    //显示模态框
    showModal = (name) => {
        this.refs[name].show();
    }
    //隐藏模态框
    hideModal = (name) => {
        this.refs[name].hide();
    }

    //确认筛选
    submitFilter = (filterList) =>{
        Taro.showLoading({ title: '加载中...' });
        let activeArr = [];
        let newActiveArr = [];
        filterList.forEach((e,i)=>{
            newActiveArr.push(e.active);
        });
        this.filterList.forEach((e,i)=>{
            activeArr.push(e.active);
        });
        this.refs.slideDialog.hide();
        /* 筛选和上次条件相同 则不处理 */
        if(newActiveArr.join() == activeArr.join()){
            return;
        }
        this.filterList = filterList;
        /* 重置无线滚动标志 */
        if (this.state.dataSource.length>0) {
            this.refs.mylist.resetLoadmore();
        }

        let self = this;
        this.getDistributeLog(1,(result)=>{
            self.setState({
                dataSource:result.result,
                isLoading:self.state.isLoading
            });
            Taro.hideLoading();
        });
    }

    //重置
    reset = () =>{
        this.hasFilter = false;
    }

    /* 搜索 */
    onChange=(value)=>{
        Taro.showLoading({ title: '加载中...' });
        this.keyWord = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        /* 重置无线滚动标志 */
        if (this.state.dataSource.length>0) {
            this.refs.mylist.resetLoadmore();
        }
        let self = this;
        this.getDistributeLog(1,(result)=>{
            self.setState({
                dataSource : result.result,
                isLoading:false
            });
            Taro.hideLoading();
        });
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
        self.getDistributeLog(this.pageNo,(result)=>{
            self.setState({
                dataSource: self.state.dataSource.concat(result.result),
                isLoading:false
            });
        });
    }

    //获取所有日志
    renderRow = (item, index) =>{
        let imgUrl = '';
        let title = '';
        if(!IsEmpty(item.pic_1688)){
            imgUrl = item.pic_1688;
        } else if (!IsEmpty(item.pic_url)) {
            imgUrl = item.pic_url;
        } else {
            imgUrl = 'https://cbu01.alicdn.com/images/app/detail/public/camera.gif';
        }

        if (!IsEmpty(item.origin_title)) {
            title = item.origin_title;
        } else if (!IsEmpty(item.title)) {
            title = item.title;
        } else {
            title = '暂无标题';
        }

        let btns = '';
        let distribute_mome = '';
        if (!IsEmpty(item.distribute_mome)){
            distribute_mome = item.distribute_mome;
            if (distribute_mome.indexOf('授权') >= 0) {
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('重新授权',item)}}
                    >重新授权</Button>
                    <Button type="secondary"
                    size="small" style={{marginLeft:px(24),width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('重新铺货',item)}}
                    >重新铺货</Button>
                </View>;
            } else if (distribute_mome.indexOf('保证金') >= 0) {
                distribute_mome = '该类目下您需先缴纳保证金';
            } else if (distribute_mome.indexOf('假一罚十') >= 0 || distribute_mome.indexOf('七天') >= 0 || distribute_mome.indexOf('24小时') >= 0 || distribute_mome.indexOf('智能匹配类目') >= 0) {
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('去设置',item)}}
                    >去设置</Button>
                </View>;
            } else if (distribute_mome.indexOf('CHENNEL_MANUAL_REVIEW') >= 0) {
                distribute_mome = '代销关系需要人工审核';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('申请分销',item)}}
                    >申请分销</Button>
                    <Button type="secondary"
                    size="small" style={{marginLeft:px(24),width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('重新铺货',item)}}
                    >重新铺货</Button>
                </View>;
            } else if (distribute_mome.indexOf('IC_CHECKSTEP_NO_PERMISSION') >= 0) {
                distribute_mome = '您未通过认证或已被处罚';
            } else if (distribute_mome.indexOf('NOT_SUPPLY_MARKETING_OFFER') >= 0) {
                distribute_mome = '该产品不支持代销';
                distribute_mome = '该商品不支持传淘宝，请尝试铺货到其他渠道';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(202),height:px(56)}}
                    onClick={()=>{this.btnOptions('铺货到其他店铺',item)}}
                    >铺货到其他店铺</Button>
                </View>;
            } else if (distribute_mome.indexOf('DESC_IMG_ILLEGAL') >= 0) {
                distribute_mome = '该产品的详情使用了淘宝其他店铺图片，无法代销，请联系供应商更换';
            } else if (distribute_mome.indexOf('广告商品或信息') >= 0) {
                distribute_mome = '标题含有批发，代理，求购类广告商品或信息';
            } else if (distribute_mome.indexOf('CHENNEL_REPEAT_REVIEW') >= 0) {
                distribute_mome = '渠道关系重复申请';
            } else if (distribute_mome.indexOf('DISTRIBUTOR_CONDITION_IS_INELIGIBLE') >= 0 ) {
                distribute_mome = '不符合代销招商条件';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('申请分销',item)}}
                    >申请分销</Button>
                    <Button type="secondary"
                    size="small" style={{marginLeft:px(24),width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('重新铺货',item)}}
                    >重新铺货</Button>
                </View>;
            } else if (distribute_mome.indexOf('Sentinel') >= 0 ) {
                distribute_mome = '1688接口异常';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{marginLeft:px(24),width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('重新铺货',item)}}
                    >重新铺货</Button>
                </View>;
            } else if (distribute_mome.indexOf('图片空间不足') >= 0 ) {
                distribute_mome = '图片空间不足';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{marginLeft:px(24),width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('重新铺货',item)}}
                    >重新铺货</Button>
                </View>;
            } else if (distribute_mome.indexOf('这不是供销offer') != -1 || distribute_mome.indexOf('无铺货入淘权限') != -1 ) {
                distribute_mome = '该商品不支持传淘宝，请尝试铺货到其他渠道';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(202),height:px(56)}}
                    onClick={()=>{this.btnOptions('铺货到其他店铺',item)}}
                    >铺货到其他店铺</Button>
                </View>;
            } else if (distribute_mome.indexOf('代销关系已存在') != -1) {
                distribute_mome = '您的店铺已代销过该货品，是否覆盖店铺里的商品？';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('覆盖原商品',item)}}
                    >覆盖原商品</Button>
                </View>;
            } else if (distribute_mome.indexOf('店铺不同意新协议') != -1) {
                distribute_mome = '请前往电脑版拼多多商家后台签署店铺协议后再重新铺货。';
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('复制链接',item)}}
                    >去签署</Button>
                </View>;
            } else if (distribute_mome.indexOf('商品规格中价格的范围过大') != -1 || distribute_mome.indexOf('sku的规格错误') != -1 || distribute_mome.indexOf('规格值过多') != -1 ) {
                if (distribute_mome.indexOf('商品规格中价格的范围过大') != -1) {
                    distribute_mome = '商品规格中价格的范围过大,您可以选择sku再次铺货';
                } else if (distribute_mome.indexOf('sku的规格错误') != -1) {
                    distribute_mome = 'sku的规格错误,您可以选择sku再次铺货';
                }
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(162),height:px(56)}}
                    onClick={()=>{this.btnOptions('选择规格铺货',item)}}
                    >选择规格铺货</Button>
                </View>;
            }
        }

        if (item.isonsale == '0') {
            if (distribute_mome.indexOf('必填属性未填') >= 0) {
                btns =
                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                    <Button type="secondary"
                    size="small" style={{width:px(152),height:px(56)}}
                    onClick={()=>{this.btnOptions('修改并上架',item)}}
                    >修改并上架</Button>
                </View>;
            }
        }

        if (this.state.nowPageStatus.status == 'distributeSuccess' && item.shop_type == 'wc' && distribute_mome.indexOf('您的店铺已代销过该货品') <= -1) {
            btns =
            <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                <Button type="secondary"
                size="small" style={{width:px(200),height:px(56)}}
                onClick={()=>{this.btnOptions('修改代销信息',item)}}
                >修改代销信息</Button>
            </View>;
        }


        return (
            <View style={[{width:px(750)},index == 0 ? {}:{marginTop:px(24)}]}>
                <View style={styles.cardLine}>
                    <View onClick={()=>{this.goToDetail(item.origin_num_iid)}}>
                        <Image src={imgUrl}
                        style={styles.listImg}
                        resizeMode={"contain"}
                        />
                    </View>
                    <View style={styles.cardRight}>
                        <View onClick={()=>{this.goToDetail(item.origin_num_iid)}} style={{height:px(68)}}>
                            <Text style={{fontSize:px(28),width:px(478)}}>{title}</Text>
                        </View>
                        {/*
                            <View style={styles.icon}>
                                <Text style={{fontSize:px(24)}}>货号:{item.cagoNumber}</Text>
                            </View>
                        */}
                        <View style={{marginTop:px(5),flexDirection:'row',}}>
                            <Text style={{fontSize:px(24)}}>铺货时间:{item.createtime}</Text>
                            {
                                this.state.nowPageStatus.status == 'distributing'&&IsEmpty(item.reopen)?(<View style={{flex:1,alignItems:'flex-end'}}><Text style={{fontSize:px(24),color:'#FF6000',textAlign:'right'}}>正在铺货…</Text></View>):null
                            }
                        </View>
                        {!IsEmpty(item.reopen)?(
                        <View style={{flexDirection:'row',marginTop:px(5),alignItems:'center',flex:1}}>
                            {/* <Button type="secondary" size="small" style={{width:px(200),height:px(56)}} onClick={()=>{this.stopandreopen(item)}}>继续铺货</Button> */}
                            <Text style={{color:'#ff6000',fontSize:px(24)}}>铺货超时，请点击继续铺货</Text>

                        </View>):
                        (<View style={{flexDirection:'row',marginTop:px(5),alignItems:'center'}}>
                            <Image src={item.shop_url} style={{width:48,height:48}}/>
                            <Text style={{marginLeft:px(8),color:'#666666',fontSize:px(24)}}>{item.shop_name}</Text>
                        </View>)}

                    </View>
                </View>

                {!IsEmpty(item.reopen)?(
                    <View style={styles.btnLineright}>
                        {/* <Text style={[{fontSize:px(24),color:'#ff6000'},!IsEmpty(btns)?{width:px(300)}:{width:px(700)}]}>
                        {distribute_mome}
                        </Text> */}
                        <Button type="secondary" size="small" style={{marginLeft:px(24),width:px(152),height:px(56)}} onClick={()=>{this.stopandreopen(item)}}>继续铺货</Button>
                    </View>):(
                    !IsEmpty(distribute_mome) ?
                        (<View style={styles.btnLine}>
                            <Text style={[{fontSize:px(24),color:'#ff6000'},!IsEmpty(btns)?{width:px(300)}:{width:px(700)}]}>
                            {distribute_mome}
                            </Text>
                            {btns}
                        </View>)
                        :
                        (
                            !IsEmpty(btns) ?
                            <View style={styles.btnLine}>
                                {btns}
                            </View>
                            :
                            ''
                        )
                )

                }
            </View>
        );
    }
    //跳转官方商品详情
    goToDetail=(productId)=>{
        console.log('gotoproductId',productId)
        if(this.state.nowPageStatus.status=='distributing'){
            console.log('铺货中不跳转');
        }else{
            GoToView({status:'https://detail.1688.com/offer/'+productId+'.html',page_status:'special'});
        }
    }


    //下拉刷新
    handleRefresh = () => {
        //显示加载中
        this.setState({
           isRefreshing: true,
           refreshText: '加载中...'
        });

        //获取第一页数据
        this.getDistributeLog(1,(result)=>{
            if(IsEmpty(result.result)){
                this.dataSourceIsEmpty = true;
            }
            this.setState({
                dataSource:result.result,
                isRefreshing:false,
                refreshText:'↓ 下拉刷新'
            });
        });
        if (this.state.dataSource.length>0) {
            this.refs.mylist.resetLoadmore();
        }
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

    //授权操作
    getAuthorization = (shop,isDialog) =>{
        let self = this;

        let params = {
            shopType:shop.shop_type,
            shopId:shop.shop_id
        };
        if (isDialog) {
            this.refs.sureDialog.hide();
        }
        if (this.retry <3) {
            this.retry++;
            NetWork.Get({
                url:'Distributeproxy/proxyGetAiyongAuthorization',
                data:params
            },(rsp)=>{
                console.log('Distributeproxy/proxyGetAiyongAuthorization',rsp);
                //有授权 更新结果
                if (!IsEmpty(rsp.code)) {
                    if(rsp.code=='200'){
                        Taro.showToast({
                            title: '授权成功',
                            icon: 'none',
                            duration: 2000
                        });
                    } else if (rsp.code == '404') {
                        Taro.hideLoading();
                        self.refs.sureDialog.show();
                        setTimeout(function(){
                            //参数构建
                            self.authorizationLink = rsp;
                            GoToView({status:rsp.authorLink,page_status:'special'});
                        },1000);
                    }
                }
            },(error)=>{
                alert(JSON.stringify(error));
            });
        } else {
            this.retry = 0;
        }
    }

    //操作
    btnOptions = (type,item) =>{
        const self = this;
        let shopId = item.shop_id;
        let shopType = item.shop_type;
        this.reAuthoration = item;
        switch (type) {
            case '重新授权':{
                this.getAuthorization(this.reAuthoration);
            } break;
            case '重新铺货':{
                let list =[{
                    id:item.shop_id,
                    shop_type:item.shop_type,
                    shop_name:item.shop_name,
                    num_iid:item.num_iid,
                    origin_num_iid:item.origin_num_iid,
                    pic_url:item.shop_url,
                    choosedSkus:this.state.choosedSkus
                }];
                let hasPdd = false;
                let pddShopId = [];
                if (item.shop_type == 'pdd') {
                    hasPdd = true;
                    pddShopId.push(item.shop_id);
                }

                if (hasPdd) {
                    Taro.showLoading({ title: '加载中...' });
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
                        Taro.hideLoading();

                        if (!IsEmpty(rsp.result)) {
                            notSetShop = rsp.result;
                            GoToView({status:'DistributionSetting',query:notSetShop.join(',')});
                        } else {
                            if (this.fromPage == 'distributeResult') {
                                console.log('list',list);
                                // RAP.emit('APP.log_distribute_redo',{list:list,offerId:item.origin_num_iid,supplierMemberId:item.origin_id,logId:item.id});
                                GoToView({page_status:'pop'});
                            } else {
                                LocalStore.Set({'go_to_distribution_list':JSON.stringify(list)});
                                GoToView({status:'DistributionResult',query:{
                                    offerId:item.origin_num_iid,
                                    supplierMemberId:item.origin_id,
                                    from:'distributeLog',
                                    logId:item.id,
                                    isfromself:'1',
                                }});
                            }
                        }
                    },(error)=>{
                        Taro.hideLoading();
                        alert(JSON.stringify(error));
                    });
                } else {
                    if (this.fromPage == 'distributeResult') {
                        // RAP.emit('APP.log_distribute_redo',{list:list,offerId:item.origin_num_iid,logId:item.id});
                        GoToView({page_status:'pop'});
                    } else {
                        LocalStore.Set({'go_to_distribution_list':JSON.stringify(list)});
                        GoToView({status:'DistributionResult',query:{
                            offerId:item.origin_num_iid,
                            supplierMemberId:item.origin_id,
                            from:'distributeLog',
                            logId:item.id,
                            isfromself:'1',
                        }});
                    }
                }

            } break;
            case '修改并上架':{
                let resultData = {
                    from:'log',
                    log_id:item.id,
                    shop_id:item.shop_id,
                    shop_name:item.shop_name,
                    shop_type:item.shop_type,
                    shop_url:item.shop_url
                };
                LocalStore.Set({'go_to_change_attributes':JSON.stringify(resultData)});
                GoToView({status:'DistributionChanges'});
            } break;
            case '去设置':{
                GoToView({status:'DistributionSetting',query:shopId});
            } break;
            case '申请分销':{
                GoToView({status:"https://page.1688.com/html/fa9028cc.html?sellerId=" + item.origin_id,page_status:'special'});
            } break;
            case '联系供应商':{
                UitlsRap.openChat(item.origin_login_name);
            } break;
            case '覆盖原商品':{
                if(shopType == 'wc'){
                    let param = {
                        shopName:item.shop_name,
                        shopType:item.shop_type,
                        shopId:item.shop_id,
                        productId:item.origin_num_iid,
                        numIid:item.origin_num_iid,
                        needDelete:'0',
                        type:'cancelAndDel'
                    };
                    this.deleteLocalRelation(param,0,(isSuccess)=>{
                        console.log('deleteLocalRelation',isSuccess);
                        Taro.hideLoading();
                        if (isSuccess) {
                            this.btnOptions('重新铺货',item);
                        } else {
                            Taro.showToast({
                                title: '覆盖原商品失败，请重试',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    });
                }else{
                    Taro.showLoading({ title: '加载中...' });
                    //判断该商品是否存在于列表中
                    NetWork.Get({
                        url:'Orderreturn/getShopProduct',
                        data:{
                            productId:item.origin_num_iid,
                            shopType:shopType,
                            shopId:shopId
                        }
                    },(rsp)=>{
                        console.log('Orderreturn/getShopProduct',rsp);
                        if (!IsEmpty(rsp)){
                            if (rsp.code == '500') {
                                //授权失效
                                Taro.hideLoading();
                                Taro.showToast({
                                    title: '店铺授权失效，请去店铺列表授权',
                                    icon: 'none',
                                    duration: 2000
                                });
                            } else if (rsp.code == '101') {
                                //商品不存在 取消代销后重新铺货
                                if (shopType == 'taobao') {
                                    NetWork.Post({
                                        url:"Distributeproxy/unLinkConsignSellItem",
                                        data:{
                                            productId: item.origin_num_iid
                                        }
                                    },(result)=>{
                                        console.log('unLinkConsignSellItem',result);
                                        //不管是否成功
                                        let param = {
                                            shopName:item.shop_name,
                                            shopType:item.shop_type,
                                            shopId:item.shop_id,
                                            productId:item.origin_num_iid,
                                            numIid:rsp.num_iid,
                                            needDelete:'0',
                                            type:'cancelAndDel'
                                        };
                                        this.deleteLocalRelation(param,0,(isSuccess)=>{
                                            console.log('deleteLocalRelation',isSuccess);
                                            Taro.hideLoading();
                                            if (isSuccess) {
                                                this.btnOptions('重新铺货',item);
                                            } else {
                                                Taro.showToast({
                                                    title: '覆盖原商品失败，请重试',
                                                    icon: 'none',
                                                    duration: 2000
                                                });
                                            }
                                        });
                                    },(error)=>{
                                        Taro.hideLoading();
                                        Taro.showToast({
                                            title: '服务器开小差啦，请稍后重试',
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    });
                                } else {
                                    let param = {
                                        shopName:item.shop_name,
                                        shopType:item.shop_type,
                                        shopId:item.shop_id,
                                        productId:item.origin_num_iid,
                                        numIid:rsp.num_iid,
                                        needDelete:'0',
                                        type:'cancelAndDel'
                                    };
                                    this.deleteLocalRelation(param,0,(isSuccess)=>{
                                        console.log('deleteLocalRelation',isSuccess);
                                        Taro.hideLoading();
                                        if (isSuccess) {
                                            this.btnOptions('重新铺货',item);
                                        } else {
                                            Taro.showToast({
                                                title: '覆盖原商品失败，请重试',
                                                icon: 'none',
                                                duration: 2000
                                            });
                                        }
                                    });
                                }
                            } else if (rsp.code == '200') {
                                Taro.hideLoading();
                                //商品存在 告知成功
                                Taro.showToast({
                                    title: '商品已覆盖',
                                    icon: 'none',
                                    duration: 2000
                                });
                            }
                        }
                        //有数据
                    },(error)=>{
                        Taro.hideLoading();
                        Taro.showToast({
                            title: '服务器开小差啦，请稍后重试',
                            icon: 'none',
                            duration: 2000
                        });
                    });
                }
            } break;
            case '复制链接':{
                UitlsRap.clipboard('https://mms.pinduoduo.com',()=>{
                    Taro.showToast({
                        title: '链接已复制，请复制到浏览器中打开',
                        icon: 'none',
                        duration: 2000
                    });
                });
            } break;
            case '铺货到其他店铺':{
                this.refs.addDialog.show();
                this.setState({
                    offerId:item.origin_num_iid,
                    supplierMemberId:item.origin_id,
                });
            } break;
            case '选择规格铺货':{
                //弹出选择sku弹窗
                this.getNotChooseSkus(item.origin_num_iid,(notChooseSpecs)=>{
                    console.log('选择规格铺货--notChooseSpecs',notChooseSpecs);
                    this.setState({
                        notChooseSpecs:notChooseSpecs.split(','),
                        offerId:item.origin_num_iid,
                        lastChooseLog:item,
                        supplierMemberId:item.origin_id,
                    });

                    console.log('选择规格铺货--setState-notChooseSpecs',this.state.notChooseSpecs);


                    console.log('选择规格铺货',item);
                    this.refs.skuDialog.show();
                });
            } break;
            case '修改代销信息':{
                GoToView({
                    status:'Sellbysetting',
                    query:{
                        numIid:item.num_iid,
                        productId:item.origin_num_iid,
                        shopid:item.shop_id
                    }
                });
            } break;
            default: break;
        }
    }

    //更新state sku的弹窗用
    updateStates = (obj) =>{
        this.setState({
            ...obj
        });
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

    //sku弹窗确定按钮回调
    skuDistribute = (skus) =>{
        this.state.choosedSkus = skus;
        this.refs.skuDialog.hide();
        this.btnOptions('重新铺货',this.state.lastChooseLog);
    }

    //删除当前代销关系
    deleteLocalRelation = (param,retry,callback) =>{
        NetWork.Post({
            url:'Orderreturn/deleteRelation',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/deleteRelation',rsp);
            if (!IsEmpty(rsp)) {
                callback(true);
            } else {
                callback(false);
            }
        },(error)=>{
            if (retry < 3) {
                retry++;
                this.deleteLocalRelation(param,retry,callback);
            } else {
                callback(false);
            }
        });
    }
    //断点续传
    stopandreopen=(data)=>{
        const self = this;
        Taro.showLoading({ title: '加载中...' });
        let param = {
            productId:data.productId,
            shopList:data.shopList,
            startTime:data.startTime,
        };
        if (!IsEmpty(data.supplierMemberId)) {
            param.supplierMemberId = data.supplierMemberId;
        }
        if (!IsEmpty(data.logId)) {
            param.logId = data.logId;
        }
        if (!IsEmpty(data.skuIds)) {
            param.skuIds = data.skuIds;
        }
        NetWork.Get({
            url:'Distributeproxy/distributionProxy1688',
            data:param
        },(rsp)=>{
            console.log('distribution/distributionProxy1688',rsp);
            LocalStore.Get(['movetoback_stopandreopen'],(result) => {
                console.log('movetoback_stopandreopen',result);
                if(IsEmpty(result)||IsEmpty(result.movetoback_stopandreopen)||result.movetoback_stopandreopen=='[]'){
                }else{
                    let params = Parse2json(result.movetoback_stopandreopen);
                    let num = -1;
                    for(let i =0;i<params.length;i++){
                        if(data.productId ==params[i].productId){
                            num = i;
                        }
                        if(num!=-1){
                            params.splice(num,1);
                        }

                    };
                    LocalStore.Set({'movetoback_stopandreopen':JSON.stringify(params)},()=>{
                        setTimeout(() => {
                            this.getDistributeLog(1,(result)=>{
                                self.setState({
                                    dataSource:result.result,
                                });
                                Taro.hideLoading();
                            });
                        }, 2000);

                    });
                }
            });
        },(error)=>{
            Taro.showToast({
                title: '铺货失败，稍后再试',
                icon: 'none',
                duration: 2000
            });
        });
    }
    //空列表的内容
    renderNull = (item,index) =>{
        return (
            <View style={{flex:1}}>
                <View style={styles.midContent}>
                    <ItemIcon code={"\ue61d"} iconStyle={{fontSize:px(140),color:'#e6e6e6'}}/>
                    <View style={{marginTop:px(40)}}>
                        <Text style={{fontSize:px(24),color:'#666'}}>
                            没有符合条件的日志
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    //改变状态
    changeStaus=(item)=>{
        this.state.nowPageStatus = item;
        Taro.showLoading({ title: '加载中...' });
        this.getDistributeLog(1,(result)=>{
            if(IsEmpty(result.result)){
                this.dataSourceIsEmpty = true;
            }
            this.setState({
                dataSource : result.result,
                showLoading:false,
                nowPageStatus:item
            });
            // Taro.hideLoading();
        });
    }

    //获取所有状态
    getMenus=()=>{
        let doms=[];
        this.state.pageStatus.map((item,key)=>{
            doms.push(
                <View style={this.state.nowPageStatus.name==item.name?styles.activeStatus:styles.statusItem} onClick={()=>{this.changeStaus(item)}}>
                    <Text style={[styles.normalText,this.state.nowPageStatus.name==item.name?styles.activeText:'']}>
                    {item.name}
                    {
                        this.state.nowPageStatus.name==item.name ?
                        '(' + item.itemTotal + ')'
                        :
                        ''
                    }
                    </Text>
                </View>
            );
        });
        return doms;
    }

    render(){
        let content='';
        if (this.state.showLoading) {
            content='';
        } else {
            if (this.state.dataSource.length>0) {
                content=
                <ListView
                ref='mylist'
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderFooter={this.renderFooter}
                renderHeader={this.renderHeader}
                onEndReached={this.onEndReached}
                showScrollbar={false}
                />;
            } else {
                content=
                <ListView
                dataSource={['null']}
                renderHeader={this.renderHeader}
                renderRow={this.renderNull}
                showScrollbar={false}
                />;
            }
        }

        let hasFilted = false;
        this.filterList.forEach((e,i)=>{
            if (e.active != 0) {
                hasFilted = true;
            }
        });
        return (
            <View>
                <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                    <View style={styles.headSelect}>
                        <View style={styles.headLeft}>
                            <Input style={styles.headInput} placeholder={"输入搜索关键词"} onChange={this.onChange}/>
                            <ItemIcon code={"\ue6ac"} iconStyle={styles.searchIcon}/>
                        </View>
                        <View style={styles.headRight} onClick={this.showModal.bind(this,'slideDialog')}>
                            <Text style={[{fontSize:px(28)},hasFilted ? {color:'#ff6000'}:{color:'#4A4A4A'}]}>筛选</Text>
                            <ItemIcon code={"\ue6f1"} iconStyle={[{fontSize:px(38),marginLeft:px(10)},hasFilted ? {color:'#ff6000'}:{color:'#4A4A4A'}]} onClick={this.showModal.bind(this,'slideDialog')}/>
                        </View>
                    </View>
                    <View style={styles.statusList}>
                        {this.getMenus()}
                    </View>
                    {content}
                </View>
                <SideDialog
                ref='slideDialog'
                reset={this.reset}
                submitFilter={this.submitFilter}
                filterList={this.filterList}
                ></SideDialog>
                <SureDialog
                    ref={"sureDialog"}
                    onSubmit={()=>{this.getAuthorization(this.reAuthoration,true)}}
                    lastShopType={this.reAuthoration.shop_type}
                    authorizationLink={this.authorizationLink}
                />
                <ChooseSkuDialog ref={"skuDialog"}
                offerId={this.state.offerId}
                updateStates={this.updateStates}
                from="chooseMore"
                notChooseSpecs={this.state.notChooseSpecs}
                showLoading={()=>{Taro.showLoading({ title: '加载中...' });}}
                hideLoading={()=>{Taro.hideLoading();}}
                skuDistribute = {this.skuDistribute}
                />
                <Dialog ref={"addDialog"} duration={1000} maskStyle={styles.maskStyle} contentStyle={styles.modal2Style} maskClosable={false}>
                    <View style={styles.dialogContent}>
                        <View style={styles.dialogBody}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{fontSize:32,color:'#333333',fontWeight:600}}>您还可以铺货到</Text>
                            </View>
                            <View style={styles.shopLine}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png" style={{width:70,height:70}}/>
                                </View>
                                <Text style={{color:'#333333',fontSize:28,marginLeft:16}}>拼多多店铺</Text>
                                <View style ={{flexDirection:'row',justifyContent:'flex-end',flex:1}}>
                                    <Button size="small"
                                    type="secondary"
                                    onClick={()=>{
                                        GoToView({status:'DistributionShops',query:{offerId:this.state.offerId,supplierMemberId:this.state.supplierMemberId}});
                                    }}
                                    >立即铺货</Button>
                                </View>
                            </View>
                            <View style={styles.shopLine}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/weichatLogo.png" style={{width:70,height:70}}/>
                                </View>
                                <Text style={{color:'#333333',fontSize:28,marginLeft:16}}>爱用旺铺</Text>
                                {/* <Text style={{color:'#999999',fontSize:22,width:280,marginLeft:24}}>您的专属店铺，即将上线...</Text> */}
                                <View style ={{flexDirection:'row',justifyContent:'flex-end',flex:1}}>
                                    {/* {
                                        this.state.iscreateWd?(
                                        <Button size="small"
                                        type="secondary"
                                        onClick={()=>{
                                            RAP.emit('App.checkwc');
                                            GoToView({status:'DistributionShops',query:{iswd:1}});

                                        }}
                                        >立即铺货</Button>):(
                                       )
                                    } */}
                                        <Button size="small"
                                        type="secondary"
                                        onClick={()=>{
                                            GoToView({status:'DistributionShops',query:{offerId:this.state.offerId,supplierMemberId:this.state.supplierMemberId}});
                                        }}
                                        >立即铺货</Button>
                                </View>
                            </View>
                            <View style={styles.shopLine}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/sumaitongLogo.png" style={{width:70,height:70}}/>
                                </View>
                                <Text style={{color:'#333333',fontSize:28,marginLeft:16}}>速卖通店铺</Text>
                                <View style ={{flexDirection:'row'}}>
                                    <Text style={{color:'#999999',fontSize:22,marginLeft:24}}>努力开发中......</Text>
                                </View>
                            </View>
                            <View style={[styles.shopLine,{borderBottomColor:'#ffffff'}]}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/lazadaLogo.png" style={{width:70,height:70}}/>
                                </View>
                                <View style={[styles.imgBox,{marginLeft:24}]}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/amazonLogo.png" style={{width:70,height:70}}/>
                                </View>
                                <View  style={[styles.imgBox,{marginLeft:24}]}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/facebookLogo.png" style={{width:70,height:70}}/>
                                </View>
                                <Text style={{color:'#999999',fontSize:22,width:290,marginLeft:24}}>更多平台敬请期待......</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:24}}>
                                <Button size="small"
                                type="normal"
                                style={{marginLeft:12,width:256}}
                                onClick={()=>{this.refs.addDialog.hide();}}
                                >我知道了</Button>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </View>
        );
    }
}
