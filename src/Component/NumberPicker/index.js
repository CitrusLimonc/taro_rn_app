import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , Input } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import styles from './styles';
/**
 * @author cy
 * 数字选择器
 */
export default class NumberPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:!IsEmpty(this.props.value) ? this.props.value : 0,
            step:!IsEmpty(this.props.step) ? this.props.step : 1,
            maxValue:!IsEmpty(this.props.maxValue) ? this.props.maxValue : 999999999,
            minValue:!IsEmpty(this.props.minValue) ? this.props.minValue : 0
        };
    }
    
    componentWillReceiveProps(nextProps){
        let {value,step,maxValue,minValue} = this.state;
        let datas = {};
        if (!IsEmpty(nextProps.value) && nextProps.value != value) {
            datas.value = nextProps.value;
        }
        if (!IsEmpty(nextProps.step) && nextProps.step != step) {
            datas.step = nextProps.step;
        }
        if (!IsEmpty(nextProps.maxValue) && nextProps.maxValue != maxValue) {
            datas.maxValue = nextProps.maxValue;
        }
        if (!IsEmpty(nextProps.minValue) && nextProps.minValue != minValue) {
            datas.minValue = nextProps.minValue;
        }

        if (!IsEmpty(datas)) {
            this.setState({
                ...datas
            }); 
        }
    }

    changeVal = (type) =>{
        let {value,step,maxValue,minValue} = this.state;
        if (type == "add") {
            value = value + step;
        } else if (type == "sub") {
            value = value - step;
        }

        if (value > maxValue) {
            value = maxValue;
        } else if (value < minValue) {
            value = maxValue;
        }

        this.setState({
            value:value
        });
    }

    onInput = (e) =>{
        let value = e.target.value;

        this.setState({
            value:value
        });
    }


    render(){
        let {value} = this.state;
        return (
            <View style={styles}>
                <View style={styles.box} onClick={()=>{this.changeVal('add')}}>
                    <Text style={styles.textStyle}>-</Text>
                </View>
                <Input value={value} style={styles.inputBox} onInput={(e)=>{this.onInput(e)}}/>
                <View style={styles.box} onClick={()=>{this.changeVal('sub')}}>
                    <Text style={styles.textStyle}>+</Text>
                </View>
            </View>
        );
    }
}
