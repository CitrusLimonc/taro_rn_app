import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Button, Checkbox} from '@tarojs/components';
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
            nowPageStatus:this.props.nowPageStatus,
            chooseNum:this.props.chooseNum,
            checkedAll:this.props.checkedAll
        }
    }
    componentWillReceiveProps(nextProps){
        let chooseNum=this.state.chooseNum;//当前所选个数
        let checkedAll=this.state.checkedAll;//当前是否全选
        if (this.state.chooseNum!=nextProps.chooseNum) {
            chooseNum=nextProps.chooseNum;
            checkedAll=nextProps.checkedAll;
        }
        if (nextProps.chooseNum==0) {
            checkedAll=false;
        }

        this.setState({
            chooseNum:chooseNum,
            checkedAll:checkedAll
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
                    <Text style={{textAlign:'center',fontSize:px(28)}}>已选择“{this.state.nowPageStatus.status}”{this.state.chooseNum}项</Text>
                </View>
                <View style={{flex:1,alignItems:'flex-end',marginRight:px(-20),position:"relative",right:px(0),top:px(0)}}>
                    <Checkbox checked={this.state.checkedAll} size="small" style={{width:px(44),height:px(44)}} ></Checkbox>
                    <View onClick={()=>{this.props.chooseAll(!this.state.checkedAll)}} style={{width:px(80),height:px(80),position:"absolute",right:px(0),top:px(0)}}>

                    </View>
                </View>
            </View>
        );
    }
}
