'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text } from '@tarojs/components';
import Event from 'ay-event';
import { GetOrderInfo } from '../../../Biz/Apis.js';
import ItemIcon from '../../../Component/ItemIcon';
import { GoToView } from '../../../Public/Biz/GoToView.js';
import { NetWork } from '../../../Public/Common/NetWork/NetWork.js';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import px from '../../../Biz/px.js';

/**
 @aythor lzy
  首页
*/
export default class Head extends Component{
    constructor(props) {
        super(props);
        this.state = {
            orderinfo:[
                {num:0,text:'待采购'},
                {num:0,text:'待发货'},
                {num:0,text:'已发货'},
                {num:0,text:'退款中'}
            ],
            back:false,
            isOpen:false,
            needShow:true,
            isLoading:true,
        };
        this.allshops=0;
        this.token = 0;
        let self =this;
        Event.on('APP.reload_headorderlist',(data)=>{
            console.log('APP.reload_headorderlist')
            this.token=this.token*1+1;
            console.log('kankanjici',this.token,this.allshops);
            if(this.token==this.allshops){
                self.loadData();
            }
        });
        Event.on('APP.get_allshops',(data)=>{
            console.log('APP.reload_headorderlist')
            self.allshops = data.total;
        });

        Event.on('APP.reload_wechart_msg',(data)=>{
            self.setState({
                isOpen:data.isOpen,
                needShow:data.needShow
            });
        });
    }

    componentWillMount(){
        this.getList((rsp)=>{
            if (!IsEmpty(rsp.isOpen)) {
                this.setState({
                    isLoading:false,
                    isOpen:rsp.isOpen,
                    needShow:rsp.needShow
                });
            } else {
                this.setState({
                    isLoading:false,
                    isOpen:false,
                    needShow:false,
                });
            }
        });
    }

    componentDidMount(){
        this.loadData();
    }

    //初始化信息
    loadData = () =>{
        let self = this;
        GetOrderInfo({
            shopId:'',
            SuccessCallBack:(data)=>{
                if (!IsEmpty(data.waittobuy)) {
                    self.setState({
                        orderinfo:[
                            {num:data.waittobuy,text:'待采购'},
                            {num:data.waittosend,text:'待发货'},
                            {num:data.sellersended,text:'已发货'},
                            {num:data.buyerrefunded,text:'退款中'},
                        ],
                        back:true,
                    });
                } else {
                    self.setState({
                        back:true,
                    });
                }
            }
        });
    }

    //下拉刷新重置token
    resettoken=()=>{
        this.token = 0;
    }


    //跳转到订单列表
    goList=(v)=>{
        console.log("golist",v);
        Event.emit('App.Simple',{activeKey:{key:'order'},state:v});
    }

    //获取列表和用户设置
    getList = (callback) =>{
        NetWork.Get({
            url:'Wx/getWechartLists',
            data:{
                'needImg':'0'
            }
        },(rsp)=>{
            console.log('Wx/getWechartLists',rsp);
            if (!IsEmpty(rsp.msg)) {
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

    doNotShowSet = () =>{
        NetWork.Post({
            url:'Wx/doNotShowSet',
            data:{}
        },(rsp)=>{
            if (!IsEmpty(rsp.code) && rsp.code=='200') {
                this.setState({
                    needShow:false
                });
            } else {
                Taro.showToast({
                    title: '请求失败，请稍候再试',
                    icon: 'none',
                    duration: 2000
                });
            }
        },(error)=>{
            alert(JSON.stringify(error));
        });
    }

    render(){
        const { orderinfo,isLoading,needShow } = this.state;
        if (isLoading) {
            return '';
        } else {
            if (needShow) {
                return (
                    <View>
                        <View style={styles.head} onClick={()=>{GoToView({status:'WechartMsg'});}}>
                            <View style={styles.table_head}>
                                <Text style={{fontSize:px(28),color:'#ff6000'}}>尚未开通消息通知功能</Text>
                                <View onClick={()=>{GoToView({status:'WechartMsg'});}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={[styles.tap_txt24,{color:'#ff6000'}]}>立即开通</Text>
                                        <ItemIcon onClick={()=>{GoToView({status:'WechartMsg'})}} iconStyle={{fontSize:px(24),color:'#979797'}} code={"\ue6a7"}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.table_body,{alignItems: 'flex-start',flexDirection:'column'}]}>
                            <View style={{marginLeft:px(24),width:px(664),marginTop:px(24)}} onClick={()=>{GoToView({status:'WechartMsg'});}}>
                                <Text style={{fontSize:px(32),color:'#333',fontWeight:400}}>立即开通订单、铺货、库存消息通知，随时掌握生意动态！</Text>
                            </View>
                            <View style={{flex:1,marginTop:px(8),width:px(664),flexDirection:'row',justifyContent:'flex-end'}} onClick={()=>{this.doNotShowSet()}}>
                                <Text style={{fontSize:px(24),color:'#777'}}>不再提醒</Text>
                            </View>
                        </View>
                    </View>
                );
            } else {
                return (
                    <View>
                        <View style={styles.head}>
                            <View style={styles.table_head}>
                                <Text style={{fontSize:px(28)}}>代销订单</Text>
                                <View onClick={this.goList}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={styles.tap_txt24}>查看全部订单</Text>
                                        <ItemIcon onClick={this.goList} iconStyle={{fontSize:px(24),color:'#979797'}} code={"\ue6a7"}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.table_body}>
                            {orderinfo.map((item,key)=>{
                                return(
                                    <View onClick={()=>{this.goList(item.text)}} key={key} style={styles.table_item}>
                                        <Text style={styles.text_num}>{item.num}</Text>
                                        <Text style={[styles.text_grey,{marginTop:px(12)}]}>{item.text}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                );
            }
        }
    }
}
const styles = {
    head:{
        height:px(72),
        backgroundColor:'#FF8F4C',
        paddingLeft: px(24),
        paddingRight: px(24),
    },
    table_head:{
        backgroundColor:'#fff',
        borderTopRightRadius:px(12),
        borderTopLeftRadius: px(12),
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: px(1),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft: px(32),
        paddingRight: px(24),
        paddingTop: px(16),
        paddingBottom: px(16),
        height:px(72),
    },
    table_body:{
        backgroundColor:'#fff',
        borderBottomRightRadius:px(12),
        borderBottomLeftRadius: px(12),
        flexDirection:'row',
        height:px(150),
        marginLeft: px(24),
        marginRight: px(24),
        justifyContent:'center',
        alignItems: 'center',
    },
    tap_txt24:{
        fontSize:px(24),
        color:'#979797',
    },
    table_item:{
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
