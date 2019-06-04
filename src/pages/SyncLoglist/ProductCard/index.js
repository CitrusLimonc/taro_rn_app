import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import ItemIcon from '../../../Component/ItemIcon';
import styles from './styles';
import px from '../../../Biz/px.js';
/**
 * @author wzm
 * 库存预警日志卡片
 */
export default class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            item:this.props.item,//商品信息
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.item) {
            this.setState({
                item:nextProps.item,
            });
        }
    }

    render(){

        let {item} = this.state;
        let imgUrl = item.image;

        let image='';
        if (IsEmpty(imgUrl)) {
            image =
            <ItemIcon code={"\ue7ed"} iconStyle={{fontSize:px(100),color:'#e6e6e6'}}/>;
        } else {
            image =
            <Image src={imgUrl}
            style={{width:140,height:140}}
            resizeMode={"contain"}
            />;
        }
        let line2 = '';
        if (item.status == 2) {
            line2 =
            <View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                <Text style={{fontSize:px(24),color:'#DA1010'}}>同步失败:{item.error_msg}</Text>
            </View>;
        } else {
            if(item.stock==0){
                let shopname = '';
                for(let i=0;i<this.props.shopList.length;i++){
                    if(this.props.shopList[i].id == item.shop_id){
                        shopname = this.props.shopList[i].shop_type
                    }
                }
                switch (shopname) {
                    case 'taobao':{
                        shopname = '淘宝';
                     } break;
                    case 'wc':{
                        shopname = '微信';
                    } break;
                    case 'pdd':{
                        shopname = '拼多多';
                     } break;
                }
                let linemsg ='';
                let option = '';
                if(item.option==1){
                    option = '下架';
                }else{
                    option = '取消代销';
                }
                switch (item.error_msg) {
                    case '下架或取消代销成功':{
                        linemsg ='库存为0，'+shopname+'店铺的商品'+option+'成功';
                     } break;
                    case '货源被删除+下架或取消代销成功':{
                        linemsg ='货源被删除，'+shopname+'店铺的商品'+option+'成功';
                    } break;
                    case '该商品已被删除':{
                        linemsg ='库存为0，'+shopname+'店铺的商品已被删除';
                     } break;
                    case '货源被删除+该商品已被删除':{
                        linemsg ='货源被删除，'+shopname+'店铺的商品已被删除';
                    } break;
                    default:{
                        let data = item.error_msg;
                        if(data.indexOf("货源被删除")!= -1){
                            linemsg ='货源被删除，'+shopname+'店铺的商品'+option+'失败';
                        }else{
                            linemsg ='库存为0，'+shopname+'店铺的商品'+option+'失败';
                        }
                    } break;
                }
                line2 =
                (<View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                    <Text style={{fontSize:px(24),color:'#FF6000'}}>{linemsg}</Text>
                </View>);
            }else{
                line2 =
                <View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                    <Text style={{fontSize:px(24),color:'#666666'}}>同步结果:库存为{item.stock}</Text>
                </View>;
            }
        }
        return (
            <View style={{marginBottom:px(25)}}>
                <View style={styles.cardContent}>
                    <View style={styles.imgBox}>
                        {image}
                    </View>
                    <View style={{flex:1,marginLeft:px(15)}}>
                        <View style={{height:px(68)}}>
                            <Text style={{fontSize:px(28),width:px(478)}}>{item.title}</Text>
                        </View>
                        <View style={{flexDirection:'row',marginTop:px(10),alignItems:'center'}}>
                            <Text style={{fontSize:px(24),color:'#666666'}}>同步时间:</Text>
                            <Text style={{fontSize:px(24),color:'#666666'}}>{item.start_time}</Text>
                        </View>
                        {line2}
                    </View>
                </View>
            </View>
        );
    }
}
