import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import styles from './styles';
/**
 * @author cy
 * 按钮
 * style 按钮样式
 * textStyle 文字样式
 * type  按钮类型  normal/primary/secondary/warning
 * disabled 是否禁用 true/false
 * onClick 点击事件
 */
export default class AyButton extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        let textStyle = {};
        if (!IsEmpty(this.props.textStyle)) {
            textStyle = this.props.textStyle
        }
        let viewStyle = {};
        if (!IsEmpty(this.props.style)) {
            viewStyle = this.props.style;
        }

        let type = !IsEmpty(this.props.type) ? this.props.type: "normal";

        let btnType = 'btn_' + type;
        let textType = 'text_' + type;

        let disabled = !IsEmpty(this.props.disabled) ? this.props.disabled:false;
        if (disabled) {
            btnType = 'btn_disabled';
            textType = 'text_disabled';
        }
        return (
            <View style={[styles[btnType],viewStyle]} onClick={()=>{
                if(this.props.onClick && !disabled){
                    this.props.onClick();
                }
            }}>
                <Text style={[styles[textType],textStyle]} onClick={()=>{
                    if(this.props.onClick && !disabled){
                        this.props.onClick();
                    }
                }}>
                    {this.props.children}
                </Text>
            </View>
        );
    }
}
