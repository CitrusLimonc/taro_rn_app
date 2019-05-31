import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Checkbox,Image,Button} from '@tarojs/components';
import styles from './styles';
/*
* @author cy
* 店铺卡片
*/
export default class ShopItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {hasAuth,checkboxStyle,isChecked,diaabledone,item} = this.props;
        return (
            <View style={styles.shopLinebody}>
                <View style={styles.shopLine}>
                    {
                        hasAuth == false ?
                        <View style={styles.authError}>
                            <Text style={{fontSize:px(24),color:'#ff6000'}}>店铺授权失效，请授权后再选择</Text>
                        </View>
                        :
                        ''
                    }
                    <Checkbox size="small" style={checkboxStyle} checked={isChecked} disabled={diaabledone} onChange={()=>{this.props.checkboxOnChange(item.id)}}/>
                    <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{
                        this.props.checkboxOnChange(item.id,hasAuth,item.shop_type)
                    }}>
                        <Image src={item.pic_url} style={styles.shopImage}/>
                        <Text style={{fontSize:px(28),color:'#4a4a4a',marginLeft:px(12),}}>{item.shop_name}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                    {
                        hasAuth == false ?<Button type="secondary" style={{width:px(152),height:px(56)}} onClick={()=>{this.props.sureAccess(item.shop_type,false,false,item.id)}}>去授权</Button>:''
                    }
                    </View>
                </View>
            </View>
        );
    }
}
