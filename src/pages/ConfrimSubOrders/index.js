import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Image ,ScrollView,Button } from '@tarojs/components';
// import {AtInputNumber} from 'taro-ui';
import ItemIcon from '../../Component/ItemIcon';
import AiyongDialog from '../../Component/AiyongDialog';
import ChooseSkuDialog from '../../Component/ChooseSkuDialog';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import styles from './styles';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 确认采购单
 */
export default class ConfrimSubOrders extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:[], //所有采购单信息
            type:'', //采购单是全部或单个 all 或 one
            btnStatus:false, //是否可以确认采购单
            lastSubOrder:{}, //当前操作的采购单
            choosedSku:'', //当前选择的sku
            orderMsg:{}, //当前采购单的订单信息
            fromPage:'', //来自的页面
            faildReson:'', //确认采购的失败原因
            dialogLeftText:'', //失败弹窗左边的文字
            dialogRightText:'', //失败弹窗右边的文字
            offerId:'', //当前商品的id
            specId:'', //当前商品所选择的sku specId
            getsell:'',
        };
        this.downpay = 0;
        this.cargoParamList = '';
        this.supplyOrders = '';
        this.flow = '';
        let self = this;
        //返回操作
        // RAP.on('back',function(e){
        //     LocalStore.Remove(['go_to_confrim_suborder','go_to_confrim_orderMsg']);
        //     if (self.state.fromPage == 'detail') {
        //         RAP.emit('App.redetail',{});
        //     }
        //     RAP.emit('App.update_shop_orders',{});
        //     GoToView({page_status:'pop'});
        // });
    }

    // config: Config = {
    //     navigationBarTitleText: '确认采购单'
    // }

    componentWillMount(){
        let self = this;
        let type = GetQueryString({name:'type'});
        let fromPage = GetQueryString({name:'fromPage'});
        let totalPrice1 = GetQueryString({name:'totalPrice1'});
        let totalPrice2 = GetQueryString({name:'totalPrice2'});
        this.downpay = totalPrice1*1+totalPrice2*0.01;
        //获取当前订单信息和采购单信息
        LocalStore.Get(['go_to_confrim_suborder','go_to_confrim_orderMsg'],(result) => {
            console.log('go_to_confrim_suborder',result);
            if (!IsEmpty(result)) {
                let resultData = Parse2json(result.go_to_confrim_suborder);
                let orderMsg = Parse2json(result.go_to_confrim_orderMsg);
                let btnStatus = true;
                resultData.map((item,key)=>{
                    if (IsEmpty(item.innerSpec)) {
                        btnStatus = false;
                    }
                });
                self.setState({
                    dataSource:resultData,
                    type:type,
                    btnStatus:btnStatus,
                    orderMsg:orderMsg,
                    fromPage:fromPage
                });
            }
        });
    }

    //更新state 选择sku弹窗用
    updateStates = (obj) =>{
        this.setState({
            ...obj
        });
    }

    //选择sku操作，获取一遍1688淘货源详情
    chooseSku = (product,offerId,specId) =>{
        this.setState({
            lastSubOrder:product,
            offerId:offerId,
            specId:specId
        });
        console.log(product,offerId,specId);
        this.refs.skuDialog.show();
    }
    // 修改sku数量
    changeskunum = (e,specId) => {
        const {dataSource} = this.state;
        let tokennum =0;
        dataSource.map((item,key)=>{
            let itemlist = [];
            if (!IsEmpty(item.itemlist)) {
                itemlist = item.itemlist;
            } else {
                itemlist.push(item);
                dataSource[key].itemlist = itemlist;
            }

            for (let i = 0; i < itemlist.length; i++) {

                if (specId == itemlist[i].specId) {
                    dataSource[key].itemlist[i].buyAmount = e;
                    tokennum = tokennum + e;
                }else{
                    tokennum = tokennum + dataSource[key].itemlist[i].buyAmount;
                }
            }
        });
        if(tokennum==0){
            Taro.showToast({
                title: '采购单数量总和不能为0',
                icon: 'none',
                duration: 2000
            });
        }else{
            this.setState({
                dataSource:dataSource,
            });
        }
    };

    //渲染采购单卡片
    renderCards = () =>{
        const {dataSource} = this.state;
        let doms = [];
        if (!IsEmpty(dataSource)) {
            dataSource.map((item,key)=>{
                let itemlist = [];
                if (!IsEmpty(item.itemlist)) {
                    itemlist = item.itemlist;
                } else {
                    itemlist.push(item);
                }

                doms.push(
                    <View style={styles.card}>
                        <View style={styles.supplierLine}>
                            <Text style={{fontSize:px(28),color:'#999999'}}>供应商：</Text>
                            <Text style={{fontSize:px(28),color:'#999999'}}>{item.supplierNickName}</Text>
                            {
                                !IsEmpty(item.supplierId) ? 
                                <View style = {{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}} onClick={()=>{this.faildDialogSubmit('申请分销',item.supplierId)}}>
                                    <Text style={{fontSize:px(28),color:'#3089dc'}}>申请分销</Text>
                                </View>
                                :
                                ''
                            }
                            
                        </View>
                        <View style={{marginTop:24}}>
                        {
                            itemlist.map((product,idx)=>{
                                let picUrl  = 'https://cbu01.alicdn.com/images/app/detail/public/camera.gif';
                                if (!IsEmpty(product.offerPicUrl)) {
                                    if (product.offerPicUrl.indexOf('https://cbu01.alicdn.com/') > -1) {
                                        picUrl = product.offerPicUrl;
                                    } else {
                                        picUrl = 'https://cbu01.alicdn.com/'+product.offerPicUrl;
                                    }
                                }
                                let sku = '';
                                if(!IsEmpty(product.innerSpec)){
                                    for(let i in product.innerSpec){
                                        sku += product.innerSpec[i]+',';
                                    }
                                    sku = sku.slice(0,-1);
                                } else {
                                    sku = '请重新选择商品规格';
                                }

                                let price = '';
                                if (product.minPrice == product.maxPrice) {
                                    price = '¥' + product.minPrice;
                                } else {
                                    price = '¥' + product.minPrice + '~¥' + product.maxPrice;
                                }

                                return (
                                    <View style={styles.cardLine}>
                                        <Image src={picUrl} style={{width:px(120),height:px(120)}}/>
                                        <View style={{marginLeft:px(12),flex:1}}>
                                            <View style={{width:px(532)}}>
                                                <Text style={{width:px(532),fontSize:px(24),color:'#4a4a4a'}}>{product.offerTitle}</Text>
                                            </View>
                                            <View style={{marginTop:px(18),flexDirection:'row',alignItems:'center',flex:1}}>
                                                {
                                                    !IsEmpty(product.innerSpec) ?
                                                    <View style={styles.skuTag} onClick={()=>{this.chooseSku(product,product.offerId,product.specId)}}>
                                                        <Text style={{fontSize:px(24),color:'#9a9a9a'}}>{sku}</Text>
                                                        <ItemIcon code={"\ue6a6"} iconStyle={{fontSize:px(24),color:'#9a9a9a'}}/>
                                                    </View>
                                                    :
                                                    <Button style={styles.littleBtn} onClick={()=>{this.chooseSku(product,product.offerId)}}>匹配规格</Button>
                                                }
                                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                                                    {/* <Text style={{fontSize:px(24),color:'#9a9a9a'}}>x{product.buyAmount}</Text> */}
                                                    <AtInputNumber style={{width:px(180),height:px(57)}} min={0} max={99999} value={product.buyAmount} onChange={(e)=>{this.changeskunum(e,product.specId)}}  step={1}/>
                                                </View>
                                            </View>
                                            {
                                                !IsEmpty(product.innerSpec)?
                                                <View style={styles.priceTag}>
                                                    <Text style={{fontSize:px(24),color:'#ff6000'}}>{price}</Text>
                                                </View>
                                                :
                                                <View style={styles.noMateTag}>
                                                    <Text style={{fontSize:px(18),color:'#ffffff'}}>规格未匹配</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                        </View>
                    </View>
                );
            });
        }

        return doms;
    }

    //获取字符串长度
    getByteLen=(val)=>{
        let len = 0;
        for (let i = 0; i < val.length; i++) {
            let a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        return len;
    }
    //确定采购单之前
    confrimOrdersbefore = (flow)=> {
        const self = this;
        let orderMsg = this.state.orderMsg;
        let dataSource = this.state.dataSource;
        let cargoParamList = [];
        let supplyOrders = [];
        dataSource.map((item,key)=>{
            if (!IsEmpty(item.itemlist)) {
                item.itemlist.map((subitem,idx)=>{
                    supplyOrders.push(subitem.orderId);
                    if (subitem.specId != '0') {
                        //无sku时的操作
                        cargoParamList.push(
                            {
                                offerId:subitem.offerId,
                                specId:subitem.specId,
                                quantity:subitem.buyAmount
                            }
                        );
                    } else {
                        cargoParamList.push(
                            {
                                offerId:subitem.offerId,
                                quantity:subitem.buyAmount
                            }
                        );
                    }

                });
            } else {
                supplyOrders.push(item.orderId);
                if (item.specId != '0') {
                    //无sku时的操作
                    cargoParamList.push(
                        {
                            offerId:item.offerId,
                            specId:item.specId,
                            quantity:item.buyAmount
                        }
                    );
                } else {
                    cargoParamList.push(
                        {
                            offerId:item.offerId,
                            quantity:item.buyAmount
                        }
                    );
                }

            }

        });
        this.flow = flow;
        this.cargoParamList = cargoParamList;
        this.supplyOrders = supplyOrders;
        let addressparam = orderMsg.addressParam;
        let addressParamname = orderMsg.addressParam;
        console.log('kankanfullname',addressParamname);
        let leng = self.getByteLen(addressParamname.fullName);
        if(leng<=2){
            addressParamname.fullName = addressParamname.fullName+'先生/女士';
            // addressparam = JSON.stringify(addressParamname);
            addressparam = addressParamname;
        }
        let params = {
            addressParam:addressparam,
            cargoParamList:cargoParamList,
            invoiceParam:'',
            flow:flow,
        };
        if (orderMsg.shopType != 'pdd' && orderMsg.shopType != 'wc') {
            self.confirmSubOrders();
            return;
        }
        Taro.showLoading({ title: '加载中...' });
        //确认采购单前预览
        NetWork.Post({
            url:'Distributeproxy/createOrderPreview',
            data:params
        },(result)=>{
            if (IsEmpty(result.errorCode)) {
                let getsell = this.downpay*100-result.orderPreviewResuslt[0].sumPayment*1
                if(getsell<0){
                    //有亏损
                    Taro.hideLoading();
                    self.refs.lossDialog.show();
                    let newGetSell = (getsell*(-0.01)).toFixed(2);
                    let getSellText = '该笔采购将会导致您亏损'+newGetSell+'元，是否确定采购单？';
                    self.setState({
                        getsell:getSellText,
                    })

                }else{
                    self.confrimOrders();
                }
			}else{
                //预览失败，显示失败信息
                Taro.hideLoading();
                let errorMessage = '';
                if (!IsEmpty(result.errorMsg)) {
                    errorMessage = result.errorMsg;
                } else if (!IsEmpty(result.message)) {
                    errorMessage = result.message;
                } else {
                    errorMessage = JSON.stringify(result);
                }
                if (errorMessage.indexOf('TB_ORDER_LOGISTICS_STATUS_ERROR') > -1) {
                    errorMessage = '生成订单失败！该淘宝订单已发货';
                } else if (errorMessage.indexOf('FAIL_BIZ_FAIL_BIZ_PROXY_RELATED_NOT_FUND') > -1) {
                    errorMessage = '抱歉，供应商未授权，无法分销该产品，请申请分销权限后再下单或尝试现货采购';
                }
                if (orderMsg.shopType != 'pdd' && orderMsg.shopType != 'wc') {
                    this.setState({
                        dialogLeftText:'遇到问题',
                        dialogRightText:'我知道了',
                        faildReson:errorMessage
                    });
                } else {
                    if (!IsEmpty(flow) && flow == 'general') {
                        this.setState({
                            dialogLeftText:'联系供应商',
                            dialogRightText:'申请分销',
                            faildReson:errorMessage
                        });
                    } else {
                        this.setState({
                            dialogLeftText:'现货采购',
                            dialogRightText:'申请分销',
                            faildReson:errorMessage
                        });
                    }
                }
                this.refs.faildDialog.show();
            }
			// console.log(result);
        },(error)=>{
            Taro.hideLoading();
			console.error(error);
        });
    }

    confirmSubOrders = () =>{
        let orderMsg = this.state.orderMsg;
        let submitDatas = [];

        this.state.dataSource.map((item,key)=>{
            if (submitDatas.indexOf(item.relationId) <= -1) {
                let supplyOrders = [];
                let offerIds = [];
                if (!IsEmpty(item.itemlist)) {
                    item.itemlist.map((subitem,idx)=>{
                        supplyOrders.push(subitem.orderId);
                        offerIds.push(subitem.offerId);
                    });
                } else {
                    supplyOrders.push(item.orderId);
                    offerIds.push(item.offerId);
                }
                submitDatas.push({
                    relationId:item.relationId,
                    shopName:orderMsg.shopName,
                    shopType:orderMsg.shopType,
                    lowerOrderId:orderMsg.tid,
                    shopId:orderMsg.shopId,
                    supplyOrders:supplyOrders,
                    offerIds:offerIds
                });
            }
        });

        console.log('submitDatas',submitDatas);
        Taro.showLoading({ title: '加载中...' });
        this.confrimOrders(0,submitDatas,[],(errorArr)=>{
            Taro.hideLoading();
            if (errorArr.length > 0) {
                this.setState({
                    dialogLeftText:'遇到问题',
                    dialogRightText:'我知道了',
                    faildReson:errorArr[0]
                });
                this.refs.faildDialog.show();

            } else {
                Taro.showToast({
                    title: '确认成功',
                    icon: 'none',
                    duration: 2000
                });
                if (this.state.fromPage == 'detail') {
                    // RAP.emit('App.redetail',{});
                }
                // RAP.emit('App.update_shop_orders',{});
                GoToView({page_status:'pop'});
            }

        });
    }

    //确认采购单
    confrimOrders = (idx = 0,submitDatas = [],errorArr = [],callback = '') =>{
        let params = {};
        let orderMsg = this.state.orderMsg;
        let cargoParamList = this.cargoParamList;
        let supplyOrders = this.supplyOrders;
        let flow = this.flow;
        let addressParamnew = JSON.stringify(orderMsg.addressParam);
            addressParamnew = encodeURIComponent(addressParamnew);
        if (orderMsg.shopType != 'pdd' && orderMsg.shopType != 'wc') {
            params = submitDatas[idx];
            let offerIds = submitDatas[idx].offerIds;
            params = {
                relationId:submitDatas[idx].relationId,
                shopName:submitDatas[idx].shopName,
                shopType:submitDatas[idx].shopType,
                lowerOrderId:submitDatas[idx].lowerOrderId,
                shopId:submitDatas[idx].shopId,
                supplyOrders:submitDatas[idx].supplyOrders,
            };
            params.addressParam = addressParamnew;
            let newCargoList = [];
            for (let i = 0; i < cargoParamList.length; i++) {
                for (let j = 0; j < offerIds.length; j++) {
                    if (cargoParamList[i].offerId == offerIds[j]) {
                        newCargoList.push(cargoParamList[i]);
                        break ;
                    }
                }
            }
            
            params.cargoParamList = JSON.stringify(newCargoList);
        } else {
            params = {
                shopName:orderMsg.shopName,
                shopType:orderMsg.shopType,
                lowerOrderId:orderMsg.tid,
                relationId:orderMsg.relationId,
                shopId:orderMsg.shopId,
                addressParam:addressParamnew,
                cargoParamList:JSON.stringify(cargoParamList)
            };
            if (!IsEmpty(flow)) {
                params.flow = flow;
            }
        }

        console.log('params',params);
        //确认采购单
        NetWork.Post({
            url:'Orderreturn/submitSupplyOrder',
            data:params
        },(data)=>{
            console.log('Orderreturn/submitSupplyOrder',data);
            if((!IsEmpty(data.isSuccess) && (data.isSuccess == true || data.isSuccess == 'true')) || (!IsEmpty(data.success) && (data.success == true || data.success == 'true'))){
                console.log('Orderreturn/submitSupplyOrder','成功');
                if (orderMsg.shopType != 'taobao') {
                    Taro.hideLoading();
                    Taro.showToast({
                        title: '确认成功',
                        icon: 'none',
                        duration: 2000
                    });
                    if (this.state.fromPage == 'detail') {
                        // RAP.emit('App.redetail',{});
                    }
                    // RAP.emit('App.update_shop_orders',{});
                    GoToView({page_status:'pop'});
                }
            } else {
                //确认采购单失败
                let errorMessage = '';
                if (!IsEmpty(data.errorMsg)) {
                    errorMessage = data.errorMsg;
                } else if (!IsEmpty(data.message)) {
                    errorMessage = data.message;
                } else {
                    errorMessage = JSON.stringify(data);
                }
                if (errorMessage.indexOf('TB_ORDER_LOGISTICS_STATUS_ERROR') > -1) {
                    errorMessage = '生成订单失败！该淘宝订单已发货';
                } else if (errorMessage.indexOf('FAIL_BIZ_FAIL_BIZ_PROXY_RELATED_NOT_FUND') > -1) {
                    errorMessage = '抱歉，供应商未授权，无法分销该产品，请申请分销权限后再下单或尝试现货采购';
                }
                if (orderMsg.shopType != 'pdd' && orderMsg.shopType != 'wc') {
                    errorArr.push(errorMessage);
                } else {
                    Taro.hideLoading();
                    if (!IsEmpty(flow) && flow == 'general') {
                        this.setState({
                            dialogLeftText:'联系供应商',
                            dialogRightText:'申请分销',
                            faildReson:errorMessage
                        });
                    } else {
                        this.setState({
                            dialogLeftText:'现货采购',
                            dialogRightText:'申请分销',
                            faildReson:errorMessage
                        });
                    }
                }w
                if (orderMsg.shopType == 'pdd' || orderMsg.shopType == 'wc') {
                    this.refs.faildDialog.show();
                }
            }

            if (orderMsg.shopType != 'pdd' && orderMsg.shopType != 'wc') {
                if (submitDatas.length-1 <= idx) { //结束
                    callback(errorArr);
                } else {
                    idx = idx + 1;
                    this.confrimOrders(idx,submitDatas,errorArr,callback);
                }
            }
        },(error)=>{
            errorArr.push('网络异常，请稍后再试');
            if (submitDatas.length-1 >= idx) { //结束
                callback(errorArr);
            } else {
                idx = idx + 1;
                this.confrimOrders(idx,submitDatas,errorArr,callback);
            }
            Taro.hideLoading();
            alert(JSON.stringify(error));
        });
    }

    //失败弹窗的右边按钮操作
    faildDialogSubmit = (text,supplierMemberId = '') =>{
        if (supplierMemberId == '') {
            supplierMemberId = this.state.orderMsg.supplierMemberId;
        }
        switch (text) {
            case '申请分销':{
                this.refs.faildDialog.hide();
                GoToView({status:"https://page.1688.com/html/fa9028cc.html?sellerId=" + supplierMemberId,page_status:'special'});
            } break;
            case '我知道了':{
                this.refs.faildDialog.hide();
            } break;
            default:break;
        }
    }

    //失败弹窗左边按钮操作
    faildDialogCancel = (text) =>{
        let supplierNickName = this.state.dataSource[0].supplierNickName;
        this.refs.faildDialog.hide();
        switch (text) {
            case '联系供应商':{
                UitlsRap.openChat(supplierNickName);
            } break;
            case '现货采购':{
                this.confrimOrdersbefore('general');
            } break;
            case '遇到问题':{
                UitlsRap.sendMessage({
                    loginid:'爱用科技1688',
                    message:'确认采购单失败'+this.state.faildReson
                });
                UitlsRap.openChat('爱用科技1688');
            } break;
            default:break;
        }
    }


    render(){
        const {dataSource,btnStatus,dialogLeftText,dialogRightText,faildReson,orderMsg,lastSubOrder,offerId,specId} = this.state;
        let supplierNum = dataSource.length;
        let typeNum = 0;
        let productNum = 0;
        dataSource.map((item,key)=>{
            let itemlist = [];
            if (!IsEmpty(item.itemlist)) {
                itemlist = item.itemlist;
            } else {
                itemlist.push(item);
            }
            itemlist.map((product,idx)=>{
                typeNum = typeNum + 1;
                productNum = productNum + parseInt(product.buyAmount);
            });
        });

        return (
            <View>
                <View style={styles.topLine}>
                    <Text style={{fontSize:px(28),color:'#333333'}}>请确认您的采购单</Text>
                </View>
                <ScrollView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                    {this.renderCards()}
                </ScrollView>
                <View style={styles.footLine}>
                    <View style={styles.footTop}>
                        <Text style={{fontSize:px(28),color:'#4A4A4A'}}>
                            共计{supplierNum}个供应商，{typeNum}种货品共{productNum}件
                        </Text>
                    </View>
                    <View style={btnStatus ? styles.footBottom:styles.footBottomGray} onClick={()=>{
                        if (btnStatus) {
                            this.confrimOrdersbefore('saleproxy')
                        }
                    }}>
                        <Text style={btnStatus ? styles.footText:styles.footTextGray}>确定采购</Text>
                    </View>
                </View>
                <ChooseSkuDialog ref={"skuDialog"}
                orderMsg={orderMsg}
                offerId={offerId}
                specId={specId}
                dataSource={dataSource}
                lastSubOrder={lastSubOrder}
                updateStates={this.updateStates}
                showLoading={()=>{Taro.showLoading({ title: '加载中...' });}}
                hideLoading={()=>{Taro.hideLoading();}}
                from="all"
                showLoading={()=>{Taro.showLoading({ title: '加载中...' });}}
                hideLoading={()=>{Taro.hideLoading();}}
                />
                <AiyongDialog
                maskClosable={true}
                ref={"faildDialog"}
                title={"确认采购单失败"}
                cancelText={dialogLeftText}
                okText={dialogRightText}
                content={faildReson}
                onSubmit={()=>{this.faildDialogSubmit(dialogRightText)}}
                onCancel={()=>{this.faildDialogCancel(dialogLeftText)}}
                />
                <AiyongDialog
                ref={"lossDialog"}
                title={"该笔订单会亏损"}
                cancelText={'取消'}
                okText={'确定'}
                content={this.state.getsell}
                onSubmit={()=>{this.confrimOrders();this.refs.lossDialog.hide();}}
                onCancel={()=>{this.refs.lossDialog.hide();}}
                />
            </View>
        );
    }
}