import Taro, { Component, Config } from '@tarojs/taro';
import {ScrollView,View,Text,Image,Dialog} from '@tarojs/components';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import SwitchLine from './SwitchLine';
import ItemIcon from '../../Component/ItemIcon';
import styles from './styles';

/*
 * 公众号通知设置
 * @author cy
 */
export default class WechartMsg extends Component {
    constructor(props) {
        super(props);
        this.state={
            list:[],
            isLoading:true,
            isOpen:false,
            imageUrl:'',
            openId:'',
            relationId:''
        };
        let self = this;
        // RAP.on('back',function(e){
        //     if (self.state.isOpen) {
        //         GoToView({page_status:'pop'});
        //     } else {
        //         self.getList((rsp)=>{
        //             if (!IsEmpty(rsp)) {
        //                 self.setState({
        //                     list:rsp.list,
        //                     isOpen:rsp.isOpen,
        //                     imageUrl:rsp.imageUrl,
        //                     openId:rsp.openId,
        //                     relationId:rsp.relationId
        //                 });

        //                 if (!rsp.isOpen) {
        //                     GoToView({page_status:'pop'});
        //                 } else {
        //                     RAP.emit('APP.reload_wechart_msg',{
        //                         isOpen:true,
        //                         needShow:false,
        //                     });
        //                 }
        //             } else {
        //                 GoToView({page_status:'pop'});
        //             }
        //         });
        //     }
        // });
    }

    // config: Config = {
    //     navigationBarTitleText: '消息通知'
    // }

    componentWillMount(){
        // SetTitle({"text": "消息通知"});
    }

    componentDidMount(){
        Taro.showLoading({ title: '加载中...' });
        this.getList((rsp)=>{
            if (!IsEmpty(rsp)) {
                this.setState({
                    list:rsp.list,
                    isOpen:rsp.isOpen,
                    imageUrl:rsp.imageUrl,
                    openId:rsp.openId,
                    isLoading:false,
                    relationId:rsp.relationId
                });
            } else {
                this.setState({
                    isLoading:false
                });
            }
            Taro.hideLoading();
        });
    }

   
    //获取列表和用户设置
    getList = (callback) =>{
        NetWork.Get({
            url:'Wx/getWechartLists',
            data:{
                'needImg':'1'
            }
        },(rsp)=>{
            console.log('Wx/getWechartLists',rsp);
            if (!IsEmpty(rsp.msg)) {
                Taro.showToast({
                    title: rsp.msg,
                    icon: 'none',
                    duration: 2000
                });
                callback({});
            } else {
                callback(rsp);
            }
        },(error)=>{
            callback({});
            alert(JSON.stringify(error));
            Taro.hideLoading();
        });
    }

    //渲染店铺列表
    renderRow = () =>{
        let { list } = this.state;
        let doms = [] ;
        list.map((item,key) =>{
            let isOpen = item.isOpen == '0' ? false : true;
            doms.push(
                <SwitchLine
                    isOpen = {isOpen}
                    title = {item.title}
                    desc = {item.describe}
                    id = {item.id}
                    onValueChange = {this.changeSwitch}
                />
            );
        });
        return doms;
    }

    //修改开关
    changeSwitch = (value,id) =>{
        let {list} = this.state;
        list.map((item,key)=>{
            if (item.id == id) {
                list[key].isOpen = value ? '1' : '0';
            }
        });

        this.setState({
            list:list
        });

        this.updateSetting();
    }

    updateSetting = () =>{
        let {list,relationId} = this.state;
        let setting = [];
        list.map((item,key)=>{
            if (item.isOpen == '1') {
                setting.push(item.id);
            }
        });
        setting = setting.join(',');
        NetWork.Get({
            url:'Wx/changeWechartSet',
            data:{
                setting:setting,
                relationId:relationId
            }
        },(rsp)=>{
            console.log('Wx/changeWechartSet',rsp);
            if (!IsEmpty(rsp.code)) {
                if (rsp.code != '200') {
                    Taro.showToast({
                        title: rsp.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            } else {
                Taro.showToast({
                    title: "修改失败",
                    icon: 'none',
                    duration: 2000
                });
            }
        },(error)=>{
            console.log(error);
            Taro.showToast({
                title: "修改失败，网络错误，请稍后再试",
                icon: 'none',
                duration: 2000
            });
        });
    }

    changeImage = () =>{
        this.getList((rsp)=>{
            if (!IsEmpty(rsp)) {
                this.setState({
                    imageUrl:rsp.imageUrl,
                    openId:rsp.openId,
                    relationId:rsp.relationId
                });
                this.refs.codeDialog.show();
            } else {
                Taro.showToast({
                    title: "二维码获取失败",
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    }
  
    render() {
        let {isLoading,isOpen,imageUrl} = this.state;
        if (isLoading) {
            return '';
        }

        return (
            <View>
                <View style={{backgroundColor:'#fff',flex:1}}>
                    {
                        isOpen ?
                        <ScrollView style={{backgroundColor:'#f5f5f5'}}>
                            {this.renderRow()}
                            <View style={styles.shopLine} onClick={()=>{this.changeImage()}}>
                                <Text style={styles.titleText}>{"更改接收消息通知的账号"}</Text>
                                <View style={styles.switchLine}>
                                    <ItemIcon iconStyle={{fontSize:px(36),color:'#3D4145',height:px(36),width:px(36)}} code={"\ue6a7"}/>
                                </View>
                            </View>
                        </ScrollView>
                        :
                        <ScrollView style={{backgroundColor:'#fff',paddingBottom:px(80)}}>
                            <Image src={"https://q.aiyongbao.com/1688/web/img/wechar_msg.png"} style={{width:px(750),height:px(772)}}/>
                            <View style={styles.imgLine}>
                                <Image src={imageUrl} style={{width:px(350),height:px(350)}}/>
                            </View>
                        </ScrollView>
                    }
                    {
                        isOpen ?
                        ''
                        :
                        <View style={styles.btnBox} onClick={()=>{this.refs.codeDialog.show()}}>
                            <Text style={styles.btnText}>点击查看并截图保存到相册</Text>
                        </View>
                    }
                </View>
                <Dialog ref='codeDialog' duration={1000} contentStyle={styles.adStyle} maskClosable={true}>
                    <Image style={{width:px(600),height:px(600)}} src={imageUrl}/>
                    <Text style={[styles.btnText,{marginTop:px(80),fontSize:px(28)}]}>截图保存二维码到相册</Text>
                    <Text style={[styles.btnText,{marginTop:px(24),fontSize:px(28)}]}>微信扫码关注“代发助手服务号”，开通消息通知</Text>
                    <ItemIcon onClick={()=>{this.refs.codeDialog.hide();}} iconStyle={styles.close} code={"\ue69a"} />
                </Dialog>
            </View>
        );
    }
}