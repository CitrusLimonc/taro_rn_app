import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text,Image} from '@tarojs/components';
import {GoToView} from '../../Public/Biz/GoToView.js';
import { LocalStore } from '../../Public/Biz/LocalStore.js';
import TradeAyTabber from '../../Component/TradeAyTabber/index.js';
import ItemIcon from '../../Component/ItemIcon';
import { UitlsRap } from '../../Public/Biz/UitlsRap.js';
import {DoBeacon} from '../../Public/Biz/DoBeacon.js';
import { NetWork } from '../../Public/Common/NetWork/NetWork.js';
import px from '../../Biz/px.js';
import styles from './styles.js';

/**
*author lzy
*设置页面
*/
const list1=[
    {icon:'\ue7bf',txt:'店铺管理',color:'#81BEFF',fontSize:px(48),marginLeft:px(0),marginTop:px(0)},
    {icon:'\ue654',txt:'铺货设置',color:'#FFA873',fontSize:px(62),marginLeft:px(-6),marginTop:px(-10)},
    {icon:'\ue6bc',txt:'消息通知',color:'#49BC19',fontSize:px(48),marginLeft:px(0),marginTop:px(0)},
];
const list3=[{icon:'\ue68f',txt:'重新授权',color:'#4CD964'},{icon:'\ue64b',txt:'清除缓存',color:'#FFA033'},{icon:'\ue6ba',txt:'联系爱用客服',color:'#3BAFF7'},{icon:'\ue662',txt:'客服电话',color:'#579CFC'},{icon:'\ue71a',txt:'关于代发助手',color:'#4CD964'}]
export default class DistributionMy extends Component <{}, {}>{
    constructor(props) {
        super(props);
    }
    public state = {
        tap_check:['我的设置','更多信息'],
        checked:'我的设置',
        companyname:'',
        toux:'',
        loginId:'',
        version:'',
        distribute:'',
    }

    config: Config = {
        navigationBarTitleText: '我的'
    }

    componentWillMount(){
        let self = this;
        let now = new Date();
        //获取到期时间
        // NetWork.Get({
        //     url:'m1688/get_service_end',
        //     data:{
        //         type:"distribute"
        //     }
        // },(res)=>{
        //     let gmtServiceEnd='';
            // gmtServiceEnd=res.gmtServiceEnd.slice(0,10);
            self.setState({
                distribute:'1321414',
                companyname:'',
                toux:'',
                loginId:'萌晓月cy',
            });
        // },(error)=>{
        //     alert(JSON.stringify(error));
        // });
    }

    //切换tab
    checkStatus = (index) =>{
        var { tap_check } = this.state;
        this.state.checked = tap_check[index];
        this.setState({checked:this.state.checked});
    }

    //渲染更多信息页面
    listItemMore = (item,index)=>{
        return(
            <View key={index}>
                <View onClick={()=>{this.do(item.txt)}} style={styles.list_ix}>
                    <View style={styles.list_iy}>
                        <ItemIcon iconStyle={{fontSize:px(48),color:item.color}} code={item.icon}/>
                    </View>
                    {item.txt=='客服电话'?(
                        <View style={styles.list_iz_none}>
                            <Text style={styles.list_txt}>{item.txt}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:'#979797',fontSize:px(28),marginRight:px(15)}}>18116496170</Text>
                                <ItemIcon iconStyle={{fontSize:px(36),color:'#3D4145',height:px(36),width:px(36)}} code={"\ue6a7"}/>
                            </View>
                        </View>
                    ):(
                        <View style={styles.list_iz_none}>
                            <Text style={styles.list_txt}>{item.txt}</Text>
                            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                {
                                    item.txt == '关于代发助手' ?
                                    <Text style={{color:'#979797',fontSize:px(28),marginRight:px(15)}}>vx.x.x</Text>
                                    :
                                    ''
                                }
                                {
                                    item.txt == '关于代发助手' ?
                                    ''
                                    :
                                    <ItemIcon iconStyle={{fontSize:px(36),color:'#3D4145',height:px(36),width:px(36)}} code = {"\ue6a7"}/>
                                }
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.grey_view}/>
            </View>
        )
    }

    //操作
    do = (status)=>{
        switch(status){
            case '清除缓存':
                LocalStore.RemoveAll();
            break;
            case '联系爱用客服':
                UitlsRap.openChat('爱用科技1688');
            break;
            case '重新授权':
                // RAP.sso.goAuth('8869440');
            break;
            default:
            break;
        }
    }

    //跳转页面
    GoToPage = (status) =>{
        switch(status){
            case '铺货设置':
                GoToView({status:'DistributionSetting'});
            break;
            case '店铺管理':
                DoBeacon('TD20181012161059','mine_shop_click',this.state.loginId);
                GoToView({status:'DistributionShops',query:{from:'my',isfromself:'1'}});
            break;
            case '消息通知':
                GoToView({status:'WechartMsg'});
            default:
            break;
        }
    }

    getCheckView = (checked)=>{
        if (checked == '更多信息') {
            return (
                <View>
                    {list3.map((item,index)=>{
                        return this.listItemMore(item,index);
                    })}
                </View>
            );
        } else if (checked == '我的设置') {
            return (
                <View>
                    <View>
                        {list1.map((item,index)=>{
                            return(
                                <View key={index}>
                                    <View onClick={()=>{this.GoToPage(item.txt)}} style={styles.list_ix}>
                                        <View style={styles.list_iy}>
                                            <ItemIcon iconStyle={{fontSize:px(48),color:item.color,marginLeft:item.marginLeft,marginTop:item.marginTop}} code={item.icon}/>
                                        </View>
                                        <View style={styles.list_iz}>
                                            <Text style={styles.list_txt}>{item.txt}</Text>
                                            <ItemIcon iconStyle={{fontSize:px(36),color:'#3D4145',height:px(36),width:px(36)}} code={"\ue6a7"}/>
                                        </View>
                                    </View>
                                    <View style={styles.grey_view}/>
                                </View>
                            )
                        })}
                    </View>
                </View>
            );
        }
    }

    public render(){
        const { tap_check,checked,toux,loginId } = this.state;
        let checkview = this.getCheckView(checked);
        return (
            <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
               <View style={styles.head}>
                    <Image style={styles.img} src={`https://q.aiyongbao.com/1688/web/img/niutou.png`}/>
                    <Image style={styles.img2} src={`https://cbu01.alicdn.com/club/upload/pic/user/b/2/b/-/${toux}_s.jpeg`}/>
                    <View style={styles.mid_view}>
                        <Text style={styles.mid_text}>{loginId}</Text>
                        <Text style={styles.mid_textS}>服务到期时间：{this.state.distribute}</Text>
                    </View>
                    <View onClick={()=>{UitlsRap.openChat('爱用科技1688');}} style={styles.tap_view}>
                        <ItemIcon iconStyle={{fontSize:px(28),color:'#fff',}} code={'\ue602'}/>
                        <Text style={{marginLeft:px(5),color:'#FFFFFF',fontSize: px(28)}}>联系客服</Text>
                        <ItemIcon iconStyle={styles.new} code={"\ue6a7"}/>
                    </View>
               </View>
               <View style={{backgroundColor:'#fff'}}>
                   <TradeAyTabber taps={tap_check} checkStatus={this.checkStatus}/>
               </View>
               <View style={styles.grey_view}/>
               {checkview}
            </View>
        );
    }
}