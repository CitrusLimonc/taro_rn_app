import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Dialog, Checkbox} from '@tarojs/components';
import {UitlsRap} from '../../../../Public/Biz/UitlsRap.js';
import {IsEmpty} from '../../../../Public/Biz/IsEmpty.js';
import {LocalStore} from '../../../../Public/Biz/LocalStore.js';
import {NetWork} from '../../../../Public/Common/NetWork/NetWork.js';
import { GoToView } from '../../../../Public/Biz/GoToView.js';
import styles from './styles';
import {DoBeacon} from '../../../../Public/Biz/DoBeacon';
import {Domain} from '../../../../Env/Domain';
import px from '../../../../Biz/px.js';


/**
 * @author cy
 * 商品卡片下的按钮
 */
export default class ItemProductButtons extends Component {
    constructor(props) {
        super(props);
        this.state={
            showDialog:false, //是否显示弹窗
            dialogSet:{ //弹窗显示内容
                dialogTitle:'',
                dialogContentText:'',
                dialogCancelText:'',
                dialogOkText:'',
                errorMsg:''
            },
            changeItemSet:['1'], //是否需要下架或删除 多选框的选择
            delChecked:true //是否选中了删除
        };
        this.retry = 0;
        this.userNick = '';

    }

    componentDidMount(){
        let self = this;
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     console.log('getUserInfo',info);
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.userNick = info.extraInfo.result.loginId;
        //     } else {
        //         self.userNick = info.nick;
        //     }
        // }).catch((error) => {
        //     console.log(error);
        // });
    }
    //修改删除或下架的选择
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

    //按钮的操作
    btnClick = (flag) =>{
        let {item,status} = this.props;
        const self = this;
        switch (flag) {
            case '供应商':{
                UitlsRap.openChat(item.origin_login_name);
            }
            break;
            case '同步信息':{
                DoBeacon('TD20181012161059','goodslist_btn_sync',this.userNick);
                let dialogContentText = '重新获取1688产品的标题、价格、库存、主图等信息';
                if(this.props.item.shop_type =='wc'){
                    dialogContentText = '重新获取1688产品的标题、价格、库存、主图和详情等信息';
                };
                this.setState({
                    dialogSet:{
                        dialogTitle:'同步1688货源信息',
                        dialogContentText:dialogContentText,
                        dialogOkText:'立即同步'
                    }
                });
                this.refs.sureDialog.show();
            }
            break;
            case '取消代销':{
                if(this.props.item.shop_type =='wc'){
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
            }
            break;
            case '采购':{
                //跳转官方商品详情
                DoBeacon('TD20181012161059','goodslist_btn_purchase',this.userNick);
                // RAP.navigator.push({
                //     url:'https://detail.1688.com/offer/'+item.origin_num_iid+'.html',
                //     title:'商品详情',
                //     backgroundColor:'#fff',
                //     clearTop:false,
                //     animated:true,
                // }).then((result) => {
                //     //console.log(result);
                // }).catch((error) => {
                //     console.error(error);
                // });
            }
            break;
            case '删除':{
                this.setState({
                    dialogSet:{
                        dialogTitle:'删除已取消货品',
                        dialogContentText:'删除后该产品不再出现在代销货品列表中，您可选择是否同时删除店铺商品',
                        dialogOkText:'删除'
                    },
                    changeItemSet:['1'],
                    delChecked:false
                });
                this.refs.sureDialog.show();
            } break;
            case '重新铺货':{
                let list = [{
                    id:item.shop_id,
                    shop_type:item.shop_type,
                    shop_name:item.shop_name,
                    num_iid:item.num_iid,
                    origin_num_iid:item.origin_num_iid
                }];
                LocalStore.Set({'go_to_distribution_list':JSON.stringify(list)});
                GoToView({status:'DistributionResult',query:{
                    offerId:item.origin_num_iid,
                    supplierMemberId:item.origin_id,
                    from:'hasCancelRelation',
                    // isfromself:'1',
                }});
            } break;
            case '恢复代销':{
                NetWork.Post({
                    url:'dishelper/islowpublish',
                    host:Domain.WECHART_URL,
                    params:{
                        shopid:item.shop_id,
                        shoptype:item.shop_type,
                        productid:item.origin_num_iid,
                        shopname:item.shop_name,
                        outproductid:item.num_iid,
                    }
                },(rsp)=>{
                    if(rsp.code == 200){
                        Taro.showToast({
                            title: rsp.value,
                            icon: 'none',
                            duration: 2000
                        });
                        // RAP.emit('App.product_list_reload',{});
                    }else{
                        Taro.showToast({
                            title: rsp.value,
                            icon: 'none',
                            duration: 2000
                        });
                        self.setState({
                            dialogSet:{
                                dialogTitle:'恢复代销关系失败',
                                dialogContentText:'检测到您店铺中的商品已不存在，无法恢复代销关系，是否重新铺货？',
                                dialogOkText:'重新铺货'
                            },
                        });
                        self.refs.sureDialog.show();
                    }
                });
            } break;
            case '编辑代销商品':{
                GoToView({
                    status:'Sellbysetting',
                    query:{
                        numIid:item.num_iid,
                        productId:item.origin_num_iid,
                        shopid:item.shop_id
                    }
                });
            } break;
            default:break;
        }
    }
    //获取商品信息
    getProductInfo = (callback) => {
        let {item} = this.props;
        let self = this;
        NetWork.Post({
            url:"Distributeproxy/pushTaoProductInfo",
            data:{
                productId: item.origin_num_iid
            }
        },(result)=>{
            if (!IsEmpty(result.productInfo)) {
                callback(result.productInfo);
            } else {
                Taro.hideLoading();
                //弹出错误信息
                if (!IsEmpty(result.errorMsg)) {
                    if (result.errorMsg == "without consign relation") {
                        result.errorMsg = "检测到该货源尚未取得分销权限，请申请分销后再尝试同步信息";
                    }
                    this.setState({
                        dialogSet:{
                            dialogTitle:'温馨提示',
                            dialogCancelText:'取消',
                            dialogOkText:'申请分销',
                            dialogContentText:result.errorMsg
                        }
                    });
                    this.refs.sureDialog.show();
                }
                callback({});
            }
        },(error)=>{
            console.error(error);
            Taro.hideLoading();
            callback({});
        });
    }
    //二次确认弹窗的确认操作
    submit = () =>{
        let {item,callback} = this.props;
        let {dialogSet,delChecked} = this.state;
        this.refs.sureDialog.hide();
        if (dialogSet.dialogTitle == '同步1688货源信息') {
            Taro.showLoading({ title: '加载中...' });
            //获取一遍1688信息
            let param = {
                shopName:item.shop_name,
                shopType:item.shop_type,
                shopId:item.shop_id,
                productID:item.origin_num_iid,
                numIid:item.num_iid,
                origin_login_name:item.origin_login_name,
                needUpadate:'0'
            }
            NetWork.Post({
                url:'Orderreturn/synchroOneProduct',
                data:param
            },(rsp)=>{
                console.log('Orderreturn/synchroOneProduct',rsp);
                Taro.hideLoading();
                //有结果
                if (!IsEmpty(rsp.code) && rsp.code == '200') {
                    item.amount_1688 = rsp.amountOnSale;
                    item.origin_title = rsp.subject;
                    item.origin_price = rsp.price;
                    item.pic_1688 = rsp.image;
                    item.status_1688 = rsp.status;
                    item.max_list_price = rsp.max_list_price;
                    item.min_list_price = rsp.min_list_price;
                    item.min_defect_num = rsp.min_defect_num;
                    callback('update',item);
                    Taro.showToast({
                        title: '同步成功~',
                        icon: 'none',
                        duration: 2000
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
                                dialogCancelText:'取消',
                                dialogOkText:'申请分销',
                                dialogContentText:rsp.errorMsg
                            }
                        });
                        this.refs.sureDialog.show();
                    }
                }
            },(error)=>{
                alert(JSON.stringify(error));
                Taro.hideLoading();
            });

        } else if (dialogSet.dialogTitle == '温馨提示') {
            //申请分销
            GoToView({status:"https://page.1688.com/html/fa9028cc.html?sellerId=" + item.origin_id,page_status:'special'});
        } else if (dialogSet.dialogTitle == '取消代销') {
            Taro.showLoading({ title: '加载中...' });
            if (item.shop_type == 'taobao') { //淘宝需要取消真实代销关系
                NetWork({
                    url:"Distributeproxy/unLinkConsignSellItem",
                    data:{
                        productId: item.origin_num_iid
                    }
                },(result)=>{
                    console.log('unLinkConsignSellItem',result);
                    // if (!IsEmpty(result.isSuccess) && (result.isSuccess == 'true' || result.isSuccess == true)) {
                        //成功
                        this.updateRelation(item,'',callback);
                    // } else {
                    //     if (!IsEmpty(result.errorMsg)){
                                // Taro.showToast({
                                //     title: result.errorMsg,
                                //     icon: 'none',
                                //     duration: 2000
                                // });
                    //     } else {
                                // Taro.showToast({
                                //     title: '取消代销失败',
                                //     icon: 'none',
                                //     duration: 2000
                                // });
                    //     }
                    //     Taro.hideLoading();
                    // }
                },(error)=>{
                    console.error(error);
                    Taro.showToast({
                        title: '取消代销失败，请稍候再试',
                        icon: 'none',
                        duration: 2000
                    });
                    Taro.hideLoading();
                });
            } else {
                this.updateRelation(item,'',callback);
            }
        } else if (dialogSet.dialogTitle == '删除已取消货品') {
            this.updateRelation(item,'delete',callback);
        } else if (dialogSet.dialogTitle == '恢复代销关系失败') {
            GoToView({ status: 'DistributionShops', query: {
				offerId:item.origin_num_iid,
				supplierMemberId:item.origin_id,
				isfromself:'1',
			}});
        }
    }

    //修改代销关系
    updateRelation = (item,updateType,callback) =>{
        let param = {
            shopName:item.shop_name,
            shopType:item.shop_type,
            shopId:item.shop_id,
            productId:item.origin_num_iid,
            numIid:item.num_iid,
            needDelete:this.state.dialogSet.dialogTitle == '温馨提示' ? '0' : (this.state.delChecked ? '1':'0')
        };
        if (updateType == 'delete') {
            param.type = 'delete';
        }
        console.log('kankanupdaterelation',param);
        NetWork.Post({
            url:'Orderreturn/deleteRelation',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/deleteRelation',rsp);
            //有结果
            Taro.hideLoading();
            if (!IsEmpty(rsp)) {
                callback('del',item);
                if (param.needDelete == '0') {
                    if (updateType == 'delete') {
                        Taro.showToast({
                            title: '删除成功~',
                            icon: 'none',
                            duration: 2000
                        });
                    } else {
                        Taro.showToast({
                            title: '取消代销成功~',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                } else {
                    if (item.shop_type == 'taobao') {
                        if (!IsEmpty(rsp.item)) {
                            if (updateType == 'delete') {
                                Taro.showToast({
                                    title: '删除并下架成功~',
                                    icon: 'none',
                                    duration: 2000
                                });
                            } else {
                                Taro.showToast({
                                    title: '取消代销并下架成功~',
                                    icon: 'none',
                                    duration: 2000
                                });
                            }
                        } else {
                            if (!IsEmpty(rsp.sub_msg)) {
                                if (updateType == 'delete') {
                                    Taro.showToast({
                                        title: '已从列表删除，淘宝商品删除失败:' + rsp.sub_msg,
                                        icon: 'none',
                                        duration: 2000
                                    });
                                } else {
                                    Taro.showToast({
                                        title: '取消代销成功，下架失败:'+rsp.sub_msg,
                                        icon: 'none',
                                        duration: 2000
                                    });
                                }
                            } else {
                                if (updateType == 'delete') {
                                    Taro.showToast({
                                        title: '取消代销成功，下架失败',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                } else {
                                    Taro.showToast({
                                        title: '取消代销成功，删除失败',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                }
                            }
                        }
                    } else {
                        if(item.shop_type=='wc'){
                            Taro.showToast({
                                title: '取消代销成功~',
                                icon: 'none',
                                duration: 2000
                            });
                        }else if(item.shop_type=='pdd'){
                            if (!IsEmpty(rsp.goods_sale_status_set_response) && !IsEmpty(rsp.goods_sale_status_set_response.is_success)) {

                                if (updateType == 'delete') {
                                    Taro.showToast({
                                        title: '删除并下架成功~',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                } else {
                                    Taro.showToast({
                                        title: '取消代销并下架成功~',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                }
                            } else {
                                if (!IsEmpty(rsp.error_response) && !IsEmpty(rsp.error_response.error_msg)) {
                                    if (updateType == 'delete') {
                                        Taro.showToast({
                                            title: '已从列表删除，拼多多商品删除失败:' + rsp.error_response.error_msg,
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    } else {
                                        Taro.showToast({
                                            title: '取消代销成功，下架失败：:' + rsp.error_response.error_msg,
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    }
                                } else {
                                    if (updateType == 'delete') {
                                        Taro.showToast({
                                            title: '成功从列表移除，下架失败',
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    } else {
                                        Taro.showToast({
                                            title: '取消代销成功，下架失败',
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    }
                                }
                            }
                        } else {
                            if (!IsEmpty(rsp.isSuccess) && rsp.isSuccess == true) {
                                if (updateType == 'delete') {
                                    Taro.showToast({
                                        title: '删除并下架成功~',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                } else {
                                    Taro.showToast({
                                        title: '取消代销并下架成功~',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                }
                                
                            } else {
                                if (!IsEmpty(rsp.errorMsg)) {
                                    if (updateType == 'delete') {
                                        Taro.showToast({
                                            title: '已从列表删除，商品删除失败:' + rsp.errorMsg,
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    } else {
                                        Taro.showToast({
                                            title: '取消代销成功，下架失败：:' + rsp.errorMsg,
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    }
                                } else {
                                    if (updateType == 'delete') {
                                        Taro.showToast({
                                            title: '成功从列表移除，下架失败',
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    } else {
                                        Taro.showToast({
                                            title: '取消代销成功，下架失败',
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    }
                                }
                            }
                        }

                    }
                }
            }
        },(error)=>{
            if (this.retry < 3) {
                this.retry++;
                this.updateRelation(item,updateType,callback);
            } else {
                this.retry = 0;
                alert(JSON.stringify(error));
                Taro.hideLoading();
            }
        });
    }

    //隐藏二次确认弹窗
    cancel = () =>{
        this.refs.sureDialog.hide();
    }

    render(){
        console.log('props',status,this.props.item);
        const {status,item,callback} = this.props;
        const {dialogSet} = this.state;
        let buttons='';
        let amountOnSale = 0;
        if (!IsEmpty(item.amount_1688)) {
            amountOnSale = item.amount_1688;
        }


        //各状态显示不同的按钮
        switch (status) {
            case '代销中':
                buttons=
                <View style={styles.buttonGroup}>
                    {
                        item.shop_type == 'pdd' || item.shop_type == 'wc' ? 
                        '' 
                        : !IsEmpty(item.origin_login_name) ?
                        <View style={styles.buttons} onClick={()=>{this.btnClick('供应商')}}>
                            <Text style={styles.buttonText}>供应商</Text>
                        </View> :
                        ''
                    }
                    <View style={styles.buttons} onClick={()=>{this.btnClick('同步信息')}}>
                        <Text style={styles.buttonText}>同步信息</Text>
                    </View>
                    {
                        this.props.type =='recycle'?null:(
                            <View style={styles.buttons} onClick={()=>{this.btnClick('取消代销')}}>
                                <Text style={styles.buttonText}>取消代销</Text>
                            </View>)
                    }
                    {
                        amountOnSale > 0 ?
                        <View style={styles.buttons} onClick={()=>{this.btnClick('采购')}}>
                            <Text style={styles.buttonText}>采购</Text>
                        </View>
                        :
                        ''
                    }
                    {
                        this.props.type =='recycle'?(
                            <View style={styles.buttons} onClick={()=>{this.btnClick('恢复代销')}}>
                                <Text style={styles.buttonText}>恢复代销</Text>
                            </View>):null
                    }
                    {
                        (item.shop_type == 'pdd' || item.shop_type == 'wc') && this.props.type != 'recycle' ? 
                        <View style={[styles.buttons,{borderColor:'#ff6000'}]} onClick={()=>{this.btnClick('编辑代销商品')}}>
                            <Text style={[styles.buttonText,{color:'#ff6000'}]}>编辑代销商品</Text>
                        </View> 
                        :
                        ''
                    }
                </View>;
                break;
            case '已缺货':
                buttons=
                <View style={styles.buttonGroup}>
                    <View style={styles.buttons} onClick={()=>{this.btnClick('供应商')}}>
                        <Text style={styles.buttonText}>供应商</Text>
                    </View>
                    <View style={styles.buttons} onClick={()=>{this.btnClick('同步信息')}}>
                        <Text style={styles.buttonText}>同步信息</Text>
                    </View>
                    <View style={styles.buttons} onClick={()=>{this.btnClick('取消代销')}}>
                        <Text style={styles.buttonText}>取消代销</Text>
                    </View>
                    {
                        item.shop_type == 'pdd' || item.shop_type == 'wc' ? 
                        <View style={[styles.buttons,{borderColor:'#ff6000'}]} onClick={()=>{this.btnClick('编辑代销商品')}}>
                            <Text style={[styles.buttonText,{color:'#ff6000'}]}>编辑代销商品</Text>
                        </View> 
                        :
                        ''
                    }
                </View>;
                break;
            case '终止代销':
                buttons=
                <View style={styles.buttonGroup}>
                    <View style={styles.buttons} onClick={()=>{this.btnClick('供应商')}}>
                        <Text style={styles.buttonText}>供应商</Text>
                    </View>
                    <View style={styles.buttons} onClick={()=>{this.btnClick('删除')}}>
                        <Text style={styles.buttonText}>删除</Text>
                    </View>
                    <View style={styles.buttons} onClick={()=>{this.btnClick('恢复代销')}}>
                        <Text style={styles.buttonText}>恢复代销</Text>
                    </View>
                    {
                        item.shop_type == 'pdd' || item.shop_type == 'wc' ? 
                        <View style={[styles.buttons,{borderColor:'#ff6000'}]} onClick={()=>{this.btnClick('编辑代销商品')}}>
                            <Text style={[styles.buttonText,{color:'#ff6000'}]}>编辑代销商品</Text>
                        </View> 
                        :
                        ''
                    }
                </View>;
                break;
            default:break;

        }

        return (
            <View>
                {buttons}
                <Dialog ref={"sureDialog"} duration={1000} maskStyle={styles.maskStyle} contentStyle={styles.modal2Style}>
                    <View style={styles.dialogContent}>
                        <Text style={{marginTop:px(15),fontSize:px(38),fontWeight:'300',color:'#4A4A4A',textAlign:'center',width:px(612)}}>{dialogSet.dialogTitle}</Text>
                        <View style={{width:px(612),marginTop:px(24),minHeight:200}}>
                            <Text style={[styles.dialogText,dialogSet.dialogTitle == '同步1688货源信息'||dialogSet.dialogTitle == '恢复代销关系失败' ? {marginTop:px(50)}:{}]}>
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
                        <View style={styles.foot}>
                            <View style={styles.footBtn} onClick={this.cancel}>
                                <Text style={styles.fontStyle}>{dialogSet.dialogCancelText ? dialogSet.dialogCancelText : '取消'}</Text>
                            </View>
                            <View style={[styles.submitBtn,{backgroundColor:"#ff6000"}]} onClick={this.submit}>
                                <Text style={[styles.fontStyle,{color:"#ffffff"}]}>{dialogSet.dialogOkText ? dialogSet.dialogOkText : '确定'}</Text>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </View>

        );
    }
}
