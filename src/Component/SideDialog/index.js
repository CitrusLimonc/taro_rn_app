import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Dialog} from '@tarojs/components';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import ItemIcon from '../../Component/ItemIcon';
import styles from './styles';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 批量修改库存日志-右侧筛选弹框
 */
export default class SideDialog extends Component {
    constructor(props) {
        super(props);
        this.state={
            filterList:[ //筛选条件
                {
                    id:0,
                    name:'铺货店铺',
                    active:0,
                    list:[
                        {name:'全部',id:0},
                        {name:'淘宝',id:1},
                        {name:'拼多多',id:2},
                        {name:'旺铺',id:3},
                    ],
                },
                {
                    id:1,
                    name:'修改时间',
                    active:0,
                    list:[
                        {name:'近3天',id:0},
                        {name:'近7天',id:2},
                        {name:'近30天',id:3},
                        {name:'近90天',id:4}
                    ],
                }
            ]
        };
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
            arr[key].active=0;
        });
        // this.hasFilter = false;
        this.setState({
            filterList:arr
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
            doms.push(
                <View style={{marginTop:px(50)}}>
                    <View style={{paddingLeft:px(25)}}>
                        <Text style={{color:'#666666',fontSize:px(24)}}>{item.name}</Text>
                    </View>
                    <View style={styles.items}>
                        {
                            item.list.map((listItem,index)=>{
                                let icon='';
                                if (item.active==listItem.id) {
                                    {/* if (window.__weex_env__.platform == "android") { */}
                                        icon=<ItemIcon code={"\ue8b7"} iconStyle={styles.tagIcon}/>;
                                    {/* } else {
                                        icon=<ItemIcon code={"\ue8b7"} iconStyle={[styles.tagIcon,{bottom:px(-3)}]}/>;
                                    } */}

                                }
                                return (
                                    <View onClick={()=>{this.changeFilter(item.id,listItem.id)}} style={item.active==listItem.id ? styles.filterActive : styles.filterItem}>
                                        <Text style={item.active==listItem.id ? styles.filterActiveText : styles.filterItemText}>{listItem.name}</Text>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
            );
        });

        return doms;
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
            <Dialog ref="modal1" maskStyle={maskStyle} contentStyle={contentStyle} >
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
