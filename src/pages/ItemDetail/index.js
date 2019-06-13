import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, ScrollView, Image} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import AyButton from '../../Component/AyButton/index';
import Event from 'ay-event';
import BasicInfo from './BasicInfo';
import SellSpec from './SellSpec';
import ItemIcon from '../../Component/ItemIcon';
import Dialog from '../../Component/Dialog';
import { GoToView } from '../../Public/Biz/GoToView.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {GetPrice} from '../../Biz/GetPrice.js';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import styles from './styles';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 商品详情
 */

export default class ItemDetail extends Component{
    constructor(props) {
        super(props);
        this.state={
            isLoading:true,
            productID:'', //商品id
            productInfo:{}, //商品详情
            imageList:[], //图片列表
            content:'',
            flag:'',
            supplierMemberId:'', //供应商memberid
            supplierLoginId:'', //供应商nick
            dialogSet:{
                dialogTitle:'',
                dialogOkText:'',
                dialogContentText:''
            },
            numIid:'',
        };
        this.loading = '';
        let self=this;
        //返回操作
        Event.on('App.detail_back',(data)=>{
            self.initData();
        });
    }

    config = {
        navigationBarTitleText: '1688商品详情'
    }

    componentDidMount(){
        this.initData();
    }

    //初始化数据
    initData = () => {
        this.loading = Toast.loading('加载中...');
        let productID = GetQueryString({name:'productID',self:this});
        let supplierMemberId = GetQueryString({name:'supplierMemberId',self:this});
        let supplierLoginId = GetQueryString({name:'supplierLoginId',self:this});
        let numIid = GetQueryString({name:'numIid',self:this});
        supplierLoginId = decodeURI(supplierLoginId);
        if (!IsEmpty(productID)) {
            let self = this;
            //获取当前商品信息
            self.getProductInfo('full',productID,(rsp)=>{
                if (IsEmpty(rsp.productInfo)) {
                    self.getProductInfo('simple',productID,(rsp)=>{
                        if (!IsEmpty(rsp.productInfo)) {
                            self.setState({
                                isLoading:false,
                                productID:productID,
                                supplierMemberId:supplierMemberId,
                                supplierLoginId:supplierLoginId,
                                productInfo:rsp.productInfo,
                                imageList:rsp.newImageList,
                                numIid:numIid,
                            });
                        }
                        Portal.remove(self.loading);
                    });
                } else {
                    self.setState({
                        isLoading:false,
                        productID:productID,
                        supplierMemberId:supplierMemberId,
                        supplierLoginId:supplierLoginId,
                        productInfo:rsp.productInfo,
                        imageList:rsp.newImageList,
                        numIid:numIid,
                    });
                    Portal.remove(self.loading);
                }
            });
        }
    }

    //获取商品信息
    getProductInfo = (type,productID,callback) =>{
        // alibaba.agent.product.simple.get
        let apiName = 'Distributeproxy/pushTaoProductInfo';
        let params = {
            productId:productID,
            webSite:'1688'
        }
        if (type == 'simple') {
            apiName = 'Distributeproxy/productSimple';
            params = {
                productID:productID,
                webSite:'1688'
            }
        }

        NetWork.Get({
            url:apiName,
            data:params
        },(result)=>{
            console.log(apiName,result);
            if (!IsEmpty(result) && !IsEmpty(result.productInfo)) {
                let rsp = result.productInfo;
                let image = [];//图片数组
                if(!IsEmpty(rsp.image)){
                    image = rsp.image.images;
                } else {
                    image = [];
                }
                let newImageList = [];//重组的图片数组
                image.map((item,key) => {
                    newImageList.push({
                        url:item,
                        width:200,
                        height:200
                    });
                });
                callback({
                    productInfo:rsp,
                    newImageList:newImageList
                });
            } else {
                callback(result);
            }
        },(error)=>{
            callback({});
        });
    }

    //获取所有图片
    getAllPricture = () => {
        let doms = [];
        if(this.state.productInfo){
            // 图片不能编辑的暂代方法
            if (this.state.imageList.length==0) {
                doms.push(
                    <View style={[styles.bigimgBox,{width:px(200),height:px(200)}]}>
                        <ItemIcon code={"\ue7ed"} iconStyle={{fontSize:px(100),color:'#e6e6e6'}}/>
                        <Text style={{fontSize:px(28),color:'#666',marginTop:px(20)}}>未上传主图</Text>
                    </View>
                )
            } else {
                this.state.imageList.map((item,key)=>{
                    let imgUrl="https://cbu01.alicdn.com/"+item.url;
                    imgUrl = imgUrl.replace(/(.*)(.jpg)|(.*)(.png)/,'$1$3.200x200$2$4');
                    doms.push(
                        <View style={[styles.bigimgBox,{width:px(200),height:px(200)},key!=this.state.imageList.length-1?{marginRight:px(16)}:{}]}>
                            <Image src={imgUrl}
                            style={{width:px(196),height:px(196)}}
                            resizeMode={"contain"}/>
                        </View>
                    );
                });
            }

        }

        return doms;
    }

    //底部的按钮的操作
    footPress = (flag) => {
        const {supplierMemberId,supplierLoginId} = this.state;

        if (flag == '可代销货源') {
            GoToView({status:'SupplierDetails',query:{
                supplierLoginId: encodeURIComponent(supplierLoginId),
                memberId:supplierMemberId,
                needmemberid:'1',
            }});
        } else if (flag == '同步信息') {
            this.setState({
                dialogSet:{
                    dialogTitle:'同步1688货源信息',
                    dialogContentText:'重新获取1688产品的标题、价格、库存、主图等信息',
                    dialogOkText:'立即同步'
                }
            });
            this.refs.sureDialog.show();
        } else {
            let url = '';
            let title = '';
            if (flag == '查看商品') {
                url = 'https://detail.1688.com/offer/'+this.state.productID+'.html';
                title = '商品详情';
            } else if (flag == '供应商信息') {
                title = '供应商信息';
                url = "https://m.1688.com/winport/company/" + supplierMemberId + ".html?spm=a262to.11649718.0.0&memberId=" + supplierMemberId;
            } else if (flag == '申请分销') {
                url = "https://page.1688.com/html/fa9028cc.html?sellerId=" + supplierMemberId,
                title = '申请分销';
            }

            GoToView({status:url,page_status:'special'});
        }

    }

    //渲染获取数据失败
    renderHasNoRelation = () =>{
        return (
            <View style={{width:px(750),height:px(750),flexDirection:'column',alignItems:'center',justifyContent:'center'}}
            onClick={()=>{this.initData()}}>
                <Text style={{fontSize:px(32),color:'#4a4a4a'}}>获取失败，点击刷新</Text>
            </View>
        );
    }

    //渲染所有属性
    renderAttributes = () =>{
        let doms = [];
        let productInfo = this.state.productInfo;
        if (!IsEmpty(productInfo) && !IsEmpty(productInfo.attributes)) {
            let newAttr=productInfo.attributes;
            if (!IsEmpty(productInfo.skuInfos)) {
                let skuInfos=productInfo.skuInfos[0].attributes;
                for (let i = newAttr.length-1; i >=0 ; i--) {
                    for (let j = skuInfos.length-1; j >=0 ; j--) {
                        if (!IsEmpty(newAttr[i]) && !IsEmpty(skuInfos[j])){
                            if (newAttr[i].attributeID==skuInfos[j].attributeID) {
                                newAttr.splice(i,1);
                            }
                        }
                    }
                }
            }
            newAttr.map((item,key)=>{
                doms.push(
                    <View style={styles.attrLine}>
                        <Text style={[styles.attrText,{width:px(280)}]}>{item.attributeName}</Text>
                        <Text style={styles.attrText}>{item.value}</Text>
                    </View>
                );
            });
        }
        return doms;
    }

    //显示查看属性的弹窗
    showAttrDialog = () =>{
        this.refs.attrDialog.show();
    }
    //复制商品标题
    copy = (title) =>{
        UitlsRap.clipboard(title,()=>{
            Toast.info('商品标题已复制', 2);
        });
    }
    //确认操作
    submit = () =>{
        let {productInfo,productID,dialogSet} = this.state;
        if (dialogSet.dialogOkText == '申请分销') {
            this.footPress('申请分销');
        } else {
            this.getProductInfo('full',productID,(rsp)=>{
                if (!IsEmpty(rsp.productInfo)) {
                    let param = {
                        numIid:productID,
                        productID:productID,
                        amountOnSale:rsp.productInfo.saleInfo.amountOnSale,
                        subject:rsp.productInfo.subject,
                        price:GetPrice(rsp.productInfo,'one'),
                        image:"https://cbu01.alicdn.com/"+rsp.productInfo.image.images[0],
                        needUpadate:'0',
                        synchroType:'all'
                    }
                    NetWork.Post({
                        url:'Orderreturn/synchroOneProduct',
                        data:param
                    },(rsp)=>{
                        console.log('Orderreturn/synchroOneProduct',rsp);
                        //有结果
                        if (!IsEmpty(rsp)) {
                            Event.emit('App.product_list_reload',{});
                            Toast.info('同步成功~', 2);
                        }
                        this.refs.sureDialog.hide();
                    },(error)=>{
                        console.error(error);
                    });
                } else {
                    //弹出错误信息
                    if (!IsEmpty(rsp.errorMsg)) {
                        if (rsp.errorMsg == "without consign relation") {
                            rsp.errorMsg = "检测到该货源尚未取得分销权限，请申请分销后再尝试同步信息";
                        }
                        this.setState({
                            dialogSet:{
                                dialogTitle:'温馨提示',
                                dialogOkText:'申请分销',
                                dialogContentText:rsp.errorMsg
                            }
                        });
                        this.refs.sureDialog.show();
                    }
                }
            });
        }
    }


    render(){
        console.log('-----render Detail-----',this.state.productInfo);
        let {productInfo,supplierMemberId,dialogSet,supplierLoginId} = this.state;
        let supportOnlineTrade = '';//是否支持网上订购
        let mixWholeSale = '';//是否支持混批
        let img = '';//图片
        if (!IsEmpty(productInfo) && !IsEmpty(productInfo.saleInfo)) {
            //是否支持网上商品
            if (JSON.parse(productInfo.saleInfo.supportOnlineTrade)) {
                supportOnlineTrade = (
                    <View style={styles.icon}>
                        <View style={styles.circle}></View>
                        <Text style={styles.smallTag}>网上交易</Text>
                        <View style={styles.circle}></View>
                    </View>
                );
            }
            //是否支持混批
            if (JSON.parse(productInfo.saleInfo.mixWholeSale)) {
                mixWholeSale = (
                    <View style={[styles.icon,{marginLeft:px(10)}]}>
                        <View style={styles.circle}></View>
                        <Text style={styles.smallTag}>混批</Text>
                        <View style={styles.circle}></View>
                    </View>
                );
            }
        }
        let subject = !IsEmpty(productInfo) ? productInfo.subject : '';
        let amountOnSale = !IsEmpty(productInfo.saleInfo) ? productInfo.saleInfo.amountOnSale : '申请分销后查看';
        let price = '';
        if (!IsEmpty(productInfo.saleInfo)) {
            price = GetPrice(productInfo);
        } else {
            if (!IsEmpty(productInfo.referencePrice)) {
                price = '¥' + productInfo.referencePrice;
            }
        }
        let body = null;
        if (this.state.isLoading) {
            console.log('productInfo',2);
            return null;
        } else {
            if (!IsEmpty(productInfo)) {
                console.log('productInfo',3);
                body = (
                    <View style={{backgroundColor:'#f5f5f5',flex:1}}>
                        <View style={styles.pictureBox}>
                            <ScrollView
                            style={styles.pictureScroll}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {this.getAllPricture()}
                            </ScrollView>
                        </View>
                        <View style={styles.subjectLine}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:px(28),color:'#666',lineHeight:px(40),width:px(648)}}>{subject}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-end',width:px(50)}} onClick={()=>{this.copy(subject)}}>
                                <Image style={[styles.copyIcon,{marginLeft:px(24)}]}
                                src='https://q.aiyongbao.com/trade/web/images/qap_img/mobile/fz_new.png'
                                />
                            </View>
                        </View>
                        <View style={styles.priceLine}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                                    <Text style={{fontSize:px(28),color:'#979797',lineHeight:px(50)}}>价格:</Text>
                                    <Text style={{fontSize:px(28),color:'#FF4400',lineHeight:px(50)}}>{price}</Text>
                                </View>
                                {
                                    !IsEmpty(productInfo.saleInfo) && !IsEmpty(productInfo.saleInfo.retailprice) ?
                                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                                        <Text style={{fontSize:px(28),color:'#979797',lineHeight:px(50)}}>建议零售价:</Text>
                                        <Text style={{fontSize:px(28),color:'#FF4400',lineHeight:px(50)}}>¥{parseFloat(productInfo.saleInfo.retailprice).toFixed(2)}</Text>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                            <View style={{flex:1,flexDirection:'row'}}>
                                <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                                    <Text style={{fontSize:px(28),color:'#333333',lineHeight:px(50)}}>库存:{amountOnSale}</Text>
                                </View>
                                {
                                    amountOnSale == '申请分销后查看' ?
                                    <View style={{flex:1,justifyContent:'flex-end',height:px(50),alignItems:'center',flexDirection:'row'}}>
                                        <AyButton type="primary"
                                        style={{width:px(152),height:px(48)}}
                                        onClick={()=>{this.footPress('申请分销')}}>申请分销</AyButton>
                                    </View>
                                    :
                                    <View style={{flex:1,justifyContent:'flex-end',height:px(50),alignItems:'center',flexDirection:'row'}}>
                                        {mixWholeSale}
                                        {supportOnlineTrade}
                                    </View>
                                }
                            </View>
                        </View>
                        {
                            !IsEmpty(supplierLoginId) ?
                            <View style={[styles.supplierBox,{marginTop:px(24)}]}>
                                <View style={{flexDirection:'row',flex:1,alignItems:'center'}}>
                                    <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{supplierLoginId}</Text>
                                    {
                                        !IsEmpty(supplierMemberId) ?
                                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}
                                        onClick={()=>{this.footPress('供应商信息')}}>
                                            <Text style={{fontSize:px(28),color:'#999999'}}>供应商信息</Text>
                                            <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(32),color:'#999999'}}/>
                                        </View>
                                        :
                                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                            <View style={styles.buttons} onClick={()=>{UitlsRap.openChat(supplierLoginId);}}>
                                                <ItemIcon code={'\ue602'} iconStyle={{fontSize:px(28),color:'#3089dc'}}/>
                                                <Text style={[styles.buttonText,{marginLeft:px(5)}]}>旺旺联系</Text>
                                            </View>
                                        </View>
                                    }
                                </View>
                                {
                                    !IsEmpty(supplierMemberId) ?
                                    <View style={{flexDirection:'row',justifyContent:'flex-end',flex:1,marginTop:px(24)}}>
                                        <View style={styles.buttons} onClick={()=>{UitlsRap.openChat(supplierLoginId);}}>
                                            <ItemIcon code={'\ue602'} iconStyle={{fontSize:px(28),color:'#3089dc'}}/>
                                            <Text style={[styles.buttonText,{marginLeft:px(5)}]}>旺旺联系</Text>
                                        </View>
                                        <View style={[styles.buttons,{marginLeft:px(24)}]} onClick={()=>{this.footPress('可代销货源')}}>
                                            <Text style={styles.buttonText}>可代销货源</Text>
                                        </View>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                            :
                            null
                        }
                        <View style={styles.midLine}>
                            <Text style={{fontSize:px(28),color:'#333333'}}>基本信息</Text>
                        </View>
                        <BasicInfo numIid={this.state.numIid} productInfo={productInfo} showAttrDialog={this.showAttrDialog}/>
                        <View style={styles.midLine}>
                            <Text style={{fontSize:px(28),color:'#333333'}}>销售规格</Text>
                        </View>
                        <SellSpec productInfo={productInfo}/>
                    </View>
                );
            } else {
                console.log('productInfo',4);
                body = this.renderHasNoRelation();
            }
        }

        return (
            <View>
                <ScrollView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                    {body}
                </ScrollView>
                {
                    !IsEmpty(productInfo) ?
                    <View style={styles.footBtn}>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}
                        onClick={()=>{this.footPress('查看商品')}}>
                            <Text style={{fontSize:px(32),color:'#666'}}>查看商品</Text>
                        </View>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#ff6000'}}
                        onClick={()=>{this.footPress('同步信息')}}>
                            <Text style={{fontSize:px(32),color:'#ffffff'}}>同步信息</Text>
                        </View>
                    </View>
                    :
                    null
                }
                <Dialog ref="attrDialog"
                maskClosable={true}
                contentStyle={styles.categoryModel}>
                    <View style={styles.body}>
                        <View style={styles.head}><Text style={styles.textHead}>产品属性</Text></View>
                        <ScrollView style={{flex:1}}>
                        {this.renderAttributes()}
                        </ScrollView>
                        <View style={styles.footer}>
                            <AyButton style={styles.dlgBtn} type="normal" onClick={()=>{this.refs.attrDialog.hide()}}>关闭</AyButton>
                        </View>
                    </View>
                </Dialog>
                <Dialog ref={"sureDialog"} contentStyle={styles.modal2Style}>
                    <View style={styles.dialogContent}>
                        <Text style={{marginTop:px(15),fontSize:px(38),fontWeight:'300',color:'#4A4A4A',textAlign:'center',width:px(612)}}>{dialogSet.dialogTitle}</Text>
                        <View style={{width:px(612),marginTop:px(24),minHeight:px(200),paddingLeft:px(24)}}>
                            <Text style={[styles.dialogText,{marginTop:px(50)}]}>
                            {dialogSet.dialogContentText}
                            </Text>
                        </View>
                        <View style={styles.foot}>
                            <View style={styles.footBtnDialog} onClick={()=>{this.refs.sureDialog.hide();}}>
                                <Text style={styles.fontStyle}>{'取消'}</Text>
                            </View>
                            <View style={[styles.submitBtn,{backgroundColor:"#ff6000"}]} onClick={this.submit}>
                                <Text style={[styles.fontStyle,{color:"#ffffff"}]}>{dialogSet.dialogOkText}</Text>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </View>
        );
    }
}