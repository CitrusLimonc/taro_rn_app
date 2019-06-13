import Taro, { Component, Config } from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import {IsEmpty} from '../../Biz/IsEmpty.js';
import ItemIcon from '../ItemIcon';
import {GoToView} from '../../Biz/GoToView';
import {DoBeacon} from '../../Biz/DoBeacon';
import { NetWork } from '../../Common/NetWork/NetWork';
import {Domain} from '../../../Env/Domain.js';
import px from '../../Biz/px.js';

/**
 * @author wzm
 * 顶部悬浮窗
 * @author cy
 * 可配置
 */
export default class Floattop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setting:{}
        };
    }
    componentWillMount(){
        // this.getSetting();
    }

    getSetting = () =>{
        NetWork.Get({
            url:'Orderreturn/getBannerSetting',
            data:{
                from:Domain.Product
            }
        },(res)=>{
            console.log('Orderreturn/getBannerSetting',res);
            if (!IsEmpty(res.setting)) {
                this.setState({
                    setting:res.setting
                });
            }
        },(error)=>{
            console.error(error);
        });
    }

    //banner点击
    bannerOnClick=()=>{
        let {setting} = this.state;
        if(!IsEmpty(this.props.goto) && setting.needProps == '1'){
            this.props.goto();
        }else{
            if (!IsEmpty(setting.doBeacon)) {
                let doBeacon = setting.doBeacon;
                DoBeacon(doBeacon.number,doBeacon.name,doBeacon.nick);
            }
            if (!IsEmpty(setting.goToPage)) {
                let query = {};
                if (!IsEmpty(setting.query)) {
                    query = setting.query;
                }
                GoToView({status:'DistributionManage',query:query});
            }
            if (setting.needDelete == '1') {
                setting.isShow = '0';
                this.setState({
                    setting:setting
                });
            }
        }
    }


    render(){
        let {setting} = this.state;
        if (!IsEmpty(setting) && setting.isShow == '1' && !IsEmpty(setting.showMessage)) {
            return (
                <View onClick={()=>{this.bannerOnClick()}} style={{backgroundColor:'#FFF1E6',paddingLeft:px(24),paddingRight:px(24),width:px(750),height:px(80),flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <ItemIcon code={"\ue666"} iconStyle={{fontSize:px(32),color:'#ff6000'}}/>
                    <Text style={{flex:1,fontSize:px(24),color:'#666666',paddingLeft:px(24)}}>{setting.showMessage}</Text>
                    {
                        !IsEmpty(setting.goToPage) ? 
                        <ItemIcon code={"\ue6a7"}  iconStyle={{fontSize:px(32),color:'#999999'}}/>
                        :
                        setting.needDelete == '1' ?
                        <ItemIcon code={"\ue69a"}  iconStyle={{fontSize:px(32),color:'#999999'}}/>
                        :
                        null
                    }
                </View>
            );
        } else {
            return null;
        }

    }
}
