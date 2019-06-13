'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text } from '@tarojs/components';
import Event from 'ay-event';
import { IsEmpty } from '../../../Public/Biz/IsEmpty.js';
import { NetWork } from '../../../Public/Common/NetWork/NetWork.js';
import Item from './item';
import px from '../../../Biz/px.js';
/**
 @aythor lzy
  首页列表
*/
export default class List extends Component{
    constructor(props) {
        super(props);
        this.state = {
            datasource:[],
            loding:false,
        };
        this.info = '';

        let self = this;
        Event.on('APP.reload_shoplist_info',(data)=>{
            self.loadData();
        });
    }

    componentDidMount(){
        this.loadData();
    }

    //初始化数据
    loadData = () =>{
        let self = this;
        //获取用户基本信息
        self.getShops();
        self.info = {
            'extraInfo':{
                'result':{
                    'loginId':'萌晓月cy'
                }
            }
        };
    }

    //获取店铺列表
    getShops = () =>{
        let self = this;
        //获取店铺列表
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{}
        },(shopRes)=>{
            if(!IsEmpty(shopRes.result) && shopRes.result.length > 0){
                Event.emit('APP.get_allshops',{total:shopRes.result.length});
                let shopList = shopRes.result;
                let shopIds = [];
                for(let i in shopList){
                    shopIds.push(shopList[i].id);
                }
                //获取店铺授权信息
                NetWork.Get({
                    url:'Distributeproxy/getAuthInfoByShopIds',
                    data:{
                        shopIds:shopIds.join(',')
                    }
                },(authRes)=>{
                    //有数据
                    console.log(authRes);
                    if(!IsEmpty(authRes.result)){
                        shopList.map((item,key)=>{
                            let hasAuth = true;
                            for (let i = 0; i < authRes.result.length; i++) {
                                if (authRes.result[i] == item.id) {
                                    hasAuth = false;
                                }
                            }
                            shopList[key].hasAuth = hasAuth;
                        });
                        self.setState({datasource:shopList,loding:true});
                    }else{
                        shopList.map((item,key)=>{
                            shopList[key].hasAuth = true;
                        });
                        self.setState({datasource:shopList,loding:true});
                    }
                },(error)=>{
                    self.setState({datasource:[],loding:true});
                    console.error(error);
                });
            }else{
                self.setState({datasource:[],loding:true});
            }
        },(error)=>{
            self.setState({datasource:[],loding:true});
            console.error(error);
        });
    }

    //修改授权信息
    changeAuth = (shopId,hasAuth) =>{
        let {datasource} = this.state;
        datasource.map((item,key)=>{
            if (item.id == shopId) {
                datasource[key].hasAuth = hasAuth;
            }
        });
        this.setState({
            datasource:datasource
        });
    }

    render(){
        const { datasource,loding } = this.state;
        if(IsEmpty(datasource)&&loding==true){
            return (
                <View key={0}>
                    <Item type={'empty'} key={0}/>
                </View>
            )
        }else if (!IsEmpty(datasource)){
            return (
                <View>
                    {datasource.map((item,key)=>{
                        return(
                            <Item key={key} info={this.info} type={'normal'} data={item} changeAuth={this.changeAuth}/>
                        );
                    })}
                </View>
            )
        }else{
            return (
                <View style={{height:px(256),borderRadius: px(12),marginTop:px(20),backgroundColor:'#fff',justifyContent:'center',alignItems: 'center'}} key={0}>
                   <Text style={{fontSize: px(28)}}>加载中......</Text>
                </View>
            )
        }
    }
}
