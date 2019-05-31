import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Image } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import px from '../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 单个卡片 未代销
 */
export default class OneGoodsCard extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {productInfo} = this.props;
        if(!IsEmpty(productInfo)){
            return (
                <View style={styles.productLine}>
                    <View style={styles.productImg}>
                        <Image src={productInfo.picUrl} style={{width:px(136),height:px(136)}}/>
                        {
                            productInfo.is_daixiao == '0' ?
                            <View style={styles.notTag}>
                                <Text style={styles.tagText}>未代销</Text>
                            </View>
                            :
                            ''
                        }
                    </View>
                    <View style={{marginLeft:px(8)}}>
                        <Text style={{width:px(544),fontSize:px(28),color:'#4a4a4a'}}>{productInfo.title}</Text>
                        <View style={{flex:1,flexDirection:'row',marginTop:px(8)}}>
                            <Text style={{fontSize:px(24),color:'#666666'}}>货号：{productInfo.productCargoNumber}</Text>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <Text style={{fontSize:px(24),color:'#666666'}}>库存：{productInfo.amountOnSale}</Text>
                            </View>
                        </View>
                        <Text style={{fontSize:px(24),color:'#666666',marginTop:px(8)}}>价格：{productInfo.price}</Text>
                    </View>
                </View>
            );
        } else {
            return '';
        }
    }
}
