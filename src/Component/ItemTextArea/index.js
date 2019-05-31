import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Icon, Input, Radio } from '@tarojs/components';
import px from '../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 带字数提示的文本域
 * （缺失可再添加）
 * 属性：1、value(默认内容)
 *      2、triangle(角标)
 *      3、height(高度/如:height="200rem")
 *      4、maxLength:'最大字符数'
 *      5、prompt:'是否带提示信息'
 *      6、test:'是否带检测信息'
 *      7、disabled:'是否可编辑'
 *      8、id:'数字或字符'，用于Radio.Group中,当前Radio的id
 *        checked:'数字或字符',当前Group选中的Radio的id
 *      9、getValue 父组件获取value值
 */
export default class ItemTextArea extends Component {
    constructor(props) {
        super(props);
        this.state={
            wordNum:0,
            value:this.props.value,
            check:this.props.radio
        }
    }
    //获得输入框中的内容并判断长度
    changeWords =(e)=>{
        let string=e.value;
        let length=string.replace(/[\u0391-\uFFE5]/g,"aa").length;
        this.setState({
            wordNum:length
        });
        this.props.getValue(string);

    }
    //调用组件时若自带value，则将value放进文本域中并计算字符数
    componentWillMount(){
        // console.log("componentWillMount",this.props.value);
        // console.log("componentWillMount props",this.props.value);
        if (this.props.value) {
            this.setState({
                wordNum:this.props.value.replace(/[\u0391-\uFFE5]/g,"aa").length
            });
        }
    }

    changeRadio=()=>{
        this.setState({
            check:!this.state.check
        })
    }

    render(){
        //是否带检测信息
        let text='';
        if (this.props.test) {
            if (this.state.wordNum==0) {
                text=<Text style={styles.placehold}>{this.props.test}</Text>;
            }
        }

        let num='';
        if (this.props.maxLength) {
            num=
            <View style={{flex:1}}>
                <Text style={this.state.wordNum>this.props.maxLength?styles.overText:styles.normalText}>{this.state.wordNum}/{this.props.maxLength}</Text>
            </View>;
        }

        let radio='';
        if (this.props.radio) {
            radio=
            <View onClick={this.changeRadio} style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <Radio size="small" value={this.props.id} style={styles.radio} checked={this.props.id==this.props.checked?true:false}/>
                <Text style={this.props.id==this.props.checked ? styles.activeRadio:styles.radioText}>默认短语</Text>
            </View>;
        }

        let disabled=false;
        if (this.props.disabled) {
            disabled=true;
        }

        return (
            <View style={styles.memoContent}>
                <Input style={[styles.textArea,{height:this.props.height}]}
                value={this.props.value}
                multiple={true}
                maxLength={this.props.maxLength}
                onInput={(e)=>{this.changeWords(e)}}
                disabled={disabled}
                placeholder={this.props.placeholder ? this.props.placeholder:''} rows={5}/>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:px(15)}}>
                    {radio}
                    {num}
                    {text}
                </View>
            </View>
        );
    }
}
