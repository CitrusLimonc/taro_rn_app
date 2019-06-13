import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, ScrollView} from '@tarojs/components';
import { Toast } from '@ant-design/react-native';
import Dialog from '../Dialog';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import ItemIcon from '../ItemIcon';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import px from '../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 状态
 */
export default class PddCateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pddCategories:[],
            shopId:'',
            choosedPddCates:[0],
            shopType:'pdd'
        };
        this.cidNumber = 0;
    }

    componentWillReceiveProps(nextProps){
        let param = {};
        if (nextProps.shopId != this.state.shopId) {
            param.shopId = nextProps.shopId;
        }
        if (nextProps.shopType != this.state.shopType) {
            param.shopType = nextProps.shopType;
        }
        this.setState({
            ...param
        });

    }

    show = (shopId,shopType) =>{
        this.getPddGoodsCats(0,shopId,shopType,(rsp)=>{
            if(!IsEmpty(rsp.result)){
                if (this.props.from == 'setting') {
                    this.props.updateState({
                        dialogFlag:'pddcategory'
                    });
                }
                this.setState({
                    pddCategories:rsp.result,
                    choosedPddCates:[0],
                    shopId:shopId,
                    shopType:shopType
                });
                this.refs.categryPddDialog.show();
            } else {
                Toast.info('类目获取失败，请稍候重试', 2);
            }
        });
    }

    hide = () =>{
        this.refs.categryPddDialog.hide();
    }

    getPddGoodsCats = (parentCatId,shopId,shopType,callback,retry = 0) =>{
        let url = "Distributeproxy/getPddGoodsCats";
        if (shopType!='pdd') {
            url = "Distributeproxy/getOtherCats";
        }
        NetWork.Get({
            url:url,
            data:{
                parentCatId:parentCatId,
                shopId:shopId
            }
        },(rsp)=>{
            console.log('Distributeproxy/getPddGoodsCats',rsp);
            //有数据
            if(!IsEmpty(rsp.code) && rsp.code == '404' && rsp.msg == "miss-toke"){
                //重试
                retry = retry + 1;
                if (retry <= 3) {
                    this.getPddGoodsCats(parentCatId,shopId,shopType,callback,retry);
                } else {
                    callback({});
                }
            } else {
                callback(rsp);
            }
        });
    }

    //获取拼多多类目
    getChildCid = (cates,type) =>{
        let {shopId,shopType} = this.state;
        let goOnFlag = false;
        if (type == 'back') {
            goOnFlag = true;
        }
        if (this.cidNumber < 4 || goOnFlag) {
            let parentCatId = '';
            if (type == 'back') {
                if (this.state.choosedPddCates.length > 1) {
                    this.state.choosedPddCates.splice(this.state.choosedPddCates.length-1,1);
                }
                parentCatId = this.state.choosedPddCates[this.state.choosedPddCates.length-1];
                this.cidNumber --;
            } else {
                parentCatId = shopType == 'pdd' ? cates.cat_id : cates.cid;
                this.cidNumber ++;
                this.state.choosedPddCates.push(parentCatId);
            }

            console.log('this.state.choosedPddCates',this.state.choosedPddCates);

            if (this.cidNumber < 0 ) {
                this.cidNumber = 0;
            } else {
                this.getPddGoodsCats(parentCatId,shopId,shopType,(rsp)=>{
                    if(!IsEmpty(rsp.result)){
                        this.setState({
                            pddCategories:rsp.result
                        });
                    } else {
                        this.cidNumber = 0;
                        if (this.props.from == 'setting') {
                            console.log('updateState',cates);
                            this.props.updateState({
                                pddCateSet:cates
                            });
                        } else {
                            this.props.callback(cates);
                        }
                        this.refs.categryPddDialog.hide();
                    }
                });
            }

        } else {
            this.cidNumber = 0;
            if (this.props.from == 'setting') {
                this.props.updateState({
                    pddCateSet:cates
                });
            } else {
                this.props.callback(cates);
            }
            this.refs.categryPddDialog.hide();
        }
    }

    //渲染拼多多的类目
    renderPddCategories = () =>{
        let doms = [];
        let {shopType} = this.state;
        this.state.pddCategories.map((item,key)=>{
            let catName = shopType == 'pdd' ? item.cat_name : item.name;
            doms.push(
                <View style={styles.radioLine} onClick={()=>{this.getChildCid(item)}}>
                    <Text style={{fontSize:px(32),color:'#333333'}}>{catName}</Text>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(32),color:'#979797'}}/>
                    </View>
                </View>
            );
        });

        return doms;
    }

    render(){
        return (
            <Dialog 
            ref="categryPddDialog" 
            maskClosable={true} 
            contentStyle={styles.categoryModel}
            >
                <View style={styles.body}>
                    <View style={styles.head}>
                        <ItemIcon code={"\ue647"}
                        boxStyle={{position:'absolute',left:px(24),top:px(20)}}
                        iconStyle={{fontSize:px(42),color:'#666666'}}
                        onClick={()=>{this.getChildCid({},'back')}}
                        />
                        <Text style={styles.textHead}>选择商品类目</Text>
                    </View>
                    <ScrollView style={{flex:1}}>
                    {this.renderPddCategories()}
                    </ScrollView>
                </View>
            </Dialog>
        );
    }
}
