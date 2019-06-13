import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Input} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import styles from './styles';
import ItemIcon from '../../../../Component/ItemIcon';
import {IsEmpty} from '../../../../Public/Biz/IsEmpty';
import px from '../../../../Biz/px.js';

/**
 * @author wzm
 * 销售规格每一项组件
 */
export default class PddSku extends Component {
    constructor(props){
        super(props);
        this.state = {
            item:{}, //商品信息
            oldItem:{},
            price:0, //价格
            multi_price:0, //团购价格
            defect_num:0, //可售数量
            changeing:false, //是否有修改
        };
    }
    
    componentWillMount(){
        this.setState({
            item:this.props.data,
            price:this.props.data.price,
            multi_price:this.props.data.multi_price,
            defect_num:this.props.data.defect_num,
            oldItem:JSON.parse(JSON.stringify(this.props.data)),
        })
    }
    componentWillReceiveProps(){
        this.setState({
            item:this.props.data,
            price:this.props.data.price,
            multi_price:this.props.data.multi_price,
            defect_num:this.props.data.defect_num,
            oldItem:JSON.parse(JSON.stringify(this.props.data)),
        })
    }
    //保存修改
    hideModalok = () =>{
        let self = this;
        let {item,oldItem,price,multi_price,defect_num} = this.state;
        let pandun = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;
        //判断价格是否合法
        if(pandun.test(price)){
            item.price = price;
        }else{
            Toast.info('单买价需为大于0的小数或整数', 2);
            return ;
        }
        if(pandun.test(multi_price)){
            item.multi_price = multi_price;
        }else{
            Toast.info('团购价需为大于0的小数或整数', 2);
            return ;
        }
        //判断可售数量是否合法
        let pandunNum = /^(0|\+?[1-9][0-9]*)$/;
        if(pandunNum.test(defect_num)){
            item.defect_num = defect_num;
        }else{
            Toast.info('请输入大于等于0的整数', 2);
            return ;
        }

        let promiseArr = [];

        //看看有没有修改，或者说修改了啥，
        let changeTypes = [];
        if (oldItem.defect_num != item.defect_num) {
            //库存有修改
            changeTypes.push('num');
        }
        if (oldItem.multi_price != item.multi_price || oldItem.price != item.price) {
            //单买价格或团购价格有修改
            changeTypes.push('price');
        }
        console.log('changeTypes',changeTypes);
        console.log('editItemForPdd--oldItem',oldItem);
        console.log('editItemForPdd--item',item);

        let msg = '修改成功';
        if (!IsEmpty(changeTypes)) {
            if (changeTypes[0] == 'num') {
                var p1 = new Promise(function(resolve,reject){
                    let params = {
                        numIid:self.props.numIid,
                        shopId:self.props.shopId,
                        editType:'amount',
                        skuId:item.sku_product_id,
                        amount:item.defect_num
                    };
                    self.props.editItemForPdd(params,(rsp)=>{
                        console.log('editItemForPdd--amount--params',params);
                        console.log('editItemForPdd--amount',rsp);
                        resolve({
                            data:rsp,
                            type:'num'
                        });
                    });
                });
                promiseArr.push(p1);
            }
    
            if (changeTypes[0] == 'price' || changeTypes[1] == 'price') {
                var p2 = new Promise(function(resolve,reject){
                    let params = {
                        numIid:self.props.numIid,
                        shopId:self.props.shopId,
                        editType:'price',
                        skuId:item.sku_product_id,
                        singlePrice:item.price,
                        groupPrice:item.multi_price
                    };
                    self.props.editItemForPdd(params,(rsp)=>{
                        console.log('editItemForPdd--price--params',params);
                        console.log('editItemForPdd--price',rsp);
                        resolve({
                            data:rsp,
                            type:'price'
                        });
                    });
                });
                promiseArr.push(p2);
            }
    
            Promise.all(promiseArr).then(function(result){
                console.log('promiseArr',result);
                if (result.length == 2) {//两个都改了
                    msg = '';
                    if (result[0].data.code != '200') {
                        msg = msg + '库存修改失败：' + result[0].data.msg + '。';
                    } else {
                        self.state.oldItem.defect_num = item.defect_num;
                    }
                    if (result[1].data.code != '200') {
                        msg = msg + '价格修改失败：' + result[1].data.msg + '。';
                    } else {
                        self.state.oldItem.price = item.price;
                        self.state.oldItem.multi_price = item.multi_price;
                    }
                    if (IsEmpty(msg)) {
                        msg = '修改成功';
                    }
                } else {
                    if (result[0].data.code != '200') {
                        if (result[0].type == 'num') {
                            msg = '库存修改失败：' + result[0].data.msg;
                        } else if (result[0].type == 'price') {
                            msg = '价格修改失败：' + result[0].data.msg;
                        }
                    } else {
                        if (result[0].type == 'num') {
                            self.state.oldItem.defect_num = item.defect_num;
                        } else if (result[0].type == 'price') {
                            self.state.oldItem.price = item.price;
                            self.state.oldItem.multi_price = item.multi_price;
                        }
                        msg = '修改成功';
                    }
                }
                Toast.info(msg, 2);
                self.setState({
                    changeing:false,
                });
            });
        } else {
            Toast.info(msg, 2);
            self.setState({
                changeing:false,
            });
        }
    }
    //修改单个价格
    changePrice = (value,flag) =>{
        let price = value;
        if (flag == 'multi') {
            this.setState({
                multi_price:price
            });
        } else {
            this.setState({
                price:price
            });
        }
    }
    //修改单个库存
    changeNum = (value) =>{
        let defect_num = value;
        this.state.defect_num = defect_num;
    }
    //点击修改按钮
    changeing = ()=>{
        this.setState({
            changeing:true,
        })
    }

    render(){
        let item = this.state.item;
        let price = 0;
        let multi_price = 0;
        if(!IsEmpty(item.price)){
            price = (item.price*1).toFixed(2);
        }
        if(!IsEmpty(item.multi_price)){
            multi_price = (item.multi_price*1).toFixed(2);
        }
        
        return (
            <View style={styles.skuone}>
                <View style={styles.skuoneTop}>
                    <Text style={styles.skuoneTopLeft}>{item.prop_name}</Text>
                </View>
                <View style={styles.skuoneMid}>
                    <View style={styles.skuoneMidtext}>
                        <View style={styles.textBox}>
                            <Text style={styles.skuoneMidtextLeft}>团购价:&nbsp;</Text>
                        </View>
                        {
                            this.state.changeing ?<Input type={'number'} style={styles.skuoneMidtextRightinput} onChange={(value,e)=>{this.changePrice(value,'multi')}} defaultValue={this.state.multi_price} />:<Text style={styles.skuoneMidtextRight}>{multi_price}</Text>
                        }
                    </View>
                    <View style={styles.skuoneMidtext}>
                        <View style={styles.textBox}>
                            <Text style={styles.skuoneMidtextLeft}>单买价:&nbsp;</Text>
                        </View>
                        {
                            this.state.changeing ?<Input type={'number'} maxLength={7} style={styles.skuoneMidtextRightinput} onChange={(value,e)=>{this.changePrice(value,'single')}} defaultValue={this.state.price} />:<Text style={styles.skuoneMidtextRight}>{price}</Text>
                        }

                    </View>
                    {this.state.changeing ?<Text onClick={()=>{this.hideModalok()}} style={styles.skuoneTopRight}>保存</Text>:<ItemIcon onClick={()=>{this.changeing()}} code={"\ue60d"} iconStyle={{fontSize:px(24),color:'#9B9B9B'}}/>}
                </View>
                <View style={styles.skuoneMid}>
                    <View style={styles.skuoneMidtext}>
                        <View style={styles.textBox}>
                            <Text style={styles.skuoneMidtextLeft}>库存:&nbsp;</Text>
                        </View>
                        {
                            this.state.changeing ?<Input type={'number'} style={styles.skuoneMidtextRightinput} onChange={(value,e)=>{this.changeNum(value)}} defaultValue={this.state.defect_num} />:<Text style={styles.skuoneMidtextRight}>{item.defect_num}</Text>
                        }
                    </View>
                </View>
            </View>
        );
    }
}
