import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import styles from './styles';
/**
 * @author cy
 * 状态
 */
export default class ProductStatus extends Component {
    constructor(props) {
        super(props);
        this.changeStaus=this.changeStaus.bind(this);
    }

    //改变状态
    changeStaus=(item)=>{
        this.props.changeStaus(item);
    }

    //获取所有状态
    getViews=()=>{
        let doms=[];
        this.props.pageStatus.map((item,key)=>{
            doms.push(
                <View style={this.props.nowPageStatus.status==item.status?styles.activeStatus:styles.statusItem} onClick={()=>{this.changeStaus(item)}}>
                    <Text style={[styles.normalText,this.props.nowPageStatus.status==item.status?styles.activeText:'']}>{item.status}</Text>
                </View>
            );
        });
        return doms;
    }
    render(){
        return (
            <View style={styles.statusList}>
                {this.getViews()}
            </View>
        );
    }
}
