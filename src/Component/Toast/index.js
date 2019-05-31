/**
 * toast 弹框组件
 *  type: success || fail || loading    弹框类型
 *  content:    主体内容
 *  [title]:    标题 （默认：'温馨提示'）
 *  [button]:   按钮 （默认：'我知道了'）
 *  [callback]: 回调事件 （默认：function(){}）
 *  [duration]: 延时 （默认：-1 不自动隐藏）
 *
 * @Author: Lin
 * @Date: 2018-01-29 15:13:00
 * @Last Modified by: Lin
 * @Last Modified time: 2018-03-01 16:04:29
 */
import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Dialog } from '@tarojs/components';
import styles from './styles';
import ItemIcon from '../ItemIcon';
import px from '../../Biz/px.js';

export default class Toast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            content: this.props.content,
            title: this.props.title || '温馨提示',
            button: this.props.button || '我知道了',
            duration: this.props.duration || -1,
            callback: this.props.callback || function(){},
        };
        this.setTimeout;    /* 定时器 */
    }

    componentWillReceiveProps(nextProps) {
        let param = {};
        if(nextProps.content != this.state.content){
            param.content = nextProps.content;
        }

        if(param){
            this.setState({
                ...param
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.duration!=this.state.duration){
            clearTimeout(this.setTimeout);
            if(nextState.duration!=-1){
                let self = this;
                this.setTimeout = setTimeout(() => {
                    self.hide();
                }, nextState.duration);
            }
        }

        if(nextState.content != this.state.content){
            return true;
        }
    }


    show=()=>{
        this.refs.toast.show();
        if(this.state.duration != -1){
            let self = this;
            this.setTimeout = setTimeout(() => {
                self.hide();
            }, self.state.duration);
        }
    }
    hide=()=>{
        this.state.callback();
        this.refs.toast.hide();
    }

    btnOnClick=()=>{
        this.hide();
        // this.state.callback();
    }

    render(){
        let contentStyle = this.state.type == 'fail' ? styles.dialogContainer : styles.dialogContainer2;
        let body = '';
        
        switch(this.state.type){
            case 'fail':
                body = (
                    <View style={{flexDirection:'column'}}>
                        <View style={styles.dialogTitle}>
                            <ItemIcon code={"\ue666"} iconStyle={{width:px(50),color:'#E41010',fontSize:px(50),marginRight:px(15)}}  />
                            <Text style={styles.dialogTitleText}>{this.state.title}</Text>
                        </View>
                        <View style={styles.dialogBody}>
                            <Text style={styles.dialogBodyText}>{this.state.content}</Text>
                        </View>
                        <View style={styles.dialogButton} onClick={this.btnOnClick}>
                            <Text style={styles.dialogButtonText}>{this.state.button}</Text>
                        </View>
                    </View>
                );
                break;
            case 'success':
                body = (
                    <View style={styles.dialogBody2}>
                        <ItemIcon code={"\ue6b1"} iconStyle={{width:px(64),color:'#1DC11D',fontSize:px(64),marginLeft:px(24),marginRight:px(15)}}  />
                        <Text style={styles.dialogBodyText2}>{this.state.content}</Text>
                    </View>
                );
                break;
            case 'warning':
            body = (
                <View style={styles.dialogBody2}>
                    <ItemIcon code={"\ue6b6"} iconStyle={{width:px(64),color:'#ff6000',fontSize:px(64),marginLeft:px(24),marginRight:px(15)}}  />
                    <Text style={styles.dialogBodyText2}>{this.state.content}</Text>
                </View>
            );
            break;
            case 'loading':
                body = (
                    <View style={styles.dialogBody2}>
                        <ItemIcon code={"\ue65a"} iconStyle={{width:px(64),color:'#e6e6e6',fontSize:px(64),marginLeft:px(24),marginRight:px(15)}}  />
                        <Text style={styles.dialogBodyText2}>{this.state.content}</Text>
                    </View>
                );
        }

        return (
            <Dialog ref='toast' contentStyle={contentStyle} maskClosable={false}>
                {body}
            </Dialog>
        );

    }
}
