import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Dialog from '../../../Component/Dialog';
import { IsEmpty } from '../../../Public/Biz/IsEmpty';
import {Parse2json} from '../../../Public/Biz/Parse2json.js';
import ItemIcon from '../../../Component/ItemIcon';
import {NetWork} from '../../../Public/Common/NetWork/NetWork.js';
import px from '../../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 右侧筛选弹框
 */
export default class SideDialog extends Component {
    constructor(props) {
        super(props);
        this.state={
            shopList:[{id:'-1',shop_name:'全部',pic_url:''}], //店铺列表
            filterList:[ //筛选项
                {
                    id:0,
                    name:'店铺',
                    active:'-1',
                    list:[{id:'-1',shop_name:'全部',pic_url:''}],
                }
            ],
            searchValue:'' //搜索框中的值
        };
    }

    componentWillMount(){
        let {shopList,filterList} = this.state;
        this.getShopLists((data)=>{
            shopList = shopList.concat(data);
            filterList.map((item,key)=>{
                if (item.name == '店铺') {
                    filterList[key].list = filterList[key].list.concat(data);
                }
            });
            this.setState({
                shopList:shopList,
                filterList:filterList
            });
        });
    }

    //获取店铺列表
    getShopLists = (callback) =>{
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{}
        },(rsp)=>{
            console.log('Distributeproxy/getProxyShopInfo',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                this.state.shopList = rsp.result;
                callback(rsp.result);
            } else {
                callback([]);
            }
        },(error)=>{
            callback([]);
            console.error(error);
        });
    }

    //显示弹窗
    show=()=>{
        this.refs.modal1.show();
    }
    //隐藏弹窗
    hide=()=>{
        this.refs.modal1.hide();
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
                                    let icon=null;
                                    if (item.active==listItem.id) {
                                        icon=<ItemIcon code={"\ue8b7"} iconStyle={styles.tagIcon}/>;
                                    }
                                    let shopType = '';
                                    if(listItem.id != '-1'){
                                        switch (listItem.shop_type) {
                                            case 'taobao':shopType = '(淘宝)';break;
                                            case 'pdd':shopType = '(拼多多)';break;
                                            case 'wc':shopType = '(旺铺)';break;//markWZM
                                            default:break;
                                        }
                                    }
                                    
                                    return (
                                        <View onClick={()=>{this.changeFilter(item.id,listItem.id)}}
                                        style={item.active==listItem.id ? styles.filterActive : styles.filterItem}>
                                            <Text style={item.active==listItem.id ? styles.filterActiveText : styles.filterItemText}>
                                            {shopType}{listItem.shop_name}
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

    //确认筛选
    submitFilter = () =>{
        let lastShop = {};
        this.state.filterList[0].list.map((item,key)=>{
            if (item.id == this.state.filterList[0].active) {
                lastShop = Parse2json(JSON.stringify(item));
            }
        });
        this.refs.modal1.hide();
        this.props.submitFilter(lastShop);
    }

    //重置
    reset = () =>{
        let arr=Parse2json(JSON.stringify(this.state.filterList));
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
            <Dialog 
            ref="modal1" 
            contentStyle={contentStyle} 
            maskClosable={false}
            >
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
