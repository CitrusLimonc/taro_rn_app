import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Modal } from '@ant-design/react-native';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import styles from './styles';
import px from '../../Biz/px.js';

/**
 * @author cy
 * 对话框
 */
export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false
        };
    }
    
    // componentWillReceiveProps(nextProps){
    //     if(!IsEmpty(nextProps.visible) && nextProps.visible != this.state.visible){
    //         this.setState({
    //             visible:nextProps.visible
    //         });
    //     }
    // }

    //隐藏
    hide = () =>{
        this.setState({
            visible:false
        });
    }

    //显示
    show = () =>{
        this.setState({
            visible:true
        });
    }


    render(){
        // console.log('----------render Dialog----------',JSON.stringify(this));
        if (this.state.visible) {
            // return (
            //     <Modal 
            //     style={!IsEmpty(this.props.style) ? this.props.style : {}}
            //     visible={!IsEmpty(this.props.visible) ? this.props.visible : this.state.visible}
            //     maskClosable = {!IsEmpty(this.props.maskClosable) ? this.props.maskClosable : false}
            //     closable = {!IsEmpty(this.props.closable) ? this.props.closable : false}
            //     >
            //         {this.props.children}
            //     </Modal>
            // );
            return (
                <View style={styles.maskStyle} onClick={()=>{
                    if (this.props.maskClosable) {
                        this.hide();
                        if (this.props.onHide) {
                            this.props.onHide();
                        }
                    }
                }}>
                    <View style={[styles.dialogContent,!IsEmpty(this.props.contentStyle) ? this.props.contentStyle : {}]}>
                        {this.props.children}
                    </View>
                </View>
            );
        } else {
            return null;
        }

    }
}
