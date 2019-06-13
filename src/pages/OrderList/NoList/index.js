/**
 * @author LZY
 * 空订单列表显示
 */
import Taro, { Component, Config } from '@tarojs/taro';
import {View,Image,Text} from '@tarojs/components';
import { FlatList , RefreshControl}  from 'react-native';
import AyButton from '../../../Component/AyButton/index';
import {GoToView} from '../../../Public/Biz/GoToView.js';
import styles from './styles.js';
import px from '../../../Biz/px.js';

export default class NoList extends Component{
    constructor(){
    	super();
    }
    //渲染头部的下拉刷新
    // renderHeader = () =>{
    //     return (
    //         <RefreshControl refreshing={this.props.isRefreshing} style={styles.itemRefresh} onRefresh={this.props.onRefresh}>
    //             <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.props.refreshText}</Text>
    //         </RefreshControl>
    //     );
    // }
    //去添加店铺
    gotoAddShop = () =>{
        GoToView({status:'DistributionShops',query:{fromPage:'orderList',isfromself:'1'}});
    }
    //渲染页面
    renderRow = (items) =>{
        let index = items.index;
        let item = items.item;
        return (
            <View style={[styles.content,{height:px(750)}]}>
                <Image src='https://q.aiyongbao.com/1688/web/img/preview/orderNull.png'  style={{width:px(226),height:px(124)}}/>
                {
                    this.props.type == 'noshops' ?
                    <View style={{alignItems:'center',marginTop:px(32)}}>
                        <Text style={{fontSize:px(28),color:'#4a4a4a'}}>您还没有添加任何店铺</Text>
                        <Text style={{fontSize:px(28),color:'#4a4a4a',marginTop:px(12)}}>添加店铺后，自动显示该店铺的代销订单</Text>
                        <AyButton type="normal"
                        onClick={()=>{this.gotoAddShop()}}
                        style={[styles.addShopBtn,{marginTop:px(32)}]}>添加店铺</AyButton>
                    </View>
                    :
                    <Text style={{marginTop:px(20),fontSize:px(32),color:"#666666"}}>暂无相关订单</Text>
                }
            </View>
        );
    }

    render(){
    	return(
            <View style={{flex:1}}>
                <FlatList
                    data={['null']}
                    renderItem={({item}) => this.renderRow(item)}
                    onRefresh={()=>{this.props.onRefresh()}}
                    refreshing={this.props.isRefreshing}
                    onEndReached={()=>{console.log('onEndReached');}}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => (index + '1')}
                />
            </View>
    	)
    }
}
