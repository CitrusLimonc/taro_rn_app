import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button,Input} from '@tarojs/components';
import styles from './styles';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork';
import AiyongDialog from '../../Component/AiyongDialog';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty';
import {Domain} from '../../Env/Domain';
import ItemIcon from '../../Component/ItemIcon';
import {DoBeacon} from '../../Public/Biz/DoBeacon';


/**
 * @author wzm
 * 扫描二维码开旺铺
 */
export default class Gocum extends Component {
    constructor(props){
        super(props);
        this.state={
            inputname:'',
            bindname:'',
            shopid:'',
            shopname:'',
            loginId:'',
            bindbutton:false,
            inputbutton:false,
        }
        this.userNick = '';

    }

    // config: Config = {
    //     navigationBarTitleText: '开通旺铺'
    // }

    componentWillMount(){
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.userNick = info.extraInfo.result.loginId;
        //     } else {
        //         self.userNick = info.nick;
        //     }
        // });
    }


    //修改店铺名称
    inputname = (value) =>{
        this.state.inputname = value;
    }

    //获取绑定码
    bindname = (value) =>{
        this.state.bindname = value;
    }

    //创建微信店铺
    creatWD =()=>{
        DoBeacon('TD20181012161059','ownshop_create_click',this.userNick);
        let self = this;
        this.setState({
            inputbutton:true,
        })
        this.refs.creatWD.wrappedInstance.blur();
        setTimeout(()=>{
            if(IsEmpty(this.state.inputname)){
                Taro.showToast({
                    title: '店铺名不能为空',
                    icon: 'none',
                    duration: 2000
                });
                self.setState({
                    inputbutton:false,
                })
                return;
            }
            Taro.showLoading({ title: '加载中...' });
            NetWork.Get({
                url:'Distributeproxy/bindShopInfoWC',
                // host:Domain.ITEM_TEST_URL,
                data:{
                    shopType:'wc',
                    shopName:this.state.inputname,
                }
            },(data)=>{
                self.setState({
                    inputbutton:false,
                })
                if(data.code == 200){
                    self.getShops((result)=>{
                        if (!IsEmpty(result)) {
                            self.setState({
                                shopList:result
                            });
                            let shopid='';
                            let shopname = '';
                            for(let i=0;i<result.length;i++){
                                if(result[i].shop_type=='wc'){
                                    shopid = result[i].id;
                                    shopname = result[i].shop_name;
                                }
                            }
                            let shopnamenew = encodeURI(shopname);
                            GoToView({status:'Openwd',query:{shopid:shopid,shopname:shopnamenew}});
                        }
                        self.refs.addDialog.hide();
                        Taro.hideLoading();
                    });
                }else{
                    Taro.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 2000
                    });
                    Taro.hideLoading();
                }
            },(error)=>{
                self.setState({
                    inputbutton:false,
                })
                Taro.hideLoading();
            });
        },1000);
    }
    //绑定店铺
    BindWD =()=>{
        DoBeacon('TD20181012161059','ownshop_add_click',this.userNick);
        let self = this;
        self.setState({
            bindbutton:true,
        })
        this.refs.BindWD.wrappedInstance.blur();
        setTimeout(()=>{
            if(IsEmpty(this.state.bindname)){
                Taro.showToast({
                    title: '绑定码不能为空',
                    icon: 'none',
                    duration: 2000
                });
                self.setState({
                    bindbutton:false,
                })
                return;
            }
            Taro.showLoading({ title: '加载中...' });
            let token = encodeURIComponent(this.state.bindname);
            NetWork.Get({
                url:'dishelper/bindWx',
                host:Domain.WECHART_URL,
                data:{
                    getToken:token,
                }
            },(data)=>{
                self.setState({
                    bindbutton:false,
                })
                if(data.code == 200){
                    Taro.showToast({
                        title: '绑定成功，您可以直接铺货到爱用旺铺',
                        icon: 'none',
                        duration: 2000
                    });                  
                }else if(data.code ==504){
                    self.refs.bind.show();
                }else{
                    Taro.showToast({
                        title: data.value,
                        icon: 'none',
                        duration: 2000
                    }); 
                }
                Taro.hideLoading();
            },(error)=>{
                self.setState({
                    bindbutton:false,
                })
                Taro.showToast({
                    title: '绑定失败',
                    icon: 'none',
                    duration: 2000
                });                   
                Taro.hideLoading();
            });
        },1000);
    }
    render(){
        return (
            <View>
                <View style={styles.body}>
                    <View style={styles.TopBody}>
                        <Image src='https://q.aiyongbao.com/1688/web/img/preview/mySpaceLogo.png' style={styles.TopBodyPic}></Image>
                        <Text style={styles.TopBodyText}>独立站</Text>
                    </View>
                    <Text style={styles.TipText}>代发助手支持铺货到您自己的独立店铺，如果您还没有独立店铺，可以免费使用代发助手为您创建的专属店铺</Text>
                    <Text style={styles.TitleText}>1.我已经有自己的独立店铺</Text>
                    <View style={styles.TitleBody}>
                        <Input ref={'BindWD'} onChange={(value,e)=>{this.bindname(value)}} placeholder={'请输入您的绑定码，点击授权添加'} style={styles.TitleInput}></Input>
                        <Button disabled={this.state.bindbutton} type="secondary" onClick={()=>{this.BindWD()}}  style={styles.TitleButton}>授权添加</Button>
                    </View>
                    <Text style={styles.TitleText}>2.我想创建一个专属店铺</Text>
                    <View style={styles.TitleBody}>
                        <Input ref={'creatWD'} maxLength={12} onChange={(value,e)=>{this.inputname(value)}} placeholder={'输入想要的店名，然后点击”创建店铺”'} style={styles.TitleInput}></Input>
                        <Button disabled={this.state.inputbutton} type="secondary" onClick={()=>{this.creatWD()}} style={styles.TitleButton}>创建店铺</Button>
                    </View>
                    <Text style={styles.TipRed}>*已有店铺或绑定码的用户请勿重复创建店铺，否则会导致店铺数据异常，无法恢复</Text>
                    <View style={styles.wangwangbody} onClick={()=>{UitlsRap.openChat('爱用科技1688')}}>
                        <Text style={styles.wangwangLeft}>添加店铺遇到问题？</Text>
                        <Text style={styles.wangwangRight}>联系我们</Text>
                        <ItemIcon iconStyle={styles.wangwangicon} name="\ue6ba"/>
                    </View>
                </View>
                <AiyongDialog
                maskClosable={true}
                ref={"bind"}
                title={"未能识别你的店铺类型"}
                cancelText={"我知道了"}
                okText={"联系客服"}
                content={"抱歉，暂不支持铺货到您输入的店铺，请联系客服为您接入铺货服务"}
                onSubmit={()=>{UitlsRap.openChat('爱用科技1688')}}
                onCancel={()=>{this.refs.bind.hide()}}
                />
            </View>
        );
    }
}
