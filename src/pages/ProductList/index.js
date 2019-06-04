import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text,Image,Progress,Checkbox,ScrollView} from '@tarojs/components';
import Event from 'ay-event';
// import {AtModal, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui';
import ProductStatus from './ProductStatus';
import ProductCard from './ProductCard';
import ChooseStatus from './ChooseStatus';
import SideDialog from './SideDialog';
import ItemIcon from '../../Component/ItemIcon';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import { GoToView } from '../../Public/Biz/GoToView.js';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import SetTitle from '../../Biz/SetTitle.js';
import styles from './styles';
import px from '../../Biz/px.js';
/**
* @author cy
* 代销货品列表
**/
export default class ProductList extends Component{
    constructor(props) {
        super(props);
        this.state={
            dataSource:[],//列表数据源
            pageStatus:[ //商品状态列表
                {status:'代销中',itemTotal:0},
                {status:'已缺货',itemTotal:0},
                {status:'终止代销',itemTotal:0}
            ],
            nowPageStatus:{status:'代销中',itemTotal:0},//当前页面状态
            headType:false,//搜索栏显示或全选栏显示
            chooseItem:[],//当前勾选产品集合
            checkedAll:false,//当前全选状态
            hischeckedAll:false,//是否全选过
            totalRecords:0,//当前状态总数
            pageNo:1,//页码
            pageSize:20,//每页展示数量
            showLoading:false,//加载状态
            isLoading:true,//加载状态
            subjectKey:'',//搜索关键词
            rate:0.0,//当前操作进度
            refreshText: '↓ 下拉刷新',//下拉刷新的文字
            isRefreshing:false,//是否正在刷新
            lastShop:{},//当前店铺信息
            shopList:[], //店铺列表
            dialogSet:{ //弹窗的显示内容
                dialogTitle:'',
                dialogContentText:'',
                dialogCancelText:'',
                dialogOkText:'',
                errorMsg:''
            },
            changeItemSet:['1'], //是否需要下架或删除
            delChecked:true, //是否需要删除
            toCancel:false, //是否需要取消
            faildNumber:'', //失败个数
            faildReson:'', //失败原因
            progressDialogIsOpened:false,
            faildDialogIsOpened:false,
            sureDialogIsOpened:false,
        };
        this.chooseTotal = 0;//选择的产品数量
        this.chooseItems = []; //选择的商品
        this.retry = 0;
        this.type = 'product';
        let self = this;
        //重新加载商品列表
        Event.on('App.product_list_reload',(data)=>{
            let param={
                pageNo:1,
                pageSize:self.state.pageSize
            };
            self.getData(param);
        });
        //首页小卡片进入 修改默认显示的店铺
        this.catchflag = true;
        Event.on('App.item_list_get_data',(data)=>{
            self.catchflag = false;
            self.state.lastShop = data;
            console.log('item_list_get_data',data);
            let param={
                shopId:data.id,
                shopType:data.shop_type,
                shopName:data.shop_name,
                pageNo:1,
                pageSize:self.state.pageSize,
                status:data.type,
            };
            // if(data.type == 'noamount'){
            //     let param = {status:'已缺货',itemTotal:0};
            //     self.changeStaus(param)
            // }else{
            //     Taro.showLoading({ title: '加载中...' });
            // }
            self.getData(param);

        });
        Event.on('back',function(e){
            console.log('shifourecycle',self.type);
            if(self.type=="recycle"){
                self.state.subjectKey='';
            }
            GoToView({page_status:'pop'});
        });

    }

    // config: Config = {
    //     navigationBarTitleText: this.type=='recycle' ? '代销货品' : '代销货品'
    // }

    componentWillMount(){
        const self = this;
        // this.type = GetQueryString({name:'type'});
        //修改列表搜索条件
        let typename = '';
        if(this.type=='recycle'){
            typename = 'App.recylelist_search';
        }else{
            typename = 'App.list_search';
        }
        Event.on(typename,(data)=>{
            let param={
                pageNo:1,
                pageSize:self.state.pageSize
            };
            if (!IsEmpty(data.subjectKey)) {
                param.subjectKey = data.subjectKey;
                self.state.subjectKey = data.subjectKey;
            }
            Taro.showLoading({ title: '加载中...' });
            self.getData(param);
        });
    }

    componentDidMount(){
        let self = this;
        Taro.showLoading({ title: '加载中...' });
        self.loadData();
    }

    // 初始化数据
    loadData = () =>{
        console.log('lastShop',this.state.lastShop);
        let self = this;
        //获取店铺列表
        self.getShopLists((shopList)=>{
            let lastShop = {};
            if (!IsEmpty(shopList)) {
                lastShop = shopList[0];
                if (!IsEmpty(this.state.lastShop)) {
                    shopList.map((item,key)=>{
                        if (item.id == this.state.lastShop.id) {
                            lastShop = Parse2json(JSON.stringify(item));
                        }
                    });
                }
                this.state.lastShop = lastShop;
                let params = {
                    shopId:lastShop.id,
                    shopType:lastShop.shop_type,
                    shopName:lastShop.shop_name,
                    pageNo:1,
                };
                //获取代销货品
                //首次进入尚未注册
                if (self.catchflag) {
                    LocalStore.Get(['item_list_get_shop_info'],(result) => {
                        if(!IsEmpty(result)){
                            LocalStore.Remove(['item_list_get_shop_info']);
                            let data = Parse2json(result['item_list_get_shop_info']);
                            console.log('item_list_get_shop_info',data);
                            Taro.showLoading({ title: '加载中...' });
                            self.state.lastShop = data;
                            let param={
                                shopId:data.id,
                                shopType:data.shop_type,
                                shopName:data.shop_name,
                                pageNo:1,
                                pageSize:self.state.pageSize,
                                status:data.type,
                            };
                            // if(data.type == 'noamount'){
                            //     let param = {status:'已缺货',itemTotal:0};
                            //     self.changeStaus(param)
                            // }else{
                            //     Taro.showLoading({ title: '加载中...' });
                            // }
                            self.getData(param);
                        } else {
                            self.getData(params);
                        }
                    });
                }else{
                    self.getData(params);
                }
            } else {
                self.setState({
                    showLoading:false
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
            Taro.hideLoading();
            console.log('Distributeproxy/getProxyShopInfo',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                this.state.shopList = rsp.result;
                callback(rsp.result);
            } else {
                callback([]);
            }
        },(error)=>{
            callback([]);
            Taro.hideLoading();
        });
    }

    //显示是否为批量操作状态
    showBatch = () => {
        this.setState({
            headType:true
        });
    }

    //Checkbox的选择操作
    chooseNum = (originitem,checked) => {
        let arr = this.state.chooseItem; //当前选择项
        let allMessArr = this.chooseItems;
        //判断当前勾选状态，选中则添加到数组中，取消则移除
        if (checked) {
            this.chooseTotal++;
            arr.push(originitem.origin_num_iid);
            allMessArr.push(originitem);
        }else {
            this.chooseTotal--;
            arr = [];
            allMessArr = [];
            this.state.chooseItem.map((item,key)=>{
                if (item!=originitem.origin_num_iid) {
                    arr.push(item);
                }
            });
            this.chooseItems.map((item,key)=>{
                if (item.origin_num_iid!=originitem.origin_num_iid) {
                    allMessArr.push(item);
                }
            });
        }
        //改变但是不触发渲染
        let checkedAll = false;
        if (this.chooseTotal == this.state.totalRecords) {
            checkedAll = true;
        }
        this.state.checkedAll = checkedAll;
        this.state.chooseItem = arr;
        this.chooseItems = allMessArr;
        let headType = false;//需要触发setState更新的数据
        if(!this.state.headType){
            this.setState({
                headType:true
            });
        }
        this.refs.ChooseStatus.setState({
            chooseNum:this.chooseTotal,
            checkedAll:checkedAll
        });
    }

    //改变状态
    changeStaus = (item) => {
        //@fix listView的原因需要清空
        if (this.state.nowPageStatus.status!=item.status) {
            this.setState({
                nowPageStatus:item,
                pageNo:1,
                dataSource:[],
                isLoading:true
            });
            //参数构建
            let param={
                pageNo:1
            }
            Taro.showLoading({ title: '加载中...' });
            this.getData(param);
        }
    }

    //全选
    chooseAll = (checked) => {
        let chooseItem = [];//存储选中项
        let chooseTotal = 0;//选中数量
        if (checked) {
            this.chooseItems = [];
            for (var i = 0; i < this.state.dataSource.length; i++) {
                chooseItem.push(this.state.dataSource[i].origin_num_iid);
                this.chooseItems.push(this.state.dataSource[i]);
            }
            chooseTotal = this.state.dataSource.length;
        }
        this.chooseTotal = chooseTotal;
        this.refs.ChooseStatus.setState({
            chooseNum:chooseTotal,
            checkedAll:checked
        });
        this.setState({
            hischeckedAll:checked,
            checkedAll:checked,
            chooseItem:chooseItem,
        });
    }

    //取消批量操作状态
    cancelBatch = () =>{
        //重置数据
        this.chooseTotal = 0;
        this.chooseItems = [];
        this.setState({
            checkedAll:false,
            chooseItem:[],
            headType:false,
            hischeckedAll:false
        });
    }

    //底部文本
    renderFooter = () => {
        let foot = '';
        if (this.state.showLoading) {
            foot =
            <View style={{width: px(750),height: px(50),flexDirection: 'row',backgroundColor: '#f5f5f5',justifyContent: 'center',alignItems: 'flex-start'}}>
                <Text style={{color: '#cccccc',fontSize: px(24)}}>加载中...</Text>
            </View>;
        }
        return foot;
    }

    //无限滚动
    onLoadMore = () => {
        if(this.state.totalRecords < 20){
            return ;
        }
        let pageNo = this.state.pageNo + 1;
        let newArr = this.state.dataSource;
        let param = {
            pageNo:pageNo
        };

        this.setState({
            showLoading:true
        });
        //获取下一页数据
        this.getData(param);
    }

    //获取代销货品数据
    getData = (param) =>{
        Taro.showLoading({ title: '加载中...' });
        console.log('getData',param);
        let initData = {};
        //当前是否存在关键词
        if (IsEmpty(param.subjectKey)) {
            if (!IsEmpty(this.state.subjectKey)) {
                param.subjectKey = this.state.subjectKey;
            }
        }

        if (IsEmpty(param.shopId)) {
            if (!IsEmpty(this.state.lastShop)) {
                param.shopId = this.state.lastShop.id;
                param.shopType = this.state.lastShop.shop_type;
                param.shopName = this.state.lastShop.shop_name;
            }
        }
        if(this.type == 'recycle'){
            param.status = 'delete';
        }else{
            if(IsEmpty(param.status)){
                if (this.state.nowPageStatus.status == '已缺货') {
                    param.status = 'noamount';
                } else if (this.state.nowPageStatus.status == '终止代销') {
                    param.status = 'norelation';
                } else {
                    param.status = 'onsale';
                }
            }else{
                if(param.status =='noamount'){
                    this.state.nowPageStatus = {status:'已缺货',itemTotal:0};
                } else if (param.status =='onsale') {
                    this.state.nowPageStatus = {status:'代销中',itemTotal:0};
                }

            }
        }




        if (IsEmpty(param.pageNo)) {
            param.pageNo = 1;
        }
        NetWork.Get({
            url:'Orderreturn/getItemList',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/getItemList',rsp);
            //有结果
            let dataSource = this.state.dataSource;

            let chooseItem=this.state.chooseItem;
            let totalRecords=this.state.totalRecords;
            if(!IsEmpty(rsp)){
                if (param.pageNo > 1) {
                    dataSource = this.state.dataSource.concat(rsp.result);
                    if(this.state.headType && this.state.hischeckedAll){
                        for (var i = 0; i < rsp.result.length; i++) {
                            chooseItem.push(rsp.result[i].origin_num_iid);
                        }
                    }

                } else {
                    //订单状态总数赋值
                    dataSource = rsp.result;
                    let arr = this.state.pageStatus;
                    arr.map((item,key) => {
                        if (this.state.nowPageStatus.status == item.status) {
                            arr[key].itemTotal = rsp.totalRecords;
                            this.state.nowPageStatus.itemTotal = rsp.totalRecords;
                        }

                        // if(IsEmpty(param.status)&&this.state.nowPageStatus.status == item.status){
                        //     arr[key].itemTotal = rsp.totalRecords;
                        // }else if(!IsEmpty(param.status)&&initData.nowPageStatus.status == item.status){
                        //     arr[key].itemTotal = rsp.totalRecords;
                        // }
                    });
                    initData.pageStatus = arr;
                    totalRecords = rsp.totalRecords;
                }
                initData.dataSource = dataSource;
            }
            console.log('kankangetData',initData);
            this.setState({
                ...initData,
                pageNo:param.pageNo,
                showLoading:false,
                isLoading:false,
                chooseItem:chooseItem,
                totalRecords:totalRecords,
                isRefreshing: false,
                subjectKey:!IsEmpty(param.subjectKey) ? param.subjectKey : ''
            });
            Taro.hideLoading();
        },(error)=>{
            let arr = this.state.pageStatus;
            arr.map((item,key) => {
                if (this.state.nowPageStatus.status == item.status) {
                    arr[key].itemTotal = 0;
                }
            });
            this.setState({
                dataSource:[],
                pageStatus:arr,
                pageNo:param.pageNo,
                showLoading:false,
                isLoading:false,
                isRefreshing: false,
                subjectKey:!IsEmpty(param.subjectKey) ? param.subjectKey : ''
            });
            Taro.hideLoading();
        });
    }

    //删除关键词
    deleteSubjectKey = () =>{
        this.state.subjectKey = '';
        let param={
            pageNo:1,
            pageSize:this.state.pageSize,
            subjectKey:'',
        };
        Taro.showLoading({ title: '加载中...' });
        this.getData(param);
    }

    //下拉刷新
    handleRefresh = () => {
        // console.log('handleRefresh');

        this.setState({
           isRefreshing: true,
           refreshText: '加载中...'
        });

        let params = {
            pageNo:1
        };

        this.getData(params);
        if (this.state.dataSource.length>0) {
            this.refs.itemListView.resetLoadmore();
        }
    };

    //列表的头部
    renderHeader = () =>{
        // console.log("renderHeader");
        let text='';

        if (this.state.isRefreshing) {
            text=this.state.refreshText;
        } else {
            text='↓ 下拉刷新';
        }

        //console.log('下拉刷新',text);
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

    //空列表的内部
    renderNull = (item,index) =>{
        return (
            <View style={{flex:1}}>
                <View style={styles.midContent}>
                    <ItemIcon code={"\ue61d"} iconStyle={{fontSize:px(140),color:'#e6e6e6'}}/>
                    <Text style={{fontSize:px(24),color:'#666',marginTop:px(40)}}>没有符合条件的商品</Text>
                </View>
            </View>
        );
    }

    //获取商品
    getProductLists = (item, index) => {
        // console.log("item",item);
        // console.log("this.state.dataSource",this.state.dataSource);
        if (item == "null") {
            return ;
        }
        let items = {};
        items.origin_price = item.origin_price;
        items.origin_num_iid = item.origin_num_iid;
        items.cargo_number_1688 = item.cargo_number_1688;
        items.origin_title = item.origin_title;
        items.pic_1688 = item.pic_1688;
        items.is_del = item.is_del;
        items.amount_1688 = item.amount_1688;
        items.origin_login_name = item.origin_login_name;
        items.shop_type = item.shop_type;
        items.shop_id = item.shop_id;
        items.shop_name = item.shop_name;
        items.num_iid = item.num_iid;
        items.origin_id = item.origin_id;
        items.status_1688 = item.status_1688;
        items.max_list_price = item.max_list_price;
        items.min_list_price = item.min_list_price;
        items.min_defect_num = item.min_defect_num;

        return (
            <ProductCard
            key={index}
            headType={this.state.headType}
            buttons={true}
            item={items}
            status={this.state.nowPageStatus.status}
            chooseNum={this.chooseNum}
            checkedAll={this.state.checkedAll}
            chooseItem={this.state.chooseItem}
            hischeckedAll={this.state.hischeckedAll}
            callback={this.productCallback}
            synchroRelation={this.synchroRelation}
            updateRelation={this.updateRelation}
            type ={this.type}
            />
        )
    }

    //商品卡片更新或删除操作
    productCallback = (type,item)=>{
        let dataSource = [];
        for(let i in this.state.dataSource){
            //单个商品的删除操作更新数据
            if(type=='del'){
                if(this.state.dataSource[i].num_iid != item.num_iid){
                    dataSource.push(this.state.dataSource[i]);
                }else{
                    this.state.nowPageStatus.itemTotal = parseInt(this.state.nowPageStatus.itemTotal) - 1;
                }
            //单个商品的修改后的更新操作
            }else if(type=='update'){
                dataSource = this.state.dataSource;
                console.log('update',this.state.dataSource[i].num_iid,item.num_iid);
                if(this.state.dataSource[i].num_iid == item.num_iid){
                    console.log('update',this.state.dataSource[i].num_iid,item.num_iid,'相等');
                    dataSource[i] = item;
                    break;
                }
            }
        }
        this.setState({
            dataSource:dataSource
        });
    }

    //确认筛选
    submitFilter = (lastShop) =>{
        Taro.showLoading({ title: '加载中...' });

        let params = {
            pageNo:1
        };
        if (!IsEmpty(lastShop)) {
            params.shopType = lastShop.shop_type;
            params.shopId = lastShop.id;
            params.shopName = lastShop.shop_name;
        }
        this.state.lastShop = lastShop;

        this.getData(params);
    }

    //跳转到搜索页面
    goToSelect = () =>{
        Event.emit('App.DoBeacon',{event:"180313-listpage-searchbar"});
        if (this.state.subjectKey!='') {
            LocalStore.Set({'search_list_subjectkey':this.state.subjectKey});

        }
        if(this.type == 'recycle'){
            GoToView({status:'ItemSelectPage',query:{type:'recycle'}});
        }else{
            GoToView({status:'ItemSelectPage'});
        }
    }
    //批量操作
    btnOptions = (text) =>{
        console.log('chooseItems',this.chooseItems);
        this.state.toCancel = false;
        switch (text) {
            case '同步信息':{
                let dialogContentText = '重新获取1688产品的标题、价格、库存、主图等信息';
                if(this.state.lastShop.shop_type =='wc'){
                    dialogContentText = '重新获取1688产品的标题、价格、库存、主图和详情等信息';
                };
                this.setState({
                    dialogSet:{
                        dialogTitle:'同步1688货源信息',
                        dialogContentText:dialogContentText,
                        dialogOkText:'立即同步'
                    },
                    rate:0.0
                });
                this.refs.sureDialog.show();
            }
            break;
            case '取消代销':{
                if(this.state.lastShop.shop_type =='wc'){
                    this.setState({
                        dialogSet:{
                            dialogTitle:'取消代销',
                            dialogContentText:'您正在取消该产品的代销合作，取消后该商品将不能在爱用旺铺中展示',
                            dialogOkText:'取消代销'
                        },
                        rate:0.0,
                    });
                }else{
                    this.setState({
                        dialogSet:{
                            dialogTitle:'取消代销',
                            dialogContentText:'您正在取消该产品的代销合作，取消后该产品的订单将不再同步至1688分销商后台',
                            dialogOkText:'取消代销'
                        },
                        rate:0.0,
                        changeItemSet:['1'],
                        delChecked:true
                    });
                };
                this.refs.sureDialog.show();
            } break;
            case '删除':{
                this.setState({
                    dialogSet:{
                        dialogTitle:'删除已取消货品',
                        dialogContentText:'删除后该产品不再出现在代销货品列表中，您可选择是否同时删除店铺商品',
                        dialogOkText:'删除'
                    },
                    rate:0.0,
                    changeItemSet:['1'],
                    delChecked:false
                });
                this.refs.sureDialog.show();
            } break;
            default: break;
        }
    }

    //弹窗的确认操作
    submit = () =>{
        this.refs.sureDialog.hide();
        this.setState({
            progressDialogIsOpened:true
        });
        switch (this.state.dialogSet.dialogTitle) {
            case '同步1688货源信息':{
                this.synchroRelation(this.chooseItems,0,[],(result)=>{
                    this.btnCallback(result,'同步信息');
                });
            }
            break;
            case '取消代销':{
                this.updateRelation(this.chooseItems,0,[],(result)=>{
                    this.btnCallback(result,'取消代销');
                });
            }
            case '删除已取消货品':{
                this.updateRelationSub(this.chooseItems,0,[],(result)=>{
                    this.btnCallback(result,'删除');
                });
            }
            default: break;
        }
    }

    //批量任务结束后的回调
    btnCallback = (result,type) =>{
        console.log('result',result);
        this.setState({
            progressDialogIsOpened:false
        });
        //显示结果
        let success = 0;
        let faild = 0;
        let faildMsg = [];
        result.map((item,key)=>{
            if (item.isOk) {
                success = success + 1;
            } else {
                faild = faild + 1;
                if (!(faildMsg.indexOf(item.errorMsg) > -1)) {
                    faildMsg.push(item.errorMsg);
                }
            }
        });
        faildMsg = faildMsg.join(',');
        if (result.length < this.chooseItems.length){
            faildMsg = "您取消了操作";
        }

        this.chooseTotal = 0;
        this.chooseItems = [];
        if (faild > 0) {
            let faildNumber = "";
            if (type == '同步信息') {
                faildNumber = "成功为您同步"+success+"个商品信息，失败"+faild+"个";
            } else if (type == "取消代销") {
                faildNumber = "成功取消代销"+success+"个商品，失败"+faild+"个"
            }else if (type == "删除") {
                faildNumber = "成功删除"+success+"个商品，失败"+faild+"个"
            }
            this.setState({
                faildNumber:faildNumber,
                faildReson:faildMsg,
                checkedAll:false,
                chooseItem:[],
                headType:false,
                hischeckedAll:false,
                rate:0.0,
                toCancel:false,
                faildDialogIsOpened:true
            });
        } else {
            this.setState({
                checkedAll:false,
                chooseItem:[],
                headType:false,
                hischeckedAll:false,
                rate:0.0,
                toCancel:false
            });
            Taro.showToast({
                title: type+'成功~',
                icon: 'none',
                duration: 2000
            });
        }
        let params = {
            pageNo:1
        };
        Taro.showLoading({ title: '加载中...' });
        this.getData(params);
    }
    //修改代销关系 淘需要先修改真实代销关系
    updateRelation = (items,index,batchRes,callback) =>{
        let rate = (index + 1)/items.length;
        this.setState({
            rate:parseFloat(rate).toFixed(2)
        });
        if (items[index].shop_type == 'taobao') {
            NetWork.Post({
                url:"Distributeproxy/unLinkConsignSellItem",
                data:{
                    productId: items[index].origin_num_iid
                }
            },(result)=>{
                console.log('unLinkConsignSellItem',result);
                // if (!IsEmpty(result.isSuccess) && (result.isSuccess == 'true' || result.isSuccess == true)) {
                    this.updateRelationSub(items,index,batchRes,callback);
                // } else {
                //     if (!IsEmpty(result.errorMsg)){
                //         batchRes.push({
                //             isOk:false,
                //             errorMsg:result.errorMsg
                //         });
                //     } else {
                //         batchRes.push({
                //             isOk:false,
                //             errorMsg:"未知错误"
                //         });
                //     }
                //
                //     if (index >= items.length - 1) {
                //         callback(batchRes);
                //     } else {
                //         if(this.state.toCancel){
                //             callback(batchRes);
                //         } else {
                //             index = index + 1;
                //             this.updateRelation(items,index,batchRes,callback);
                //         }
                //     }
                // }
            },(error)=>{
                console.error(error);
                if (this.retry < 3) {
                    this.retry ++;
                    this.updateRelation(items,index,batchRes,callback);
                } else {
                    this.retry = 0;
                    index = index + 1;
                    batchRes.push({
                        isOk:false,
                        errorMsg:'网络异常'
                    });
                    index = index + 1;
                    this.updateRelation(items,index,batchRes,callback);
                }
            });
        } else {
            this.updateRelationSub(items,index,batchRes,callback);
        }
    }
    //修改代销关系
    updateRelationSub = (items,index,batchRes,callback) =>{
        //成功
        let param = {
            shopName:items[index].shop_name,
            shopType:items[index].shop_type,
            shopId:items[index].shop_id,
            productId:items[index].origin_num_iid,
            numIid:items[index].num_iid,
            needDelete:this.state.delChecked ? '1':'0'
        };
        if (this.state.dialogSet.dialogTitle == '删除已取消货品') {
            param.type = 'delete';
            let rate = (index + 1)/items.length;
            this.setState({
                rate:parseFloat(rate).toFixed(2)
            });
        }
        NetWork.Post({
            url:'Orderreturn/deleteRelation',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/deleteRelation',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                if (param.needDelete == '0') {
                    batchRes.push({
                        isOk:true
                    });
                } else {
                    if (items[index].shop_type == 'taobao') {
                        if (!IsEmpty(rsp.item)) {
                            batchRes.push({
                                isOk:true
                            });
                        } else {
                            if (!IsEmpty(rsp.sub_msg)) {
                                batchRes.push({
                                    isOk:false,
                                    errorMsg:rsp.sub_msg
                                });
                            } else {
                                batchRes.push({
                                    isOk:false,
                                    errorMsg:"未知错误"
                                });
                            }
                        }
                    } else {
                        if(items[index].shop_type=='wc'){
                            batchRes.push({
                                isOk:true
                            });
                        }else if(items[index].shop_type=='pdd'){
                            if (!IsEmpty(rsp.goods_sale_status_set_response) && !IsEmpty(rsp.goods_sale_status_set_response.is_success)) {
                                batchRes.push({
                                    isOk:true
                                });
                            } else {
                                if (!IsEmpty(rsp.error_response) && !IsEmpty(rsp.error_response.error_msg)) {
                                    batchRes.push({
                                        isOk:false,
                                        errorMsg:rsp.error_response.error_msg
                                    });
                                } else {
                                    batchRes.push({
                                        isOk:false,
                                        errorMsg:"未知错误"
                                    });
                                }
                            }
                        } else {
                            if (!IsEmpty(rsp.isSuccess) && rsp.isSuccess == true) {
                                batchRes.push({
                                    isOk:true
                                });
                            } else {
                                if (!IsEmpty(rsp.errorMsg)) {
                                    batchRes.push({
                                        isOk:false,
                                        errorMsg:rsp.errorMsg
                                    });
                                } else {
                                    batchRes.push({
                                        isOk:false,
                                        errorMsg:"未知错误"
                                    });
                                }
                            }
                        }

                    }
                }
            }
            if (index >= items.length-1) {
                callback(batchRes);
            } else {
                if(this.state.toCancel){
                    callback(batchRes);
                } else {
                    index = index + 1;
                    if (this.state.dialogSet.dialogTitle == '删除已取消货品') {
                        this.updateRelationSub(items,index,batchRes,callback);
                    } else {
                        this.updateRelation(items,index,batchRes,callback);
                    }

                }
            }
        },(error)=>{
            console.error(error);
            if (index >= items.length-1) {
                callback(batchRes);
            } else {
                if(this.state.toCancel){
                    callback(batchRes);
                } else {
                    index = index + 1;
                    if (this.state.dialogSet.dialogTitle == '删除已取消货品') {
                        this.updateRelationSub(items,index,batchRes,callback);
                    } else {
                        this.updateRelation(items,index,batchRes,callback);
                    }
                }
            }
        });
    }

    //同步信息
    synchroRelation = (items,index,batchRes,callback) =>{
        let rate = (index + 1)/items.length;
        this.setState({
            rate:parseFloat(rate).toFixed(2)
        });
        // let data = result.productInfo;
        //保存数据库  是否需要更新多平台信息
        let param = {
            shopName:items[index].shop_name,
            productID:items[index].origin_num_iid,
            shopType:items[index].shop_type,
            shopId:items[index].shop_id,
            numIid:items[index].num_iid,
            productID:items[index].origin_num_iid,
            origin_login_name:items[index].origin_login_name,
            // amountOnSale:data.saleInfo.amountOnSale,
            // subject:data.subject,
            // status:data.status,
            // price:GetPrice(data,'one'),
            // image:"https://cbu01.alicdn.com/"+data.image.images[0],
            needUpadate:'0'
        };
        NetWork.Post({
            url:'Orderreturn/synchroOneProduct',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/synchroOneProduct',rsp);
            //有结果
            if (!IsEmpty(rsp.code) && rsp.code == '200') {
                batchRes.push({
                    isOk:true
                });
            } else {
                //保存错误信息
                if (!IsEmpty(rsp.errorMsg)) {
                    if (rsp.errorMsg == "without consign relation") {
                        rsp.errorMsg = "代销关系已取消";
                    }
                    batchRes.push({
                        isOk:false,
                        errorMsg:rsp.errorMsg
                    });
                } else {
                    batchRes.push({
                        isOk:false,
                        errorMsg:'未知'
                    });
                }
            }
            if (index >= items.length - 1) {
                callback(batchRes);
            } else {
                if(this.state.toCancel){
                    callback(batchRes);
                } else {
                    index = index + 1;
                    this.synchroRelation(items,index,batchRes,callback);
                }
            }
        },(error)=>{
            batchRes.push({
                isOk:false,
                errorMsg:'网络异常'
            });
            if (index >= items.length -1) {
                callback(batchRes);
            } else {
                if(this.state.toCancel){
                    callback(batchRes);
                } else {
                    index = index + 1;
                    this.synchroRelation(items,index,batchRes,callback);
                }
            }
            console.error(error);
        });
    }

    //修改选择是否需要删除或下架
    changeSetDel = (value,flag) =>{
        console.log(flag,value);
        let chooseList = [];
        if (flag == 'group') {
            chooseList = value;
        } else {
            chooseList = this.state.changeItemSet;
            let index = chooseList.indexOf(value);
            if( index > -1){
                chooseList.splice(index,1);
            } else {
                chooseList.push(value);
            }
        }

        let delChecked = false;
        if (chooseList.indexOf('1') > -1) {
            delChecked = true;
        }

        console.log(delChecked,chooseList);
        this.setState({
            changeItemSet:chooseList,
            delChecked:delChecked
        });
    }

    //隐藏进度弹窗
    hideProgressDialog = () =>{
        this.setState({
            progressDialogIsOpened:false
        });
        this.chooseTotal=0;
        this.setState({
            toCancel:true
        });
    }

    //隐藏二次确认弹窗
    cancel = () =>{
        this.refs.sureDialog.hide();
    }

    render(){
        let headSelect='';//搜索、选择状态
        let headStatus='';//商品状态导航
        let footButton='';//底部按钮

        let {headType,checkedAll,pageStatus,nowPageStatus,subjectKey,lastShop,isLoading,dataSource,shopList,dialogSet} = this.state;

        let faildDialogContent = (
            <View style={{marginTop:px(12),width:px(612),paddingLeft:px(24),paddingRight:px(24)}}>
                <Text style={{fontSize:px(28),color:'#666666',width:px(564)}}>{this.state.faildNumber}</Text>
                <Text style={{fontSize:px(28),color:'#666666',marginTop:px(12),width:px(564)}}>失败原因:{this.state.faildReson}</Text>
            </View>
        );

        let progressDialogContent = (
            <View style={{marginLeft:px(25),flexDirection:'row',marginTop:px(36),alignItems:'center'}}>
                <Progress rate={this.state.rate} style={{width:px(36),height:px(36)}}/>
                <Text style={{fontSize:px(28),color:'#666',marginLeft:px(24)}}>{parseInt(this.state.rate*100)}%</Text>
            </View>
        );

        //批量状态的头部
        if (headType) {
            let length=0;
            if (checkedAll) {
                length=dataSource.length;
            } else {
                length=this.chooseTotal;
            }

            headSelect=
            <ChooseStatus
            ref="ChooseStatus"
            cancelBatch={this.cancelBatch}
            nowPageStatus={nowPageStatus}
            chooseNum={length}
            checkedAll={checkedAll}
            chooseAll={this.chooseAll}/>;
            headStatus='';
            switch (nowPageStatus.status) {
                case '代销中':
                case '已缺货':
                    footButton=
                    <View style={styles.footBox}>
                        <View style={styles.footBtn} onClick={()=>{this.btnOptions('同步信息')}}>
                            <Text style={styles.footText}>批量同步信息</Text>
                        </View>
                        <View style={styles.footBtn} onClick={()=>{this.btnOptions('取消代销')}}>
                            <Text style={styles.footText}>批量取消代销</Text>
                        </View>
                    </View>;
                    break;
                case '终止代销':
                    footButton=
                    <View style={styles.footBox}>
                        <View style={styles.footBtn} onClick={()=>{this.btnOptions('删除')}}>
                            <Text style={styles.footText}>批量删除</Text>
                        </View>
                    </View>;
                    break;
                default:break;
            }
        }else {
            let subject='';
            if (subjectKey!='') {
                subject=
                <View style={styles.subjectTag} onClick={this.deleteSubjectKey}>
                    <Text style={styles.subjectText}>
                        {subjectKey}
                    </Text>
                    <ItemIcon code={"\ue69a"} iconStyle={styles.closeIcon}/>
                </View>;
            }
            headSelect= (
            <View style={styles.selectView}>
                <View style={[styles.inputBox,{flexDirection:'row',alignItems:'center'}]}>
                {
                    !IsEmpty(subjectKey) ?
                    ''
                    :
                    <Text style={{fontSize:px(28),color:'#999999',marginLeft:54}}>输入搜索关键词</Text>
                }
                </View>
                <ItemIcon code={"\ue6ac"} iconStyle={styles.searchIcon}/>
                <View style={styles.touchInput} onClick={()=>{this.goToSelect()}}></View>
                {subject}
                <View style={styles.arrowDown} onClick={()=>{this.refs.slideDialog.show()}}>
                {
                    !IsEmpty(lastShop.pic_url) ?
                    <Image src={lastShop.pic_url}
                    style={{width:px(60),height:px(60)}}
                    onClick={()=>{this.refs.slideDialog.show()}}
                    />
                    :
                    <ItemIcon onClick={()=>{this.refs.slideDialog.show()}}
                    iconStyle={{color:'#666666'}}
                    code={"\ue6a6"}
                    />
                }
                </View>
            </View>);
            headStatus = (this.type =='recycle'?null:(
                <ProductStatus
                pageStatus={pageStatus}
                nowPageStatus={nowPageStatus}
                changeStaus={this.changeStaus}
                />)
                );
        }

        let content = '';
        if (isLoading) {
            content = '';
        } else {
            if (IsEmpty(dataSource)) {
                content = (
                    <ScrollView 
                    ref="itemListView"
                    scrollY = {true} 
                    scrollWithAnimation 
                    style={headType ? {paddingBottom:px(100)}:{}}
                    >
                        {this.renderNull()}
                    </ScrollView>
                );
            } else {
                content = (
                    <ScrollView 
                    ref="itemListView"
                    scrollY = {true} 
                    scrollWithAnimation 
                    style={headType ? {paddingBottom:px(100)}:{}}
                    >
                        {
                            dataSource.map((item,key)=>{
                                return this.getProductLists(item, key)
                            })
                        }
                    </ScrollView>
                );
            }
        }

        return (
            <View>
                <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
                    <View>
                        {headSelect}
                        {headStatus}
                    </View>
                    {content}
                    {footButton}
                </View>
                <View>
                    <Text>{JSON.stringify(this.props)}</Text>
                </View>
                <SideDialog
                ref='slideDialog'
                submitFilter={this.submitFilter}
                shopId = {this.state.lastShop.id}
                shopList={shopList}
                ></SideDialog>
                {/* <AtModal isOpened={this.state.sureDialogIsOpened}>
                    <AtModalHeader>{dialogSet.dialogTitle}</AtModalHeader>
                    <AtModalContent>
                        <View style={{width:px(612),marginTop:px(24),minHeight:px(200),paddingLeft:px(24)}}>
                            <Text style={[styles.dialogText,dialogSet.dialogTitle == '同步1688货源信息' ? {marginTop:px(50)}:{}]}>
                            {dialogSet.dialogContentText}
                            </Text>
                            {
                                dialogSet.dialogTitle == "取消代销" || dialogSet.dialogTitle == "删除已取消货品"?
                                <Checkbox.Group value={this.state.changeItemSet} onChange={(value)=>{this.changeSetDel(value,'group')}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{this.changeSetDel('1','line')}}>
                                        <Checkbox
                                        value={"1"}
                                        size="small"
                                        style={{borderRadius:px(4),width:px(40),height:px(40)}}
                                        checkedStyle={{borderRadius:px(4),width:px(40),height:px(40)}}/>
                                        <Text style={{fontSize:px(28),color:'#333333',width:px(500)}}>
                                        同时{dialogSet.dialogTitle == "取消代销" ? "下架":"删除"}已铺货到下游店铺的商品
                                        </Text>
                                    </View>
                                </Checkbox.Group>
                                :
                                ''
                            }
                        </View>
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={this.cancel}>{dialogSet.dialogCancelText ? dialogSet.dialogCancelText : '取消'}</Button>
                        <Button onClick={this.submit}>{dialogSet.dialogOkText ? dialogSet.dialogOkText : '确定'}</Button> 
                    </AtModalAction>
                </AtModal>
                <AtModal
                isOpened = {this.state.progressDialogIsOpened}
                title='正在执行操作，请稍后...'
                confirmText='取消'
                onConfirm={()=>{this.hideProgressDialog()}}
                content = {progressDialogContent}
                />
                <AtModal
                isOpened = {this.state.faildDialogIsOpened}
                title='温馨提示'
                confirmText='我知道了'
                onConfirm={()=>{
                    this.setState({
                        faildDialogIsOpened:false
                    });
                }}
                content = {faildDialogContent}
                /> */}
            </View>
        );
    }
}