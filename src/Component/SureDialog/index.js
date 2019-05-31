import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import styles from './styles';
import px from '../../Biz/px.js';

/**
 * @author cy
 * 授权对话框
 */
export default class SureDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false
        };
        this.userId ='';
        this.userNick = '';
    }
    componentWillMount(){
        const self = this;
        self.userId = '2190174972';
        self.userNick = '萌晓月cy';
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
            visible:false
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
        if(this.props.lastShopType=='pdd'){
            GoToView({
                status:"https://zk1688.aiyongbao.com/auth/pddhtml?userid=" + this.userId+'&nick='+this.userNick,
                page_status:'special'
            });
        }else if(this.props.lastShopType=='taobao'){
            GoToView({
                status:"https://zk1688.aiyongbao.com/auth/taohtml?userid=" + this.userId+'&nick='+this.userNick,
                page_status:'special'
            });
        }else{
            UitlsRap.clipboard(this.props.authorizationLink.authorLink,()=>{
                Taro.showToast({
                    title: '授权链接已复制，请粘贴到浏览器内访问并授权',
                    icon: 'none',
                    duration: 2000
                });
            });
            // let message = GetAuthoraitionMessage(this.props.lastShopType,this.props.authorizationLink);
            // UitlsRap.sendMessage({
            //     loginid:'爱用科技1688',
            //     message:message
            // });
            // UitlsRap.openChat('爱用科技1688');
        }
        this.hide();
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
                        <View style={styles.tokenBody}>
                            <Text style={{fontSize:px(32),color:'#333333',width:px(564)}}>{"完成授权后，请根据情况点击下面按钮"}</Text>
                        </View>
                        <View style={styles.foot}>
                            <View style={styles.footBtn} onClick={this.cancel}>
                                <Text style={styles.fontStyle}>{'遇到问题'}</Text>
                            </View>
                            <View style={styles.submitBtn} onClick={this.submit}>
                                <Text style={[styles.fontStyle,{color:"#ffffff"}]}>{'完成授权'}</Text>
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
