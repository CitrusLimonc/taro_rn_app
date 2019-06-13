import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , ScrollView,Radio,Checkbox,Input,RadioGroup,CheckboxGroup} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import AyButton from '../../Component/AyButton/index';
import Dialog from '../../Component/Dialog';
import Event from 'ay-event';
import ItemIcon from '../../Component/ItemIcon';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import styles from './styles';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 铺货修改页面（属性）
 */
export default class DistributionChanges extends Component {
    constructor(props) {
        super(props);
        this.state={
            shopId:'',
            resultData:{},
            attributes:[],
            lastAttr:{},
            fromPage:'',
            logId:'',
            dialogContent:''
        };
        this.lastAttr = {};
        this.attributes = [];
        this.loading = '';
        let self = this;
        //从搜索页面返回刷新数据
        Event.on('App.add_search_back',(data) => {
            self.attributes.map((item,key)=>{
                if (item.name == '品牌') {
                    self.attributes[key].value = data.value;
                    self.attributes[key].showValue = data.displayName;
                }
            });
            this.setState({
                attributes:self.attributes
            });
        });
    }

    config = {
        navigationBarTitleText: '修改属性'
    }
    
    componentDidMount(){
        let self = this;
        //获取所有属性(缓存)
        this.loading = Toast.loading('加载中...');
        LocalStore.Get(['go_to_change_attributes'],(result) => {
            console.log('go_to_change_attributes',result);
            if (!IsEmpty(result)) {
                let resultData = Parse2json(result.go_to_change_attributes);
                console.log('go_to_change_attributes-------',resultData);
                let fromPage = '';
                let logId = '';
                if (!IsEmpty(resultData.from)) {
                    fromPage = resultData.from;
                }
                if (!IsEmpty(resultData.log_id)) {
                    logId = resultData.log_id;
                }
                //获取当前铺货日志的结果
                self.getDisResult(logId,(res)=>{
                    if (!IsEmpty(res.dis_result)) {
                        res.dis_result = Parse2json(res.dis_result);
                    }
                    console.log('typeof',typeof(res.dis_result));
                    if (typeof(res.dis_result) == "string") {
                        Portal.remove(self.loading);
                        Toast.info('获取数据失败，请去淘宝卖家中心修改并上架', 2);
                        setTimeout(function(){
                            GoToView({page_status:'pop'});
                        },1000);
                    } else {
                        self.setState({
                            shopId:resultData.shop_id,
                            logId:logId,
                            fromPage:fromPage,
                            resultData:res.dis_result,
                            attributes:res.dis_result.unfilledProps
                        });
                        self.attributes = res.dis_result.unfilledProps;
                        Portal.remove(self.loading);
                    }
                });
            }
        });

    }

    //获取单条日志的铺货结果
    getDisResult = (logId,callback) =>{
        NetWork.Get({
            url:'Orderreturn/getOneLog',
            data:{
                logId:logId
            }
        },(rsp)=>{
            console.log('Orderreturn/getOneLog',rsp);
            //有数据
            if (!IsEmpty(rsp)) {
                callback(rsp);
            } else {
                callback({dis_result:{}});
            }
        },(error)=>{
            callback({dis_result:{}});
            console.error(error);
        });
    }

    //去选择品牌
    goToBrand = () =>{
        let cid = this.state.resultData.cid;
        LocalStore.Set({'go_to_select_brands':cid});
        GoToView({status:'SelectBrand'});
    }

    //渲染所有属性
    getAttributes = () =>{
        let attributes = this.state.attributes;
        let doms = [];
        attributes.map((item,key)=>{
            //品牌单个处理
            if(item.name == '品牌'){
                doms.push(
                    <View style={styles.attLines} onClick={()=>{this.goToBrand()}}>
                        <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{item.name}</Text>
                        <Text style={{marginLeft:px(18),color:'#666666',fontSize:px(28)}}>
                        {
                            IsEmpty(item.showValue) ? '请选择' : item.showValue
                        }
                        </Text>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                            <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(32),color:'#979797'}}/>
                        </View>
                    </View>
                );
            } else {
                let rightCode = '\ue6a7';
                switch (item.type) {
                    case 'singleCheck':{
                        if (!IsEmpty(item.inProp) && item.inProp.type=='input') {
                            //既可输入也可选择
                            doms.push(
                                <View style={styles.attLines}>
                                    <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{item.name}:</Text>
                                    <View style={{marginLeft:px(18)}}>
                                        <Input style={styles.inputStyle} placeholder={"请输入"}
                                        value={attributes[key].showValue}
                                        onInput={(value)=>{this.inputChange(value,attributes[key])}}
                                        onChange={()=>{this.inputOnBlur()}}
                                        />
                                    </View>
                                    <View style={{flex:1,alignItems:'flex-end'}} onClick={()=>{this.renderOptions(item,key)}}>
                                        <ItemIcon code={rightCode} iconStyle={{fontSize:px(32),color:'#979797'}}/>
                                    </View>
                                </View>
                            );
                        } else {
                            //只可单选
                            doms.push(
                                <View style={styles.attLines} onClick={()=>{this.renderOptions(item,key)}}>
                                    <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{item.name}:</Text>
                                    <Text style={{marginLeft:px(18),color:'#666666',fontSize:px(28)}}>
                                    {
                                        IsEmpty(item.showValue) ? '请选择' : item.showValue
                                    }
                                    </Text>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                        <ItemIcon code={rightCode} iconStyle={{fontSize:px(32),color:'#979797'}}/>
                                    </View>
                                </View>
                            );
                        }

                    } break;
                    case 'multiCheck':{ //多选
                        doms.push(
                            <View style={styles.attLines} onClick={()=>{this.renderOptions(item,key)}}>
                                <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{item.name}:</Text>
                                <Text style={{marginLeft:px(18),color:'#666666',fontSize:px(28)}}>
                                {
                                    IsEmpty(item.showValue) ? '请选择' : item.showValue
                                }
                                </Text>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                    <ItemIcon code={rightCode} iconStyle={{fontSize:px(32),color:'#979797'}}/>
                                </View>
                            </View>
                        );
                    } break;
                    case 'input':{ //只可输入
                        doms.push(
                            <View style={styles.attLines}>
                                <Text style={{fontSize:px(28),color:'#4A4A4A'}}>{item.name}:</Text>
                                <View style={{marginLeft:px(18)}}>
                                    <Input style={styles.inputStyle} placeholder={"请输入"}
                                    value={attributes[key].value}
                                    onInput={(value)=>{this.inputChange(value,attributes[key])}}
                                    onChange={()=>{this.inputOnBlur()}}/>
                                </View>
                            </View>
                        );
                    } break;
                    default: break;
                }
            }
        });
        return doms;
    }

    //input框的修改
    inputChange = (value,attr) =>{
        console.log(value);
        this.attributes.map((item,key) =>{
            if (!IsEmpty(item.rules) && !IsEmpty(item.rules.fieldId)) {
                item.childs.map((val,idx)=>{
                    if (val.id == attr.id) {
                        this.attributes[key].childs[idx].value = value.value;
                    }
                });
            } else {
                if (item.id == attr.id) {
                    this.attributes[key].value = value.value;
                }
            }
        });
    }

    //input框失去焦点
    inputOnBlur = () =>{
        this.setState({
            attributes:this.attributes
        });
    }

    //显示单选弹窗
    renderOptions = (lastAttr,index) =>{
        console.log(lastAttr,index);
        this.lastAttr = lastAttr;
        this.setState({
            lastAttr:lastAttr
        });
        this.refs.optionDialog.show();
    }

    //渲染弹窗主体
    renderDialogContent = () =>{
        let lastAttr = this.state.lastAttr;
        console.log('renderDialogContent-state',lastAttr);
        console.log('renderDialogContent-this',this.lastAttr);
        switch (lastAttr.type) {
            case 'singleCheck':{
                if (IsEmpty(lastAttr.value)) {
                    lastAttr.value = lastAttr.options[0].value;
                    this.lastAttr.value = lastAttr.options[0].value;
                }
                //只可单选
                return (
                    <RadioGroup ref="radioGroup" style={{flex:1}} defaultValue={lastAttr.value} onChange={(value)=>{this.radioOnChange(value)}}>
                        {
                            lastAttr.options.map((item,key)=>{
                                return (
                                    <View style={styles.radioLine}>
                                        <Text style={{fontSize:px(32),color:'#333333'}}>{item.displayName}</Text>
                                        <View style={{flex:1,alignItems:'flex-end'}}>
                                            <Radio size="small" value={item.value} type="dot"></Radio>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </RadioGroup>
                );
            } break;
            case 'multiCheck':{ //多选
                if (IsEmpty(lastAttr.value)) {
                    this.lastAttr.value = [];
                    lastAttr.value = [];
                }
                console.log(lastAttr.value);
                return (
                    <CheckboxGroup style={{flex:1}} value={lastAttr.value} onChange={(value)=>{this.checkboxOnChange(value)}}>
                        {
                            lastAttr.options.map((item,key)=>{
                                return (
                                    <View style={styles.radioLine}>
                                        <Text style={{fontSize:px(32),color:'#333333'}}>{item.displayName}</Text>
                                        <View style={{flex:1,alignItems:'flex-end'}}>
                                            <Checkbox size="small" value={item.value} type="normal"></Checkbox>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </CheckboxGroup>
                );
            } break;
            default: break;
        }
    }

    //修改单选项
    radioOnChange = (value) =>{
        console.log('radios',value);
        this.lastAttr.value = value;
        let flag = false;
        this.attributes.map((item,key)=>{
            if (item.id == this.lastAttr.id) {
                for (var i = 0; i < item.options.length; i++) {
                    if (value == item.options[i].value) {
                        this.attributes[key].value = item.options[i].value;
                        this.attributes[key].showValue = item.options[i].displayName;
                    }
                }
            }
        });
        if (!IsEmpty(this.lastAttr.childs)) {
            this.lastAttr.childs.map((item,key)=>{
                if (item.rules.value == value) {
                    this.lastAttr = item;
                    flag = true;
                }
            });
        }
        if (flag) {
            this.setState({
                lastAttr:this.lastAttr
            });
        } else {
            if (!IsEmpty(this.lastAttr.rules) && !IsEmpty(this.lastAttr.rules.fieldId)) {
                this.attributes.map((item,key)=>{
                    if (item.value == this.lastAttr.rules.value) {
                        for (var i = 0; i < this.lastAttr.options.length; i++) {
                            if (value == this.lastAttr.options[i].value) {
                                this.attributes[key].childs[i].value = this.lastAttr.options[i].value;
                                this.attributes[key].showValue += '>>'+this.lastAttr.options[i].displayName;
                            }
                        }
                    }
                });
            }
        }
    }

    //修改多选项
    checkboxOnChange = (value) =>{
        console.log('checkbox',value);
        this.lastAttr.value = value;
        this.attributes.map((item,key)=>{
            if (item.id == this.lastAttr.id) {
                this.attributes[key].value = value;
                this.attributes[key].showValue = '已选择（'+value.length+'）';
            }
        });
        this.setState({
            lastAttr:this.lastAttr
        });
    }
    //确认选择属性
    submitDialog = () =>{
        this.setState({
            attributes:this.attributes
        });
        this.refs.optionDialog.hide();
    }

    //保存并上架
    saveAndListing = () =>{
        let attributes = this.state.attributes;
        let num_iid = this.state.resultData.num_iid;
        let propsStr = '';
         /* 遍历所有值，转化为字符串类型 */
        let input_pids = '';
        let input_str = '';
        attributes.map((value,key)=>{
            if (value.type == 'input' || (value.type == 'singleCheck' && !IsEmpty(value.inProp) && value.inProp.type == 'input')) {
                let fieldId = value.id.replace('prop_','');
                let fieldValue = value.value;
                input_pids += fieldId + ',';
                input_str += fieldValue + ',';
            } else {
                if (typeof(value.value) == 'string') {
                    let fieldId = value.id.replace('prop_','');
                    let fieldValue = value.value.replace('prop_','');
                    propsStr = propsStr + fieldId + ':' + fieldValue + ';';
                    if (!IsEmpty(value.childs)) {
                        value.childs.map((item,idx)=>{
                            if (value.value == item.rules.value) {
                                propsStr = propsStr + value.value + ':' + item.value + ';';
                            }
                        });
                    }
                } else {
                    for (var i = 0; i < value.value.length; i++) {
                        let fieldId = value.id.replace('prop_','');
                        let fieldValue = value.value[i].replace('prop_','');
                        propsStr = propsStr + fieldId + ':' + fieldValue + ';';
                    }
                }
            }
        });

        input_pids = input_pids.slice(0,-1);
        input_str = input_str.slice(0,-1);

        console.log('propsStr',propsStr);
        console.log('input_pids',input_pids);
        console.log('input_str',input_str);
        let have_props_value = this.state.resultData.have_props_value.split(',');
        for (let i = have_props_value.length-1; i >=0 ; i--) {
            have_props_value[i] = have_props_value[i].split(':');
            if (propsStr.indexOf(have_props_value[i][0]) >=0 ) {
                have_props_value.splice(i,1);
            }
        }
        for (let i = have_props_value.length-1; i >=0 ; i--) {
            have_props_value[i] = have_props_value[i].join(':');
        }
        propsStr = propsStr + have_props_value.join(';');
        let params = [{
            cid:this.state.resultData.cid,
            productId:this.state.resultData.origin_num_iid,
            num_iid:this.state.resultData.num_iid,
            props:propsStr,
            onsale:true,
            logId:this.state.logId
        }];

        if (!IsEmpty(input_pids)) {
            params.input_pids = input_pids;
            params.input_str = input_str;
        }

        console.log(params);

        //修改并上架
        NetWork.Post({
            url:'Distributeproxy/updateProxyItemProps',
            data:{
                param:JSON.stringify(params)
            }
        },(rsp)=>{
            console.log('Distributeproxy/updateProxyItemProps',rsp);
            if (!IsEmpty(rsp)) {
                let result = rsp.result[0];
                if (!IsEmpty(result.sub_msg)) {
                    let subMsg = result.sub_msg;
                    if (result.sub_msg.indexOf('more seconds') > -1) {
                        subMsg = '您的操作过于频繁，请稍后再试~';
                    } else if (result.sub_msg.indexOf('保证金') > -1 && result.sub_msg.indexOf('，您当前余额为') > -1) {
                        let subIdx = result.sub_msg.indexOf('，您当前余额为');
                        subMsg = result.sub_msg.substring(0,subIdx);
                    }
                    this.setState({
                        dialogContent:subMsg
                    });
                    this.refs.submitDialog.show();
                } else {
                    if (this.state.fromPage == 'log') {
                        Event.emit('APP.change_attr_log',{logId:this.state.logId});
                    } else {
                        Event.emit('APP.change_attr_back',{shopId:this.state.shopId});
                    }
                    GoToView({page_status:'pop'});
                }
            }
        },(error)=>{
            console.error(error);
        });
    }

    render(){
        return (
            <View>
                <ScrollView style={{flex:1,backgroundColor:'#ffffff'}}>
                    {this.getAttributes()}
                </ScrollView>
                <View style={styles.footLine}>
                    <View style={styles.footRight} onClick={()=>{this.saveAndListing()}}>
                        <Text style={{fontSize:px(32),color:'#ffffff'}}>保存修改并上架</Text>
                    </View>
                </View>
                <Dialog 
                ref="optionDialog" 
                maskClosable={false} 
                contentStyle={styles.categoryModel}
                >
                    <View style={styles.body}>
                        <ScrollView style={{flex:1}}>
                            {this.renderDialogContent()}
                        </ScrollView>
                    </View>
                    <View style={styles.footer}>
                        <AyButton style={styles.dlgBtn} type="secondary" onClick={()=>{this.submitDialog()}}>确定</AyButton>
                    </View>
                </Dialog>
                <Dialog 
                ref={"submitDialog"}
                contentStyle={styles.modal2Style}
                >
                    <View style={styles.dialogContent}>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <Text style={{marginTop:px(15),fontSize:px(38),color:'#4A4A4A'}}>温馨提示</Text>
                        </View>
                        <View style={styles.tokenBody}>
                            <Text style={{fontSize:px(24),color:'#4A4A4A'}}>{this.state.dialogContent}</Text>
                        </View>
                        <View style={styles.foot}>
                            <View style={[styles.footBtn,{borderBottomRightRadius:px(8),width:px(612)}]}
                            onClick={()=>{this.refs.submitDialog.hide();}}>
                                <Text style={styles.fontStyle}>我知道了</Text>
                            </View>
                        </View>
                    </View>
                </Dialog>
            </View>
        );
    }
}