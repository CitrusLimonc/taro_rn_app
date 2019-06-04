import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Image,Button} from '@tarojs/components';
import { GoToView } from '../../../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../../../Public/Common/NetWork/NetWork.js';
import styles from './styles';
import px from '../../../../Biz/px.js';
/**
 * @author cy
 * 基本信息
 */
export default class ShopList extends Component{
    constructor(props){
        super(props);
        this.state={
            shopList:[]
        }
    }

    componentWillMount(){
        //获取当前商品的铺货列表
        NetWork.Get({
            url:'Orderreturn/getShopsForItem',
            data:{
                productId:this.props.productId
            }
        },(rsp)=>{
            console.log('Orderreturn/getShopsForItem',rsp);
            if (!IsEmpty(rsp)) {
                this.setState({
                    shopList:rsp
                });
            }
        },(error)=>{
            console.log(error);
        });
    }

    //渲染店铺列表
    renderShops = () =>{
        const self = this;
        let doms = [];
        let nums = this.state.shopList.length-1;
        this.state.shopList.map((item,key)=>{
            doms.push(
                <View style={key == nums?styles.shopsbodynoboder:styles.shopsbody}>
                    <Image src={item.shop_url} style={{width:px(40),height:px(40)}}/>
                    <Text style={{marginLeft:px(8),fontSize:px(24),color:'#333333',flex:1}}>{item.shop_name}</Text>
                    {
                        item.shop_type == 'wc' || item.shop_type == 'pdd' ?(
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            {
                                //mark 测试时用0，正式用1
                                item.has_smallroutine == 1 || item.shop_type == 'pdd' ? (<Button onClick={()=>{
                                    GoToView({status:'Sellbysetting',query:{numIid:item.num_iid,productId:self.props.productId,shopid:item.shop_id}});
                                }} size="small" type="secondary" style={{height:px(48)}}>编辑代销商品</Button>):''
                            }
                            {
                                item.shop_type == 'wc' ?
                                <Button onClick={()=>{
                                    let shopname = encodeURI(item.shop_name);
                                    if(item.has_smallroutine == 1){
                                        GoToView({status:'Intowd',query:{shopid:item.shop_id,shopname:shopname}});
                                    }else{
                                        GoToView({status:'Openwd',query:{shopid:item.shop_id,shopname:shopname}});
                                    }

                                }}
                                size="small" type="primary" style={{marginLeft:px(24),height:px(48)}}>去分享</Button>
                                :
                                ''
                            }
                            
                        </View>
                    ):''
                    }

                </View>
            )
        });

        return doms;
    }

    render(){
        return (
            <View style={{backgroundColor:'#ffffff',flex:1,paddingLeft:px(20),paddingRight:px(24),paddingTop:px(24)}}>
                <Text style={{fontSize:px(28),color:'#979797'}}>已经铺货的店铺</Text>
                <View style={{width:px(702),flexWrap:'wrap',marginTop:px(24)}}>
                    {this.renderShops()}
                </View>
            </View>
        );
    }
}
