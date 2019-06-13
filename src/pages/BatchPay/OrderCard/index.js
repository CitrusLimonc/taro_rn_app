import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Checkbox,Image} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import {UitlsRap} from '../../../Public/Biz/UitlsRap.js';
import ItemIcon from '../../../Component/ItemIcon';
import px from '../../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 批量付款 --- 订单卡片
 */
export default class BatchPay extends Component {
    constructor(props){
        super(props);
        this.state={
            maskShow:false,
            order:this.props.order,
            isLastOne:this.props.isLastOne,
            headType:this.props.headType
        }
    }

    componentWillReceiveProps(nextProps){
        let param = {};
        if(nextProps.order){
            param.order = nextProps.order;
        }
        if(nextProps.isLastOne != this.state.isLastOne){
            param.isLastOne = nextProps.isLastOne;
        }
        if(nextProps.headType != this.state.headType){
            param.headType = nextProps.headType;
            if (nextProps.headType == false) {
                param.maskShow = false;
            }
        }
        this.setState({
            ...param
        });
        
    }


    openChart = (data) =>{
        UitlsRap.openChat(data);
    }

    //选择当前选中商品
    chooseOne = (checked) =>{
       
        this.props.chooseNum(this.state.order,checked,(total,needCheck)=>{
            console.log('chooseTotal',total);
            if (checked && !needCheck) {
                return ;
            }
            this.setState({
                maskShow:checked
            });
        });
    }


    render(){
        let {order,maskShow,isLastOne,headType} = this.state;
        let orders = order.orders;
        console.log('headType',headType);
        
        if (headType == false) {
            maskShow = false;
        }
        return (
            <View style={[styles.cardBox,isLastOne ? {marginBottom:px(184)}:{marginBottom:px(24)}]}
            onClick={()=>{
                if(headType){
                    this.chooseOne(!maskShow)
                }
            }}>
                <View style={styles.wangwang}>
                    <Text style={{color:'#999999',fontSize:24}} onClick={()=>{if(!headType){this.openChart(order.seller_nick)}}}>{'供 应 商 ：'}</Text>
                    <Text onClick={()=>{if(!headType){this.openChart(order.seller_nick)}}} style={styles.wangText}>{order.seller_nick}</Text>
                    <ItemIcon onClick={()=>{if(!headType){this.openChart(order.seller_nick)}}} code={"\ue6ba"} iconStyle={styles.wangIcon}/>
                    <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                        <Checkbox size="small" checked={maskShow} style={{width:px(44),height:px(44),marginRight:px(-40)}}>
                        </Checkbox>
                        <View onClick={()=>{this.chooseOne(!maskShow)}}
                        style={{width:px(80),height:px(80),position:"absolute",right:0,top:0}}>
                        </View>
                    </View>
                </View>
                {
                    orders.map((product,idx)=>{
                        let sku = '';
                        let price = '';
                        let number = 1;
                        let title = '';
                        let offerPicUrl = '';
                        let properties = product.sku_properties_name;
                        if (!IsEmpty(properties)) {
                            properties = properties.split(';');
                            properties.map((prop,key) => {
                                properties[key] = properties[key].split(':');
                                if (key == properties.length - 1) {
                                    sku = sku + properties[key][1];
                                } else {
                                    sku = sku + properties[key][1] + ',';
                                }
                            });
                        }
                        price = product.price;
                        number = product.num;
                        title = product.title;

                        if (!IsEmpty(product.pic_path)) {
                            offerPicUrl = product.pic_path;
                        } else {
                            offerPicUrl = 'https://cbu01.alicdn.com/images/app/detail/public/camera.gif';
                        }

                        return (
                            <View style={styles.cardLine}>
                                <View style={styles.img}>
                                    <Image resizeMode={"contain"} src={offerPicUrl} style={{width:120,height:120}}/>
                                </View>
                                <View style={{flex:1,marginLeft:px(24)}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{width:px(400),fontSize:px(24),color:'#333333'}}>{title}</Text>
                                        <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                                            <Text style={{fontSize:px(24),color:'#333333'}}>¥{price}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row',marginTop:px(8)}}>
                                        {
                                            !IsEmpty(sku) ?
                                            <Text style={{fontSize:px(24),color:'#ff6000'}}>{sku}</Text>
                                            :
                                            null
                                        }
                                        <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end'}}>
                                            <Text style={{fontSize:px(24),color:'#ff6000'}}>x{number}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                <View style={styles.orderNum}>
                    <Text style={styles.orderText}>采购单号：</Text>
                    <Text style={styles.number}
                    onClick={()=>{
                        if (!IsEmpty(order.tid) && !headType) {
                            UitlsRap.clipboard(order.tid,(result)=>{
                                Toast.info('订单号已复制', 2);
                            });
                        }
                    }}
                    >{order.tid ? order.tid:'暂无'}</Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',flex:1}}>
                        <Text style={{fontSize:px(28),color:'#4A4A4A'}}>金额：</Text>
                        <Text style={{fontSize:px(28),color:'#ff6000'}}>¥{!IsEmpty(order.payment) ? parseFloat(order.payment).toFixed(2):'暂无'}</Text>
                    </View>
                </View>
            </View>
        );
    }
}