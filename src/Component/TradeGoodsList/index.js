import Taro, { Component, Config } from '@tarojs/taro';
import { View , Text, Image,Input,Checkbox } from '@tarojs/components';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import styles from './styles.js';
import px from '../../Biz/px.js';
/**
* @author cy
* 单个的商品信息
*lzy 3.13
**/

const types = ['待采购','待发货','已发货','已成功','退款中','已关闭'];//订单对应的中文状态
const colors = {
    '待采购':'#42C4CF',
    '待发货':'#42C4CF',
    '已发货':'#4A90E2',
    '已关闭':'#4A90E2',
    '已成功':'#4A90E2',
}//不同状态订单下标颜色
export default class GoodsList extends Component {
    constructor(props) {
        super(props);
        let itemA = this.props.itemAmount;
        this.oldIA = itemA;
        this.state = {
            cht:false,//是否修改价格
            itemA:itemA,//货品总价
        }
        this.GoToDetail = this.GoToDetail.bind(this);//跳转详情页
        this.changeIa = this.changeIa.bind(this);//子订单改价事件
        this.splitGoods = this.splitGoods.bind(this);//拆单发货
    };
    /**
    *拆单发货事件
    */
    splitGoods(value){
        this.props.getsplitId(this.props.subItemIDString,value)
    }
    /**
    *子订单改价事件
    */
    changeIa(v){
        let num = 0;
        if(!IsEmpty(v.value)){
            num = parseFloat(v.value)
            if(num == 'NaN'){
                alert('请输入数字')
                return;
            }
        }
        this.state.itemA = num;
        this.setState({itemA:this.state.itemA});
    }

    /**
    *跳转详情
    *有多笔子订单退款时根据子订单号获取TQID
    */
    GoToDetail(tid,refund){
        console.log('tradelist--------gotoview');

        let self =this;
        const { refundId,allitems } = self.props;
        if(!IsEmpty(self.props.batch)){
            return;
        }
        
        GoToView({status:'OrderDetail',query:{orderId:tid,shopType:self.props.shopType}})
    }
    /**
    *修改价格后，对应子订单变化
    */
    componentWillReceiveProps(nextProps){
        if(!IsEmpty(nextProps.echo)){
            this.oldIA = nextProps.echo;
            this.setState({itemA:nextProps.echo});
        }
    }

    render(){
        const { cht,itemA } = this.state;
        const { refund,tabStatus,status,key,isLastOne } = this.props;
        let confirmRefund='';//原先做的退款协议
        let tab_retxt = '';//特殊状态文字
        let tab_color = '';//特殊状态颜色
        let had_refund = false;//是否退款相关
        let spetid = false;//是否在发货页面
        let ws_hs = false;//是否待发货列表中的已发货
        let opview = '';//特殊状态的底部栏
        if(tabStatus == '退款中'){
            tab_retxt = types[status];
            tab_color = colors[tab_retxt];
        }else{
            if(!IsEmpty(refund) && refund != 'NO_REFUND' && refund != '1' && refund != 'CLOSED'){
                if(refund == 'REFUND_SUCCESS' || refund == 'SUCCESS' || refund == '4'){
                    tab_retxt = '已退款';
                    tab_color ='#8B572A';
                    had_refund = true;
                }else{
                    tab_retxt = '退款中';
                    tab_color = '#E41010';
                }
                opview = <View style={[styles.bo_f,{backgroundColor:tab_color}]}>
                            <Text style={styles.bo_txt}>{tab_retxt}</Text>
                        </View>
            }
        }//
        if(tabStatus == '待发货'){
            if( types[status] == '已发货'){
                ws_hs = true;
                tab_retxt = types[status];
                tab_color = colors[tab_retxt];
            }
        }
        if( tab_retxt =='已退款'||types[status]=='已发货'){
            spetid = true;
        }
        if(tabStatus == '退款中'){
            opview = <View style={[styles.bo_f,{backgroundColor:tab_color}]}>
                        <Text style={styles.bo_txt}>{tab_retxt}</Text>
                    </View>;
        }else if(ws_hs){
            opview = <View style={[styles.bo_f,{backgroundColor:tab_color}]}>
                        <Text style={styles.bo_txt}>{tab_retxt}</Text>
                    </View>;
        }//退款状态优先级高
        let single = parseFloat(this.props.itemAmount/this.props.num); //
        if(single<0.01&&this.props.itemAmount!=0){
            single = `<¥0.01`;
        }else{
            single = `¥${(this.props.itemAmount/this.props.num).toFixed(2)}`;
        }

        if (this.props.is_daixiao == '0') {
            opview = <View style={[styles.bo_f,{backgroundColor:'#ff6000'}]}>
                        <Text style={styles.bo_txt}>未代销</Text>
                     </View>;
        }
        return (
            <View onClick={()=>{
                // if(tabStatus == '退款中'){
                //     this.GoToDetail(this.props.tid,true)
                // }else{
                    if(this.props.chp||this.props.isSendPage){

                    }else{
                        this.GoToDetail(this.props.tid)
                    }
                // }
            }} style={isLastOne ? styles.laysLast:styles.lays}>
                <View style={styles.layGrid}>
                    {this.props.isSendPage?(
                        <View style={{justifyContent:'center',marginLeft:spetid?0:-20}}>
                            {spetid?(null):(
                                <Checkbox style={{width:px(44),height:px(44)}} type='normal' size="small" onChange={this.splitGoods}/>
                            )}
                        </View>
                    ):(null)}
                    <View style={styles.imgCol}>
                        <View style={styles.img}>
                            <Image resizeMode={"contain"} src={this.props.picUrl} style={{width:px(120),height:px(120)}}/>
                            {opview}
                        </View>
                    </View>
                    <View style={{flex:1,paddingLeft:px(16)}}>
                        <View style={styles.v_row}>
                            <View style={styles.mesCol}>
                                <Text style={styles.name}>{this.props.name}</Text>
                                {!IsEmpty(this.props.productCargoNumber)?(
                                    <Text style={{fontSize:px(26),color:'#333',marginTop:px(6)}}>{`货号:${this.props.productCargoNumber}`}</Text>
                                ):(
                                    null
                                )}
                                <View style={styles.colors}>
                                    <Text style={{color:"#ff6000",fontSize:px(24)}}>{this.props.sku}</Text>
                                </View>
                            </View>
                            <View style={styles.priceCol}>
                                {this.props.chp?(
                                    <Text onClick = {()=>{
                                        if(this.state.cht){
                                            let price = this.state.itemA;
                                            let oldprice = this.oldIA;
                                            this.props.ecChange(price,oldprice,this.props.subItemIDString);
                                            this.oldIA = this.state.itemA;
                                        }
                                        this.setState({cht:!this.state.cht})
                                    }} style={{fontSize:px(26),color:'#3089DC',textAlign: 'right',lineHeight:px(40)}}>{cht?'完成':'改价'}</Text>
                                ):(
                                    <Text style={[styles.newPrice,{lineHeight:px(0)}]}>{single}</Text>
                                )}
                                {had_refund?(
                                    <View style={[styles.red_btn,{borderColor:'#FFA033'}]}>
                                        <Text style={{color:'#FFA033',fontSize:px(24)}}>退款成功</Text>
                                    </View>
                                ):(
                                    <View>
                                        {this.props.chp?
                                            (   <View>
                                                    {this.state.cht?(
                                                        <Input style={styles.inputNormal} type="number" maxLength={8} value={itemA} onInput={(value,e)=>{this.changeIa(value)}}/>
                                                    ):(
                                                        <Text style={styles.newPrice}>{`¥${itemA}`}</Text>
                                                    )}
                                                </View>
                                            ):(
                                                <Text style={styles.oldPrice}>{`¥${this.props.price}`}</Text>
                                            )
                                        }
                                    </View>
                                )}
                                <Text style={styles.numbers}>x{this.props.num}</Text>
                            </View>
                        </View>
                        {confirmRefund}
                    </View>
                </View>
            </View>
        );
    }
}
