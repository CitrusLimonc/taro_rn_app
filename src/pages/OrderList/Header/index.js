/**
 * @author LZY
 * 空订单列表显示
 */
import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text} from '@tarojs/components';
import {NetWork} from '../../../Public/Common/NetWork/NetWork.js';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import ItemIcon from '../../../Component/ItemIcon';
import styles from './styles.js';
import px from '../../../Biz/px.js';

export default class Header extends Component{
    constructor(props){
        super(props);
        this.state={
            lastUpdateTime:'',
            show:true,
            shopId:this.props.shopId
        }
    };

    componentWillMount(){
        //获取上次同步时间
        this.loadData();
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.shopId != this.state.shopId && this.state.show) {
            this.state.shopId = nextProps.shopId;
            this.loadData();
        }
    }

    loadData = () =>{
        let nowTime = new Date();
        NetWork.Get({
            url:'Orderreturn/getLastSynchroTime',
            data:{
                shopId:this.state.shopId
            }
        },(rsp)=>{
            console.log('Orderreturn/getLastSynchroTime',rsp);
            //有结果
            if (!IsEmpty(rsp.time)) {
                this.setState({
                    lastUpdateTime:rsp.time
                });
            }
        },(error)=>{
            console.log(error);
            this.setState({
                lastUpdateTime:nowTime
            });
        });
    }

    deleteLine = () =>{
        this.setState({
            show:false
        });
    }
    

    render(){
        let {lastUpdateTime,show} = this.state;
       
        if (show) {
            return (
                <View style={styles.headBox}>
                    <Text style={{fontSize:px(28),color:'#333333'}}>上次同步时间{lastUpdateTime}</Text>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                        <Text style={{fontSize:px(28),color:'#333333',marginRight:px(24)}}>下拉重新同步</Text>
                        <ItemIcon onClick={()=>{this.deleteLine()}} code={'\ue69a'} iconStyle={styles.iconStyle}/>
                    </View>
                </View>
            );
        } else {
            return '';
        }
    }
}
