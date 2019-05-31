import Taro, { Component} from '@tarojs/taro';
import {StyleSheet} from 'react-native';
import { View,Text,Image } from '@tarojs/components';
import { NetWork } from '../../../Public/Common/NetWork/NetWork.js';
import {Domain} from '../../../Env/Domain.js';
import {GoToView} from '../../../Public/Biz/GoToView.js';
import px from '../../../Biz/px.js';
import { IsEmpty } from '../../../Public/Common/Utils/IsEmpty.js';
/**
* 教程
*/
export default class Tool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderinfo:[],
        }
    }
    componentDidMount(){
        let self = this;
        //获取需要显示的功能
        // NetWork.Post({
		// 	url:'dishelper/gettool',
        //     host:Domain.WECHART_URL,
        //     params:{}
        // },(rsp)=>{
        //     console.log('dishelper/gettool',rsp);
		// 	if(rsp.code == 200){
		// 		self.setState({
		// 			orderinfo:rsp.value
		// 		})
		// 	}else{
        //         self.setState({
		// 			orderinfo:'1'
		// 		})
        //         Taro.showToast({
        //             title: '获取数据失败',
        //             icon: 'none',
        //             duration: 2000
        //         });
		// 	}
        // },()=>{
        //     self.setState({
        //         orderinfo:'1'
        //     })
        //     Taro.showToast({
        //         title: '获取数据失败',
        //         icon: 'none',
        //         duration: 2000
        //     });
        // });
    }
    //跳转页面
    goList=(v)=>{
        if(v=='RecycleList'){
            GoToView({status:'ProductList',query:{type:'recycle'}});
        }else{
            GoToView({status:v,});
        }
        // if(this.props.vipflag == 1){
        // // if(this.props.vipflag == 0){
        // }else{
        //     this.props.openvip();
        // }
    }

    render(){
        const { orderinfo } = this.state;
        return  IsEmpty(orderinfo) ? null : (
            <View>
                <View style={styles.table_head}>
                    <Text style={{fontSize:px(28)}}>常用工具</Text>
                </View>
                <View style={styles.table_body}>
                    {orderinfo.map((item,key)=>{
                        return(
                            <View onClick={()=>{this.goList(item.mark)}} key={key} style={styles.table_item}>
                                <Image src={item.pic} style={styles.textPIc}></Image>
                                <Text style={styles.textBlack}>{item.text}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
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
        marginTop:px(24),

    },
    table_body:{
        backgroundColor:'#fff',
        borderBottomRightRadius:px(12),
        borderBottomLeftRadius: px(12),
        flexDirection:'row',
        width:px(702),
        alignItems: 'center',
    },
    tap_txt24:{
        fontSize:px(24),
        color:'#979797',
    },
    table_item:{
        width:px(120),
        justifyContent:'center',
        alignItems: 'center',
        marginLeft:px(30),
        marginTop:px(24),
        marginRight:px(0)
    },
    textPIc:{
        width:px(70),
        height:px(70),
    },
    textBlack:{
        fontSize: px(28),
        marginBottom:px(24),
        color: '#333333',
        marginTop:px(12)
    }
};
