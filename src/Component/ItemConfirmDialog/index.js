import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Dialog } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import px from '../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 对话框
 * 参数：content 内容
 *      cancel 取消操作
 *      submit 确认操作
 *      title 标题
 *      ref 命名
 *      visble 是否显示
 *      color  确认按钮的背景色
 *      textColor  确认按钮的字色
 *      cancelText  取消按钮文字
 *      okText  确认按钮文字
 */
export default class ItemConfirmDialog extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUpdate(nextProps){
        if (!IsEmpty(nextProps.visible)) {
            if(nextProps.visible){
                this.refs.sureDialog.show();
            }else {
                this.refs.sureDialog.hide();
            }
        }
    }

    //取消操作
    cancel = () =>{
        this.props.cancel();
    }

    //确认操作并隐藏
    submit = () =>{
        this.props.submit();
    }

    //弹窗显示
    show = () =>{
        this.refs.sureDialog.show();
    }
    //弹窗隐藏
    hide = () =>{
        this.refs.sureDialog.hide();
    }

    render(){
        console.log('----------render confrimDialog----------');
        return (
            <Dialog ref={"sureDialog"} duration={1000} maskStyle={styles.maskStyle} contentStyle={styles.modal2Style}>
                <View style={styles.dialogContent}>
                    <Text style={{marginTop:px(15),fontSize:px(38),fontWeight:'300',color:'#4A4A4A',marginLeft:px(25)}}>{this.props.title}</Text>
                    {this.props.content}
                    <View style={styles.foot}>
                        <View style={styles.footBtn} onClick={this.cancel}>
                            <Text style={styles.fontStyle}>{this.props.cancelText ? this.props.cancelText : '取消'}</Text>
                        </View>
                        <View style={[styles.submitBtn,{backgroundColor:this.props.color}]} onClick={this.submit}>
                            <Text style={[styles.fontStyle,{color:this.props.textColor}]}>{this.props.okText ? this.props.okText : '确定'}</Text>
                        </View>
                    </View>
                </View>
            </Dialog>
        );
    }
}
