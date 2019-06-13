import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Toast } from '@ant-design/react-native';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 字体图标
 * 参数 code 转义字符
 *     boxStyle 外框样式
 *     iconStyle 字体图标样式
 *     onClick 点击事件
 */
export default class ItemIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            platform:'ios'
        }
    }

    componentWillMount(){
        Taro.getSystemInfo({
            success:(result)=>{
                platform = result.platform;
                this.setState({
                    platform:platform
                });
            }
        });
    }

    render(){
        let boxStyle='';//外框样式
        let iconStyle='';//图标样式
        if (this.props.boxStyle) {
            boxStyle=this.props.boxStyle;
        }else {
            boxStyle={};
        }

        if (this.props.iconStyle) {
            iconStyle=this.props.iconStyle;
        }else {
            iconStyle={};
        }

        let content=null;//内容部分
        let platformStyle = {};
        if (this.state.platform == "android") {
            platformStyle = {'marginTop':px(-24)};
        }
        
        if (this.props.onClick) {
            content=
            <View style={[boxStyle,platformStyle]} onClick={this.props.onClick}>
                <Text style={[iconStyle,{'fontFamily':'iconfont','fontStyle':'normal'}]}>{this.props.code}</Text>
            </View>;
        } else {
            content=
            <View style={[boxStyle,platformStyle]}>
                <Text style={[iconStyle,{'fontFamily':'iconfont','fontStyle':'normal'}]}>{this.props.code}</Text>
            </View>;
        }

        return content

    }
}
