import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text} from '@tarojs/components';
import ItemIcon from '../ItemIcon';
import styles from './styles.js';
/**
* @author lzy
* 卖家备忘
**/
export default class SellerMemo extends Component{
    constructor(props) {
        super(props);
    };

    render(){
        let icon = <ItemIcon onClick={this.props.ModifyMo} code={'\ue61f'} iconStyle={[styles.memoIcon,{color:'red'}]}/>
        switch(this.props.clo){
            case '1': icon = <ItemIcon onClick={this.props.ModifyMo} code={'\ue61f'} iconStyle={[styles.memoIcon,{color:'red'}]}/>
            break;
            case '2':icon = <ItemIcon onClick={this.props.ModifyMo} code={'\ue61f'} iconStyle={[styles.memoIcon,{color:'#34b2f8'}]}/>
            break;
            case '3':icon = <ItemIcon onClick={this.props.ModifyMo} code={'\ue61f'} iconStyle={[styles.memoIcon,{color:'#89d924'}]}/>
            break;
            case '4':icon = <ItemIcon onClick={this.props.ModifyMo} code={'\ue61f'} iconStyle={[styles.memoIcon,{color:'#fec80e'}]}/>
            break;
        }
        return (
            <View onClick={this.props.ModifyMo} style={styles.memo} >
                <View style={[styles.sellerText,{flex:1}]}>
                    <Text style={styles.seller}>卖家备注：</Text>
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
                <View onClick={this.props.ModifyMo} style={styles.iconView}>
                    {icon}
                </View>
            </View>
        )
    }
}
