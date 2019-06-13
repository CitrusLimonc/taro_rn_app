import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Dialog from '../../../Component/Dialog';
import { IsEmpty } from '../../../Public/Biz/IsEmpty';
import {Parse2json} from '../../../Public/Biz/Parse2json.js';
import styles from './styles';
import px from '../../../Biz/px.js';
/**
 * @author wzm
 * 库存预警日志-右侧筛选弹框
 */
export default class SideDialog extends Component {
    constructor(props) {
        super(props);
        let initid = !IsEmpty(this.props.shopList) ? this.props.shopList[0].id : '';
        this.state={
            shopList:this.props.shopList, //店铺列表
            filterList:[ //筛选项
                {
                    id:0,
                    name:'店铺',
                    active:!IsEmpty(this.props.shopId) ? this.props.shopId : initid,
                    list:this.props.shopList,
                },
                {
                    id:1,
                    name:'同步结果',
                    active:!IsEmpty(this.props.issuccess) ? this.props.issuccess : 'all',
                    list:[{shop_name:'全部',id:'all'},{shop_name:'成功',id:'1'},{shop_name:'失败',id:'2'}],
                },
                {
                    id:2,
                    name:'同步日期',
                    active:!IsEmpty(this.props.synctime) ? this.props.synctime : '7',
                    list:[{shop_name:'近7天',id:'7'},{shop_name:'近15天',id:'15'},{shop_name:'近30天',id:px(30)}],
                }
            ],
            searchValue:'' //搜索框中的值
        };
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.shopList) {
            let initid = !IsEmpty(nextProps.shopList) ?  nextProps.shopList[0].id : '';
            this.setState({
                shopList:nextProps.shopList,
                filterList:[
                    {
                        id:0,
                        name:'店铺',
                        active:!IsEmpty(nextProps.shopId) ? nextProps.shopId : initid,
                        list:nextProps.shopList,
                    },
                    {
                        id:1,
                        name:'同步结果',
                        active:!IsEmpty(nextProps.issuccess) ? nextProps.issuccess : 'all',
                        list:[{shop_name:'全部',id:'all'},{shop_name:'成功',id:'1'},{shop_name:'失败',id:'2'}],
                    },
                    {
                        id:2,
                        name:'同步日期',
                        active:!IsEmpty(nextProps.synctime) ? nextProps.synctime : '7',
                        list:[{shop_name:'近7天',id:'7'},{shop_name:'近15天',id:'15'},{shop_name:'近30天',id:px(30)}],
                    }
                ],
            });
        }
    }

    //显示弹窗
    show=()=>{
        this.refs.modal1.show();
    }
    //隐藏弹窗
    hide=()=>{
        this.refs.modal1.hide();
    }

    //重置
    reset = () =>{
        let arr=Parse2json(JSON.stringify(this.state.filterList));
        let lastShop = this.state.filterList[0].list[0];
        this.state.filterList.map((item,key)=>{
            if (!IsEmpty(item.list)) {
                arr[key].active=item.list[0].id;
            }
        });
        // this.hasFilter = false;
        this.setState({
            filterList:arr,
            searchValue:''
        });
    }

    //选择筛选操作
    changeFilter = (parent,child) =>{
        let arr=Parse2json(JSON.stringify(this.state.filterList));
        arr.map((item,key)=>{
            if (parent == item.id) {
                item.list.map((listItem,index)=>{
                    if (listItem.id==child) {
                        arr[key].active=listItem.id;
                    }
                });
            }
        });
        this.setState({
            filterList:arr
        });
    }

    //获取筛选的列表
    getFilterList = () =>{
        let doms=[];
        this.state.filterList.map((item,key)=>{
            if (!IsEmpty(item.list)) {
                doms.push(
                    <View style={styles.filterLine}>
                        <View style={{paddingLeft:px(20)}}>
                            <Text style={{color:'#666666',fontSize:px(24)}}>{item.name}</Text>
                        </View>
                        <View style={styles.items}>
                            {
                                item.list.map((listItem,index)=>{
                                    return (
                                        <View onClick={()=>{this.changeFilter(item.id,listItem.id)}}
                                        style={item.active==listItem.id ? styles.filterActive : styles.filterItem}>
                                            <Text style={item.active==listItem.id ? styles.filterActiveText : styles.filterItemText}>
                                            {listItem.shop_name}
                                            </Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                );
            }
        });
        return doms;
    }

    //点击确定
    submitFilter = () =>{
        let lastShop = {};
        let issuccess = {};
        let synctime = {};
        this.state.filterList.map((itemout,keyout)=>{
            itemout.list.map((itemin,keyin)=>{
                if (itemin.id == this.state.filterList[keyout].active) {
                    switch(keyout){
                        case 0 :{
                            lastShop = Parse2json(JSON.stringify(itemin));
                        }break;
                        case 1 :{
                            issuccess = Parse2json(JSON.stringify(itemin));
                        }break;
                        case 2 :{
                            synctime = Parse2json(JSON.stringify(itemin));
                        }break;
                        default:break;
                    }
                }
            })
        })
        this.refs.modal1.hide();
        this.props.submitFilter(lastShop,issuccess,synctime);
    }

    render(){

        let maskStyle=styles.maskStyle;
        let contentStyle=styles.modalStyle;
        // if (window.__weex_env__.platform == "android") {
            maskStyle=styles.maskStyle;
            contentStyle=styles.modalStyle;
        // } else {
        //     maskStyle={
        //         backgroundColor:'rgba(0,0,0,0.5)',
        //         position: 'absolute',
        //         top:px(50),
        //         bottom: px(0),
        //         right: px(0),
        //         width: px(750),
        //     };
        //     contentStyle={
        //         position: 'absolute',
        //         right: px(0),
        //         top: px(50),
        //         bottom: px(0),
        //         width: px(560),
        //         backgroundColor: '#ffffff',
        //     }
        // }

        return(
            <Dialog ref="modal1" contentStyle={contentStyle} maskClosable={false}>
                <View style={styles.normalLine}>
                    <Text style={{fontSize:px(24)}}>筛选</Text>
                </View>
                <View>
                    {this.getFilterList()}
                </View>
                <View style={styles.filterFoot}>
                    <View style={styles.filterFootLeft} onClick={this.reset}>
                        <Text style={{fontSize:px(32),color:'#999999'}}>重置</Text>
                    </View>
                    <View style={styles.filterFootRight} onClick={this.submitFilter}>
                        <Text style={{fontSize:px(32),color:'#fff'}}>确定</Text>
                    </View>
                </View>
            </Dialog>
        );
    }
}