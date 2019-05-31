'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text,Image,ScrollView } from '@tarojs/components';
import { GoToView } from '../../../Public/Biz/GoToView.js';
import px from '../../../Biz/px.js';
/**
 @aythor wzm
  教程
*/
export default class Course extends Component{
    constructor(props) {
        super(props);
        this.state = {
            orderinfo:[
                {pic:'https://q.aiyongbao.com/1688/web/img/course01.png',text:'在代发助手中查看淘宝代销订单并进行采购',mark:'look'},
                {pic:'https://q.aiyongbao.com/1688/web/img/course02.png',text:'获取已代销货品最新信息或取消代销关系',mark:'get'},
            ],
        };
    }

    //跳转到代发教程
    goList=(v)=>{
        GoToView({status:'Courses',query:{type:v}});
    }

    render(){
        const { orderinfo } = this.state;
        return (
            <View>
                    <View style={styles.table_head}>
                        <Text style={{fontSize:px(28)}}>代发教程</Text>
                        <View onClick={this.goList}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                            </View>
                        </View>
                    </View>
                <ScrollView horizontal={true} style={styles.table_body}>
                    {orderinfo.map((item,key)=>{
                        if(key == orderinfo.length-1){
                            return(
                                <View onClick={()=>{this.goList(item.mark)}} key={key} style={[styles.table_item,{marginRight:px(0)}]}>
                                    <Image src={item.pic} style={styles.textPIc}></Image>
                                    <Text style={[styles.textBlack,{marginTop:px(12)}]}>{item.text}</Text>
                                </View>
                            );
                        }else{
                            return(
                                <View onClick={()=>{this.goList(item.mark)}} key={key} style={[styles.table_item,{marginRight:px(0)}]}>
                                    <Image src={item.pic} style={styles.textPIc}></Image>
                                    <Text style={[styles.textBlack,{marginTop:px(12)}]}>{item.text}</Text>
                                </View>
                            );
                        }

                    })}
                </ScrollView>
            </View>
        )
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
        borderBottomWidth: 1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft: px(32),
        paddingRight: px(24),
        paddingTop: px(16),
        paddingBottom: px(16),
        height:px(72),
        marginTop:px(24),
    },
    table_body:{
        backgroundColor:'#fff',
        borderBottomRightRadius:px(12),
        borderBottomLeftRadius: px(12),
        flexDirection:'row',
        height:px(300),
        width:px(702),
        justifyContent:'space-between',
        alignItems: 'center',
    },
    tap_txt24:{
        fontSize:px(24),
        color:'#979797',
    },
    table_item:{
        width:px(306),
        justifyContent:'center',
        alignItems: 'center',
        marginLeft:px(30)
    },
    textPIc:{
        width:px(306),
        height:px(136),
    },
    textBlack:{
        fontSize: px(24),
        color: '#333333',
        width:px(298),
    },

}
