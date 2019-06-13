import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Image } from '@tarojs/components';
import AyButton from '../../../Component/AyButton/index';
import OneGoodsCard from '../../../Component/OneGoodsCard';
import styles from './styles';
import px from '../../../Biz/px.js';
/**
 * @author cy
 * 头部
 */
export default class HeadLine extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {dataSource} = this.props;
        let shopUrl = '';
        switch (dataSource.shopType) {
            case 'taobao':{
                shopUrl = 'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png';
            } break;
            case 'pdd':{
                shopUrl = 'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png';
            } break;
            default: break;
        }
        let productInfo = dataSource.productInfo;
        return (
            <View style={{width:750}}>
                <View style={styles.topLine}>
                    <View style={styles.shopImgBox}>
                        <Image src={shopUrl} style={{width:px(60),height:px(60)}}/>
                    </View>
                    <Text style={{fontSize:px(32),color:'#4a4a4a',marginLeft:px(12)}}>{dataSource.shopName}</Text>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                        <AyButton type="primary">
                        关联商品设置
                        </AyButton>
                    </View>
                </View>
                <OneGoodsCard productInfo={productInfo}/>
            </View>
        );
    }
}
