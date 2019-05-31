import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import px from '../../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 状态
 */
export default class Foot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice:this.props.totalPrice
        }
    }
    componentWillReceiveProps(nextProps){
        let totalPrice=this.state.totalPrice;//当前所选个数
        if (this.state.totalPrice!=nextProps.totalPrice) {
            totalPrice=nextProps.totalPrice;
        }
        
        this.setState({
            totalPrice:totalPrice
        });
    }

    btnOptions = (text) =>{
        switch (text) {
            case '批量付款':{
                this.props.goToPay();
            } break;
            default:break;
        }
    }

    render(){
        //console.log(this.state.totalPrice);
        return (
            <View style={styles.footBottom}>
                <View style={styles.footTop}>
                    <Text style={{fontSize:px(28),color:'#000'}}>合计应付款</Text>
                    <View style={{flex:1,justifyContent:'flex-end',flexDirection:'row'}}>
                        <Text style={{fontSize:px(32),color:'#ff6000'}}>￥{this.state.totalPrice}</Text>
                    </View>
                </View>
                <View style={styles.footBtn} onClick={()=>{this.btnOptions('批量付款')}}>
                    <Text style={styles.footText}>批量付款</Text>
                </View>
            </View>
            
        );
    }
}
