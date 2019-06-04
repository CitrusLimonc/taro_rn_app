import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text} from '@tarojs/components';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import ShopList from './ShopList';
import ItemIcon from '../../../Component/ItemIcon';
import styles from './styles';
import px from '../../../Biz/px.js';
/**
 * @author cy
 * 基本信息
 */
export default class BasicInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            productInfo:this.props.productInfo
        }
    }

    render(){
        //判断当前商品状态
        let status='';
        switch (this.state.productInfo.status) {
            case 'auditing':{
                status='待审核';
                break;
            }
            case 'expired':
            case 'member expired':
            case 'auto expired':{
                status='待上架';
                break;
            }
            case 'published':{
                status='出售中';
                break;
            }
            case 'member deleted':
            case 'deleted':{
                status='已删除';
                break;
            }
            default:break;
        }

        //获取当前商品的属性字符串
        let attributes='';
        if (!IsEmpty(this.state.productInfo.attributes)) {
            let item=this.state.productInfo.attributes;
            let end=4;
            if (this.state.productInfo.attributes.length>4) {
                end=4;
            } else {
                end=this.state.productInfo.attributes.length
            }
            for (var i = 0; i < end; i++) {
                if (i!=end-1) {
                    attributes+=item[i].value;
                    attributes+='/';
                }else {
                    attributes+=item[i].value;
                }
            }
            if(this.state.productInfo.attributes.length>4){
                attributes+='...';
            }
        }

        let consignPrice='';
        if (!IsEmpty(this.state.productInfo.extendInfos)) {
            let extendInfos = this.state.productInfo.extendInfos;
            let consignArr = [];
            for (let i = 0; i < extendInfos.length; i++) {
                if (extendInfos[i].key == "consign_price") {
                    consignArr = extendInfos[i].value.split(';');
                }
            }
            if (consignArr.length > 0) {
                let prices = [];
                for (let j = 0; j < consignArr.length; j++) {
                    if (!IsEmpty(consignArr[j])) {
                        let onePrice = consignArr[j].split(':');
                        prices.push(onePrice[1]);
                    }
                }

                let maxPrice = prices[0];
                let minPrice = prices[0];
                for (let k = 0; k < prices.length; k++) {
                    if (prices[k] > maxPrice) {
                        maxPrice = parseFloat(prices[k]).toFixed(2);
                    }

                    if (prices[k] < minPrice) {
                        minPrice = parseFloat(prices[k]).toFixed(2);
                    }
                }

                let price = "¥" + minPrice;
                if (maxPrice != minPrice) {
                    price = "¥" + minPrice + '~' + "¥" + maxPrice;
                }

                consignPrice=
                <View style={styles.statusLinenoboder}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:px(28),color:'#979797'}}>代销价格:</Text>
                        <Text style={{fontSize:px(28),color:'#4A4A4A',marginLeft:px(20)}}>
                            {price}
                        </Text>
                    </View>
                </View>;
            }
        }
        return (
            <View style={{backgroundColor:'#fff'}}>
                <ShopList numIid = {this.props.numIid}  productId={this.state.productInfo.productID}/>
                <View style={[styles.statusLine,{borderTopWidth:px(1),borderTopColor:'#e5e5e5'}]}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:px(28),color:'#979797'}}>商品状态:</Text>
                        <Text style={{fontSize:px(28),color:'#4A4A4A',marginLeft:px(20)}}>{status}</Text>
                    </View>
                </View>
                {
                    !IsEmpty(attributes) ?
                    <View style={styles.middleLine} onClick={()=>{this.props.showAttrDialog()}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:px(28),color:'#979797'}}>商品属性:</Text>
                            <Text style={styles.attrText}>{attributes}</Text>
                        </View>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                            <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#979797'}}/>
                        </View>
                    </View>
                    :
                    ''
                }
                {consignPrice}
            </View>
        );
    }
}
