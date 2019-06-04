'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text,Image } from '@tarojs/components';
import Event from 'ay-event';
import { IsEmpty } from '../../../../Public/Biz/IsEmpty.js';
import { GoToView } from '../../../../Public/Biz/GoToView.js';
import { GetOrderInfo,SyncShop,GetOrderState } from '../../../../Biz/Apis.js';
import { NetWork } from '../../../../Public/Common/NetWork/NetWork.js';
import SureDialog from '../../../../Component/SureDialog';
import {DoBeacon} from '../../../../Public/Biz/DoBeacon';
import { LocalStore } from '../../../../Public/Biz/LocalStore.js';
import ItemIcon from '../../../../Component/ItemIcon';
import px from '../../../../Biz/px.js';
/**
 @aythor lzy
  首页列表的组件
*/
export default class Item extends Component{
    constructor(props) {
        super(props);
        this.state = {
            trade:[
                {num:0,text:'待采购'},
                {num:0,text:'待发货'},
            ],
            item:[
                {num:0,text:'代销中'},
                {num:0,text:'缺货中'},
            ],
            syncstate:false,
            hasAuth:!IsEmpty(props.data) ? props.data.hasAuth:false
        };
        this.tokenall = 0;
        this.retry = 0;
        this.authorizationLink = '';
        let emitName = 'APP.render_shop_card';
        let self = this;
        Event.on(emitName,(data)=>{
            //避免重复interval
            if (self.state.syncstate) {
                self.setState({
                    syncstate:false
                });
                self.loadData();
            }
        });
    }

    componentDidMount(){
        this.loadData();
    }

    componentWillReceiveProps(nextProps){
        if (!IsEmpty(nextProps.data) && nextProps.data.hasAuth != this.state.hasAuth){
            this.setState({
                hasAuth:nextProps.data.hasAuth
            });
        }
    }

    //初始化信息
    loadData = () =>{
        let self = this;
        const { data,type } = this.props;
        if(type!='empty'){
            //获取订单信息
            GetOrderInfo({
                shopId:data.id,
                SuccessCallBack:(res)=>{
                    self.setState({
                        trade:[
                            {num:res.waittobuy,text:'待采购'},
                            {num:res.waittosend,text:'待发货'},
                        ],
                        item:[
                            {num:res.spnumber,text:'代销中'},
                            {num:res.notspnum,text:'缺货中'},
                        ],
                    });
                }
            });
            if(data.hasAuth){
                this.syncshop();
            }
        }
    }

    //同步订单
    syncshop=()=>{
        let self = this;
        const { data,type,changeAuth } = this.props;
        GetOrderState({
            shopId:data.id,
            SuccessCallBack:(res)=>{
                console.log(res)
                if(res.isend){
                    SyncShop({
                        shopId:data.id,
                        shopName:data.shop_name,
                        shopType:data.shop_type,
                        SuccessCallBack:(res)=>{
                            switch(res.code){
                                case '200':
                                case 200 :
                                    self.interval = setInterval(() => {
                                        GetOrderState({
                                            shopId:data.id,
                                            SuccessCallBack:(res)=>{
                                                console.log(res)
                                                if(res.isend){
                                                    clearInterval(self.interval);
                                                    // this.loadData();
                                                    GetOrderInfo({
                                                        shopId:data.id,
                                                        SuccessCallBack:(res)=>{
                                                            console.log('kankanasyn',res)
                                                            self.setState({
                                                                trade:[
                                                                    {num:res.waittobuy,text:'待采购'},
                                                                    {num:res.waittosend,text:'待发货'},
                                                                ],
                                                                item:[
                                                                    {num:res.spnumber,text:'代销中'},
                                                                    {num:res.notspnum,text:'缺货中'},
                                                                ],
                                                            });
                                                        }
                                                    });
                                                    Event.emit('APP.reload_headorderlist');
                                                    console.log('kankanloadmore')
                                                    self.setState({syncstate:true});
                                                }
                                            }
                                        })
                                    },1000)
                                break;
                                case 500 :
                                    // alert('店铺'+data.shop_name+'未授权');
                                    changeAuth(data.id,false);
                                break;
                                case 101:
                                    alert('同步订单消息发送失败');
                                    changeAuth(data.id,false);
                                break;
                                default:
                                break;
                            }
                        },
                        ErrorCallBack:()=>{
                            changeAuth(data.id,false);
                        }
                    });
                } else {
                    self.interval = setInterval(() => {
                        GetOrderState({
                            shopId:data.id,
                            SuccessCallBack:(res)=>{
                                console.log(res)
                                if(res.isend){
                                    clearInterval(self.interval);
                                    self.setState({syncstate:true});
                                }
                            }
                        })
                    },1000)
                }
            }
        })
        console.log('kankansync');

    }

    //授权操作
    sureAccess = () =>{
        const { data } = this.props;
        let self = this;
        let params = {
            shopType:data.shop_type,
            shopId:data.id,
        };
        self.refs.sureDialog.hide();
        Taro.showLoading({ title: '加载中...' });
        if (self.retry <= 3) {
            self.retry++;
            NetWork.Get({
                url:'Distributeproxy/proxyGetAiyongAuthorization',
                data:params
            },(rsp)=>{
                Taro.hideLoading();
                if (!IsEmpty(rsp)) {
                    if(rsp.code=='200'){
                        self.retry = 0;
                        self.setState({hasAuth:true});//授权完成后开始同步
                        self.syncshop();
                    }else if (rsp.code == '404'){
                        self.refs.sureDialog.show();
                        self.authorizationLink = rsp;
                        GoToView({status:rsp.authorLink,page_status:'special'});
                    }
                }
            },(error)=>{
                Taro.hideLoading();
                alert(JSON.stringify(error));
            });
        } else {
            Taro.hideLoading();
            self.retry = 0;
        }
    }

    render(){
        const { trade,syncstate,item } = this.state;
        const { data,info } = this.props;
        if(this.props.type=='empty'){
            return (
                <View style={styles.item}>
                    <View style={styles.head}>
                        <View style={styles.img_div}>
                            <Image src={'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png'} style={{width:px(44),height:px(44)}}/>
                        </View>
                        <View style={{flex:1}}/>
                        <Text onClick={()=>{GoToView({status:'DistributionShops',query:{isfromself:'1'}});}} style={styles.o_txt}>您还没有添加任何店铺，去添加</Text>
                        <ItemIcon iconStyle={{fontSize:px(24),color:'#333'}} code={"\ue6a7"}/>
                    </View>
                    <View style={styles.tit}>
                        <Text style={styles.lil_txt}>订单</Text>
                        <Text style={styles.lil_txt}>商品</Text>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.body_item}>
                            {trade.map((item,key)=>{
                                return(
                                    <View key={key} style={styles.item_dis}>
                                        <Text style={styles.text_num}>
                                            {item.num}
                                        </Text>
                                        <Text style={styles.text_grey}>
                                            {item.text}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{width:px(1),height:px(86),backgroundColor:'#e5e5e5'}}/>
                        <View style={styles.body_item}>
                        {item.map((item,key)=>{
                                return(
                                    <View key={key} style={styles.item_dis}>
                                        <Text style={item.text=='缺货中'&&item.num!==0?(styles.textRednum):(styles.text_num)}>
                                            {item.num}
                                        </Text>
                                        <Text style={styles.text_grey}>
                                            {item.text}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
            );
        }else{
            return (
                <View style={styles.item}>
                    <SureDialog
                        ref={"sureDialog"}
                        onSubmit={()=>{this.sureAccess();}}
                        lastShopType={data.shop_type}
                        authorizationLink={this.authorizationLink}
                    />
                    <View style={styles.head}>
                        <View style={styles.img_div}>
                            <Image src={data.pic_url} style={{width:px(44),height:px(44)}}/>
                        </View>
                        <Text style={{fontSize:px(28),color:'#666',marginLeft: px(12),}}>{data.shop_name}</Text>
                        <View style={{flex:1}}/>
                        {
                            data.shop_type =='wc' && data.has_smallroutine == 0 ?(
                                <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{
                                    DoBeacon('TD20181012161059','hompage_createwcshop_click',info.extraInfo.result.loginId);
                                    let shopname = encodeURI(data.shop_name);
                                    GoToView({status:'Openwd',query:{shopid:data.id,shopname:shopname}});
                                }}>
                                    <Text style={[styles.o_txt,{color:'#FF6000'}]}>{'开通小程序店铺'}</Text>
                                    <ItemIcon iconStyle={{fontSize:px(24),color:'#999999'}} code={"\ue6a7"}/>
                                </View>
                                ):(
                                this.state.hasAuth?(
                                    syncstate ?
                                    <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{
                                        this.setState({
                                            syncstate:false
                                        });
                                        this.syncshop();
                                    }}>
                                        <Text style={[styles.o_txt,{color:'#999999'}]}>{'点击同步订单'}</Text>
                                        <ItemIcon iconStyle={{fontSize:px(24),color:'#999999'}} code={"\ue6a7"}/>
                                    </View>
                                    :
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={styles.o_txt}>{'同步订单中...'}</Text>
                                    </View>
                                ):(
                                    <View onClick={()=>{this.sureAccess();}} style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={styles.o_txt}>店铺授权失效，去授权</Text>
                                        <ItemIcon iconStyle={{fontSize:px(24),color:'#333'}} code={"\ue6a7"}/>
                                    </View>
                                )
                            )
                        }
                        {/* {this.state.hasAuth?(
                            syncstate ?
                            <View style={{flexDirection:'row',alignItems:'center'}} onClick={()=>{
                                this.setState({
                                    syncstate:false
                                });
                                this.syncshop();
                            }}>
                                <Text style={[styles.o_txt,{color:'#999999'}]}>{'点击同步订单'}</Text>
                                <ItemIcon iconStyle={{fontSize:24,color:'#999999'}} code={"\ue6a7"}/>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.o_txt}>{'同步订单中...'}</Text>
                            </View>
                        ):(
                            <View onClick={()=>{this.sureAccess();}} style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={styles.o_txt}>店铺授权失效，去授权</Text>
                                <ItemIcon iconStyle={{fontSize:24,color:'#333'}} code={"\ue6a7"}/>
                            </View>
                        )} */}
                    </View>
                    <View style={styles.tit}>
                        <Text style={styles.lil_txt}>订单</Text>
                        <Text style={styles.lil_txt}>商品</Text>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.body_item}>
                            {trade.map((item,key)=>{
                                return(
                                    <View key={key} onClick={()=>{
                                        Event.emit('App.Simple',{activeKey:{key:'order'},state:item.text,shopid:data.id});
                                    }} style={styles.item_dis}>
                                        <Text style={styles.text_num}>
                                            {item.num}
                                        </Text>
                                        <Text style={styles.text_grey}>
                                            {item.text}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={{width:px(1),height:px(86),backgroundColor:'#e5e5e5'}}/>
                        <View style={styles.body_item}>
                            {item.map((item,key)=>{
                                return(
                                    <View key={key} onClick={()=>{
                                        if(item.text == '缺货中'){
                                            data.type = 'noamount';
                                        }else if(item.text == '代销中'){
                                            data.type = 'onsale';
                                        }
                                        LocalStore.Set({'item_list_get_shop_info':JSON.stringify(data)});
                                        Event.emit('App.go_item_list_search',data);
                                        console.log('kankantype',data);
                                    }} style={styles.item_dis}>
                                        <Text style={item.text=='缺货中'&&item.num!=0?(styles.textRednum):(styles.text_num)}>
                                            {item.num}
                                        </Text>
                                        <Text style={styles.text_grey}>
                                            {item.text}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = {
    body:{
        flexDirection:'row',
        flex:1,
        marginTop:px(12)
    },
    body_item:{
        flex:1,
        flexDirection: 'row',
    },
    item:{
        height:px(246),
        borderRadius: px(12),
        marginTop: px(20),
        backgroundColor:'#fff',
    },
    item_dis:{
       alignItems: 'center',
       flex:1,
    },
    head:{
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        flexDirection:'row',
        paddingLeft: px(32),
        paddingRight: px(24),
        alignItems: 'center',
        height:px(72),
    },
    img_div:{
        borderColor: '#E5E5E5',
        borderWidth:px(1),
        borderRadius: px(5),
        justifyContent:'center',
        alignItems: 'center',
    },
    o_txt:{
        fontSize: px(24),
        color:'#FF6000',
    },
    tit:{
        flexDirection:'row',
        alignItems: 'center',
        paddingLeft: px(32),
        marginTop:px(12)
    },
    lil_txt:{
        fontSize: px(20),
        color: '#DCDEE3',
        flex:1
    },
    text_num:{
        fontSize: px(36),
        color: '#333333',
    },
    textRednum:{
        fontSize: px(36),
        color: '#FF6000',
    },
    text_grey:{
        fontSize: px(28),
        color: '#666666',
        marginTop:px(12),
    },

}
