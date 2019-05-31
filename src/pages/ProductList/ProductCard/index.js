import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Checkbox } from '@tarojs/components';
import ItemProductButtons from './ItemProductButtons';
import { GoToView } from '../../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import {LocalStore} from '../../../Public/Biz/LocalStore.js';
import ItemIcon from '../../../Component/ItemIcon';
import px from '../../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 商品卡片
 */
export default class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            maskShow:false, // 是否有覆盖层
            item:this.props.item, //当前商品信息
            imgMes:{ //图片信息
                width:'',
                height:''
            }
        }
        this.changeMask=this.changeMask.bind(this);
    }

    componentWillMount(){
        let maskShow=false;//是否有遮盖层
        if(this.props.hischeckedAll){
            maskShow = this.props.hischeckedAll;
        }else if(this.props.chooseItem.length==0){
            maskShow = false;
        }

        this.setState({
            maskShow:maskShow
        });
    }
    componentWillReceiveProps(nextProps){
        let param = {};
        if(nextProps.item.origin_num_iid != this.state.item.origin_num_iid){
            param.item = nextProps.item;
        }
        if (nextProps.item.origin_title != this.state.item.origin_title) {
            param.item = nextProps.item;
        }

        if (nextProps.item.amount_1688 != this.state.item.amount_1688) {
            param.item = nextProps.item;
        }

        if (nextProps.item.shop_type != this.state.item.shop_type) {
            param.item = nextProps.item;
        }

        if(nextProps.checkedAll){
            param.maskShow = nextProps.checkedAll;
        }else if(nextProps.chooseItem.length==0){
            param.maskShow = false;
        }
        this.setState({
            ...param
        });
        //console.log('maskShow',param.maskShow);
    }

    //选择当前选中商品
    chooseOne(checked,item){
        this.setState({
            maskShow:checked
        });
        this.props.chooseNum(item,checked);
    }

    //点击遮盖层改变选中状态
    changeMask=(item,check)=>{
        this.setState({
            maskShow:check
        });
        this.props.chooseNum(item,check);
    }

    //显示商品详情页面
    showPage = (productID,supplierMemberId) =>{
        let {item} = this.state;
        //如果是从终止代销页面进入 ，理论上说是没有代销关系的
        if (this.props.status == '终止代销') {
            let list = [{
                id:item.shop_id,
                shop_type:item.shop_type,
                shop_name:item.shop_name,
                num_iid:item.num_iid,
                origin_num_iid:item.origin_num_iid
            }];
            LocalStore.Set({'go_to_distribution_list':JSON.stringify(list)});
            GoToView({status:'ProductDetail',query:{
                offerid:productID,
                memberId:supplierMemberId,
                from:'hasCancelRelation'
            }});
        } else {
            GoToView({
                status:'ItemDetail',
                query:{
                    productID:productID,
                    numIid:item.num_iid,
                    supplierMemberId:supplierMemberId,
                    supplierLoginId:encodeURI(item.origin_login_name)
                }});
        }
    }

    render(){

        let {maskShow,item} = this.state;
        let {status,callback,headType,buttons} = this.props;
        //是否存在复选框
        let flag = false;
        if(maskShow){
            flag = true;
        }
        let chooseModal='';
        //是否包含遮盖层
        if (headType) {
            if (flag) {
                chooseModal = <View style={styles.mask} onClick={()=>{this.changeMask(item,false)}}></View>;
            } else {
                chooseModal = <View style={[styles.mask,{backgroundColor: 'rgba(0,0,0,0)'}]} onClick={()=>{this.changeMask(item,true)}}></View>;
            }
        }

        //是否包含按钮
        let buttonsDom = '';
        if (this.props.buttons) {
            buttonsDom = (<ItemProductButtons
            status={status}
            item={item}
            type={this.props.type}
            callback={callback}
            synchroRelation={this.props.synchroRelation}
            updateRelation={this.props.updateRelation}
            />);
        }

        let productID = item.origin_num_iid;
        let imgUrl = item.pic_1688;
        let warningIcon = '';

        let amountOnSale = '待同步';
        if(!IsEmpty(item.amount_1688)){
            amountOnSale = item.amount_1688;
            if (amountOnSale <= 0) {
                warningIcon =
                <View style={styles.maskLine}>
                    <Text style={{fontSize:px(24),color:'#ffffff'}}>供应商缺货</Text>
                </View>;
            } else if (item.min_defect_num == 0) {
                warningIcon =
                <View style={styles.maskLine}>
                    <Text style={{fontSize:px(24),color:'#ffffff'}}>部分缺货</Text>
                </View>;
            }
        }

        let image='';
        if (IsEmpty(imgUrl)) {
            image =
            <ItemIcon code={"\ue7ed"} iconStyle={{fontSize:px(100),color:'#e6e6e6'}}/>;
        } else {
            image =
            <Image src={imgUrl}
            style={{width:px(140),height:px(140)}}
            resizeMode={"contain"}
            />;
        }
        let line2 = '';
        if (item.status_1688 != 'published' && item.status_1688 != 'new' && item.status_1688 != 'modified') {
            switch (item.status_1688) {
                case 'member expired':
                case 'auto expired':
                case 'expired':
                line2 =
                <View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                    <Text style={{fontSize:px(28),color:'#ff6000'}}>已被供应商下架</Text>
                </View>
                warningIcon =
                <View style={styles.maskLine}>
                    <Text style={{fontSize:px(24),color:'#ffffff'}}>供应商缺货</Text>
                </View>;
                break;
                case 'member deleted':
                case 'deleted':
                case 'TBD':
                line2 =
                <View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                    <Text style={{fontSize:px(28),color:'#ff6000'}}>已被供应商删除</Text>
                </View>
                warningIcon =
                <View style={styles.maskLine}>
                    <Text style={{fontSize:px(24),color:'#ffffff'}}>供应商缺货</Text>
                </View>;
                break;
                default:break;
            }
        } else {
            if (!IsEmpty(item.origin_login_name)) {
                line2 =
                <View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                    <Text style={{fontSize:px(24),color:'#666666'}}>供应商:{item.origin_login_name}</Text>
                </View>;
            }
        }
        let price = "¥" + item.origin_price;
        if (!IsEmpty(item.max_list_price) && !IsEmpty(item.min_list_price)) {
            if (item.max_list_price == item.min_list_price) {
                price = "¥" + item.max_list_price;
            } else {
                price = "¥" + item.min_list_price + '~' + "¥" + item.max_list_price;
            }
        }

       
        return (
            <View style={{marginBottom:px(25)}}>
                <View style={styles.cardContent}>
                    <View onClick={this.showPage.bind(this,productID,item.origin_id)} style={styles.imgBox}>
                        {image}
                        {warningIcon}
                    </View>
                    <View style={{flex:1,marginLeft:px(15)}} onClick={this.showPage.bind(this,productID,item.origin_id)}>
                        <View style={{height:px(68)}}>
                            <Text style={{fontSize:px(28),width:px(478)}}>{item.origin_title}</Text>
                        </View>
                        {
                            item.is_del == '0' ?
                            <View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                                <Text style={{fontSize:px(24),color:'#666666'}}>进价:</Text>
                                <Text style={{fontSize:px(24),color:'#ff6000'}}> {price}</Text>
                                <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                                    <Text style={[{fontSize:px(24)},Number(amountOnSale) <= 0 ? {color:'#ff0000'}:{color:'#666666'}]}>
                                    库存: {amountOnSale}
                                    </Text>
                                </View>
                            </View>
                            :
                            ''
                        }
                        {line2}
                    </View>
                    {
                        this.props.type == 'recycle'?null:(                    
                            <View style={{position:"relative",right:px(0),top:px(0)}}>
                                <Checkbox size="small" checked={flag} style={{width:px(44),height:px(44)}}>
                                </Checkbox>
                                <View onClick={this.chooseOne.bind(this,!flag,item)}
                                style={{width:px(80),height:px(80),position:"absolute",right:px(0),top:px(0)}}>
                                </View>
                            </View>)
                    }

                </View>
                {buttonsDom}
                {chooseModal}
            </View>
        );
    }
}
