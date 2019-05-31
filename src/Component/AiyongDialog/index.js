import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import px from '../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 对话框
 */
export default class AiyongDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false
        }
    }

    componentWillReceiveProps(nextProps){
        if(!IsEmpty(nextProps.visible) && nextProps.visible != this.state.visible){
            this.setState({
                visible:nextProps.visible
            });
        }
    }

    //隐藏
    hide = () =>{
        this.setState({
            visible:false,
        });
    }

    //显示
    show = () =>{
        this.setState({
            visible:true
        });
    }

    //取消操作
    cancel = () =>{
        this.props.onCancel();
    }

    //确认操作
    submit = () =>{
        this.props.onSubmit();
    }


    render(){
        console.log('----------render Dialog----------',this.state.visible);
        if (this.state.visible) {
            return (
                <View style={styles.maskStyle} onClick={()=>{
                    if (this.props.maskClosable) {
                        this.hide();
                        if (this.props.onHide) {
                            this.props.onHide();
                        }
                    }
                }}>
                    <View style={styles.dialogContent}>
                        {
                            this.props.title ?
                            <Text style={{marginTop:px(15),fontSize:px(38),color:'#4A4A4A',marginLeft:px(25)}}>{this.props.title}</Text>
                            :
                            ''
                        }
                        <View style={styles.tokenBody}>
                            <Text style={{fontSize:px(32),color:'#333333',width:px(564)}}>{this.props.content}</Text>
                        </View>
                        <View style={styles.foot}>
                            <View style={styles.footBtn} onClick={this.cancel}>
                                <Text style={styles.fontStyle}>{this.props.cancelText ? this.props.cancelText : '取消'}</Text>
                            </View>
                            <View style={styles.submitBtn} onClick={this.submit}>
                                <Text style={[styles.fontStyle,{color:"#ffffff"}]}>{this.props.okText ? this.props.okText : '确定'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else {
            return '';
        }

    }
}
