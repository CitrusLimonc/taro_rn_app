import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Button} from '@tarojs/components';
import px from '../../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 状态
 */
export default class ChooseStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chooseNum:this.props.chooseNum
        }
    }
    componentWillReceiveProps(nextProps){
        let chooseNum=this.state.chooseNum;//当前所选个数
        if (this.state.chooseNum!=nextProps.chooseNum) {
            chooseNum=nextProps.chooseNum;
        }
        
        this.setState({
            chooseNum:chooseNum
        });
    }

    render(){
        //console.log(this.state.chooseNum);
        return (
            <View style={styles.batchHead}>
                <Button type="normal"
                style={styles.cancelBtn}
                onClick={this.props.cancelBatch}
                >取消</Button>
                <View style={styles.cancelTouch}
                onClick={this.props.cancelBatch}>
                </View>
                <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{textAlign:'center',fontSize:px(28)}}>已选择 {this.state.chooseNum} / 10 项</Text>
                </View>
                <View style={{flex:1,alignItems:'flex-end',marginRight:px(-20),position:"relative",right:px(0),top:px(0)}}>
                </View>
            </View>
        );
    }
}
