'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text,Image } from '@tarojs/components';
import { IsEmpty } from '../../../Public/Biz/IsEmpty.js';
import { NetWork } from '../../../Public/Common/NetWork/NetWork.js';
import ItemIcon from '../../../Component/ItemIcon';
import px from '../../../Biz/px.js';
/**
 @aythor lzy
  首页
*/
export default class Body extends Component{
    constructor(props) {
        super(props);
        this.state = {
            companyname:'', //企业名称
            toux:'',
            loginId:'', //用户名
            distribute:''
        }
    }

    componentWillMount(){
        this.loadData();
    }
   
    //初始化信息
    loadData = () =>{
        //获取到期时间
        NetWork.Get({
            url:'m1688/get_service_end',
            data:{
                type:"distribute"
            }
        },(res)=>{
            let gmtServiceEnd='';
            // if (!IsEmpty(res.gmtServiceEnd)) {
            //     gmtServiceEnd=res.gmtServiceEnd.slice(0,10);
            // }
            this.setState({
                distribute:'2019-06-01',
                toux:'',
                loginId:'萌晓月cy',
            });
        },(error)=>{
            // alert(JSON.stringify(error));
            this.setState({
                distribute:'2019-06-01',
                toux:'',
                loginId:'萌晓月cy',
            });
        });
    }

    render(){
        const { toux,loginId,distribute } = this.state;
        return (
            <View style={{height:px(150)}}>
                <Image src={'https://q.aiyongbao.com/1688/newbg.png'} style={{width:px(750),height:px(150)}}/>
                <View style={[styles.i_head,{width:px(750)}]}>
                    <Image style={styles.img} src={`https://q.aiyongbao.com/1688/web/img/niutou.png`}/>
                    <Image style={styles.img2} src={`https://cbu01.alicdn.com/club/upload/pic/user/b/2/b/-/${toux}_s.jpeg`}/>
                    <View style={{flex:1,marginLeft:px(34)}}>
                        <Text style={{color:'#fff',fontSize:px(28)}}>{loginId}</Text>
                        <Text style={{color:'#fff',fontSize:px(24),marginTop:px(10)}}>服务到期时间：{distribute}</Text>
                    </View>
                </View>
                <View style={styles.ecode}>
                    <ItemIcon iconStyle={{fontSize:px(28),color:'#fff',}} code={'\ue602'}/>
                    <Text style={{fontSize:px(24),color:'#fff',marginLeft:px(5)}}>联系客服</Text>
                    <ItemIcon iconStyle={{fontSize:px(24),color:'#fff',marginLeft:px(5)}} code={'\ue6a7'}/>
                </View>
            </View>
        )
    }
}
const styles = {
    i_head:{
        position:'absolute',
        top:px(0),
        height:px(150),
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
    },
    img:{
        height: px(100),
        width: px(100),
        borderRadius: px(50),
        marginLeft:px(38)
    },
    img2:{
        height: px(100),
        width: px(100),
        borderRadius: px(50),
        position:'absolute',
        left:px(38),
        top:px(25)
    },
    ecode:{
        height: px(54),
        paddingRight:px(12),
        paddingLeft:px(12),
        backgroundColor:'#FD995F',
        borderBottomWidth:px(2),
        borderBottomColor:'#fff',
        borderLeftWidth:px(2),
        borderLeftColor:'#fff',
        borderTopWidth:px(2),
        borderTopColor:'#fff',
        position:'absolute',
        right:px(0),
        top:px(48),
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        borderTopLeftRadius:27,
        borderBottomLeftRadius:27,
    },
}
