'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text } from '@tarojs/components';
import Event from 'ay-event';
import { GetGoodsLog } from '../../../Biz/Apis.js';
import { IsEmpty } from '../../../Public/Biz/IsEmpty.js';
import { GoToView } from '../../../Public/Biz/GoToView.js';
import {LocalStore} from '../../../Public/Biz/LocalStore.js';
import {Parse2json} from '../../../Public/Biz/Parse2json.js';
import { NetWork } from '../../../Public/Common/NetWork/NetWork.js';
import px from '../../../Biz/px.js';
/**
 @aythor lzy
  首页
*/
export default class Body extends Component{
    constructor(props) {
        super(props);
        this.state = {
            log:[
                {num:0,text:'铺货中'},
                {num:0,text:'成功'},

            ],
            companynum:0
        }
    }

    componentDidMount(){
        this.loadData();
    }
    //初始化信息
    loadData = () =>{
        let self = this;
        // let log= new Promise(function (resolve,reject) {
		// 	GetGoodsLog({SuccessCallBack:(res)=>{
        //         resolve(res)
        //     }})
        // });

        // //获取供应商个数
        // let company= new Promise(function (resolve,reject) {
        //     NetWork.Get({
        //         url:'Distributeproxy/querySuppliers',
        //         data:{}
        //     },(result)=>{
        //         if (IsEmpty(result.errorCode)) {
        //             let res = result.result;
        //             console.log('alibaba.relation.querySuppliers',res.count);
        //             resolve(res.count);
        //         } else {
        //             resolve(0);
        //         }
        //     },(error)=>{
        //         resolve(0);
        //         console.error(error);
        //     });
        // });

        // Promise.all([log,company]).then(function (result) {
        //     LocalStore.Get(['movetoback_stopandreopen'],(backdata) => {
        //         let distributingcount = result[0].distributing;
        //         if(IsEmpty(backdata)||IsEmpty(backdata.movetoback_stopandreopen)||backdata.movetoback_stopandreopen=='[]'){

        //         }else{
        //             let params = Parse2json(backdata.movetoback_stopandreopen);
        //             distributingcount = distributingcount*1+params.length*1
        //         }
        //         self.setState({
        //             log:[
        //                 // {num:result[0].distrubutting,text:'铺货中'},//wzmtoken
        //                 {num:distributingcount,text:'铺货中'},
        //                 {num:result[0].success,text:'成功'},
        //             ],
        //             companynum:result[1]
        //         });
        //     });
        // });
    }

    //跳转页面
    gopage=(v,status)=>{
        switch(v){
            case '铺货日志':
                let logStatus = '1';
                if (status == '铺货中') {
                    logStatus = '2';
                }
                GoToView({status:'DistributionLog',query:{status:logStatus,fromPage:'distributeIndex'}});
            break;
            case '货源推荐':
                Event.emit('App.Simple',{activeKey:{key:'source'}});
            break;
            case '我的供应商':
                GoToView({status:'SupplierList'});
            break;
            default:
            break;
        }
    }

    render(){
        const { log,companynum } = this.state;
        // if(log[0].num==0&&log[1].num==0){
        //     logbody = <View style={{flex:1,justifyContent:'center',alignItems: 'center',}}>
        //                 <Text style={styles.text_grey}>您还没有铺货记录</Text>
        //                 <View style={{flexDirection:'row',marginTop: 16,}}>
        //                     <Text style={styles.text_grey}>去挑选货源</Text>
        //                     <Icon style={[styles.text_grey,{marginLeft: 5}]} name="right" />
        //                 </View>
        //             </View>
        // }else{
        let  logbody = <View style={styles.item_div}>
                        {log.map((item,key)=>{
                            return (
                                <View key={key} style={styles.item} onClick={()=>{this.gopage('铺货日志',item.text)}}>
                                    <Text style={styles.text_num}>
                                        {item.num>999?'999+':item.num}
                                    </Text>
                                    <Text style={[styles.text_grey,{marginTop:px(12)}]}>
                                        {item.text}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
        // }
        return (
            <View style={styles.body}>
               <View onClick={()=>{
                   if(log[0].num==0&&log[1].num==0){
                        this.gopage('货源推荐');
                   }
                }} style={styles.w_div}>
                    <View style={styles.table_head}>
                        <Text style={{fontSize:px(28)}}>铺货日志</Text>
                    </View>
                    {logbody}
               </View>
               <View onClick={()=>{this.gopage('我的供应商');}} style={styles.w_div}>
                    <View style={styles.table_head}>
                        <Text style={{fontSize:px(28)}}>我的供应商</Text>
                    </View>
                    <View style={styles.item_div}>
                        <View style={styles.item}>
                            <Text style={styles.text_num}>
                                {companynum}
                            </Text>
                            <Text style={[styles.text_grey,{marginTop:px(12)}]}>合作中</Text>
                        </View>
                    </View>
               </View>
            </View>
        )
    }
}
const styles = {
    body:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    w_div:{
        width:px(334),
        height:px(222),
        backgroundColor:'#fff',
        borderRadius:px(12),
    },
    table_head:{
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: px(1),
        paddingLeft: px(32),
        paddingRight: px(32),
        justifyContent: 'center',
        height:px(72),
    },
    item_div:{
        flexDirection:'row',
        flex:1,
    },
    item:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
    },
    text_num:{
        fontSize: px(36),
        color: '#333333',
    },
    text_grey:{
        fontSize: px(28),
        color: '#666666',
    }
}
