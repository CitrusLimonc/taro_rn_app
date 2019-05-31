import Taro, { Component, Config } from '@tarojs/taro';
import {ScrollView,View,Text,Checkbox,Image,Button,Dialog,Radio,Input} from '@tarojs/components';
import SureDialog from '../../Component/SureDialog';
import ItemIcon from '../../Component/ItemIcon';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import MatchNumber from '../../Public/Biz/MatchNumber.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import ChooseLine from './ChooseLine';
import PriceLine from './PriceLine';
import styles from './styles';
import PddCateDialog from '../../Component/PddCateDialog';
import px from '../../Biz/px.js';

/*
 * 铺货-铺货设置页面
 * @author cy
 */
export default class DistributionSetting extends Component {
    constructor(props) {
        super(props);
        this.state={
            changeSend:0,
            shopList:[],  /* 店铺列表 */
            chooseShop:'', /* 当前选中的店铺 */
            lastShopType:'taobao',
            describeSet:["1","2"], /* 详情设置列表 */
            amountList:[
                {id:"1",name:'买家拍下减库存'},
                {id:"2",name:'买家付款减库存'}
            ],   /* 库存设置列表 */
            amountSet:{id:"1",name:'买家拍下减库存'},  /* 当前库存设置 */
            autoOrder:"1",
            dialogFlag:'',
            publishList:[
                {id:"1",name:'直接上架'},
                {id:"2",name:'存放仓库'}
            ],   /* 上架设置列表 */
            publishSet:{id:"1",name:'直接上架'},   /* 当前上架设置 */
            categoryList:[],   /* 分类列表 */
            chooseCateNum:"选择分类",
            choosedCategory:[],   /* 当前选中分类 */
            tempList:[],   /* 运费模板设置列表 */
            tempSet:{},   /* 当前运费模板设置 */
            compensateState:true,   /* 是否支持假一赔十 */
            refundSevenState:true,   /* 是否支持七天无理由退换货 */
            autoPlaceSwitch:true,    /* 自动下单 */
            groupBuySet:{
                mulNum:100,
                addNum:0,
                isRemovePoint:true,
                removeWay:"1"
            },    /* 商品团购价格设置 */
            singleBuySet:{
                mulNum:110,
                addNum:0,
                isRemovePoint:true,
                removeWay:"1"
            },    /* 商品单买价格设置 */
            sellSet:{
                mulNum:150,
                addNum:10,
                isRemovePoint:true,
                removeWay:"1",
                priceWay:'0',
                onlypercent:50,
            },    /* 微信售价价格设置 */
            beforSet:{
                mulNum:200,
                addNum:0,
                isRemovePoint:true,
                removeWay:"1"
            },    /* 微信原价价格设置 */
            deliveryTime:"2",   /* 承诺发货时间设置 */
            pddCategories:[],   /* 拼多多商品分类 */
            pddCateSet:{},   /* 拼多多商品分类设置 */
            batchChanges:[],  /* 批量设置 */
            hasChanged:false,
            content:'',  /* 二次确认弹窗的内容 */
            confirmTitle:'',  /* 二次确认弹窗标题 */
            confirmBtns:{
                cancelText:'取消',
                okText:'确认'
            },
            choosedPddCates:[0],
            pddChooseCat:"0",
            sendGoodState:true
        }
        this.amountSet = {id:"1",name:'买家拍下减库存'};
        this.publishSet = {id:"1",name:'直接上架'};
        this.tempSet = {};
        this.cidNumber = 0;
        this.tempPageNo = 1;
        this.offerId = '';
        this.retry = 0;
        this.willShowShop="";
        this.from = '';
        this.authorizationLink = '';


        let self = this;
        // RAP.on('back',function(e){
        //     if (self.state.hasChanged) {
        //         self.setState({
        //             confirmTitle:'',
        //             content:'铺货设置已经被修改，您要保存修改后的设置吗？',
        //             confirmBtns:{
        //                 cancelText:'不保存，直接退出',
        //                 okText:'保存并退出'
        //             }
        //         });
        //         self.refs.submitDialog.show();
        //     } else {
        //         GoToView({page_status:'pop'});
        //     }
        // });
    }

    // config: Config = {
    //     navigationBarTitleText: '铺货设置'
    // }


    componentDidMount(){
        let shopId = GetQueryString({name:'query'});
        let batchChanges = [];
        if (IsEmpty(shopId)) {
            shopId = GetQueryString({name:'resShopId'});
            this.offerId = GetQueryString({name:'offerId'});
            if (!IsEmpty(shopId)) {
                batchChanges = shopId.split(',');
                shopId = batchChanges[0];
            }
        }
        let self = this;
        Taro.showLoading({ title: '加载中...' });
        self.getAllSettings(shopId,batchChanges);
    }
    
    updateState = (data) =>{
        this.setState({
            ...data
        });
    }

    //获取所有店铺
    getAllSettings = (shopId,batchChanges) =>{
        let self = this;
        //获取所有店铺
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{}
        },(rsp)=>{
            console.log('Distributeproxy/getProxyShopInfo',rsp);
            //有数据
            if (!IsEmpty(rsp.result)) {
                let shopList = rsp.result;
                let lastShopType = '';
                let shopName = '';
                if (IsEmpty(shopId)) {
                    shopId = rsp.result[0].id;
                }
                rsp.result.map((item,key)=>{
                    if (shopId == item.id) {
                        lastShopType = item.shop_type;
                        shopName = item.shop_name;
                    }
                });

                //导入上次设置
                NetWork.Get({
                    url:'Distributeproxy/getProxySetting',
                    data:{
                        shopId:shopId
                    }
                },(rsp)=>{
                    console.log('Distributeproxy/getProxySetting',rsp);
                    self.amountSet = self.state.amountList[0];
                    self.publishSet = self.state.publishList[0];
                    self.tempSet = {};
                    let groupBuySet = {
                        mulNum:100,
                        addNum:0,
                        isRemovePoint:true,
                        removeWay:"1"
                    };
                    let singleBuySet = {
                        mulNum:110,
                        addNum:0,
                        isRemovePoint:true,
                        removeWay:"1"
                    };
                    let sellSet = {
                        mulNum:150,
                        addNum:10,
                        isRemovePoint:true,
                        removeWay:"1",
                        priceWay:'0',
                        onlypercent:50,
                    };
                    let beforSet={
                        mulNum:200,
                        addNum:0,
                        isRemovePoint:true,
                        removeWay:"1"
                    };
                    let deliveryTime = "2";
                    let compensateState = true;
                    let refundSevenState = true;
                    let autoPlaceSwitch = true;
                    let pddCateSet = {};
                    let choosedCategory = [];
                    let describeSet =["1","2"];
                    let changeSend = 0;
                    let pddChooseCat = '0';

                    //判断设置并更新
                    if (!IsEmpty(rsp.result) && !IsEmpty(rsp.result.rule)) {
                        let setting = Parse2json(rsp.result.rule);
                        //承诺发货时间
                        if (!IsEmpty(setting.promise_delivery_time)) {
                            deliveryTime = setting.promise_delivery_time;
                        }
                        //是否支持假一赔十
                        if (!IsEmpty(setting.indemnify_more)) {
                            if (setting.indemnify_more == "0") {
                                compensateState = false;
                            } else {
                                compensateState = true;
                            }
                        }
                        //是否支持七天无理由退换货
                        if (!IsEmpty(setting.refund_seven)) {
                            if (setting.refund_seven == "0") {
                                refundSevenState = false;
                            } else {
                                refundSevenState = true;
                            }
                        }
                       
                        if (!IsEmpty(setting.cat_choose_way)) {
                            pddChooseCat = setting.cat_choose_way;
                        }
                        //微信原价价格设置
                        let old_price = '';
                        if (!IsEmpty(setting.old_price)) {
                            old_price = setting.old_price.split(';');
                            old_price[0] = old_price[0].split(',');

                            beforSet.mulNum = old_price[0][0];
                            beforSet.addNum = old_price[0][1];
                            if(old_price[1] == '0'){
                                beforSet.isRemovePoint = false;
                            } else {
                                beforSet.isRemovePoint = true;
                            }
                            beforSet.removeWay = old_price[2];
                        }

                        //微信售价价格设置
                        let sale_price = '';
                        if (!IsEmpty(setting.sale_price)) {
                            sale_price = setting.sale_price.split(';');
                            if(sale_price[0] == '0'){
                                sale_price[1] = sale_price[1].split(',');
                                sellSet.mulNum = sale_price[1][0];
                                sellSet.addNum = sale_price[1][1];
                                sellSet.priceWay = sale_price[0];
                            }else if(sale_price[0] == '1'){
                                sellSet.priceWay = sale_price[0];
                                sellSet.onlypercent = sale_price[1];
                            }

                            if(sale_price[2] == '0'){
                                sellSet.isRemovePoint = false;
                            } else {
                                sellSet.isRemovePoint = true;
                            }
                            sellSet.removeWay = sale_price[3];
                        }

                        //运费模板设置
                        if (!IsEmpty(setting.temp_price)) {
                            changeSend = setting.temp_price;
                        }

                        //拼多多商品分类
                        if (!IsEmpty(setting.goods_classify)) {
                            let goods_classify = Parse2json(setting.goods_classify);
                            if (lastShopType == 'pdd') {
                                pddCateSet = {
                                    cat_id:goods_classify.key,
                                    cat_name:goods_classify.value
                                };
                            } else {
                                pddCateSet = {
                                    cid:goods_classify.key,
                                    name:goods_classify.value
                                };
                            }
                            
                        }

                        //淘宝分类
                        if(!IsEmpty(setting.shop_classify)){
                            choosedCategory = setting.shop_classify.split(',');
                        }
                        //库存设置
                        if (!IsEmpty(setting.stoc_count)) {
                            self.state.amountList.map((item,key)=>{
                                if (item.id == setting.stoc_count) {
                                    self.amountSet = item;
                                }
                            });
                        }

                        //运费模板设置
                        if (!IsEmpty(setting.freight_formwork)) {
                            let freight_formwork = Parse2json(setting.freight_formwork);
                            if (typeof(freight_formwork) != 'string') {
                                if (lastShopType == 'pdd') {
                                    self.tempSet = {
                                        template_id:freight_formwork.key,
                                        template_name:freight_formwork.value
                                    };
                                } else {
                                    self.tempSet = {
                                        template_id:freight_formwork.key,
                                        name:freight_formwork.value
                                    };
                                }
                                
                            }
                        }

                        //上架设置
                        if (!IsEmpty(setting.grouding_setting)) {
                            self.state.publishList.map((item,key)=>{
                                if (item.id == setting.grouding_setting) {
                                    self.publishSet = item;
                                }
                            });
                        }
                        //详情描述设置
                        if (!IsEmpty(setting.desc_setting)) {
                            describeSet = setting.desc_setting.split(',');
                        } else if (setting.desc_setting == "") {
                            describeSet = [];
                        }
                        //自动下单
                        if (!IsEmpty(setting.auto_place)) {
                            if (setting.auto_place == "0") {
                                autoPlaceSwitch = false;
                            } else {
                                autoPlaceSwitch = true;
                            }
                        }

                        //商品价格 / pdd团购价
                        let group_price = '';
                        if (!IsEmpty(setting.group_price)) {
                            group_price = setting.group_price.split(';');
                            group_price[0] = group_price[0].split(',');
                            groupBuySet.mulNum = group_price[0][0];
                            groupBuySet.addNum = group_price[0][1];
                            if(group_price[1] == '0'){
                                groupBuySet.isRemovePoint = false;
                            } else {
                                groupBuySet.isRemovePoint = true;
                            }
                            groupBuySet.removeWay = group_price[2];
                        }
                        //商品市场价格 / pdd单买价
                        let single_price = '';
                        if (!IsEmpty(setting.single_price)) {
                            single_price = setting.single_price.split(';');
                            single_price[0] = single_price[0].split(',');

                            singleBuySet.mulNum = single_price[0][0];
                            singleBuySet.addNum = single_price[0][1];
                            if(single_price[1] == '0'){
                                singleBuySet.isRemovePoint = false;
                            } else {
                                singleBuySet.isRemovePoint = true;
                            }
                            singleBuySet.removeWay = single_price[2];
                        }
                       
                    }

                    self.setState({
                        shopList:shopList,
                        lastShopType:lastShopType,
                        chooseShop:shopId,
                        choosedCategory:choosedCategory,
                        chooseCateNum:choosedCategory.length > 0 ? '已选:'+choosedCategory.length+'个自定义分类':'选择分类',
                        tempSet:self.tempSet,
                        publishSet:self.publishSet,
                        amountSet:self.amountSet,
                        describeSet:describeSet,
                        pddCateSet:pddCateSet,
                        groupBuySet:groupBuySet,
                        changeSend:changeSend,
                        singleBuySet:singleBuySet,
                        beforSet:beforSet,
                        sellSet:sellSet,
                        deliveryTime:deliveryTime,
                        compensateState:compensateState,
                        refundSevenState:refundSevenState,
                        autoPlaceSwitch:autoPlaceSwitch,
                        hasChanged:false,
                        batchChanges:batchChanges,
                        pddChooseCat:pddChooseCat
                    });
                    Taro.hideLoading();
                },(error)=>{
                    alert(JSON.stringify(error));
                });
            }
        },(error)=>{
            alert(JSON.stringify(error));
        });
    }

    //获取授权
    getAuthorization = (shopId,lastShopType,batchChanges,isDialog,callback) =>{
        let self = this;
        if (isDialog == 'sure') {
            this.refs.sureDialog.hide();
        }

        if (this.retry <3) {
            this.retry++;
            NetWork.Get({
                url:'Distributeproxy/proxyGetAiyongAuthorization',
                data:{
                    shopType:lastShopType,
                    shopId:shopId
                }
            },(rsp)=>{
                console.log('Distributeproxy/proxyGetAiyongAuthorization',rsp);
                //有授权 重新加载
                if (!IsEmpty(rsp)) {
                    if(rsp.code=='200'){
                        //完成
                        if (callback) {
                            Taro.showLoading({ title: '加载中...' });
                            callback(true);
                        }
                    } else if (rsp.code == '404') {
                        Taro.hideLoading();
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

    //选择店铺
    changShopTag = (item) =>{
        let self = this;
        if (this.state.hasChanged) {
            self.willShowShop = item.id;
            self.setState({
                confirmTitle:'',
                content:'铺货设置已经被修改，您要保存修改后的设置吗？',
                confirmBtns:{
                    cancelText:'不保存',
                    okText:'保存'
                }
            });
            self.refs.submitDialog.show();
        } else {
            Taro.showLoading({ title: '加载中...' });
            // 获取铺货设置  加loading
            self.getAllSettings(item.id);
        }

    }

    //渲染店铺列表tag
    renderShopTags = () =>{
        let tagDom = [];
        this.state.shopList.map((item,key)=>{
            if (IsEmpty(item.pic_url)) {
                item.pic_url = 'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png';
            }
            tagDom.push(
                <View style={[{alignItems:'center',marginRight:px(24)},key==4?{marginRight:px(0)}:{}]}>
                    <View style={[this.state.chooseShop == item.id ? styles.tagImageActive:styles.tagImage]}
                    onClick={()=>{this.changShopTag(item)}}>
                        <Image src={item.pic_url} style={{width:px(76),height:px(76)}}/>
                    </View>
                    <View style={{marginTop:px(6),width:px(140),alignItems:'center'}}>
                        <Text style={{fontSize:px(20),color:'#999999',textAlign:'center'}}>{item.shop_name}</Text>
                    </View>
                </View>
            );
        });
        return tagDom;
    }

    //修改当前设置
    changeDesccribeSet = (value,flag) =>{
        console.log(value);
        let chooseList = [];
        if (flag == 'group') {
            chooseList = value;
        } else {
            chooseList = this.state.describeSet;
            let index = chooseList.indexOf(value);
            if( index > -1){
                chooseList.splice(index,1);
            } else {
                chooseList.push(value);
            }
        }
        this.setState({
            describeSet:chooseList,
            hasChanged:true
        });
    }

    //选择设置内容
    chooseSetting = (flag) =>{
        const {chooseShop,lastShopType,batchChanges,choosedCategory} = this.state;
        let self = this;
        let shopName = '';
        this.state.shopList.map((item,key)=>{
            if (this.state.chooseShop == item.id) {
                shopName = item.shop_name;
            }
        });

        if (flag == 'temp' && lastShopType != 'wc' && lastShopType != 'pdd' && lastShopType != 'taobao') {
            Taro.showLoading({ title: '加载中...' });
            this.getTemplateModel(1,lastShopType,shopName,chooseShop,flag,(rsp)=>{
                this.setState({
                    tempList:rsp,
                    dialogFlag:flag
                });
                Taro.hideLoading();
                this.refs.chooseDialog.show();
            });
            return ;
        }
        if(flag == 'temp'&&lastShopType=='wc'){
            this.setState({
                tempList:[{template_id:'-1',name:'[1688一件代发]包邮模板(自动创建)'}],
                dialogFlag:flag
            });
            this.refs.chooseDialog.show();
        }else{
            if (flag == 'category' || flag == 'pddcategory' || flag == 'temp' || flag == 'tempPdd') {
                self.getAuthorization(chooseShop,lastShopType,batchChanges,false,(result)=>{
                    if (result) {
                        if (flag == 'category') {
                            Taro.showLoading({ title: '加载中...' });
                            NetWork.Get({
                                url:'Distributeproxy/getSellerCats',
                                data:{}
                            },(rsp)=>{
                                console.log('distribution/getSellerCats',rsp);
                                //有数据
                                if (!IsEmpty(rsp.result)) {
                                    let seller_cat = rsp.result;
                                    let newCates = [];
                                    seller_cat.map((item,key)=>{
                                        if (item.parent_cid == 0) {
                                            // newCates.push(item); 看下有没有子类目，有就不要了
                                            let hasChild = false;
                                            for (let i = 0; i < seller_cat.length; i++) {
                                                let val = seller_cat[i];
                                                if (val.parent_cid == item.cid) {
                                                    hasChild = true;
                                                    break;
                                                }
                                            }
                                            if (!hasChild) {
                                                newCates.push(item);
                                            }
                                            
                                        } else {
                                            let cidName = '';
                                            seller_cat.map((val,idx)=>{
                                                if (item.parent_cid == val.cid) {
                                                    cidName = val.name + '>>' + item.name;
                                                    if (!IsEmpty(val.parent_cid)) {
                                                        for (var i = 0; i < seller_cat.length; i++) {
                                                            if (seller_cat[i].id == val.parent_cid) {
                                                                cidName = cidName + '>>' + seller_cat[i].name;
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                            newCates.push({
                                                cid:item.cid,
                                                name:cidName
                                            });
                                        }
                                    });
                                    console.log('distribution/getSellerCats-newCates',newCates);
                                    let newChoosedCategory = [];
                                    if (choosedCategory.length > 0) {
                                        for (let i = 0; i < choosedCategory.length; i++) {
                                            let hasIn = false;
                                            newCates.map((item,key)=>{
                                                if (item.cid == choosedCategory[i]) {
                                                    hasIn = true;
                                                }
                                            });
                                            if (hasIn) {
                                                newChoosedCategory.push(choosedCategory[i]);
                                            }
                                        }
                                    }
                                    this.setState({
                                        categoryList:newCates,
                                        dialogFlag:flag,
                                        choosedCategory:newChoosedCategory,
                                        chooseCateNum:newChoosedCategory.length > 0 ? '已选:'+newChoosedCategory.length+'个自定义分类':'选择分类',
                                    });
                                } else {
                                    this.setState({
                                        categoryList:[{cid:'-1',name:'未分类'}],
                                        dialogFlag:flag
                                    });
                                }
                                Taro.hideLoading();
                                this.refs.categryDialog.show();
                            },(error)=>{
                                alert(JSON.stringify(error));
                            });
                        } else if (flag == 'pddcategory') {
                            this.refs.categryPddDialog.show(chooseShop,lastShopType);
                            Taro.hideLoading();
                        } else if(flag == 'temp' || flag == 'tempPdd'){
                            Taro.showLoading({ title: '加载中...' });
                            this.getTemplateModel(1,lastShopType,shopName,chooseShop,flag,(rsp)=>{
                                this.setState({
                                    tempList:rsp,
                                    dialogFlag:flag
                                });
                                Taro.hideLoading();
                                this.refs.chooseDialog.show();
                            });
                        }
                    }
                });
            } else {
                this.setState({
                    dialogFlag:flag
                });
                this.refs.chooseDialog.show();
            }
        }

    }

    getTemplateModel = (pageNo,lastShopType,shopName,shopId,flag,callback) =>{
        let tempList = [];
        if (flag == 'temp') {
            tempList = [{template_id:'-1',name:'[1688一件代发]包邮模板(自动创建)'}];
        } else {
            tempList = [{template_id:'-1',template_name:'[1688一件代发]包邮模板(自动创建)'}];
        }
        NetWork.Get({
            url:'Distributeproxy/getTemplateModel',
            data:{
                pageNo:pageNo,
                shopType:lastShopType,
                shopName:shopName,
                shopId:shopId
            }
        },(rsp)=>{
            console.log('distribution/getTemplateModel',rsp);
            //有数据
            if (!IsEmpty(rsp.result)) {
                callback(rsp.result);
            } else {
                callback(tempList);
            }
        },(error)=>{
            callback(tempList);
            alert(JSON.stringify(error));
        });
    }

    //获取所有单选项
    getRadios = () =>{
        let doms = [];
        let data = [];
        let title = '';
        let seletctKey = '';
        switch (this.state.dialogFlag) {
            case 'amount':{
                data = this.state.amountList;
                seletctKey = this.state.amountSet;
            } break;
            case 'publish':{
                data = this.state.publishList;
                seletctKey = this.state.publishSet;
            } break;
            case 'temp':{
                data = this.state.tempList;
                seletctKey = this.state.tempSet;
            } break;
            case 'tempPdd':{
                data = this.state.tempList;
                seletctKey = this.state.tempSet;
            } break;
            default: break;
        }
        console.log('getRadios',data,seletctKey);
        data.map((item,key)=>{
            doms.push(
                <View style={styles.radioLine}>
                    <Text style={{fontSize:px(32),color:'#333333'}}>
                    {this.state.dialogFlag == 'tempPdd' ? item.template_name : item.name}
                    </Text>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <Radio size="small" value={this.state.dialogFlag == 'temp'||this.state.dialogFlag == 'tempPdd' ? item.template_id+'' : item.id+''} type="dot"></Radio>
                    </View>
                </View>
            );
        });
        return doms;
    }

    //设置选项有修改时
    changeRadio = (value) =>{
        console.log(value);
        switch (this.state.dialogFlag) {
            case 'amount':{
                this.state.amountList.map((item,key)=>{
                    if (item.id == value) {
                        this.amountSet = item;
                    }
                });
            } break;
            case 'publish':{
                this.state.publishList.map((item,key)=>{
                    if (item.id == value) {
                        this.publishSet = item;
                    }
                });
            } break;
            case 'temp':{
                this.state.tempList.map((item,key)=>{
                    if (item.template_id == value) {
                        this.tempSet = item;
                    }
                });
            } break;
            case 'tempPdd':{
                this.state.tempList.map((item,key)=>{
                    if (item.template_id == value) {
                        this.tempSet = item;
                    }
                });
            } break;
            default: break;
        }
    }

    //单个设置确认
    changeSet = () =>{
        switch (this.state.dialogFlag) {
            case 'amount':{
                this.setState({
                    amountSet:this.amountSet,
                    hasChanged:true
                });
            } break;
            case 'publish':{
                this.setState({
                    publishSet:this.publishSet,
                    hasChanged:true
                });
            } break;
            case 'temp':{
                this.setState({
                    tempSet:this.tempSet,
                    hasChanged:true
                });
            } break;
            case 'tempPdd':{
                this.setState({
                    tempSet:this.tempSet,
                    hasChanged:true
                });
            } break;
            default: break;
        }
        this.refs.chooseDialog.hide();
    }

    //保存铺货设置
    saveDistribute = (isReturn) =>{
        let self = this;
        const {sendGoodState,chooseShop,amountSet,describeSet,publishSet,choosedCategory,chooseCateNum,tempSet,lastShopType,changeSend} = this.state;
        const {compensateState,refundSevenState,autoPlaceSwitch,groupBuySet,singleBuySet,deliveryTime,pddCateSet,batchChanges,sellSet,beforSet,pddChooseCat} = this.state;
        let shop_classify = '';
        if (chooseCateNum != '选择分类' && choosedCategory.length >0) {
            shop_classify = choosedCategory.join(',');
        }

        let descSetting = '';
        if (describeSet.length>0) {
            descSetting = describeSet.join(',');
        }

        let auto_place = '1';
        if (autoPlaceSwitch) {
            auto_place = '1';
        } else {
            auto_place = '0';
        }

        if (lastShopType == 'pdd') {
            if (IsEmpty(pddCateSet) && pddChooseCat == '1') {
                Taro.showToast({
                    title: '请至少选择发布商品分类',
                    icon: 'none',
                    duration: 2000
                });
                return ;
            }
        }

        if (IsEmpty(groupBuySet.mulNum)) {
            groupBuySet.mulNum = "100";
        }

        if (IsEmpty(singleBuySet.mulNum)) {
            singleBuySet.mulNum = "110";
        }

        if (IsEmpty(groupBuySet.addNum)) {
            groupBuySet.addNum = "0";
        }

        if (IsEmpty(singleBuySet.addNum)) {
            singleBuySet.addNum = "0";
        }
        if (IsEmpty(sellSet.mulNum)) {
            sellSet.mulNum = "100";
        }
        if (IsEmpty(sellSet.onlypercent)) {
            sellSet.onlypercent = "50";
        }
        if (IsEmpty(beforSet.mulNum)) {
            beforSet.mulNum = "110";
        }

        if (IsEmpty(sellSet.addNum)) {
            sellSet.addNum = "0";
        }

        if (IsEmpty(beforSet.addNum)) {
            beforSet.addNum = "0";
        }

        if (!MatchNumber.isPositiveNumber(groupBuySet.mulNum) || !MatchNumber.isPositiveNumber(singleBuySet.mulNum)|| !MatchNumber.isPositiveNumber(beforSet.mulNum)|| !MatchNumber.isPositiveNumber(sellSet.mulNum)|| !MatchNumber.isPositiveNumber(sellSet.onlypercent)) {
            Taro.showToast({
                title: '价格的百分比只可是正数',
                icon: 'none',
                duration: 2000
            });
            return ;
        } else if (!MatchNumber.isNumber(groupBuySet.addNum) || !MatchNumber.isNumber(singleBuySet.addNum)|| !MatchNumber.isNumber(beforSet.addNum)|| !MatchNumber.isNumber(sellSet.addNum)) {
            Taro.showToast({
                title: '价格的增减只可是数字',
                icon: 'none',
                duration: 2000
            });
            return ;
        }

        let groupPrice = 100000 * groupBuySet.mulNum/100 + parseInt(groupBuySet.addNum);
        let singlePrice = groupPrice * singleBuySet.mulNum/100 + parseInt(singleBuySet.addNum);
        console.log(singlePrice - groupPrice);

        if (singlePrice - groupPrice < 1) {
            Taro.showToast({
                title: '单买价至少比团购价多一元',
                icon: 'none',
                duration: 2000
            });
            return ;
        }


        let rule = {};
        let isTrue = true;
        switch (lastShopType) {
            case 'taobao':{
                rule = {
                    'freight_formwork':tempSet.template_id == '-1' ? '' : {key:tempSet.template_id,value:tempSet.name},
                    'stoc_count':amountSet.id,    //库存设置(1:买家拍下减库存,2:买家付款减库存)
                    'desc_setting':descSetting,   //详情页描述设置(1:清楚描述中的外链,2:自动过滤违规词)
                    'grouding_setting':publishSet.id,  //上架设置(直接上架,2放仓库)
                    'auto_place':auto_place   //自动下单(0:关1:开)
                };
                if (!IsEmpty(shop_classify)) {
                    rule.shop_classify = shop_classify;
                }
            } break;
            case 'wc':{
                let beforSetPoint = "1";
                if (beforSet.isRemovePoint) {
                    beforSetPoint = "1";
                } else {
                    beforSetPoint = "0";
                }

                let sellSetPoint = "1";
                if (sellSet.isRemovePoint) {
                    sellSetPoint = "1";
                } else {
                    sellSetPoint = "0";
                }
                let strings = '';
                if(sellSet.priceWay == '0'){
                     strings = sellSet.priceWay+';'+sellSet.mulNum + ',' + sellSet.addNum + ';' + sellSetPoint + ';' + sellSet.removeWay
                }else if(sellSet.priceWay == '1'){
                     strings = sellSet.priceWay+';'+sellSet.onlypercent + ';' + sellSetPoint + ';' + sellSet.removeWay
                }
                rule = {
                    'freight_formwork':0,
                    'goods_classify':'',
                    'sale_price':strings, //售价设置
                    'old_price':beforSet.mulNum + ',' + beforSet.addNum + ';' + beforSetPoint + ';' + beforSet.removeWay,//单买价格
                    'desc_setting':descSetting,   //详情页描述设置(1:清楚描述中的外链,2:自动过滤违规词)
                    'words':'',
                    'temp_price':changeSend,
                    'grouding_setting':publishSet.id,
                };
                if (!IsEmpty(shop_classify)) {
                    rule.shop_classify = shop_classify;
                }
            } break;
            case 'pdd':{
                let groupPoint = "1";
                if (groupBuySet.isRemovePoint) {
                    groupPoint = "1";
                } else {
                    groupPoint = "0";
                }
                let singlePoint = "1";
                if (singleBuySet.isRemovePoint) {
                    singlePoint = "1";
                } else {
                    singlePoint = "0";
                }
                rule = {
                    'goods_classify':{key:pddCateSet.cat_id,value:pddCateSet.cat_name},
                    'group_price':groupBuySet.mulNum + ',' + groupBuySet.addNum + ';' + groupPoint + ';' + groupBuySet.removeWay,
                    'single_price':singleBuySet.mulNum + ',' + singleBuySet.addNum + ';' + singlePoint + ';' + singleBuySet.removeWay,
                    'promise_delivery_time':deliveryTime,
                    'freight_formwork':tempSet.template_id == '-1' ? '' : {key:tempSet.template_id,value:tempSet.template_name},
                    'desc_setting':descSetting,
                    'grouding_setting':publishSet.id,
                    'auto_place':auto_place,
                    'indemnify_more':compensateState ? '1':'0',
                    'refund_seven':refundSevenState ? '1':'0',
                    'cat_choose_way':pddChooseCat,
                    'send_good_setting':sendGoodState ? '1':'0'
                };

            } break;
            default:{ //别的平台
                let groupPoint = "1";
                if (groupBuySet.isRemovePoint) {
                    groupPoint = "1";
                } else {
                    groupPoint = "0";
                }
                let singlePoint = "1";
                if (singleBuySet.isRemovePoint) {
                    singlePoint = "1";
                } else {
                    singlePoint = "0";
                }
                rule = {
                    'goods_classify':{key:pddCateSet.cid,value:pddCateSet.name},
                    'group_price':groupBuySet.mulNum + ',' + groupBuySet.addNum + ';' + groupPoint + ';' + groupBuySet.removeWay,
                    'single_price':singleBuySet.mulNum + ',' + singleBuySet.addNum + ';' + singlePoint + ';' + singleBuySet.removeWay,
                    'freight_formwork':tempSet.template_id == '-1' ? '' : {key:tempSet.template_id,value:tempSet.name},
                    'grouding_setting':publishSet.id
                };
            } break;
        }

        console.log('rules',rule);

        let shopIds = '';

        if (!IsEmpty(batchChanges) && batchChanges.indexOf(chooseShop)>=0) {
            shopIds = batchChanges.join(',');
        } else {
            shopIds = chooseShop;
        }
        console.log('保存的数据',rule)
        //保存铺货设置
        if(sellSet.priceWay == '0'&&sellSet.mulNum==0&&sellSet.addNum==0){
            Taro.showToast({
                title: '售价设置不能为0',
                icon: 'none',
                duration: 2000
            });
        }else if(sellSet.priceWay == '1'&&sellSet.onlypercent==0){
            Taro.showToast({
                title: '售价设置不能为0',
                icon: 'none',
                duration: 2000
            });
        }else{
            NetWork.Get({
                url:'Distributeproxy/saveProxySetting',
                data:{
                    shopIds:shopIds,
                    shopType:lastShopType,
                    rule:JSON.stringify(rule)
                }
            },(rsp)=>{
                console.log(rsp);
                if (rsp.code == '200') {
                    Taro.showToast({
                        title: '保存成功',
                        icon: 'none',
                        duration: 2000
                    });
                    self.setState({
                        hasChanged:false,
                        groupBuySet:groupBuySet,
                        singleBuySet:singleBuySet,
                        sellSet:sellSet,
                        beforSet:beforSet,
                    });
                    if (!IsEmpty(self.from) && shopIds == self.from) {
                        // RAP.emit('App.change_setting_back',{shopId:self.from});
                        GoToView({page_status:'pop'});
                    }
                    if (isReturn) {
                        if (isReturn == 'changeShop') {
                            Taro.showLoading({ title: '加载中...' });
                            // 获取铺货设置  加loading
                            self.getAllSettings(self.willShowShop);
                        } else {
                            GoToView({page_status:'pop'});
                        }
                    } else {
                        if (!IsEmpty(batchChanges)) {
                            //跳转铺货界面
                            GoToView({status:'DistributionResult',query:{offerId:this.offerId,isfromself:'1',}});
                        }
                    }
                }
                //setState
            },(error)=>{
                alert(JSON.stringify(error));
            });
        }

    }

    //获取所有分类
    renderCategorys = () =>{
        let doms =[];
        this.state.categoryList.map((item,key)=>{
            doms.push(
                <View style={styles.categoryLine} onClick={()=>{this.chooseCategory(item.cid+'','list')}}>
                    <Checkbox value={item.cid+''} size="small" />
                    <Text style={{fontSize:px(28),color:'#333333'}}>{item.name}</Text>
                </View>
            );
        });
        return doms;
    }

    //选择店铺分类
    chooseCategory = (value,flag) =>{
        let chooseList = [];
        if (flag == 'group') {
            chooseList = value;
        } else {
            chooseList = this.state.choosedCategory;
            let index = chooseList.indexOf(value);
            if( index > -1){
                chooseList.splice(index,1);
            } else {
                chooseList.push(value);
            }
        }
        console.log(chooseList);
        this.setState({
            choosedCategory:chooseList
        });
    }

    //修改店铺分类
    changeCategory = () =>{
        //确定设置自定义分类
        if (this.state.choosedCategory.length>0) {
            this.setState({
                chooseCateNum:'已选:'+this.state.choosedCategory.length+'个自定义分类',
                hasChanged:true
            });
            this.refs.categryDialog.hide();
        } else {
            Taro.showToast({
                title: '请先选择分类或点击空白处关闭',
                icon: 'none',
                duration: 2000
            });
        }

    }

    //是否支持假一赔十
    //是否支持七天无理由退换货
    changeSwitch = (value,title) =>{
        console.log(value,title);
        if (value != 'none') {
            switch (title) {
                case '是否支持假一赔十':{
                    if (value) {
                        this.setState({
                            compensateState:value,
                            confirmTitle:'支持假一赔十提醒',
                            content:'请确保1688货源支持假一赔十，否则可能影响您的销售。',
                            confirmBtns:{
                                cancelText:'我知道了',
                                okText:''
                            }
                        });
                        this.refs.submitDialog.show();
                    } else {
                        this.setState({
                            compensateState:value,
                            confirmTitle:'不支持假一赔十提醒',
                            content:'不支持假一赔十可能会导致铺货失败。',
                            confirmBtns:{
                                cancelText:'我知道了',
                                okText:''
                            }
                        });
                        this.refs.submitDialog.show();
                    }

                } break;
                case '是否支持七天无理由退换货':{
                    if (value) {
                        this.setState({
                            refundSevenState:value,
                            confirmTitle:'支持七天退换货提醒',
                            content:'请确保1688货源支持七天无理由退换货，否则可能影响您的销售。',
                            confirmBtns:{
                                cancelText:'我知道了',
                                okText:''
                            }
                        });
                        this.refs.submitDialog.show();
                    } else {
                        this.setState({
                            refundSevenState:value,
                            confirmTitle:'不支持七天退换货提醒',
                            content:'不支持七天退换货可能会导致铺货失败。',
                            confirmBtns:{
                                cancelText:'我知道了',
                                okText:''
                            }
                        });
                        this.refs.submitDialog.show();
                    }

                } break;
                case '自动下单':{
                    this.setState({
                        autoPlaceSwitch:value,
                        hasChanged:true
                    });
                } break;
                case '是否开启自动发货':{
                    if (!value) {
                        this.setState({
                            sendGoodState:value,
                            confirmTitle:'开启自动发货提醒',
                            content:'拼多多订单自动发货已关闭，采购单发货后，您可以在待发货列表中手动进行发货。',
                            confirmBtns:{
                                cancelText:'我知道了',
                                okText:''
                            }
                        });
                        this.refs.submitDialog.show();
                    }
                } break;
                default: break;
            }
        }
    }

    //团购价格是否去掉小数点
    //四舍五入或直接去掉
    //价格相乘的百分比
    //价格所加的数
    callback = (value,title,type) =>{
        let setting = {};
        switch (title) {
            case '商品团购价设置':case '商品售价设置':{
                setting = this.state.groupBuySet;
            } break;
            case '商品单买价设置':case '商品市场价设置':{
                setting = this.state.singleBuySet;
            } break;
            case '售价设置':{
                setting = this.state.sellSet;
            } break;
            case '原价设置':{
                setting = this.state.beforSet;
            } break;
            default: break;
        }


        switch (type) {
            case 'mulNum':{
                setting.mulNum = value;
                if (!MatchNumber.isPositiveNumber(value)) {
                    Taro.showToast({
                        title: '请输入一个正数',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } break;
            case 'onlypercent':{
                setting.onlypercent = value;
                if (!MatchNumber.isPositiveNumber(value)) {
                    Taro.showToast({
                        title: '请输入一个正数',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } break;
            case 'addNum':{
                setting.addNum = value;
                if (!MatchNumber.isNumber(value)) {
                    Taro.showToast({
                        title: '请输入一个数',
                        icon: 'none',
                        duration: 2000
                    });
                }
            } break;
            case 'point':{
                if (value == 'none') {
                    setting.isRemovePoint = !setting.isRemovePoint;
                } else {
                    setting.isRemovePoint = value;
                }
            } break;
            case 'remove':{
                setting.removeWay = value;
            } break;
            case 'priceWay':{
                setting.priceWay = value;
            } break;
            default: break;
        }

        switch (title) {
            case '商品团购价设置':case '商品售价设置':{
                this.setState({
                    groupBuySet:setting,
                    hasChanged:true
                });
            } break;
            case '商品单买价设置':case '商品市场价设置':{
                this.setState({
                    singleBuySet:setting,
                    hasChanged:true
                });
            } break;
            case '售价设置':{
                // setting = this.state.sellSet;
                this.setState({
                    sellSet:setting,
                    hasChanged:true
                });
            } break;
            case '原价设置':{
                // setting = this.state.beforSet;
                this.setState({
                    beforSet:setting,
                    hasChanged:true
                });
            } break;
            default: break;
        }
    }

    //修改承诺发货时间
    changeDeliveryTime = (value) =>{
        if (value == "1") {
            this.setState({
                confirmTitle:'修改发货时间提醒',
                content:'请确保1688货源支持24小时发货，否则可能影响您的销售。',
                confirmBtns:{
                    cancelText:'取消',
                    okText:'确定'
                }
            });
            this.refs.submitDialog.show();
        } else {
            this.setState({
                deliveryTime:value,
                hasChanged:true
            });
        }
    }


    //无限滚动
    tempEndReached = () =>{
        if (this.state.dialogFlag == 'tempPdd') {
            let {lastShopType,tempList,chooseShop} = this.state;
            this.tempPageNo++;
            this.getTemplateModel(this.tempPageNo,lastShopType,shopName,chooseShop,flag,(rsp)=>{
                this.setState({
                    tempList:tempList.concat(rsp),
                    dialogFlag:flag
                });
            });
        }
    }
    //修改运费
    changeSend=(e)=>{
        if(e<0){
            Taro.showToast({
                title: '运费需大于0元',
                icon: 'none',
                duration: 2000
            });
        }else{
            this.setState({
                changeSend:e
            })
        }
    }

    //铺货设置二次确认弹窗的取消操作
    confirmCancel = () =>{
        if(this.state.confirmBtns.okText == '保存并退出'){
            GoToView({page_status:'pop'});
        } else if (this.state.confirmBtns.okText == '保存') {
            this.refs.submitDialog.hide();
            Taro.showLoading({ title: '加载中...' });
            // 获取铺货设置  加loading
            this.getAllSettings(this.willShowShop);
        } else {
            this.refs.submitDialog.hide();
        }
    }
    //铺货设置二次确认弹窗的确认操作
    confirmSubmit = (callback) =>{
        if(this.state.confirmBtns.okText == '保存并退出'){
            this.saveDistribute(true);
        } else if (this.state.confirmBtns.okText == '保存') {
            this.refs.submitDialog.hide();
            this.saveDistribute('changeShop');
        } else {
            switch (this.state.confirmTitle) {
                case '修改发货时间提醒':{
                    this.setState({
                        deliveryTime:"1",
                        hasChanged:true
                    });
                } break;
                default: break;
            }
            this.refs.submitDialog.hide();
        }
    }


    //修改拼多多选择类目的方式
    changePddChooseCat = (value) =>{
        this.setState({
            pddChooseCat:value
        });
    }

    render() {
        const {chooseCateNum,lastShopType,groupBuySet,singleBuySet,deliveryTime,compensateState,refundSevenState,chooseShop,batchChanges,sellSet,beforSet} = this.state;
        const {sendGoodState,describeSet,amountSet,dialogFlag,publishSet,tempSet,choosedCategory,autoPlaceSwitch,pddCateSet,content,confirmTitle,confirmBtns,pddChooseCat}= this.state;
        console.log('当前店铺类型',lastShopType);
        let raidoSet = '';
        let dialogTitle = '';
        switch (dialogFlag) {
            case 'amount':{
                raidoSet = amountSet.id;
                dialogTitle = '选择计库存方式';
            } break;
            case 'publish':{
                raidoSet = publishSet.id;
                dialogTitle = '选择上架设置';
            } break;
            case 'temp':
            case 'tempPdd':{
                raidoSet = tempSet.template_id;
                dialogTitle = '选择运费模板';
            } break;
            default: break;
        }

        let shopName = '';
        this.state.shopList.map((item,key)=>{
            if (this.state.chooseShop == item.id) {
                shopName = item.shop_name;
            }
        });

        let isOthor = false;
        if (lastShopType != 'wc' && lastShopType != 'taobao' && lastShopType != 'pdd') {
            isOthor = true;
        }

        let singleTitle = '单买价';
        let multiTitle = '团购价';
        if (isOthor) {
            multiTitle = '售价';
            singleTitle = '市场价';
        }

        return (
            <View>
                <ScrollView style={{backgroundColor:'#f5f5f5',flex:1,paddingBottom:px(96)}}>
                    <View style={styles.topLine}>
                        <Text style={{fontSize:px(32),color:'#787993'}}>选择店铺</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            {this.renderShopTags()}
                        </View>
                    </View>
                    <View style={{backgroundColor:'#ffffff',flex:1}}>
                        {
                            lastShopType == 'taobao' ?
                            <ChooseLine
                                title = {"店铺分类"}
                                subTitle = {chooseCateNum}
                                type = 'normal'
                                callback = {()=>{this.chooseSetting('category')}}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'pdd' ?
                            <View>
                                <View><Text style={{fontSize:px(32),color:'#030303',marginLeft:px(24),marginTop:px(24)}}>发布商品类目设置</Text></View>
                                <Radio.Group
                                value={pddChooseCat}
                                onChange={(value)=>{this.changePddChooseCat(value)}}>
                                    <View style={styles.catLine} onClick={()=>{this.changePddChooseCat("0")}}>
                                        <Radio size="small" value={"0"} type="dot" style={{width:px(40),height:px(40)}}></Radio>
                                        <Text style={{fontSize:px(28),color:'#333333'}}>智能匹配商品类目</Text>
                                    </View>
                                    <View style={styles.catLine} onClick={()=>{this.changePddChooseCat("1")}}>
                                        <Radio size="small" value={"1"} type="dot" style={{width:px(40),height:px(40)}}></Radio>
                                        <Text style={{fontSize:px(28),color:'#333333'}}>手动选择商品类目</Text>
                                        <View style={styles.commonRight} onClick = {()=>{
                                            if (pddChooseCat == '1') {
                                                this.chooseSetting('pddcategory');
                                            }
                                        }}>
                                            <Text style={[{fontSize:px(28)},pddChooseCat == '1' ? {color:'#666666'}:{color:'#999999'}]}
                                            onClick = {()=>{
                                                if (pddChooseCat == '1') {
                                                    this.chooseSetting('pddcategory');
                                                }
                                            }}
                                            >{IsEmpty(pddCateSet) ? '请选择分类' : pddCateSet.cat_name}</Text>
                                            <ItemIcon code={"\ue6a7"}
                                            iconStyle={[{fontSize:px(32),marginLeft:px(12)},pddChooseCat == '1' ? {color:'#666666'}:{color:'#999999'}]}
                                            onClick = {()=>{
                                                if (pddChooseCat == '1') {
                                                    this.chooseSetting('pddcategory');
                                                }
                                            }}
                                            />
                                        </View>
                                    </View>
                                </Radio.Group>
                            </View>
                            :
                            ''
                        }
                        {
                            lastShopType == 'pdd' || isOthor? 
                            <PriceLine
                                title = {'商品' + multiTitle + '设置'}
                                subTitle = {multiTitle + "=建议零售价"}
                                mulNum = {groupBuySet.mulNum}
                                addNum = {groupBuySet.addNum}
                                isRemovePoint = {groupBuySet.isRemovePoint}
                                removeWay = {groupBuySet.removeWay}
                                callback = {this.callback}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'pdd' || isOthor? 
                            <PriceLine
                                title = {'商品' + singleTitle + '设置'}
                                subTitle = {singleTitle + "=" + multiTitle}
                                mulNum = {singleBuySet.mulNum}
                                addNum = {singleBuySet.addNum}
                                isRemovePoint = {singleBuySet.isRemovePoint}
                                removeWay = {singleBuySet.removeWay}
                                callback = {this.callback}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'wc' ?
                            <PriceLine
                                title = {"售价设置"}
                                subTitle = {"团购价=建议零售价"}
                                mulNum = {sellSet.mulNum}
                                addNum = {sellSet.addNum}
                                isRemovePoint = {sellSet.isRemovePoint}
                                removeWay = {sellSet.removeWay}
                                callback = {this.callback}
                                priceWay = {sellSet.priceWay}
                                onlypercent = {sellSet.onlypercent}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'pdd' ?
                            <View style={styles.columnLine}>
                                <Text style={{fontSize:px(32),color:'#030303'}}>承诺发货时间设置</Text>
                                <Radio.Group
                                style={{flexDirection:'row',alignItems:'center'}}
                                value={deliveryTime}
                                onChange={(value)=>{this.changeDeliveryTime(value)}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{this.changeDeliveryTime("1")}}>
                                        <Radio size="small" value={"1"} type="dot" style={{width:px(40),height:px(40)}}></Radio>
                                        <Text style={{fontSize:px(28),color:'#333333'}}>24小时</Text>
                                    </View>
                                    <View style={{flexDirection:'row',alignItems:'center',marginLeft:px(20)}} onClick={()=>{this.changeDeliveryTime("2")}}>
                                        <Radio size="small" value={"2"} type="dot" style={{width:px(40),height:px(40)}}></Radio>
                                        <Text style={{fontSize:px(28),color:'#333333'}}>48小时</Text>
                                    </View>
                                </Radio.Group>
                            </View>
                            :
                            ''
                        }
                        {
                            isOthor ? 
                            <ChooseLine
                                title = {"选择商品分类"}
                                subTitle = {IsEmpty(pddCateSet) ? '选择商品分类' : pddCateSet.name}
                                type = 'normal'
                                callback = {()=>{
                                    this.chooseSetting('pddcategory');
                                }}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'wc' ? 
                            <View style={styles.commonLine}>
                                <View>
                                    <Text style={{fontSize:px(32),color:'#030303'}}>运费设置</Text>
                                    <View style={{flexDirection:'row',alignItems:'center',marginTop:px(12)}}>
                                        <Text style={{fontSize:px(28),color:'#8F8E94'}}>运费=</Text>
                                        <Input style={{width:100,height:60}} maxLength={5} type='number' value={this.state.changeSend} onChange={(e)=>{this.changeSend(e)}}/>
                                        <Text style={{fontSize:px(28),color:'#8F8E94'}}>元</Text>
                                    </View>

                                </View>
                            </View>
                            :
                            <ChooseLine
                                title = {"运费模板"}
                                subTitle = {IsEmpty(tempSet) ? '选择运费模板' : lastShopType == 'pdd' ? tempSet.template_name : tempSet.name}
                                type = 'normal'
                                callback = {()=>{
                                    let tempType = 'temp';
                                    if(lastShopType == 'pdd'){
                                        tempType = 'tempPdd';
                                    }
                                    this.chooseSetting(tempType);
                                }}
                            />
                        }
                        {
                            lastShopType == 'taobao' ?
                            <ChooseLine
                                title = {"库存设置"}
                                subTitle = {amountSet.name}
                                type = 'normal'
                                callback = {()=>{this.chooseSetting('amount')}}
                            />
                            :
                            ''
                        }
                        {
                            isOthor ? 
                            ''
                            :
                            <View style={{paddingTop:px(24)}}>
                                <View style={{paddingLeft:px(24)}}>
                                    <Text style={{fontSize:px(32),color:'#030303'}}>详情描述设置</Text>
                                    <View style={{marginLeft:px(40)}}>
                                        <Checkbox.Group value={this.state.describeSet} onChange={(value)=>{this.changeDesccribeSet(value,'group')}}>
                                            <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{this.changeDesccribeSet("1",'list')}}>
                                                <Checkbox value={"1"}
                                                size="small"
                                                style={{borderRadius:px(4),width:px(40),height:px(40)}}
                                                checkedStyle={{borderRadius:px(4),width:px(40),height:px(40)}}/>
                                                <Text style={{fontSize:px(28),color:'#333333'}}>清除描述中的外链</Text>
                                            </View>
                                            <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{this.changeDesccribeSet("2",'list')}}>
                                                <Checkbox value={"2"}
                                                size="small"
                                                style={{borderRadius:px(4),width:px(40),height:px(40)}}
                                                checkedStyle={{borderRadius:px(4),width:px(40),height:px(40)}}/>
                                                <Text style={{fontSize:px(28),color:'#333333'}}>自动过滤标题与描述中违规词</Text>
                                            </View>
                                        </Checkbox.Group>
                                    </View>
                                </View>
                            </View>
                        }
                        {
                            lastShopType != 'pdd' ?
                            <ChooseLine
                                title = {"上架设置"}
                                subTitle = {publishSet.name}
                                type = 'normal'
                                callback = {()=>{this.chooseSetting('publish')}}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'pdd' ?
                            <ChooseLine
                                title = {"是否支持假一赔十"}
                                subTitle = {"打开开关表示发布的商品支持假一赔十"}
                                type = 'switch'
                                switch = {compensateState}
                                callback = {this.changeSwitch}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'pdd' ?
                            <ChooseLine
                                title = {"是否支持七天无理由退换货"}
                                subTitle = {"打开开关表示发布的商品支持七天无理由退换"}
                                type = 'switch'
                                switch = {refundSevenState}
                                callback = {this.changeSwitch}
                            />
                            :
                            ''
                        }
                        {
                            lastShopType == 'pdd' ?
                            <ChooseLine
                                title = {"是否开启自动发货"}
                                subTitle = {"打开开关表示自动同步物流信息"}
                                type = 'switch'
                                switch = {sendGoodState}
                                callback = {this.changeSwitch}
                            />
                            :
                            ''
                        }
                    </View>
                </ScrollView>
                <View style={{position:'fixed',bottom:px(0),left:px(0),right:px(0),backgroundColor:'#ff6000',height:px(96),alignItems:'center',justifyContent:'center'}}
                onClick={()=>{this.saveDistribute()}}>
                    <Text style={{color:'#ffffff',fontSize:px(32)}}>保存铺货设置</Text>
                </View>
                <Dialog ref="chooseDialog" duration={1000} maskClosable={true} maskStyle={styles.mask} contentStyle={styles.categoryModel}>
                    <View style={styles.body}>
                        <View style={styles.head}><Text style={styles.textHead}>{dialogTitle}</Text></View>
                        <ScrollView style={{flex:1}} onEndReached={()=>{this.tempEndReached()}}>
                            <Radio.Group style={{flex:1}} value={raidoSet} onChange={(value)=>{this.changeRadio(value)}}>
                                {this.getRadios()}
                            </Radio.Group>
                        </ScrollView>
                    </View>
                    <View style={styles.footer}>
                        <Button rect block style={styles.dlgBtn} type="primary" size="large" onClick={()=>{this.changeSet()}}>确定</Button>
                    </View>
                </Dialog>
                <Dialog ref="categryDialog" duration={1000} maskClosable={true} maskStyle={styles.mask} contentStyle={styles.categoryModel}>
                    <View style={styles.body}>
                        <View style={styles.cateTopLine}>
                            <Text style={{color:'#9B9B9B',fontSize:px(28)}}>为铺货商品添加店铺的自定义分类:已选</Text>
                            <Text style={{color:'#E41010',fontSize:px(28)}}>{choosedCategory.length}</Text>
                        </View>
                        <ScrollView style={{flex:1}}>
                            <Checkbox.Group value={choosedCategory} onChange={(value)=>{this.chooseCategory(value,'group')}}>
                                {this.renderCategorys()}
                            </Checkbox.Group>
                        </ScrollView>
                    </View>
                    <View style={styles.footer}>
                        <Button rect block style={styles.dlgBtn} type="primary" size="large" onClick={()=>{this.changeCategory()}}>确定</Button>
                    </View>
                </Dialog>
                <PddCateDialog 
                ref="categryPddDialog" 
                from = {'setting'}
                updateState={this.updateState}
                shopName = {shopName}
                />
                <SureDialog
                    ref={"sureDialog"}
                    onSubmit={()=>{this.getAuthorization(chooseShop,lastShopType,batchChanges,'sure')}}
                    lastShopType={lastShopType}
                    authorizationLink={this.authorizationLink}
                />
                <Dialog ref={"submitDialog"} duration={1000} maskStyle={styles.maskStyle} contentStyle={styles.modal2Style}>
                    <View style={styles.dialogContent}>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <Text style={{marginTop:px(15),fontSize:px(38),color:'#4A4A4A'}}>{confirmTitle}</Text>
                        </View>
                        <View style={styles.tokenBody}>
                            <Text style={{fontSize:px(32),color:'#4A4A4A'}}>{content}</Text>
                        </View>
                        <View style={styles.foot}>
                            {
                                !IsEmpty(confirmBtns.okText) ?
                                <View style={styles.footBtn}
                                onClick={()=>{this.confirmCancel()}}>
                                    <Text style={styles.fontStyle}>{confirmBtns.cancelText ? confirmBtns.cancelText : '取消'}</Text>
                                </View>
                                :
                                <View style={[styles.footBtn,{borderBottomRightRadius:px(8),width:px(612)}]}
                                onClick={()=>{this.confirmSubmit()}}>
                                    <Text style={styles.fontStyle}>{confirmBtns.cancelText ? confirmBtns.cancelText : '取消'}</Text>
                                </View>
                            }
                            {
                                !IsEmpty(confirmBtns.okText) ?
                                <View style={[styles.submitBtn,{backgroundColor:"#ff6000"}]} onClick={()=>{this.confirmSubmit()}}>
                                    <Text style={[styles.fontStyle,{color:"#ffffff"}]}>{confirmBtns.okText ? confirmBtns.okText : '确定'}</Text>
                                </View>
                                :
                                ''
                            }

                        </View>
                    </View>
                </Dialog>
            </View>
        );
  }
}