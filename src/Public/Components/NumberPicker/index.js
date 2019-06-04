import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Input} from '@tarojs/components';
import ItemIcon from '../ItemIcon';
/**
 * @author cy
 * 数字选择器
 */
export default class NumberPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue:0
        };
    }

    render(){

        return (
            <View>
                <View>
                    <ItemIcon code={"\ue6b9"}/>
                </View>
                <Input />
                <View></View>
            </View>
        );
    }
}
