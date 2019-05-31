/**
 * @author LZY
 * 空订单列表显示
 */
import Taro, { Component, Config } from '@tarojs/taro';
import {View,Image,Text,ListView,RefreshControl,Button} from '@tarojs/components';
import {GoToView} from '../../../Public/Biz/GoToView.js';
import styles from './styles.js';

export default class NoList extends Component{
    constructor(){
    	super();
    }
    //渲染头部的下拉刷新
    renderHeader = () =>{
        return (
            <RefreshControl refreshing={this.props.isRefreshing} style={styles.itemRefresh} onRefresh={this.props.onRefresh}>
                <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.props.refreshText}</Text>
            </RefreshControl>
        );
    }
    //去添加店铺
    gotoAddShop = () =>{
        GoToView({status:'DistributionShops',query:{fromPage:'orderList',isfromself:'1'}});
    }
    //渲染页面
    renderRow = () =>{
        return (
            <View style={[styles.content,{height:750}]}>
                <Image src='https://q.aiyongbao.com/1688/web/img/preview/orderNull.png'  style={{width:px(226),height:px(124)}}/>
                {
                    this.props.type == 'noshops' ?
                    <View style={{alignItems:'center',marginTop:32}}>
                        <Text style={{fontSize:28,color:'#4a4a4a'}}>您还没有添加任何店铺</Text>
                        <Text style={{fontSize:28,color:'#4a4a4a',marginTop:12}}>添加店铺后，自动显示该店铺的代销订单</Text>
                        <Button type="secondary"
                        onClick={()=>{this.gotoAddShop()}}
                        style={[styles.addShopBtn,{marginTop:32}]}>添加店铺</Button>
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
        		<ListView
                dataSource={['null']}
                renderHeader={this.renderHeader}
                renderRow={this.renderRow}
                />
            </View>
    	)
    }
}
