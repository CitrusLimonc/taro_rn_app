import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,ScrollView,Button,Dialog,Radio} from '@tarojs/components';
import Event from 'ay-event';
import styles from './styles';
import AiyongDialog from '../../../Component/AiyongDialog/index';
import PddCateDialog from '../../../Component/PddCateDialog';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../../Public/Common/NetWork/NetWork.js';
import ItemIcon from '../../../Component/ItemIcon';
import { GoToView } from '../../../Public/Biz/GoToView';
import px from '../../../Biz/px.js';

/**
 * @author wzm
 * 基本信息组件
 */
export default class Tabmessage extends Component {
    constructor(props){
        super(props);
        this.state = {
            alldata:this.props.alldata, //数据源
            faildReson:'', //失败原因
            shopId:this.props.shopId,
            pddCateSet:{},
            tempList:[],
            raidoSet:{},
            dialogSet:{ //弹窗的显示内容
                dialogTitle:'',
                dialogContentText:'',
                dialogCancelText:'',
                dialogOkText:'',
                errorMsg:''
            },
        };
        this.tempSet = {};
        this.tempPageNo = 1;
    }
    componentWillReceiveProps(nextProps){
        let param = {};
        if (nextProps.alldata) {
            param.alldata = nextProps.alldata;
        }
        if (nextProps.shopId) {
            param.shopId = nextProps.shopId;
        }
        this.setState({
            ...param
        });

    }
    //属性每一项
    renderAttributes = () =>{
        let doms = [];
        let pics = [];
        let productInfo = this.state.alldata.props_name;
        if (!IsEmpty(productInfo)) {
            let a = productInfo.replace(/;颜色:/g,',');
            let picnew = a.replace(',',';颜色:');
            pics = picnew.split(";");
            // pics = productInfo.split(";");
            // for(let i=0;i<pics.length;i++){
            //     let picsone = pics[i].split(":");
            //     for(let j=i+1;j<pics.length-j;j++){
            //         let picsonein = pics[j].split(":");
            //         if(picsone[0]==picsonein[0]){
            //             let changeone = ','+ picsonein[1];
            //             pics[i].replace(/;/g,changeone);
            //             j--;
            //         }
            //     }
            // }
            pics.map((item,index)=>{
                let one = pics[index].split(":");
                doms.push(
                <View style={styles.attrLine}>
                    <Text style={[styles.attrText,{width:380}]}>{one[0]}</Text>
                    <Text style={styles.attrText}>{one[1]}</Text>
                </View>
                )
            })
        }
        return doms;
    }
    //点击分销
    goTook = () =>{
        //申请分销
        this.refs.closeDialog.hide();
        GoToView({status:"https://page.1688.com/html/fa9028cc.html?sellerId=" + this.state.alldata.origin_id,page_status:'special'});
    }
    // 点击同步库存
    getVan=()=>{
        const self = this;
        NetWork.Get({
            url:'Orderreturn/changeProductSetting',
            params:{
                numIid:this.props.numIid,
                shopType:this.props.shopType,
                productID:this.props.productId,
                type:'stock',
            }
        },(data)=>{
            if(data.code == 200){
                Taro.showToast({
                    title: '同步库存成功',
                    icon: 'none',
                    duration: 2000
                });
            }else{
                self.setState({
                    faildReson:data.msg,
                    dialogSet:{ //弹窗的显示内容
                        dialogTitle:'同步库存失败',
                        dialogContentText:this.state.faildReson,
                        dialogCancelText:'取消',
                        dialogOkText:'申请分销'
                    }
                });
                self.refs.closeDialog.show();
            }
        });
    }
    //弹窗的确认操作
    closeOk= () =>{
        const self = this;
        this.updateRelation(self.props.shopListone,'');
    }
    //取消代销
    updateRelation = (item,updateType) =>{
        let param = {
            shopName:item.shop_name,
            shopType:item.shop_type,
            shopId:item.shop_id,
            productId:this.props.productId,
            numIid:this.props.numIid,
            // numIid:537794396775,
            needDelete:0,
        };
        if (updateType == 'delete') {
            param.type = 'delete';
        }
        NetWork.Post({
            url:'Orderreturn/deleteRelation',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/deleteRelation',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                if (param.needDelete == '0') {
                    if (updateType == 'delete') {
                        Taro.showToast({
                            title: '删除成功~',
                            icon: 'none',
                            duration: 2000
                        });
                        Event.emit('App.changeAlldata');
                    } else {
                        Taro.showToast({
                            title: '取消代销成功~',
                            icon: 'none',
                            duration: 2000
                        });
                        Event.emit('App.changeAlldata');
                    }
                }
            }
            this.refs.closeDialog.hide()
            Taro.hideLoading();
        },(error)=>{

        });
    }

    btnOnPress = (text) =>{
        switch (text) {
            case '代销中':{
                this.setState({
                    dialogSet:{ //弹窗的显示内容
                        dialogTitle:'取消代销关系',
                        dialogContentText:'您正在取消该产品的代销合作，取消后该商品将不能在爱用旺铺中展示',
                        dialogCancelText:'取消',
                        dialogOkText:'确定'
                    }
                });
                this.refs.closeDialog.show();
            } break;
            case '下架':{//updatePddStatus
                this.updatePddStatus('0');
            } break;
            case '上架':{
                this.updatePddStatus('1');
            } break;
            default:break;
        }
    }

    updatePddStatus = (isOnsale) =>{
        let {shopId,alldata} = this.state;
        let param = {
            is_onsale:isOnsale,
            shopId:shopId,
            numIid:this.props.numIid
        };
        NetWork.Post({
            url:'Orderreturn/updatePddStatus',
            data:param
        },(rsp)=>{
            console.log('Orderreturn/updatePddStatus',rsp);
            //有结果
            if (!IsEmpty(rsp.code) && rsp.code == '200') {
                //成功了
                if (isOnsale == '0') {
                    alldata.approve_status = '2';
                    Taro.showToast({
                        title: '下架成功',
                        icon: 'none',
                        duration: 2000
                    });
                } else if (isOnsale == '1') {
                    alldata.approve_status = '1';
                    Taro.showToast({
                        title: '上架成功',
                        icon: 'none',
                        duration: 2000
                    });
                }
                this.setState({
                    alldata:alldata
                });
            } else {
                Taro.showToast({
                    title: rsp.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    }

    updateState = (data) =>{
        this.setState({
            ...data
        });
    }

    showTemp = () =>{
        let {alldata} = this.state;
        Taro.showLoading({ title: '加载中...' });
        NetWork.Get({
            url:'Distributeproxy/getTemplateModel',
            data:{
                pageNo:1,
                shopType:alldata.shop_type,
                shopName:alldata.shop_name
            }
        },(rsp)=>{
            console.log('distribution/getTemplateModel',rsp);
            //有数据
            if (!IsEmpty(rsp.result)) {
                this.setState({
                    tempList:rsp.result,
                });
            } else {
                this.setState({
                    tempList:[{template_id:'-1',template_name:'[1688一件代发]包邮模板(自动创建)'}],
                });
            }
            Taro.hideLoading();
            this.refs.chooseDialog.show();
        },(error)=>{
            alert(JSON.stringify(error));
        });
    }

    //设置选项有修改时
    changeRadio = (value) =>{
        this.state.tempList.map((item,key)=>{
            if (item.template_id == value) {
                this.tempSet = item;
            }
        });
    }

    //无限滚动
    tempEndReached = () =>{
        let {alldata} = this.state;
        this.tempPageNo++;
        NetWork.Get({
            url:'Distributeproxy/getTemplateModel',
            data:{
                pageNo:this.tempPageNo,
                shopType:alldata.shop_type,
            }
        },(rsp)=>{
            console.log('distribution/getTemplateModel',rsp);
            //有数据
            if (!IsEmpty(rsp.result)) {
                this.setState({
                    tempList:this.state.tempList.concat(rsp.result)
                });
            }
        },(error)=>{
            alert(JSON.stringify(error));
        });
    }

    //获取所有单选项
    getRadios = () =>{
        let doms = [];
        let data = [];
        let title = '';
        let seletctKey = '';
        data = this.state.tempList;
        seletctKey = this.state.tempSet;
        console.log('getRadios',data,seletctKey);
        data.map((item,key)=>{
            doms.push(
                <View style={styles.radioLine}>
                    <Text style={{fontSize:px(32),color:'#333333'}}>
                    {item.template_name}
                    </Text>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        <Radio size="small" value={item.template_id+''} type="dot"></Radio>
                    </View>
                </View>
            );
        });
        return doms;
    }

    //单个设置确认
    changeSet = () =>{
        let {alldata,shopId} = this.state;
        if (IsEmpty(this.tempSet)) {
            this.tempSet = {
                template_id:alldata.cost_template_id,
                template_name:alldata.cost_template_name,
            };
        }
        //修改商品
        let param = {
            numIid:this.props.numIid,
            shopId:shopId,
            editType:'cost_template_id',
            cost_template_id:this.tempSet.template_id
        };
        this.props.editItemForPdd(param,(rsp)=>{
            if (rsp.code == '200') {
                Taro.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 2000
                });
                alldata.cost_template_id = this.tempSet.template_id;
                alldata.cost_template_name = this.tempSet.template_name;
                this.setState({
                    alldata:alldata
                });
            } else {
                Taro.showToast({
                    title: rsp.msg,
                    icon: 'none',
                    duration: 2000
                });
            }
        });
        this.refs.chooseDialog.hide();
    }

    dialogOnSubmit = (title) =>{
        switch (title) {
            case '同步库存失败':{
                this.goTook();
            } break;
            case '取消代销关系':{
                this.closeOk();
            } break;
            default:break;
        }
    }

    editCategory = (cates) =>{
        let {alldata,shopId} = this.state;
        //修改商品
        let param = {
            numIid:this.props.numIid,
            shopId:shopId,
            editType:'cat_id',
            cat_id:cates.cat_id
        };
        this.props.editItemForPdd(param,(rsp)=>{
            if (rsp.code == '200') {
                Taro.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 2000
                });
                alldata.cat_id = cates.cat_id;
                alldata.cat_name = cates.cat_name;
                this.setState({
                    alldata:alldata
                });
            } else {
                Taro.showToast({
                    title: '修改失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    }
    
    render(){
        let {alldata,dialogSet} = this.state;
        let sellState = '';
        let sellBtn = '';
        if (alldata.shop_type == 'wc') {
            sellState = '代销中';
            if(alldata.is_del==0){
                if(alldata.relation_is_cancel==1){
                    sellState = '终止代销';
                }
            }else{
                if(alldata.relation_is_cancel==1){
                    sellState = '已删除';
                }
            }
            sellBtn = '取消代销';
        } else if (alldata.shop_type == 'pdd') {
            sellState = '出售中';//1:上架，2：下架，3：售罄 4：已删除
            switch (alldata.approve_status) {
                case '1':case 1:sellState = '出售中';sellBtn = '下架';break;
                case '2':case 2:sellState = '已下架';sellBtn = '上架';break;
                case '3':case 3:sellState = '已售罄';sellBtn = '下架';break;
                case '4':case 4:sellState = '已删除';break;
                default:break;
            }
        }
        
        return (
            IsEmpty(alldata) ? 
            ''
            :
            <ScrollView style={styles.commonLine} >
                <View style={styles.title} onClick = {()=>{
                    if(alldata.shop_type == 'pdd'){
                        this.props.showEditTitle();
                    }
                }}>
                    <Text style={styles.titleTop}>标题</Text>
                    <View style={{flexDirection:'row',}}>
                        <Text style={[styles.titleText,{width:px(650)}]}>{alldata.name}</Text>
                        {
                            alldata.shop_type == 'pdd' ?
                            <ItemIcon code={"\ue69e"} iconStyle={{fontSize:px(32),color:'#979797',marginTop:px(16)}}/>
                            :
                            ''
                        }
                    </View>
                </View>
                <View style={styles.line}>
                    <Text style={styles.titleTop}>商品状态:&nbsp;</Text>
                    <Text style={styles.lineText}>{sellState}</Text>
                    {
                        sellBtn != '' ?
                        <Button onClick={()=>{this.btnOnPress(sellBtn)}} type="normal">{sellBtn}</Button>
                        :
                        ''
                    }
                </View>
                {
                    !IsEmpty(alldata.art_id)?(<View style={styles.line}>
                        <Text style={styles.titleTop}>商家编码:&nbsp;</Text>
                        <Text style={styles.lineText}>{alldata.art_id}</Text>
                    </View>):''
                }
                {
                    alldata.shop_type == 'pdd' ? 
                    <View style={styles.line} onClick = {()=>{this.refs.categryPddDialog.show(alldata.shop_id,alldata.shop_type);}}>
                        <Text style={styles.titleTop}>商品分类:&nbsp;</Text>
                        <Text style={styles.lineText}>{alldata.cat_name}</Text>
                    </View>
                    :
                    <View style={styles.line}>
                        <Text style={styles.titleTop}>商品分类:&nbsp;</Text>
                        <Text style={styles.lineTextgray}>暂不支持</Text>
                    </View>
                }
                {
                    alldata.shop_type == 'pdd' ? 
                    ''
                    :
                    !IsEmpty(alldata.props_name)?(
                        <View style={styles.line} onClick={()=>{this.refs.attrDialog.show()}}>
                            <Text style={styles.titleTop}>商品属性:&nbsp;</Text>
                            <Text style={styles.lineText}>点击查看</Text>
                            <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#979797'}}/>
                        </View>
                    ):''
                }
                {
                    alldata.shop_type == 'pdd' ? 
                    <View style={styles.line} onClick={()=>{this.showTemp()}}>
                        <Text style={styles.titleTop}>运费模版:&nbsp;</Text>
                        <Text style={styles.lineText}>{alldata.cost_template_name}</Text>
                    </View>
                    :
                    <View style={styles.line}>
                        <Text style={styles.titleTop}>运费模版:&nbsp;</Text>
                        <Text style={styles.lineTextgray}>暂不支持</Text>
                    </View>
                }
                {
                    alldata.shop_type == 'wc' ? 
                    <View style={styles.line}>
                        <Text style={styles.titleTop}>库存计数:&nbsp;</Text>
                        <Text style={styles.lineText}>确认收款后减库存</Text>
                        <Button onClick={()=>{this.getVan()}} type="normal">同步供应商库存</Button>
                    </View>
                    :
                    ''
                }
                <AiyongDialog
                ref={"closeDialog"}
                title={dialogSet.dialogTitle}
                cancelText={dialogSet.dialogCancelText}
                okText={dialogSet.dialogOkText}
                content={dialogSet.dialogContentText}
                onSubmit={()=>{this.dialogOnSubmit(dialogSet.dialogTitle)}}
                onCancel={()=>{this.refs.closeDialog.hide()}}
                />
                <Dialog ref="attrDialog"
                duration={1000}
                maskClosable={true}
                maskStyle={styles.mask}
                contentStyle={styles.categoryModel}>
                    <View style={styles.body}>
                        <View style={styles.head}><Text style={styles.textHead}>产品属性</Text></View>
                        <ScrollView style={{flex:1}}>
                        {this.renderAttributes()}
                        </ScrollView>
                        <View style={styles.footer}>
                            <Button rect block style={styles.dlgBtn} type="primary" size="large" onClick={()=>{this.refs.attrDialog.hide()}}>关闭</Button>
                        </View>
                    </View>
                </Dialog>
                <PddCateDialog 
                ref="categryPddDialog" 
                from = {'changeItem'}
                updateState={this.updateState}
                shopName = {alldata.shop_name}
                callback = {this.editCategory}
                />
                <Dialog ref="chooseDialog" duration={1000} maskClosable={true} maskStyle={styles.mask} contentStyle={styles.categoryModel}>
                    <View style={styles.body}>
                        <View style={styles.head}><Text style={styles.textHead}>选择运费模板</Text></View>
                        <ScrollView style={{flex:1}} onEndReached={()=>{this.tempEndReached()}}>
                            <Radio.Group style={{flex:1}} value={alldata.cost_template_id + ''} onChange={(value)=>{this.changeRadio(value)}}>
                                {this.getRadios()}
                            </Radio.Group>
                        </ScrollView>
                    </View>
                    <View style={styles.footer}>
                        <Button rect block style={styles.dlgBtn} type="primary" size="large" onClick={()=>{this.changeSet()}}>确定</Button>
                    </View>
                </Dialog>
            </ScrollView>
        );
    }
}
