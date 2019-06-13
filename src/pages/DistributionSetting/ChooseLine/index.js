import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Switch} from '@tarojs/components';
import ItemIcon from '../../../Component/ItemIcon';
import styles from './styles';
import px from '../../../Biz/px.js';
/**
 * @author cy
 * 设置行组件
 * callback 回调
 * title 主标题
 * subTitle 副标题
 * type nomal/switch
 */
export default class ChooseLine extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const {callback,title,subTitle,type} = this.props;
        return (
            <View style={styles.commonLine} onClick={()=>{callback('none',title)}}>
                <View>
                    <Text style={{fontSize:px(32),color:'#030303'}}>{title}</Text>
                    <Text style={{fontSize:px(28),color:'#8F8E94',marginTop:px(12)}}>{subTitle}</Text>
                </View>
                <View style={styles.commonRight}>
                {
                    type == 'normal' ?
                    <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(32),color:'#979797'}}/>
                    :
                    <Switch checked={this.props.switch} onValueChange={(value)=>{callback(value,title)}}/>
                }
                </View>
            </View>
        );
    }
}
