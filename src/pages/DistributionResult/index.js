import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Image, ScrollView} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import AyButton from '../../Component/AyButton/index';
import Dialog from '../../Component/Dialog';
import Event from 'ay-event';
import ChooseSkuDialog from '../../Component/ChooseSkuDialog';
import SureDialog from '../../Component/SureDialog';
// import Floattop from '../../Public/Components/Floattop';
import ItemIcon from '../../Component/ItemIcon';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import GetTimeString from '../../Public/Biz/GetTimeString.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import { UitlsRap } from '../../Public/Biz/UitlsRap.js';
import styles from './styles';
import {Domain} from '../../Env/Domain';
import {DoBeacon} from '../../Public/Biz/DoBeacon';
import GoodsProductMap from '../../Component/GoodsProductMap';
import px from '../../Biz/px.js';

/**
 * @author cy
 * 铺货过程和结果页面
 */
export default class DistributionResult extends Component {
    constructor(props) {
        super(props);
        this.state={
            gridData:[],        //更多货源
            distributList:[],   //铺货店铺列表
            lastDistribute:{},  //当前铺货店铺
            doList:[
                {id:0,name:'优化商品标题',isOk:false},
                {id:1,name:'编辑商品属性',isOk:false},
                {id:2,name:'优化商品主图',isOk:false},
                {id:3,name:'优化商品详情描述',isOk:false},
                {id:4,name:'生成手机详情',isOk:false},
                {id:5,name:'设置商品价格',isOk:false},
                {id:6,name:'设置商品库存',isOk:false},
                {id:7,name:'设置运费模板',isOk:false},
                {id:8,name:'设置商品自定义分类',isOk:false}
            ], //铺货过程显示
            isOk:false, //是否铺货结束
            iscreateWd:false, //是否创建过旺铺
            disResult:[], //铺货结果
            isFromManage:'', //是否从首页进入
            notChooseSpecs:'', //不可选择的sku
            lastChooseLog:{}, //当前选择的log
            choosedSkus:'',
            openfloat:true,
            floatdata:[]
        };
        this.offerId = '';
        this.retry = 0;
        this.reAuthoration = {};
        this.logId = '';
        this.supplierMemberId = '';     //供应商memberId
        this.from = '';                 //来自的页面
        this.authorizationLink = '';    //授权链接
        this.shopList=[];               //店铺列表
        this.userNick='';
        this.userInfo='';
        this.isfromself='';
        this.type = "";
        this.loading = '';

        let self = this;
        //修改属性后刷新
        Event.on('App.change_attr_back',(data) => {
            let disResult = self.state.disResult;
            for (let i = 0; i < disResult.length; i++) {
                if (data.shopId == disResult[i].shop_id) {
                    disResult[i].resText = '铺货成功';
                    disResult[i].btnText = '查看日志';
                    disResult[i].dis_result.isonsale = true;
                }
            }
            self.setState({
                disResult:disResult
            });
        });
        //修改设置后刷新
        Event.on('App.change_setting_back',(data) => {
            let disResult = self.state.disResult;
            for (let i = 0; i < disResult.length; i++) {
                if (data.shopId == disResult[i].shop_id) {
                    disResult[i].btnText = '重新铺货';
                }
            }
            self.setState({
                disResult:disResult
            });
        });
        //重新铺货
        Event.on('App.log_distribute_redo',(data) => {
            let list = data.list;
            self.offerId = data.offerId;
            self.logId = data.logId;
            let doList = [
                {id:0,name:'优化商品标题',isOk:false},
                {id:1,name:'编辑商品属性',isOk:false},
                {id:2,name:'优化商品主图',isOk:false},
                {id:3,name:'优化商品详情描述',isOk:false},
                {id:4,name:'生成手机详情',isOk:false},
                {id:5,name:'设置商品价格',isOk:false},
                {id:6,name:'设置商品库存',isOk:false},
                {id:7,name:'设置运费模板',isOk:false},
                {id:8,name:'设置商品自定义分类',isOk:false}
            ];
            if (list[0].shop_type == 'pdd') {
                doList = [
                    {id:0,name:'优化商品标题',isOk:false},
                    {id:1,name:'编辑商品属性',isOk:false},
                    {id:2,name:'优化商品主图',isOk:false},
                    {id:3,name:'优化商品详情描述',isOk:false},
                    {id:4,name:'设置商品价格',isOk:false},
                    {id:5,name:'设置商品库存',isOk:false},
                    {id:6,name:'设置运费模板',isOk:false},
                ];
            }

            console.log('choosedSkus',list[0]);
            let choosedSkus = '';
            if (!IsEmpty(list[0].choosedSkus)) {
                choosedSkus = list[0].choosedSkus;
                self.state.choosedSkus = choosedSkus;
            }

            self.setState({
                distributList:list,
                lastDistribute:list[0],
                doList:doList,
                isOk:false,
                disResult:[]
            });

            let startTime = GetTimeString('YY-MM-DD hh:mm:ss');
            self.distributionMain(0,list,[],startTime);
        });

        //返回操作
        Event.on('back',(data) => {
            this.moveToBack('pop');
        });
    }

    config = {
        navigationBarTitleText: '正在铺货'
    }

    componentWillMount(){
        const self = this;
        this.setState({
            openfloat:true,
        })
        self.userInfo = {
            loginId:'萌晓月cy'
        };
        self.userNick = '萌晓月cy';
        DoBeacon('TD20181012161059','distributing_show',result.result.loginId);   
        this.gethaoqiproducts();
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         this.userNick = info.extraInfo.result.loginId;
        //     } else {
        //         this.userNick = info.nick;
        //     }
        // });
    }

    componentDidMount(){
        let self = this;
        let distributList = this.state.distributList;
        let disResult = [];
        let iscreateWd = false;
        self.offerId = GetQueryString({name:'offerId',self:this});
        self.type = GetQueryString({
        	name: 'type',self:this
        });
        self.supplierMemberId = GetQueryString({name:'supplierMemberId',self:this});
        self.from = GetQueryString({name:'from',self:this});
        self.isfromself = GetQueryString({name:'isfromself',self:this});
        //获取铺货信息
        LocalStore.Get(['go_to_distribution_list','is_from_distribution_manage'],(result) => {
            console.log('go_to_distribution_list',result);
            if (!IsEmpty(result)) {
                let distributList = Parse2json(result.go_to_distribution_list);
                let doList = self.state.doList;
                if (distributList[0].shop_type == 'pdd') {
                    doList = [
                        {id:0,name:'优化商品标题',isOk:false},
                        {id:1,name:'编辑商品属性',isOk:false},
                        {id:2,name:'优化商品主图',isOk:false},
                        {id:3,name:'优化商品详情描述',isOk:false},
                        {id:4,name:'设置商品价格',isOk:false},
                        {id:5,name:'设置商品库存',isOk:false},
                        {id:6,name:'设置运费模板',isOk:false},
                    ];
                }

                let choosedSkus = '';
                if (!IsEmpty(distributList[0].ischoosedSkus)&&distributList[0].ischoosedSkus==1) {

                }else{
                    if (!IsEmpty(distributList[0].choosedSkus)) {
                        choosedSkus = distributList[0].choosedSkus;
                        this.state.choosedSkus = choosedSkus;
                    }
                }


                //获取所有店铺
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

                    this.setState({
                        doList:doList,
                        distributList:distributList,
                        lastDistribute:distributList[0],
                        isFromManage:result.is_from_distribution_manage,
                        iscreateWd:iscreateWd
                    });

                })

                Portal.remove(this.loading);
                let startTime = GetTimeString('YY-MM-DD hh:mm:ss');
                this.distributionMain(0,distributList,disResult,startTime);
            }
        });
    }
    //随机获取好奇服饰的4个商品图
    gethaoqiproducts = () =>{
        let self = this;
        self.gethaoqilist(0,4,function(rsp){
            let gridData = [];
            for(let i=0;i<rsp.value.length;i++){
                let gridDataone = {};
                gridDataone.image = "https://cbu01.alicdn.com/"+rsp.value[i].picURI;
                gridData.push(gridDataone);
            }
            self.setState({
                floatdata:gridData,
            })
        });

    }
    //封装获取好奇服饰的数据
    gethaoqilist=(page_no,num,callback)=>{
        NetWork.Post({
			url:'dishelper/getprodect',
			host:Domain.WECHART_URL,
			params:{
				memberId:'b2b-4231258709e4d2b',
				page:page_no,
				pagenum:num,
			}
		},(rsp)=>{
			if(rsp.code == 200){
                callback(rsp);
			}else{
                Toast.info(rsp.value, 2);
			}

		});
    }
    //生成随机数
    random=(min,max)=> {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    //获取更多货源数据
    getSumSuggest = ()=>{
        let self = this;
        console.log('kankanoffid',self.offerId)
        NetWork.Get({
            url:'dishelper/getprocidinfo',
            host:Domain.WECHART_URL,
            data:{
                productid:self.offerId
            }
        },(rsp)=>{
            //有结果
            if(!IsEmpty(rsp.value)){
                console.log('kankanleimu',rsp)
                if(rsp.value==1){
                    self.getproducts();
                }else{
                    self.getguess();
                }
            }else{
                self.getguess();
            }
        },(error)=>{
            self.getguess();
        });

    }
    //获取猜你喜欢数据
    getguess =()=>{
        const self = this;
        NetWork.Get({
            url:"Distributeproxy/guessDaiXiaoOffer",
            data:{
				companyMemberId: self.userInfo.memberId,
				pageSize: 8,
			}
        },(result)=>{
            console.log('gridDataSource', result);
            if (!IsEmpty(result.result) && !IsEmpty(result.result.result)) {
                result = result.result.result;
    			if (result.count > 0) {
    				let dataarr = [];
    				for (let i in result.offerList) {
    					try {
    						let data = {};
    						data.title = result.offerList[i].subject;
    						data.primaryID = result.offerList[i].id;
    						data.price = result.offerList[i].price;
    						data.image = result.offerList[i].imageUrlMobile;
    						data.bookedCount = result.offerList[i].bookedCount;//90天成交笔数
    						data.gmtPost = result.offerList[i].gmtPost;//发布时间
    						data.memberId = result.offerList[i].memberId;
    						data.quantitySumMonth = result.offerList[i].quantitySumMonth;//月销售件数
    						dataarr[dataarr.length] = data;
    					} catch (error) {
    						console.error(error);
    					}
                    }
                    self.setState({
                        gridData:dataarr,
                    })
    			}
            }
        },(error)=>{
			console.error(error);
        });
    }
    //获取好奇服饰更多货源
    getproducts = () =>{
        let self = this;
        self.gethaoqilist(0,8,function(rsp){
				let gridData = [];
				for(let i=0;i<rsp.value.length;i++){
					let gridDataone = {};
					gridDataone.image = "https://cbu01.alicdn.com/"+rsp.value[i].picURI;
					gridDataone.price = rsp.value[i].sellPrice;
					gridDataone.title = rsp.value[i].productTitle;
					gridDataone.primaryID = rsp.value[i].productId;
					gridDataone.bookedCount = '';
					gridDataone.quantitySumMonth = '';
					gridDataone.memberId = 'b2b-4231258709e4d2b';
					gridData.push(gridDataone);
				}
                self.setState({
                    gridData:gridData,
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

        },(error)=>{
            callback([]);
            console.error(error);
            Portal.remove(this.loading);
        });
    }


    //递归调用铺货
    distributionMain = (index,list,disResult,startTime) =>{
        let self = this;
        console.log(index,list);
        let shopList = list[index].id+':'+list[index].shop_type;
        let param = {
            productId:self.offerId,
            shopList:shopList,
            type: self.type,
            startTime:startTime
        };
        if (!IsEmpty(self.supplierMemberId)) {
            param.supplierMemberId = self.supplierMemberId;
        }
        if (!IsEmpty(self.logId)) {
            param.logId = self.logId;
        }
        if(!IsEmpty(list[0].ischoosedSkus)&&list[0].ischoosedSkus==1){
            if (!IsEmpty(list[index].choosedSkus)) {
                param.skuIds = list[index].choosedSkus;
                self.state.choosedSkus = '';
            }
        }else{
            if (!IsEmpty(self.state.choosedSkus)) {
                param.skuIds = self.state.choosedSkus;
                self.state.choosedSkus = '';
            }
        }

        console.log('kankancanshu',param);
        //调用铺货
        NetWork.Get({
            url:'Distributeproxy/distributionProxy1688',
            data:param
        },(rsp)=>{
            console.log('distribution/getProxyShopInfo',rsp);
            //有数据
        },(error)=>{
            console.error(error);
        });
        if (index > 0) {
            let doList = [
                {id:0,name:'优化商品标题',isOk:false},
                {id:1,name:'编辑商品属性',isOk:false},
                {id:2,name:'优化商品主图',isOk:false},
                {id:3,name:'优化商品详情描述',isOk:false},
                {id:4,name:'生成手机详情',isOk:false},
                {id:5,name:'设置商品价格',isOk:false},
                {id:6,name:'设置商品库存',isOk:false},
                {id:7,name:'设置运费模板',isOk:false},
                {id:8,name:'设置商品自定义分类',isOk:false}
            ];
            if (list[index].shop_type == 'pdd') {
                doList = [
                    {id:0,name:'优化商品标题',isOk:false},
                    {id:1,name:'编辑商品属性',isOk:false},
                    {id:2,name:'优化商品主图',isOk:false},
                    {id:3,name:'优化商品详情描述',isOk:false},
                    {id:4,name:'设置商品价格',isOk:false},
                    {id:5,name:'设置商品库存',isOk:false},
                    {id:6,name:'设置运费模板',isOk:false},
                ];
            }
            this.setState({
                doList:doList
            });
        }

        let j = 0;
        let isTrue = true;

        console.log('-1-----setInterval-----',GetTimeString());
        //定时刷新页面
        self.interval = setInterval(() => {
            try {
                if (j == self.state.doList.length) {
                    console.log('-1-----clearInterval-----',GetTimeString());
                    clearInterval(self.interval);
                    index++;
                    if (index < list.length) {
                        self.setState({
                            lastDistribute:list[index]
                        });
                        self.distributionMain(index,list,disResult,startTime);
                    }
                } else {
                    self.state.doList[j].isOk = true;
                    self.setState({
                        doList:self.state.doList
                    });
                    j++;

                    //获取铺货结果
                    NetWork.Get({
                        url:'Distributeproxy/getDistributeResult',
                        data:{
                            startTime:startTime
                        }
                    },(rsp)=>{
                        console.log('distribution/getDistributeResult',rsp);
                        if (!IsEmpty(rsp.results)) {
                            //有数据
                            let result = rsp.results;
                            let isEnd = true;

                            for (var i = 0; i < result.length; i++) {
                                if (IsEmpty(result[i].dis_result)) {
                                    isEnd = false;
                                }
                            }

                            if(isEnd){
                                j=9;
                                let doList = [
                                    {id:0,name:'优化商品标题',isOk:true},
                                    {id:1,name:'编辑商品属性',isOk:true},
                                    {id:2,name:'优化商品主图',isOk:true},
                                    {id:3,name:'优化商品详情描述',isOk:true},
                                    {id:4,name:'生成手机详情',isOk:true},
                                    {id:5,name:'设置商品价格',isOk:true},
                                    {id:6,name:'设置商品库存',isOk:true},
                                    {id:7,name:'设置运费模板',isOk:true},
                                    {id:8,name:'设置商品自定义分类',isOk:true}
                                ];
                                if (list[index].shop_type == 'pdd') {
                                    doList = [
                                        {id:0,name:'优化商品标题',isOk:true},
                                        {id:1,name:'编辑商品属性',isOk:true},
                                        {id:2,name:'优化商品主图',isOk:true},
                                        {id:3,name:'优化商品详情描述',isOk:true},
                                        {id:4,name:'设置商品价格',isOk:true},
                                        {id:5,name:'设置商品库存',isOk:true},
                                        {id:6,name:'设置运费模板',isOk:true},
                                    ];
                                    j=7;
                                }
                                self.setState({
                                    doList:doList
                                });
                                if(result.length  == list.length){
                                    console.log('--------取到结果------结束------');
                                    for (let i = 0; i < result.length; i++) {
                                        disResult.push(result[i]);
                                    }
                                    isTrue = true;
                                    for (let i = 0; i < disResult.length; i++) {
                                        if (!IsEmpty(disResult[i].dis_result)) {
                                            disResult[i].dis_result = Parse2json(disResult[i].dis_result);
                                            let resultInfo = disResult[i].dis_result;
                                            if (!IsEmpty(resultInfo.result) && resultInfo.result == 'fail') {
                                                disResult[i].resText = '铺货失败';
                                                if (resultInfo.error_msg.indexOf('授权') != -1) {
                                                    disResult[i].btnText = '重新授权';
                                                } else if (resultInfo.error_msg.indexOf('代销关系') != -1) {
                                                    disResult[i].btnText = '';
                                                    if (self.from == 'hasCancelRelation') {
                                                        //把它挪出去
                                                        this.removeProductList(list[index]);
                                                    }
                                                } else if (resultInfo.error_msg.indexOf('惩罚') != -1) {
                                                    disResult[i].btnText = '';
                                                } else if (resultInfo.error_msg.indexOf('假一罚十') != -1 || resultInfo.error_msg.indexOf('七天') != -1 || resultInfo.error_msg.indexOf('24小时') != -1 || resultInfo.error_msg.indexOf('智能匹配类目') != -1) {
                                                    disResult[i].btnText = '去设置';
                                                } else {
                                                    disResult[i].btnText = '重新铺货';
                                                }

                                                if (resultInfo.error_msg.indexOf('分销关系已存在') != -1) {
                                                    if (self.from == 'hasCancelRelation') {
                                                        //把它挪出去
                                                        this.removeProductList(list[index],'remove');
                                                    }
                                                }
                                            } else {
                                                if (self.from == 'hasCancelRelation') {
                                                    //把它挪出去
                                                    this.removeProductList(list[index]);
                                                } else {
                                                    Event.emit('App.product_list_reload',{});
                                                }
                                                if(resultInfo.isonsale){
                                                    disResult[i].resText = '铺货成功';
                                                    disResult[i].btnText = '查看日志';
                                                } else {
                                                    if (!IsEmpty(disResult[i].dis_result.error_msg)) {
                                                        disResult[i].resText = '上架失败';
                                                        if (resultInfo.ismust && list[index].shop_type == 'taobao') {
                                                            disResult[i].dis_result.error_msg = '必填属性未填';
                                                            disResult[i].btnText = '修改并上架';
                                                        }
                                                    } else {
                                                        disResult[i].resText = '铺货成功';
                                                        disResult[i].btnText = '查看日志';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    console.log('结果：',disResult);
                                    self.getSumSuggest();
                                    self.setState({
                                        disResult:disResult,
                                        openfloat:false,
                                        isOk:true
                                    });
                                }
                            } else {
                                if (list[index].shop_type == 'pdd') {
                                    if (j==6) {
                                        j--;
                                    }
                                } else {
                                    if (j==8) {
                                        j--;
                                    }
                                }

                            }
                        } else {
                            Toast.info('铺货异常，请查看铺货日志或重新铺货！', 2);
                            clearInterval(self.interval);
                            GoToView({page_status:'pop'});
                        }
                    },(error)=>{
                        // console.error(error);
                    });
                }
            } catch (e) {
                console.log(e);
                Toast.info('铺货异常，请查看铺货日志或重新铺货！', 2);
                clearInterval(self.interval);
                GoToView({page_status:'pop'});
            }
        },4000);
    }

    //删除代销关系
    removeProductList = (item,type) =>{
        let param = {
            shopName:item.shop_name,
            shopType:item.shop_type,
            shopId:item.id,
            productId:item.origin_num_iid,
            numIid:item.num_iid,
            type:'delete',
            needDelete:'0'
        };
        if (!IsEmpty(type)) {
            param.type = "remove";
        }
        NetWork.Get({
            url:'Orderreturn/deleteRelation',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/deleteRelation',rsp);
            //有数据
            Event.emit('App.product_list_reload',{});
        },(error)=>{
            console.error(error);
        });
    }

    //后台执行
    moveToBack = (goto) =>{
        let {lastDistribute,distributList,doList} = this.state;
        let lestList = [];
        let self = this;
        let lastIdx = 0;
        this.loading = Toast.loading('加载中...');

        if (!doList[0].isOk) {
            setTimeout(function(){
                console.log('3秒后执行');
            },3000);
        }

        for (let i = 0; i < distributList.length; i++) {
            if (lastDistribute.id == distributList[i].id) {
                lastIdx = i;
                break;
            }
        }

        for (let i = 0; i < distributList.length; i++) {
            if (i > lastIdx ) {
                lestList.push(distributList[i]);
            }
        }
        console.log('lestList',lestList);

        if (lestList.length > 0) {
            //将剩余的任务发送
            let shopList = [];
            let endchoosedSkus = '';
            for (let i = 0; i < lestList.length; i++) {
                let str = lestList[i].id+':'+lestList[i].shop_type;
                shopList.push(str);
                if(!IsEmpty(lestList[i].choosedSkus)){
                    endchoosedSkus = lestList[i].choosedSkus;
                }
            }

            let param = {
                productId:self.offerId,
                shopList:shopList.join(','),
                startTime:GetTimeString('YY-MM-DD hh:mm:ss')
            };
            if (!IsEmpty(self.supplierMemberId)) {
                param.supplierMemberId = self.supplierMemberId;
            }
            if (!IsEmpty(self.logId)) {
                param.logId = self.logId;
            }
            if(!IsEmpty(distributList[0].ischoosedSkus)&&distributList[0].ischoosedSkus==1){
                if(!IsEmpty(endchoosedSkus)){
                    param.skuIds = endchoosedSkus;
                    self.state.choosedSkus = '';
                }
            }else{
                if (!IsEmpty(self.state.choosedSkus)) {
                    param.skuIds = self.state.choosedSkus;
                    self.state.choosedSkus = '';
                }
            }

            NetWork.Get({
                url:'Distributeproxy/distributionProxy1688',
                data:param
            },(rsp)=>{
                console.log('distribution/distributionProxy1688',rsp);
                // LocalStore.Get(['movetoback_stopandreopen'],(result) => {
                //     console.log('movetoback_stopandreopen',result);
                //     if(IsEmpty(result)||IsEmpty(result.movetoback_stopandreopen)||result.movetoback_stopandreopen=='[]'){
                //         let params = [];
                //         params.push(param);
                //         LocalStore.Set({'movetoback_stopandreopen':JSON.stringify(params)});
                //     }else{
                //         let params = Parse2json(result.movetoback_stopandreopen);
                //         params.push(param);
                //         LocalStore.Set({'movetoback_stopandreopen':JSON.stringify(params)});
                //     }
                //     Portal.remove(self.loading);
                //     self.goback(goto);
                // });
                Portal.remove(self.loading);
                self.goback(goto);
            },(error)=>{
                LocalStore.Get(['movetoback_stopandreopen'],(result) => {
                    console.log('movetoback_stopandreopen',result);
                    if(IsEmpty(result)||IsEmpty(result.movetoback_stopandreopen)||result.movetoback_stopandreopen=='[]'){
                        let params = [];
                        params.push(param);
                        LocalStore.Set({'movetoback_stopandreopen':JSON.stringify(params)});
                    }else{
                        let params = Parse2json(result.movetoback_stopandreopen);
                        params.push(param);
                        LocalStore.Set({'movetoback_stopandreopen':JSON.stringify(params)});
                    }
                    Portal.remove(self.loading);
                    self.goback(goto);
                });
            });
        } else {
            Portal.remove(self.loading);
            self.goback(goto);
        }
    }

    //后台执行跳转的页面控制
    goback=(goto)=>{
        let self = this;
        let pageindex = 1;
        if(self.isfromself == '1'){
            pageindex = 2;
        }
        switch (goto){
            case 'log':{
                GoToView({status:'DistributionLog',query:{status:2,fromPage:'distributionresult'}});
            }break;
            case 'goback':{
                DoBeacon('TD20181012161059','distributing_click_background',self.userNick);
                if(pageindex==1){
                    Event.emit('App.getrunning');
                }
                GoToView({page_status:'popTo',pop_index:pageindex});
                // GoToView({page_status:'pop'});

            }break;
            case 'pop':{
                Event.emit('App.getrunning');
                GoToView({page_status:'pop'});
            }break;
            case 'gomore':{
                DoBeacon('TD20181012161059','distributing_click_moregoods',self.userNick);
                GoToView({status:'DistributionManage',query:{activeKey:'source'},clearTop:true});
            }break;
            case 'gogoods':{
                DoBeacon('TD20181012161059','distributing_click_goodslist',self.userNick);
                GoToView({status:'DistributionManage',query:{activeKey:'log'},clearTop:true});
            }break;
            case 'goorder':{
                DoBeacon('TD20181012161059','distributing_click_orderlist',self.userNick);
                GoToView({status:'DistributionManage',query:{activeKey:'order'},clearTop:true});
            }break;
            case 'gomanage':{
                if(self.state.isOk){
                    DoBeacon('TD20181012161059','distributedone_click_ordernotification',self.userNick);
                }else{
                    DoBeacon('TD20181012161059','distributing_click_ordernotification',self.userNick);
                }
                GoToView({status:'DistributionManage',clearTop:true});
            }break;
            case 'goodssupplier':{
                DoBeacon('TD20181012161059','distributing_click_AD',self.userNick);
                let supplierdata = JSON.stringify({
                    "supplierid":"湖州昊麒服饰",
                    "supplierimg":"https://q.aiyongbao.com/1688/web/img/haoqifushi.png",
                    "suppliertitle":"湖州昊麒服饰",
                    "supplierphone":"18267228999",
                    "suppliertag":"一件代发,源头商家",
                    "supplierwangwang":"湖州昊麒服饰",
                    "memberId":"b2b-4231258709e4d2b"
                });
                let supplierdatanew = encodeURI(supplierdata);
                GoToView({status:'SupplierGoods',query:{fromPage:'DistributionResult',supplierdata:supplierdatanew}});
            }break;
        }

    }

    //渲染正在铺货界面
    renderDistributing = ()=>{
        let toImage = '';
        let toName = '';
        console.log('shop_type',this.state.lastDistribute.shop_type);
        switch (this.state.lastDistribute.shop_type) {
            case 'taobao':{
                toImage = 'https://q.aiyongbao.com/1688/web/img/preview/shopTao.png';
                toName = '淘宝';
            } break;
            case 'pdd':{
                toImage = 'https://q.aiyongbao.com/1688/web/img/preview/shopPinDD.png';
                toName = '拼多多';
            } break;
            case 'wc':{
                toImage = 'https://q.aiyongbao.com/1688/web/img/preview/wangpu.png';
                toName = '旺铺';
            } break;
            default:{
                toImage = 'https://q.aiyongbao.com/1688/web/img/preview/shopTao.png';
                toName = '淘宝';
            } break;
        }


        return (
            <ScrollView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <View style={styles.headLine}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image src="https://q.aiyongbao.com/1688/web/img/preview/shop1688.png" style={{width:px(70),height:px(70)}}/>
                        <Image src="https://q.aiyongbao.com/1688/web/img/toDistributeLogo.gif" style={{width:px(200),height:px(70),marginLeft:px(20)}}/>
                        <Image src={toImage} style={{width:px(70),height:px(70),marginLeft:px(20)}}/>
                    </View>
                    <Text style={{fontSize:px(24),color:'#4a4a4a',marginTop:px(24)}}>正在铺货到您的{this.state.lastDistribute.shop_name}店铺</Text>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:px(24)}}>
                        <Text style={{fontSize:px(24),color:'#4a4a4a',}}>你可以选择后台执行，在</Text>
                        <Text style={{fontSize:px(24),color:'rgb(11,125,255)',}} onClick={()=>{this.moveToBack('log')}}>铺货日志</Text>
                        <Text style={{fontSize:px(24),color:'#4a4a4a',}}>中随时查看铺货进度</Text>
                    </View>
                    <View style={{width:px(700),flexDirection:'row',alignItems:'center',marginTop:px(48),justifyContent:'space-between'}}>
                        <AyButton type="primary" style={{height:56,width:152}} onClick={()=>{this.moveToBack('gomore')}}>更多货源</AyButton>
                        <AyButton type="primary" style={{height:56,width:152}} onClick={()=>{this.moveToBack('gogoods')}}>代销货品</AyButton>
                        <AyButton type="primary" style={{height:56,width:152}} onClick={()=>{this.moveToBack('goorder')}}>代销订单</AyButton>
                        <AyButton type="primary" style={{height:56,width:152}} onClick={()=>{this.moveToBack('goback')}}>后台执行</AyButton>
                    </View>
                </View>
                <View style={{marginTop:px(24),backgroundColor:"#ffffff"}}>
                    {
                        this.state.doList.map((item,key)=>{
                            return (
                                <View style={styles.doingLine}>
                                    <Text style={{fontSize:px(28),color:'#333333'}}>{item.name}</Text>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                    {
                                        item.isOk ?
                                        <ItemIcon code={"\ue62f"} iconStyle={{fontSize:px(40),color:'#ff6000'}}/>
                                        :
                                        <Image src="https://q.aiyongbao.com/1688/web/img/distribution_loading.gif" style={{width:px(40),height:px(40)}}/>
                                    }
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                {
                    this.state.openfloat?(
                    <View style={{width:px(750),height:px(200),backgroundColor:'transparent',position:'absolute',bottom:px(24),alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:px(700),height:px(200),alignItems:'center',paddingLeft:px(24),paddingRight:px(24),paddingBottom:px(24),backgroundColor:'#F1E6D6',borderRadius: px(8), borderWidth:px(0),borderColor:'#9D6C3F',}}>
                        <View style={{width:px(652),alignItems:'center',flexDirection:'row',justifyContent:'space-between',marginBottom:px(12),marginTop:px(12)}}>
                            <Text style={{color:'#9D6C3F',fontSize:px(24)}}>特价尾货1折起</Text>
                            <ItemIcon onClick={()=>{this.closefloat()}} code={"\ue69a"}  iconStyle={{color:'#999999'}}/>
                        </View>
                        <View style={{width:px(652),alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                            {this.getfloatdata()}
                            <ItemIcon onClick={()=>{this.moveToBack('goodssupplier')}} code={"\ue6a7"}  iconStyle={{fontSize:48,color:'#9D6C3F'}}/>
                        </View>
                    </View>
                </View>):null
                }

            </ScrollView>
        );
    }
    //关闭悬浮广告窗
    closefloat=()=>{
        const self = this;
        self.setState({
            openfloat:false
        })
    }
    //获取悬浮窗口的图片数据
    getfloatdata=()=>{
        const self = this;
        let dom=[];
        self.state.floatdata.map((item,key)=>{
            dom.push(<Image onClick={()=>{this.moveToBack('goodssupplier')}} src={item.image} style={{width:px(130),height:px(130),borderRadius: px(8), borderWidth:px(2),borderColor:'#9D6C3F',}}/>)
        });
        return dom;
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
                        let disResult = this.state.disResult;
                        for (var i = 0; i < disResult.length; i++) {
                            if (disResult[i].shop_id == shop.shop_id) {
                                disResult[i].btnText = '重新铺货';
                            }
                        }
                        this.setState({
                            disResult:disResult
                        });
                    } else if (rsp.code == '404') {
                        Portal.remove(self.loading);
                        self.refs.sureDialog.show();
                        self.authorizationLink = rsp;
                        GoToView({status:rsp.authorLink,page_status:'special'});
                    }
                }
            },(error)=>{
                console.error(error);
            });
        } else {
            this.retry = 0;
        }
    }

    //铺货结果的操作
    btnOptions = (type,item) =>{
        let shopId = '';
        let shopType = '';
        let distributList = [];
        for (var i = 0; i < this.state.distributList.length; i++) {
            if (item.shop_id == this.state.distributList[i].id) {
                shopId = this.state.distributList[i].id;
                shopType = this.state.distributList[i].shop_type;
                this.reAuthoration = item;
                distributList.push(this.state.distributList[i]);
            }
        }
        switch (type) {
            case '重新授权':{
                this.getAuthorization(this.reAuthoration);
            } break;
            case '重新铺货':{
                this.logId = item.id;
                let doList = [
                    {id:0,name:'优化商品标题',isOk:false},
                    {id:1,name:'编辑商品属性',isOk:false},
                    {id:2,name:'优化商品主图',isOk:false},
                    {id:3,name:'优化商品详情描述',isOk:false},
                    {id:4,name:'生成手机详情',isOk:false},
                    {id:5,name:'设置商品价格',isOk:false},
                    {id:6,name:'设置商品库存',isOk:false},
                    {id:7,name:'设置运费模板',isOk:false},
                    {id:8,name:'设置商品自定义分类',isOk:false}
                ];
                if (shopType == 'pdd') {
                    doList = [
                        {id:0,name:'优化商品标题',isOk:false},
                        {id:1,name:'编辑商品属性',isOk:false},
                        {id:2,name:'优化商品主图',isOk:false},
                        {id:3,name:'优化商品详情描述',isOk:false},
                        {id:4,name:'设置商品价格',isOk:false},
                        {id:5,name:'设置商品库存',isOk:false},
                        {id:6,name:'设置运费模板',isOk:false},
                    ];
                }
                this.setState({
                    isOk:false,
                    distributList:distributList,
                    lastDistribute:distributList[0],
                    doList:doList,
                    disResult:[]
                });
                let startTime = GetTimeString('YY-MM-DD hh:mm:ss');
                this.distributionMain(0,distributList,[],startTime);
            } break;
            case '修改并上架':{
                LocalStore.Set({'go_to_change_attributes':JSON.stringify(item)});
                GoToView({status:'DistributionChanges'});
            } break;
            case '查看日志':{
                GoToView({status:'DistributionLog',query:{fromPage:'distributResult'}});
            } break;
            case '去设置':{
                GoToView({status:'DistributionSetting',query:{query:shopId,from:shopId}});
            } break;
            case '申请分销':{
                GoToView({status:"https://page.1688.com/html/fa9028cc.html?sellerId=" + item.origin_id,page_status:'special'});
            } break;
            case '更多货源':{
                Event.emit('App.change_tabbar_status',{status:'source'});
                GoToView({page_status:'popTo',pop_index:1});
            } break;
            case '覆盖原商品':{
                if(shopType == 'wc'){
                    let param = {
                        shopName:item.shop_name,
                        shopType:item.shop_type,
                        shopId:item.shop_id,
                        productId:this.offerId,
                        numIid:this.offerId,
                        needDelete:'0',
                        type:'cancelAndDel'
                    };
                    this.deleteLocalRelation(param,0,(isSuccess)=>{
                        console.log('deleteLocalRelation',isSuccess);
                        Portal.remove(this.loading);
                        if (isSuccess) {
                            this.btnOptions('重新铺货',item);
                        } else {
                            Toast.info('覆盖原商品失败，请重试', 2);
                        }
                    });
                }else{
                    this.loading = Toast.loading('加载中...');
                    //判断该商品是否存在于列表中
                    NetWork.Get({
                        url:'Orderreturn/getShopProduct',
                        data:{
                            productId:this.offerId,
                            shopType:shopType,
                            shopId:shopId
                        }
                    },(rsp)=>{
                        console.log('Orderreturn/getShopProduct',rsp);
                        if (!IsEmpty(rsp)){
                            if (rsp.code == '500') {
                                //授权失效
                                Portal.remove(this.loading);
                                Toast.info('店铺授权失效，请去店铺列表授权', 2);
                            } else if (rsp.code == '101') {
                                //商品不存在 取消代销后重新铺货
                                if (shopType == 'taobao') {
                                    NetWork.Post({
                                        url:'Distributeproxy/unLinkConsignSellItem',
                                        data:{
                                            productId: this.offerId
                                        }
                                    },(result)=>{
                                        console.log('unLinkConsignSellItem',result);
                                        //不管是否成功
                                        let param = {
                                            shopName:item.shop_name,
                                            shopType:item.shop_type,
                                            shopId:item.shop_id,
                                            productId:this.offerId,
                                            numIid:rsp.num_iid,
                                            needDelete:'0',
                                            type:'cancelAndDel'
                                        };
                                        this.deleteLocalRelation(param,0,(isSuccess)=>{
                                            console.log('deleteLocalRelation',isSuccess);
                                            Portal.remove(this.loading);
                                            if (isSuccess) {
                                                this.btnOptions('重新铺货',item);
                                            } else {
                                                Toast.info('覆盖原商品失败，请重试', 2);
                                            }
                                        });
                                    },(error)=>{
                                        Portal.remove(this.loading);
                                        Toast.info('服务器开小差啦，请稍后重试', 2);
                                    });
                                } else {
                                    let param = {
                                        shopName:item.shop_name,
                                        shopType:item.shop_type,
                                        shopId:item.shop_id,
                                        productId:this.offerId,
                                        numIid:rsp.num_iid,
                                        needDelete:'0',
                                        type:'cancelAndDel'
                                    };
                                    this.deleteLocalRelation(param,0,(isSuccess)=>{
                                        console.log('deleteLocalRelation',isSuccess);
                                        Portal.remove(this.loading);
                                        if (isSuccess) {
                                            this.btnOptions('重新铺货',item);
                                        } else {
                                            Toast.info('覆盖原商品失败，请重试', 2);
                                        }
                                    });
                                }

                            } else if (rsp.code == '200') {
                                //商品存在 告知成功
                                Portal.remove(this.loading);
                                Toast.info('商品已覆盖', 2);
                            }
                        }
                        //有数据
                    },(error)=>{
                        Portal.remove(this.loading);
                        Toast.info('服务器开小差啦，请稍后重试', 2);
                    });
                }
            } break;
            case '复制链接':{
                UitlsRap.clipboard('https://mms.pinduoduo.com',()=>{
                    Toast.info('复制成功', 2);
                });
            } break;
            case '铺货到其他店铺':{
                this.refs.addDialog.show();
            } break;
            case '去分享':{
                console.log('查看item',item)
                DoBeacon('TD20181012161059','good_wcshop_share_click',this.userNick);
                let shopname = encodeURI(item.shop_name);
                if(item.has_smallroutine == 1){
                    GoToView({status:'Intowd',query:{shopid:item.shop_id,shopname:shopname}});
                }else{
                    GoToView({status:'Openwd',query:{shopid:item.shop_id,shopname:shopname}});
                }
            } break;
            case '选择规格铺货':{
                //弹出选择sku弹窗
                this.getNotChooseSkus((notChooseSpecs)=>{
                    this.setState({
                        notChooseSpecs:notChooseSpecs.split(','),
                        lastChooseLog:item
                    });
                    this.refs.skuDialog.show();
                });
            } break;
            case '修改代销信息':{
                GoToView({
                    status:'Sellbysetting',
                    query:{
                        numIid:this.offerId,
                        productId:this.offerId,
                        shopid:item.shop_id
                    }
                });
            } break;
            default: break;
        }
    }

    //删除本地的代销关系
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

    //渲染铺货完成界面
    renderDistributed = ()=>{
        let faildNum = 0;
        this.state.disResult.map((item,key)=>{
            let resultInfo = item.dis_result;
            if (resultInfo.result == 'fail') {
                faildNum++;
            }
        });

        let disText = '';
        if (faildNum == 0) {
            disText = '铺货完成！';
        } else if (faildNum == this.state.disResult.length) {
            disText = '铺货失败！';
        } else {
            disText = '部分铺货失败！';
        }


        return (
            <ScrollView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <View style={styles.headLine}>
                    <ItemIcon code={faildNum>0 ? "\ue666":"\ue6b1"} iconStyle={{fontSize:px(100),color:'#ff6000'}}/>
                    <Text style={{fontSize:px(28),color:'#4a4a4a',marginTop:px(12)}}>{disText}</Text>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:px(12)}}>
                        <Text style={{fontSize:px(28),color:'#4a4a4a'}}>您可以</Text>
                        <Text style={{fontSize:px(28),color:'#027CFF',marginLeft:px(16)}}
                        onClick={()=>{GoToView({status:'DistributionLog',query:{fromPage:'distributeResult'}})}}>查看铺货日志</Text>
                        <Text style={{fontSize:px(28),color:'#027CFF',marginLeft:px(16)}}
                        onClick={()=>{GoToView({page_status:'pop'})}}>继续铺货</Text>
                    </View>
                    <View style={{width:550,flexDirection:'row',alignItems:'center',marginTop:px(48),justifyContent:'space-between'}}>
                        <AyButton type="primary" style={{height:px(56),width:px(152)}} onClick={()=>{this.moveToBack('gomore')}}>更多货源</AyButton>
                        <AyButton type="primary" style={{height:px(56),width:px(152)}} onClick={()=>{this.moveToBack('gogoods')}}>代销货品</AyButton>
                        <AyButton type="primary" style={{height:px(56),width:px(152)}} onClick={()=>{this.moveToBack('goorder')}}>代销订单</AyButton>
                    </View>
                </View>
                <View style={{marginTop:24,backgroundColor:'#ffffff'}}>
                    <View style={styles.resultLine}>
                        <Text style={{fontSize:px(28),color:'#666666'}}>铺货结果</Text>
                    </View>
                    {
                        this.state.disResult.map((item,key)=>{
                            let btn = null;
                            let resText = '';
                            let resultInfo = item.dis_result;
                            let btnText = item.btnText;
                            let needToCopy = false;
                            let distributeOther = false;

                            let errorMessage = '';
                            if (!IsEmpty(resultInfo.error_msg)) {
                                errorMessage = resultInfo.error_msg;
                                if (resultInfo.error_msg.indexOf('CHENNEL_MANUAL_REVIEW') != -1 ) {
                                    errorMessage = '代销关系需要人工审核';
                                } else if (resultInfo.error_msg.indexOf('IC_CHECKSTEP_NO_PERMISSION') != -1 ) {
                                    errorMessage = '您未通过认证或已被处罚';
                                } else if (resultInfo.error_msg.indexOf('NOT_SUPPLY_MARKETING_OFFER') != -1 ) {
                                    errorMessage = '该商品不支持传淘宝，请联系供应商将该商品加入淘货源或尝试铺货到其他渠道';
                                    distributeOther = true;
                                } else if (resultInfo.error_msg.indexOf('DESC_IMG_ILLEGAL') != -1 ) {
                                    errorMessage = '该产品的详情使用了淘宝其他店铺图片，无法代销，请联系供应商更换';
                                } else if (resultInfo.error_msg.indexOf('CHENNEL_REPEAT_REVIEW') != -1 ) {
                                    errorMessage = '渠道关系重复申请';
                                } else if (resultInfo.error_msg.indexOf('DISTRIBUTOR_CONDITION_IS_INELIGIBLE') != -1 ) {
                                    errorMessage = '不符合代销招商条件';
                                } else if (resultInfo.error_msg.indexOf('这不是供销offer') != -1 ) {
                                    errorMessage = '该商品不支持传淘宝，请尝试铺货到其他渠道';
                                    distributeOther = true;
                                } else if (resultInfo.error_msg.indexOf('无铺货入淘权限') != -1 ) {
                                    errorMessage = '该商品不支持传淘宝，请尝试铺货到其他渠道';
                                    distributeOther = true;
                                } else if (resultInfo.error_msg.indexOf('代销关系已存在') != -1 ) {
                                    errorMessage = '您的店铺已代销过该货品，是否覆盖店铺里的商品？';
                                    needToCopy = true;
                                    btnText = "覆盖原商品";
                                } else if (resultInfo.error_msg.indexOf('店铺不同意新协议') != -1 ) {
                                    errorMessage = '请前往电脑版拼多多商家后台签署店铺协议后再重新铺货。https://mms.pinduoduo.com';
                                    btnText = "复制链接";
                                } else if (resultInfo.error_msg.indexOf('商品规格中价格的范围过大') != -1 || resultInfo.error_msg.indexOf('sku的规格错误') != -1 || resultInfo.error_msg.indexOf('规格值过多') != -1) {
                                    btnText = "选择规格铺货";
                                }
                            }

                            if (errorMessage == '代销关系需要人工审核' || errorMessage == '不符合代销招商条件') {
                                btnText = '申请分销';
                            }

                            if (item.shop_type == 'wc') {
                                btnText = '修改代销信息';
                            }
                            return (
                                <View style={[styles.resultBoxLine,key == 0 ? {}:{marginTop:px(24)}]}>
                                    <View style={styles.resultLine}>
                                        <View>
                                            <Image src={item.shop_url} style={{width:px(60),height:px(60)}}/>
                                        </View>
                                        <View style={{marginLeft:px(18)}}>
                                            <Text style={{fontSize:px(24),color:'#666666'}}>[{item.shop_name}]:{item.resText}</Text>
                                            {
                                                needToCopy ?
                                                <Text style={{fontSize:px(24),color:'#ff6000',width:px(520)}}>{errorMessage}</Text>
                                                :
                                                (
                                                    resultInfo.error_msg ?
                                                    <Text style={{fontSize:px(24),color:'#666666',width:px(520)}}>原因:{errorMessage}</Text>
                                                    :
                                                    null
                                                )
                                            }
                                            {
                                                item.shop_type == 'pdd' && item.resText == '铺货成功' ?
                                                <Text style={{fontSize:px(24),color:'#ff6000',marginTop:px(12)}}>您需要申请成为分销商，才能以代销价格采购</Text>
                                                :
                                                null
                                            }
                                        </View>
                                    </View>
                                    {
                                        !IsEmpty(btnText) || distributeOther ?
                                        <View style={styles.buttonLine}>
                                            <AyButton type="primary" onClick={()=>{this.btnOptions('更多货源',item)}}>更多货源</AyButton>
                                            {
                                                btnText != '申请分销' && item.shop_type == 'pdd' && item.resText == '铺货成功'?
                                                <AyButton type="primary" style={{marginLeft:px(12)}} onClick={()=>{this.btnOptions('申请分销',item)}}>申请分销</AyButton>
                                                :
                                                null
                                            }
                                            {
                                                !IsEmpty(btnText) ?
                                                <AyButton type="primary" style={{marginLeft:px(12)}} onClick={()=>{this.btnOptions(btnText,item)}}>{btnText}</AyButton>
                                                :
                                                null
                                            }
                                            {
                                                btnText == '申请分销' ?
                                                <AyButton type="primary" style={{marginLeft:px(12)}} onClick={()=>{this.btnOptions('重新铺货',item)}}>重新铺货</AyButton>
                                                :
                                                null
                                            }
                                            {
                                                distributeOther ?
                                                <AyButton type="primary" style={{marginLeft:px(12)}} onClick={()=>{this.btnOptions('铺货到其他店铺',item)}}>铺货到其他店铺</AyButton>
                                                :
                                                null
                                            }
                                            {
                                                item.shop_type == 'wc'?
                                                <AyButton type="primary" style={{marginLeft:px(12)}} onClick={()=>{this.btnOptions('去分享',item)}}>去分享</AyButton>
                                                :
                                                null
                                            }
                                        </View>
                                        :
                                        null
                                    }
                                </View>
                            )
                        })
                    }
                </View>
                {/* {
                    this.state.isFromManage == '1' ?
                    null
                    :
                    <View style={{marginTop:24,backgroundColor:'#ffffff',flexDirection:'column',flex:1,paddingBottom:24,paddingTop:24}}>
                        <Text style={{fontSize:24,color:'#666666',marginLeft:24}}>您可以在手机阿里买家“常用工具”中进入“代发助手”，查看店铺回流</Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginLeft:24}}>
                            <Text style={{fontSize:24,color:'#3089dc'}} onClick={()=>{GoToView({status:'DistributionManage'});}}>采购的订单</Text>
                            <Text style={{fontSize:24,color:'#666666'}}>或管理</Text>
                            <Text style={{fontSize:24,color:'#3089dc'}} onClick={()=>{GoToView({status:'DistributionManage'});}}>代销货品</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginTop:24}}>
                            <Image src="https://q.aiyongbao.com/1688/web/img/distributeGuide.png" resizeMode={"contain"} style={{width:380,height:362}}/>
                        </View>
                    </View>
                } */}
                {/* <View style={{marginTop:px(24),backgroundColor:"#fff"}}> */}
                    <GoodsProductMap from={'DistributionResult'} rows={2} dataSource={this.state.gridData} />
			    {/* </View> */}
            </ScrollView>
        );
    }

    //渲染state sku弹窗用
    updateStates = (obj) =>{
        this.setState({
            ...obj
        });
    }

    //获取当前商品已铺货过的sku
    getNotChooseSkus = (callback) =>{
        NetWork.Get({
            url:'Distributeproxy/getNotHaveRelationSkus',
            data:{
                productId:this.offerId
            }
        },(rsp)=>{
            console.log('distribution/getNotHaveRelationSkus',rsp);
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

    //选择sku铺货
    skuDistribute = (skus) =>{
        this.state.choosedSkus = skus;
        this.refs.skuDialog.hide();
        this.btnOptions('重新铺货',this.state.lastChooseLog);
    }

    render(){
        let content = null;
        if (this.state.isOk) {
            content = this.renderDistributed();
        } else {
            if (this.state.distributList.length > 0) {
                content = this.renderDistributing();
            } else {
                content = null;
            }
        }
        return (
            <View>
                <Floattop goto={()=>{this.moveToBack('gomanage')}}/>
                {content}
                <ChooseSkuDialog ref={"skuDialog"}
                offerId={this.offerId}
                updateStates={this.updateStates}
                from="chooseMore"
                notChooseSpecs={this.state.notChooseSpecs}
                showLoading={()=>{this.loading = Toast.loading('加载中...');}}
                hideLoading={()=>{Portal.remove(this.loading);}}
                skuDistribute = {this.skuDistribute}
                />
                <SureDialog
                    ref={"sureDialog"}
                    onSubmit={()=>{this.getAuthorization(this.reAuthoration,true)}}
                    lastShopType={this.reAuthoration.shop_type}
                    authorizationLink={this.authorizationLink}
                />
                <Dialog ref={"addDialog"} contentStyle={styles.modal2Style} maskClosable={false}>
                    <View style={styles.dialogContent}>
                        <View style={styles.dialogBody}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{fontSize:px(32),color:'#333333',fontWeight:600}}>您还可以铺货到</Text>
                            </View>
                            <View style={styles.shopLine}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png" style={{width:px(70),height:px(70)}}/>
                                </View>
                                <Text style={{color:'#333333',fontSize:px(28),marginLeft:px(16)}}>拼多多店铺</Text>
                                <View style ={{flexDirection:'row',justifyContent:'flex-end',flex:1}}>
                                    <AyButton size="mini"
                                    type="primary"
                                    onClick={()=>{
                                        GoToView({status:'DistributionShops',query:{offerId:this.offerId,supplierMemberId:this.supplierMemberId}});
                                    }}
                                    >立即铺货</AyButton>
                                </View>
                            </View>
                            <View style={styles.shopLine}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/weichatLogo.png" style={{width:px(70),height:px(70)}}/>
                                </View>
                                <Text style={{color:'#333333',fontSize:px(28),marginLeft:px(16)}}>爱用旺铺</Text>
                                {/* <Text style={{color:'#999999',fontSize:px(22),width:px(280),marginLeft:px(24)}}>您的专属店铺，即将上线...</Text> */}
                                <View style ={{flexDirection:'row',justifyContent:'flex-end',flex:1}}>
                                    {/* {
                                        this.state.iscreateWd?(
                                        <AyButton size="mini"
                                        type="primary"
                                        onClick={()=>{
                                            Event.emit('App.checkwc');
                                            // GoToView({status:'DistributionShops',query:{iswd:1}});
                                            GoToView({page_status:'pop'})

                                        }}
                                        >立即铺货</AyButton>):(
                                        <AyButton size="mini"
                                        type="primary"
                                        onClick={()=>{
                                            // GoToView({status:'DistributionShops'});
                                            GoToView({page_status:'pop'})
                                        }}
                                        >立即添加</AyButton>)
                                    } */}
                                    <AyButton size="mini"
                                    type="primary"
                                    onClick={()=>{
                                        GoToView({status:'DistributionShops',query:{offerId:this.offerId,supplierMemberId:this.supplierMemberId}});
                                    }}>立即铺货</AyButton>
                                </View>
                            </View>
                            <View style={styles.shopLine}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/sumaitongLogo.png" style={{width:px(70),height:px(70)}}/>
                                </View>
                                <Text style={{color:'#333333',fontSize:px(28),marginLeft:px(16)}}>速卖通店铺</Text>
                                <View style ={{flexDirection:'row'}}>
                                    <Text style={{color:'#999999',fontSize:px(22),marginLeft:px(24)}}>努力开发中......</Text>
                                </View>
                            </View>
                            <View style={[styles.shopLine,{borderBottomColor:'#ffffff'}]}>
                                <View style={styles.imgBox}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/lazadaLogo.png" style={{width:px(70),height:px(70)}}/>
                                </View>
                                <View style={[styles.imgBox,{marginLeft:px(24)}]}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/amazonLogo.png" style={{width:px(70),height:px(70)}}/>
                                </View>
                                <View  style={[styles.imgBox,{marginLeft:px(24)}]}>
                                    <Image src="https://q.aiyongbao.com/1688/web/img/preview/facebookLogo.png" style={{width:px(70),height:px(70)}}/>
                                </View>
                                <Text style={{color:'#999999',fontSize:px(22),width:px(290),marginLeft:px(24)}}>更多平台敬请期待......</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginBottom:px(24)}}>
                                <AyButton
                                type="normal"
                                style={{marginLeft:px(12),width:px(256)}}
                                onClick={()=>{this.refs.addDialog.hide();}}
                                >我知道了</AyButton>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </View>
        );
    }
}