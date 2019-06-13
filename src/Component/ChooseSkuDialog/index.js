import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Image ,ScrollView} from '@tarojs/components';
import { Toast } from '@ant-design/react-native';
import Dialog from '../Dialog';
import ItemIcon from '../ItemIcon';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import px from '../../Biz/px.js';
import styles from './styles';
import {GetPrice} from '../../Biz/GetPrice.js';
import AyButton from '../../Component/AyButton/index';
/**
 * @author cy
 * 选择sku弹窗
 */
export default class ChooseSkuDialog extends Component {
    constructor(props) {
        super(props);
        this.state={
            type:'', //用于标识sku弹窗显示方式
            productInfo:{}, //当前商品信息
            skuBtnStatus:false, //是否可修改sku
            skus:[], //当前商品的sku
            dataSource:!IsEmpty(this.props.dataSource) ? this.props.dataSource:[], //采购单信息
            lastSubOrder:!IsEmpty(this.props.lastSubOrder) ? this.props.lastSubOrder : {}, //当前采购单
            orderMsg:!IsEmpty(this.props.orderMsg) ? this.props.orderMsg : {}, //订单信息
            offerId:!IsEmpty(this.props.offerId) ? this.props.offerId : '', //商品id
            specId:!IsEmpty(this.props.specId) ? this.props.specId : '', //当前选择的sku specId
            from:!IsEmpty(this.props.from) ? this.props.from : '', //来自详情页或者列表
            notChooseSpecs:!IsEmpty(this.props.notChooseSpecs) ? this.props.notChooseSpecs : '', //不可选择的sku specId
            lastSkuPrice:'', //当前选择的sku的价格
            lastSkuAmount:'', //当前选择的sku的可售数量
        };
    }

    componentWillReceiveProps(nextProps){
        let {lastSubOrder,offerId,orderMsg,specId,dataSource,from,notChooseSpecs} = this.state;
        if (!IsEmpty(nextProps.lastSubOrder)) { lastSubOrder = nextProps.lastSubOrder; }
        if (!IsEmpty(nextProps.offerId)) { offerId = nextProps.offerId; }
        if (!IsEmpty(nextProps.orderMsg)) { orderMsg = nextProps.orderMsg; }
        if (!IsEmpty(nextProps.specId)) { specId = nextProps.specId; }
        if (!IsEmpty(nextProps.dataSource)) { dataSource = nextProps.dataSource; }
        if (!IsEmpty(nextProps.from)) { from = nextProps.from; }
        if (!IsEmpty(nextProps.notChooseSpecs)) { notChooseSpecs = nextProps.notChooseSpecs; }
        console.log('rener---componentWillReceiveProps--notChooseSpecs',offerId,notChooseSpecs);
        this.setState({
            lastSubOrder:lastSubOrder,
            offerId:offerId,
            orderMsg:orderMsg,
            specId:specId,
            dataSource:dataSource,
            from:from,
            notChooseSpecs:notChooseSpecs
        });
    }

    //获取商品信息并显示
    show = () =>{
        const {orderMsg,offerId,specId} = this.state;
        console.log('rener---chooseSku',orderMsg,offerId,specId);
        //加loading
        this.props.showLoading();
        this.chooseSku(orderMsg,offerId,specId);
    }

    //隐藏弹窗
    hide = () =>{
        this.refs.chooseSkuDialog.hide();
    }
    //选择sku操作，获取一遍1688淘货源详情
    chooseSku = (orderMsg,offerId,specId) =>{
        if (orderMsg.shopType == 'taobao') {
            //获取一遍详情
            NetWork.Get({
                url:'Orderreturn/getProductInfo',
                data:{
                    productId:offerId
                }
            },(rsp)=>{
                console.log('Orderreturn/getProductInfo',rsp);
                this.props.hideLoading();
                if (!IsEmpty(rsp.productInfo)) {
                    let productInfo = rsp.productInfo;
                    let skuBtnStatus = false;
                    if (IsEmpty(productInfo.skuInfos)) {
                        skuBtnStatus = true;
                    }
                    let skus = [];
                    if (!IsEmpty(productInfo.skuInfos)) {
                        let attributes = productInfo.skuInfos[0].attributes;
                        //处理sku
                        attributes.map((attr,key)=>{
                            let oneSku = {};
                            let name = '';
                            let attrId = '';
                            for (let i = 0; i < productInfo.attributes.length; i++) {
                                if (attr.attributeID == productInfo.attributes[i].attributeID) {
                                    name = productInfo.attributes[i].attributeName;
                                    attrId = productInfo.attributes[i].attributeID;
                                    break;
                                }
                            }

                            let values = [];
                            productInfo.skuInfos.map((skuVal,skuKey)=>{
                                for (let i = 0; i < skuVal.attributes.length; i++) {
                                    let hasIn = false;
                                    for (let j = 0; j < values.length; j++) {
                                        if (values[j].attributeValue == skuVal.attributes[i].attributeValue) {
                                            hasIn = true;
                                            break;
                                        }
                                    }
                                    if (skuVal.attributes[i].attributeID == attrId && !hasIn) {
                                        values.push({
                                            attributeID:skuVal.attributes[i].attributeID,
                                            attributeValue:skuVal.attributes[i].attributeValue,
                                            isActive:false
                                        });
                                    }
                                }
                            });
                            oneSku.name = name;
                            oneSku.attrId = attrId;
                            oneSku.values = values;
                            skus.push(oneSku);
                        });

                        //是否需要默认选中
                        if (!IsEmpty(specId)) {
                            let attr = {};
                            productInfo.skuInfos.map((item,key)=>{
                                if (item.specId == specId) {
                                    attr = item;
                                }
                            });
                            if (!IsEmpty(attr)) {
                                skuBtnStatus = true;
                                for (let i = 0; i < attr.attributes.length; i++) {
                                    for (let j = 0; j < skus.length; j++) {
                                        if (attr.attributes[i].attributeID == skus[j].attrId) {
                                            for (let k = 0; k < skus[j].values.length; k++) {
                                                if (skus[j].values[k].attributeValue == attr.attributes[i].attributeValue) {
                                                    skus[j].values[k].isActive = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }

                    }
                    this.setState({
                        skus:skus,
                        productInfo:rsp.productInfo,
                        skuBtnStatus:skuBtnStatus
                    });
                    this.refs.chooseSkuDialog.show();
                } else {
                    if (!IsEmpty(rsp.msg)) {
                        Toast.info(rsp.msg, 2);
                    }
                }
            },(error)=>{
                this.props.hideLoading();
                console.error(error);
            });
        } else {
            //以简单商品详情获取
            this.getProductInfo(offerId,0,(result)=>{
                this.props.hideLoading();
                if (!IsEmpty(result.productInfo)) {
                    let productInfo = result.productInfo;
                    let skuBtnStatus = false;
                    let skus = [];
                    let lastSkuPrice = '';
                    let lastSkuAmount = '';
                    if (!IsEmpty(productInfo.skuInfos)) {
                        skuBtnStatus = false;
                        //处理sku
                        productInfo.skuInfos.map((item,key)=>{
                            let oneSku = {
                                attributes:item.attributes,
                                amountOnSale:item.amountOnSale,
                                price:item.price,
                                skuId:item.skuId,
                                specId:item.specId
                            };
                            if (item.specId == specId || productInfo.skuInfos.length == 1) {
                                oneSku.isActive = true;
                                skuBtnStatus = true;
                                if (!IsEmpty(item.price)) {
                                    lastSkuPrice = item.price;
                                    lastSkuAmount = item.amountOnSale;
                                }
                            } else {
                                oneSku.isActive = false;
                            }
                            skus.push(oneSku);
                        });
                        console.log('skus',productInfo.skuInfos,skus);
                    } else {
                        skuBtnStatus = true;
                    }
                    this.setState({
                        skus:skus,
                        productInfo:result.productInfo,
                        skuBtnStatus:skuBtnStatus,
                        lastSkuPrice:lastSkuPrice,
                        lastSkuAmount:lastSkuAmount
                    });
                    this.refs.chooseSkuDialog.show();
                } else {
                    if (!IsEmpty(result.errMsg)) {
                        Toast.info(result.errMsg, 2);
                    } else {
                        Toast.info('服务器开小差了，请稍候再试', 2);
                    }
                }

            });
        }
    }

    //获取一遍详情
    getProductInfo = (productID,retry,callback) =>{
        //productSimple
        NetWork.Get({
            url:'Orderreturn/getProductInfo',
            data:{
                productID:productID,
				webSite: 1688
            }
        },(result)=>{
            console.log('productInfo', result);
            callback(result);
        },(error)=>{
            console.log(JSON.stringify(error));
            if (retry<3) {
                retry++;
                this.getProductInfo(productID,retry,callback);
            } else {
                callback({});
            }
        });
    }

    //切换sku
    changeSku = (attrId,attributeValue,lastActive) =>{
        const {skus,orderMsg,productInfo} = this.state;

        let skuBtnStatus = true;
        let lastSpecId = '';

        //淘宝sku选择方式不同，需要处理
        if (orderMsg.shopType == 'taobao') {
            let activeSkus = 0;
            skus.map((item,key)=>{
                if (item.attrId == attrId) {
                    item.values.map((val,idx)=>{
                        if (attributeValue == val.attributeValue) {
                            skus[key].values[idx].isActive = true;
                        } else {
                            skus[key].values[idx].isActive = false;
                        }
                    });
                }

                item.values.map((val,idx)=>{
                    if (val.isActive == true) {
                        activeSkus = activeSkus + 1;
                    }
                });
            });

            //选中sku个数达到最大值后
            if (activeSkus == skus.length) {
                //显示价格和库存
                for (let i = 0; i < productInfo.skuInfos.length; i++) {
                    let number = 0;
                    for (let j = 0; j < skus.length; j++) {
                        let activeValue = '';
                        for (let m = 0; m < skus[j].values.length; m++) {
                            if (skus[j].values[m].isActive) {
                                activeValue = skus[j].values[m].attributeValue;
                            }
                        }
                        for (let k = 0; k < productInfo.skuInfos[i].attributes.length; k++) {
                            if (productInfo.skuInfos[i].attributes[k].attributeValue == activeValue) {
                                number = number + 1;
                            }
                        }
                    }

                    if (number == skus.length) {
                        lastSpecId = productInfo.skuInfos[i].specId;
                        break;
                    }
                }
            }

            if (activeSkus == skus.length) {
                skuBtnStatus = true;
            } else {
                skuBtnStatus = false;
            }

        } else {
            //普通选择sku方式
            skuBtnStatus = false;
            lastSpecId = attrId;
            skus.map((item,key)=>{
                if (this.state.from == 'chooseMore') {
                    if (item.specId == attrId) {
                        skus[key].isActive = !item.isActive;
                    }
                } else {
                    if (item.specId == attrId) {
                        skus[key].isActive = true;
                    } else {
                        skus[key].isActive = false;
                    }
                }

                if (skus[key].isActive) {
                    skuBtnStatus = true;
                }

            });

        }

        if (lastSpecId != '') {
            if (!lastActive) {
                //是否需要展示当前sku的价格和可售数量
                this.getSkuInfo(lastSpecId,0,(skuInfo)=>{
                    if (!IsEmpty(skuInfo)) {
                        this.setState({
                            skus:skus,
                            skuBtnStatus:skuBtnStatus,
                            lastSkuPrice:'¥' + skuInfo.price.toFixed(2),
                            lastSkuAmount:skuInfo.amountOnSale
                        });
                    } else {
                        this.setState({
                            skus:skus,
                            skuBtnStatus:skuBtnStatus
                        });
                    }
                });
            } else {
                this.setState({
                    skus:skus,
                    skuBtnStatus:skuBtnStatus
                });
            }
        } else {
            this.setState({
                skus:skus,
                skuBtnStatus:skuBtnStatus
            });
        }
    }

    //修改采购单
    changeSubOrder = () =>{
        const {skus,productInfo,lastSubOrder,dataSource,orderMsg,from} = this.state;
        if (IsEmpty(productInfo.skuInfos)) {
            lastSubOrder.innerSpec = {'sku':'默认'};
            lastSubOrder.skuId = '0';
            lastSubOrder.specId = '0';

            if (from == 'all') {
                //从列表页引入时修改当前采购单的选择项
                dataSource.map((item,key)=>{
                    let itemlist = [];
                    if (!IsEmpty(item.itemlist)) {
                        itemlist = item.itemlist;
                    } else {
                        itemlist.push(item);
                        dataSource[key].itemlist = itemlist;
                    }

                    for (let i = 0; i < itemlist.length; i++) {
                        if (lastSubOrder.orderId == itemlist[i].orderId) {
                            dataSource[key].itemlist[i] = lastSubOrder;
                        }
                    }
                });
                this.props.updateStates({
                    dataSource:dataSource,
                    lastSubOrder:lastSubOrder,
                    btnStatus:true
                });
                this.refs.chooseSkuDialog.hide();
            } else {
                this.setState({
                    lastSubOrder:lastSubOrder
                });
                this.refs.chooseSkuDialog.hide();
                this.props.updateStates({
                    lastSubOrder:lastSubOrder
                });
                // this.props.updateOrder(lastSubOrder);
            }
            Toast.info('修改成功', 2);
        } else {
            this.props.showLoading();
            lastSubOrder.innerSpec = {};
            lastSubOrder.skuId = '';
            lastSubOrder.specId = '';

            if (orderMsg.shopType == 'taobao') {
                //反向处理sku的数据
                for (let i = 0; i < productInfo.skuInfos.length; i++) {
                    let number = 0;
                    for (let j = 0; j < skus.length; j++) {
                        let activeValue = '';
                        for (let m = 0; m < skus[j].values.length; m++) {
                            if (skus[j].values[m].isActive) {
                                activeValue = skus[j].values[m].attributeValue;
                            }
                        }
                        for (let k = 0; k < productInfo.skuInfos[i].attributes.length; k++) {
                            if (productInfo.skuInfos[i].attributes[k].attributeValue == activeValue) {
                                number = number + 1;
                            }
                        }
                    }

                    if (number == skus.length) {
                        for (let n = 0; n < productInfo.skuInfos[i].attributes.length; n++) {
                            let skuName = '';
                            for (let x = 0; x < productInfo.attributes.length; x++) {
                                if (productInfo.attributes[x].attributeID == productInfo.skuInfos[i].attributes[n].attributeID) {
                                    skuName = productInfo.attributes[x].attributeName;
                                }
                            }
                            lastSubOrder.innerSpec[skuName] = productInfo.skuInfos[i].attributes[n].attributeValue;
                        }
                        lastSubOrder.skuId = productInfo.skuInfos[i].skuId;
                        lastSubOrder.specId = productInfo.skuInfos[i].specId;
                        break;
                    }
                }

            } else {
                //如果不是淘宝商品直接处理
                for (let i = 0; i < skus.length; i++) {
                    if (skus[i].isActive) {
                        for (let j = 0; j < skus[i].attributes.length; j++) {
                            lastSubOrder.innerSpec['sku'+j] = skus[i].attributes[j].attributeValue;
                        }
                        lastSubOrder.skuId = skus[i].skuId;
                        lastSubOrder.specId = skus[i].specId;
                    }
                }
            }

            //修改当前订单信息
            dataSource.map((item,key)=>{
                let itemlist = [];
                if (!IsEmpty(item.itemlist)) {
                    itemlist = item.itemlist;
                } else {
                    itemlist.push(item);
                    dataSource[key].itemlist = itemlist;
                }

                for (let i = 0; i < itemlist.length; i++) {
                    if (lastSubOrder.orderId == itemlist[i].orderId) {
                        dataSource[key].itemlist[i] = lastSubOrder;
                    }
                }
            });

            console.log('dataSource',dataSource);
            console.log('lastSubOrder',lastSubOrder);
            //直接修改数据
            this.updateLastSubOrder(orderMsg,lastSubOrder,(data)=>{
                this.refs.chooseSkuDialog.hide();
                this.props.hideLoading();
                if (!IsEmpty(data.code) && data.code == '200') {
                    if (from == 'all') {
                        let btnStatus = true;
                        dataSource.map((item,key)=>{
                            if (IsEmpty(item.innerSpec)) {
                                btnStatus = false;
                            }
                        });
                        this.props.updateStates({
                            dataSource:dataSource,
                            lastSubOrder:lastSubOrder,
                            btnStatus:btnStatus
                        });
                    } else {
                        this.setState({
                            lastSubOrder:lastSubOrder
                        });
                        this.props.updateStates({
                            lastSubOrder:lastSubOrder
                        });
                        this.props.updateOrder(lastSubOrder);
                    }
                    Toast.info('修改成功', 2);
                } else {
                    Toast.info('修改失败，请稍后重试', 2);
                }
            });
        }
    }

    //修改采购单
    updateLastSubOrder = (orderMsg,lastSubOrder,callback) =>{
        NetWork.Get({
            url:'Orderreturn/changeSubOrder',
            data:{
                shopName:orderMsg.shopName,
                shopType:orderMsg.shopType,
                lowerOrderId:orderMsg.tid,
                subOrderId:lastSubOrder.orderId,
                specId:lastSubOrder.specId,
                specInfo:JSON.stringify(lastSubOrder.innerSpec),
                buyAmount:lastSubOrder.buyAmount
            }
        },(data)=>{
            console.log(data);
            callback(data);
        },(error)=>{
            this.props.hideLoading();
            console.error(error);
        });
    }

    //渲染弹窗主体
    getDialogBody = () =>{
        const {productInfo,lastSkuPrice,lastSkuAmount} = this.state;
        let price = '';
        let amountOnSale = 0;
        if (!IsEmpty(productInfo.saleInfo)) {
            price = GetPrice(productInfo);
            amountOnSale = productInfo.saleInfo.amountOnSale;
        } else {
            if (!IsEmpty(productInfo.referencePrice)) {
                price = productInfo.referencePrice;
            } else {
                price = '暂无价格';
            }
            if (!IsEmpty(productInfo.skuInfos)) {
                productInfo.skuInfos.map((item,key)=>{
                    amountOnSale = amountOnSale + parseInt(item.amountOnSale);
                });
            } else {
                amountOnSale = '暂无库存';
            }
        }

        if (!IsEmpty(lastSkuPrice)) {
            price = lastSkuPrice;
        }

        if (!IsEmpty(lastSkuAmount)) {
            amountOnSale = lastSkuAmount;
        }

        price = price + "";
        if (price != '暂无价格' && price.indexOf('¥') <= -1) {
            price = '¥'+price;
        }
        if (!IsEmpty(productInfo)) {
            return (
                <View style={{flex:1}}>
                    <View style={styles.cardLine1688}>
                        <Image resizeMode={"contain"} src={"https://cbu01.alicdn.com/"+productInfo.image.images[0]} style={{width:px(120),height:px(120)}}/>
                        <View style={{marginLeft:px(12),flex:1}}>
                            <Text style={{width:px(558),height:px(80),color:'#222222',fontSize:px(24)}}>{productInfo.subject}</Text>
                            <View style={{marginTop:px(12),flexDirection:'row',alignItems:'center',flex:1}}>
                                <Text style={{fontSize:px(24),color:'#ff6000'}}>{price}</Text>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                                    <Text style={{fontSize:px(24),color:'#666666'}}>库存:{amountOnSale}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {
                        !IsEmpty(productInfo.skuInfos) ?
                        <ScrollView style={[styles.skuBox,{flex:1}]}>
                            {this.getSkus()}
                        </ScrollView>
                        :
                        <View style={styles.skuBox}>
                            <View style={[styles.skuNameStyle,{backgroundColor:'#ff6000',width:px(112)}]}>
                                <Text style={[styles.skuTextStyle,{color:'#ffffff'}]}>默认</Text>
                            </View>
                        </View>
                    }
                </View>
            );
        } else {
            return null;
        }
    }

    //渲染弹窗中的sku部分
    getSkus = (sku) =>{
        const {productInfo,skus,orderMsg,notChooseSpecs} = this.state;
        let doms = [];
        if (orderMsg.shopType == 'taobao') {
            for (let key in skus){
                doms.push(
                    <View style={styles.skuLine}>
                        <Text style={{fontSize:px(28),color:'#222222'}}>{skus[key].name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',width:px(726),flexWrap:'wrap'}}>
                        {
                            skus[key].values.map((item,idx)=>{
                                if (item.isActive) {
                                    return (
                                        <View style={[styles.skuNameStyle,{backgroundColor:'#ff6000'}]}>
                                            <Text style={[styles.skuTextStyle,{color:'#ffffff'}]}>{item.attributeValue}</Text>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View style={styles.skuNameStyle} onClick={()=>{this.changeSku(skus[key].attrId,item.attributeValue,item.isActive)}}>
                                            <Text style={styles.skuTextStyle}>{item.attributeValue}</Text>
                                        </View>
                                    );
                                }

                            })
                        }
                        </View>
                    </View>
                );
            }
        } else {
            console.log('render----pdd---sku',skus);
            doms.push(
                <View style={{flexDirection:'row',alignItems:'center',width:px(726),flexWrap:'wrap'}}>
                {
                    skus.map((item,idx)=>{
                        let attributeValue = '';
                        item.attributes.map((attr,key)=>{
                            if (key == item.attributes.length - 1) {
                                attributeValue = attributeValue + attr.attributeValue;
                            } else {
                                attributeValue = attributeValue + attr.attributeValue + ',';
                            }
                        });
                        let canNotChoose = false;
                        if (this.state.from == "chooseMore") {
                            for (let i = 0; i < notChooseSpecs.length; i++) {
                                if (notChooseSpecs[i] ==item.specId) {
                                    canNotChoose = true;
                                    break;
                                }
                            }
                        }

                        if (canNotChoose) {
                            return (
                                <View style={[styles.skuNameStyle,{backgroundColor:'#e5e5e5'}]}>
                                    <Text style={[styles.skuTextStyle,{color:'#ffffff'}]}>{attributeValue}</Text>
                                </View>
                            );
                        }
                        if (item.isActive) {
                            if (this.state.from == "chooseMore") {
                                return (
                                    <View style={[styles.skuNameStyle,{backgroundColor:'#ff6000'}]} onClick={()=>{this.changeSku(item.specId,attributeValue,item.isActive)}}>
                                        <Text style={[styles.skuTextStyle,{color:'#ffffff'}]}>{attributeValue}</Text>
                                    </View>
                                );
                            }
                            return (
                                <View style={[styles.skuNameStyle,{backgroundColor:'#ff6000'}]}>
                                    <Text style={[styles.skuTextStyle,{color:'#ffffff'}]}>{attributeValue}</Text>
                                </View>
                            );
                        } else {
                            return (
                                <View style={styles.skuNameStyle} onClick={()=>{this.changeSku(item.specId,attributeValue,item.isActive)}}>
                                    <Text style={styles.skuTextStyle}>{attributeValue}</Text>
                                </View>
                            );
                        }

                    })
                }
                </View>
            );
        }
        return doms;
    }

    //获取sku的详细信息
    getSkuInfo = (specId,retry,callback) =>{
        NetWork.Post({
            url:'Distributeproxy/querySkuBySpecId',
            data:{
				productId: this.state.offerId,
				specId: specId
			}
        },(result)=>{
            console.log('querySkuBySpecId', result);
            let skuInfo = {};
            if (!IsEmpty(result.simpleSkuInfo)) {
                let simpleSkuInfo = result.simpleSkuInfo;
                skuInfo.amountOnSale = simpleSkuInfo.amountOnSale;
                skuInfo.price = simpleSkuInfo.proxyPrice;
            }
            callback(skuInfo);
        },(error)=>{
            console.log(JSON.stringify(error));
            if (retry<3) {
                retry++;
                this.getSkuInfo(productId,specId,retry,callback);
            } else {
                callback({});
            }
        });
    }

    //选择sku铺货
    pushProduct = () =>{
        //遍历选中sku并拼接
        let {skus} = this.state;
        let skuChoosed = [];
        skus.map((item,key)=>{
            if (item.isActive) {
                skuChoosed.push(item.specId);
            }
        });

        skuChoosed = skuChoosed.join(',');
        console.log('skuChoosed',skuChoosed);
        //重新铺货
        this.props.skuDistribute(skuChoosed);
    }


    render(){
        const {skuBtnStatus,from} = this.state;
        return (
            <Dialog ref="chooseSkuDialog"
            maskClosable={true} 
            contentStyle={styles.categoryModel}
            >
                <View style={styles.body}>
                    <View style={styles.headLine}>
                        <Text style={{fontSize:px(28),color:'#666666'}}>{from == 'chooseMore' ? "请选择要铺货的1688商品规格" : "请选择要匹配的1688商品规格"}</Text>
                        <ItemIcon code={"\ue69a"} iconStyle={{fontSize:px(32),color:'#666666'}} boxStyle={styles.closeTag} onClick={()=>{this.refs.chooseSkuDialog.hide();}}/>
                        {
                            from == 'chooseMore' ?(<Text style={{fontSize:px(24),color:'#ff6000'}}>{"建议选择价格接近的规格提高成功率"}</Text>):null
                        }
                    </View>
                    {this.getDialogBody()}
                </View>
                <View style={styles.footer}>
                    {

                        skuBtnStatus ?
                        <AyButton
                        style={[styles.dlgBtn,{backgroundColor:'#ff6000'}]}
                        textStyle={{color:'#ffffff'}}
                        type="primary"
                        onClick={()=>{
                            if (from == 'chooseMore') {
                                this.pushProduct();
                            } else {
                                this.changeSubOrder();
                            }
                        }}
                        >确定</AyButton>
                        :
                        <AyButton
                        style={[styles.dlgBtn,{backgroundColor:'#E5E5E5'}]}
                        textStyle={{color:'#BFBFBF'}}
                        type="primary"
                        >确定</AyButton>
                    }
                </View>
            </Dialog>
        );
    }
}
