import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Input} from '@tarojs/components';
import Dialog from '../../../Component/Dialog';
import { IsEmpty } from '../../../Public/Biz/IsEmpty';
import {Parse2json} from '../../../Public/Biz/Parse2json.js';
import ItemIcon from '../../../Component/ItemIcon';
import styles from './styles';
import px from '../../../Biz/px.js';
/**
 * @author cy
 * 右侧筛选弹框
 */
export default class SideDialog extends Component {
    constructor(props) {
        super(props);
        let initid = !IsEmpty(this.props.shopList) ?  this.props.shopList[0].id : ''; //默认选中的店铺id
        this.state={
            shopList:this.props.shopList, //店铺列表
            filterList:[ //筛选列表
                {
                    id:0,
                    name:'店铺',
                    active:!IsEmpty(this.props.shopid) ?  this.props.shopid : initid,
                    list:this.props.shopList,
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
                        active:!IsEmpty(nextProps.shopid) ?  nextProps.shopid : initid,
                        list:nextProps.shopList,
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

    //确认筛选
    submitFilter=()=>{
        this.props.submitFilter(Parse2json(JSON.stringify(this.state.filterList)));
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
        this.props.reset();
    }

    //选择筛选操作
    changeFilter = (parent,child) =>{
        let arr=Parse2json(JSON.stringify(this.state.filterList));
        this.state.filterList.map((item,key)=>{
            if (parent==item.id) {
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
                                        {/* if (window.__weex_env__.platform == "android") { */}
                                            icon=<ItemIcon code={"\ue8b7"} iconStyle={styles.tagIcon}/>;
                                        {/* } else {
                                            icon=<ItemIcon code={"\ue8b7"} iconStyle={[styles.tagIcon,{bottom:px(-3)}]}/>;
                                        } */}
                                    }
                                    let shopType = '';
                                    switch (listItem.shop_type) {
                                        case 'taobao':shopType = '淘宝';break;
                                        case 'pdd':shopType = '拼多多';break;
                                        case 'wc':shopType = '旺铺';break;
                                        default:break;
                                    }
                                    return (
                                        <View onClick={()=>{this.changeFilter(item.id,listItem.id)}}
                                        style={item.active==listItem.id ? styles.filterActive : styles.filterItem}>
                                            <Text style={item.active==listItem.id ? styles.filterActiveText : styles.filterItemText}>
                                            {shopType}({listItem.shop_name})
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

    //修改搜索框的内容
    changeInput = (value) =>{
        this.setState({
            searchValue:value
        });
    }
    //确认筛选
    submitFilter = () =>{
        let keyWord = this.state.searchValue;
        let shopId = this.state.filterList[0].active;
        this.refs.modal1.hide();
        this.props.submitFilter(keyWord,shopId);
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

        let deleteIcon='';
        if (this.state.searchValue!='') {
            deleteIcon=
            <ItemIcon code={"\ue658"} iconStyle={styles.deleteIcon} onClick={()=>{
                this.setState({
                    searchValue:''
                });
                this.props.deleteSubjectKey();
            }}/>;
        }

        return(
            <Dialog ref="modal1" contentStyle={contentStyle}  maskClosable={false}>
                <View style={styles.normalLine}>
                    <Text style={{fontSize:px(24)}}>筛选</Text>
                </View>
                <View style={{paddingLeft:px(20),marginTop:px(24),marginBottom:px(24)}}>
                    <Text style={{color:'#666666',fontSize:px(24)}}>订单关键词</Text>
                </View>
                <View style={styles.inputLine}>
                    <View style={styles.inputBox}>
                        <Input
                        ref="searchInput"
                        style={styles.selectInput}
                        value={this.state.searchValue}
                        placeholder={"请输入订单编号、商品关键词、货号"}
                        onChange={(value)=>{this.changeInput(value)}}
                        />
                        {deleteIcon}
                    </View>
                    <ItemIcon code={"\ue6ac"} iconStyle={styles.selectIcon}/>
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