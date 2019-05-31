import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Switch} from '@tarojs/components';
import styles from './styles';
/*
* @author cy
* 开关卡片
*/
export default class SwitchLine extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {isOpen,title,desc,onValueChange,id} = this.props;
        return (
            <View style={styles.shopLine}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.descText}>{desc}</Text>
                <View style={styles.switchLine}>
                    <Switch defaultChecked={isOpen} onValueChange={(value)=>{onValueChange(value,id)}}/>
                </View>
            </View>
        );
    }
}
