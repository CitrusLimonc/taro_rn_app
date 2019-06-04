var Modal = {};
import Taro, { Component, Config } from '@tarojs/taro';
import { Dialog,View,Text,ScrollView,Image } from '@tarojs/components';
import Event from 'ay-event';
import { IsEmpty } from '../../Biz/IsEmpty';
import { GoToView } from '../../Biz/GoToView';
import ItemIcon  from '../../../Component/ItemIcon';
import px from '../../Biz/px.js';
/**
* @author lzy
*  弹窗0.0.2 以后会改成子节点渲染方法
*  0.0.1->0.0.2 增加了广告通用弹窗
**/

class AyDialog extends Component{
    constructor(props) {
        super(props);
        this.state={
            hadrender:false,//避免重复注册
            head:'温馨提示',
            foot:'',
            body:'爱用交易',
            contstytle:{},
            pic_url:'',
            link:'',
            type:'normal',
            imgStyle:{},
            maskStyle:{},
            onClick:()=>{},
            onCancel:()=>{}
        }
    }

    componentDidMount(){
        let self = this;
        if(!self.state.hadrender){
            self.state.hadrender = true;
            Event.on('Page.showmoda',(data)=>{
                if (this.state.type == 'normal') {
                    this.refs.hello.show();
                } else {
                    this.refs.modal1.show();
                }
            })
        }
    }

    openurl = (v) => {
        if (this.state.type == 'normal') {
            this.refs.hello.hide();
        } else {
            this.refs.modal1.hide();
        }
        if(IsEmpty(v)){
            return;
        }
        GoToView({status:v,page_status:'special'});
    }

    show=()=>{
        if (this.state.type == 'normal') {
            this.refs.hello.show();
        } else {
            this.refs.modal1.show();
        }
    }

    hide=()=>{
        if (this.state.type == 'normal') {
            this.refs.hello.hide();
        } else {
            this.refs.modal1.hide();
        }
    }

    render(){
        const { head,foot,body,contstytle,onClick,onCancel,pic_url,link,type,imgStyle,maskStyle } = this.state;
        let refstr = type=='normal'?"hello":"modal1";
        if(type=='normal'){
            return(
                <Dialog ref={refstr} duration={1000}  contentStyle={[styles.modalStyle,contstytle]} >
                    {isValidElement(head)?(
                        head
                    ):(
                        <View style={styles.head}>
                            <Text style={styles.head_txt}>
                                {head}
                            </Text>
                        </View>
                    )}
                    <ScrollView style={styles.body}>
                        {isValidElement(body)?(
                            body
                        ):(
                            <Text style={styles.body_txt}>
                                {body}
                            </Text>
                        )}
                    </ScrollView>
                    {isValidElement(foot)?(
                        foot
                    ):(
                        <View  style={[styles.foot]}>
                            <View onClick={()=>{this.refs.hello.hide();onClick();}} style={[styles.button,{backgroundColor:'#fff',borderBottomLeftRadius: px(10)}]}>
                                <Text style={{fontSize:px(32)}}>确定</Text>
                            </View>
                            <View onClick={()=>{this.refs.hello.hide();onCancel();}} style={[styles.button,{backgroundColor:'#FF4400',borderBottomRightRadius: px(10)}]}>
                                <Text style={{fontSize:px(32),color:'#fff'}}>取消</Text>
                            </View>
                        </View>
                    )}
                </Dialog>
            );
        }else{
            return (
                <Dialog ref={refstr} duration={1000} maskStyle={[styles.maskStyle,maskStyle]} contentStyle={[styles.adStyle,contstytle]} >
                    <Image onClick={()=>{
                        if(IsEmpty(link)){
                            onClick();
                        }else{
                            this.openurl(link);
                        }
                    }} style={[styles.imgStyle,imgStyle]} src={pic_url}/>
                    <ItemIcon  onClick={()=>{this.refs.modal1.hide();onCancel();}} iconStyle={styles.close} code={"\ue69a"} />
                </Dialog>
            )
        }
    }


}

const styles = {
    adStyle:{
        backgroundColor:'transparent',
        height:770,
        width:550,
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems: 'center',
    },
    modalStyle:{
        backgroundColor:'#fff',
        borderRadius:px(10),
        height:px(400),
        flexDirection: 'column',
        justifyContent:'flex-start'
    },
    head:{
        height:px(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    head_txt:{
        textOverflow:'ellipsis',
        lines:1,
        fontSize:px(36)
    },
    body:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        paddingLeft:px(24),
        paddingRight: px(24),
    },
    body_txt:{
        fontSize:px(32),
    },
    foot:{
        height:px(90),
        flexDirection: 'row',
        borderTopWidth: px(1),
        borderTopColor:'#e5e5e5',
    },
    button:{
        justifyContent:'center',
        alignItems: 'center',
        flex:1
    },
    imgStyle:{
        width:550,
        height:700,
        borderRadius: 10,
    },
    close:{
        color:'#fff',
        fontSize:42,
        borderWidth:'2',
        borderColor:'#fff',
        borderRadius: 21,
        marginTop:24,
    },
    maskStyle:{
        backgroundColor:'rgba(0,0,0,0.5)'
    }
}

Modal.AyDialog= AyDialog;

Modal.alert = (custom)=>{
    custom.element.setState({...custom});
    custom.element.show();
}

export { Modal };
