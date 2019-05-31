import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Input} from '@tarojs/components';
import styles from './styles';
import ItemIcon from '../../../../Component/ItemIcon';
import {NetWork} from '../../../../Public/Common/NetWork/NetWork.js';
import {IsEmpty} from '../../../../Public/Biz/IsEmpty';


/**
 * @author wzm
 * 销售规格每一项组件
 */
export default class Skuone extends Component {
    constructor(props){
        super(props);
        this.state = {
            item:{}, //商品信息
            price:0, //价格
            defect_num:0, //可售数量
            changeing:false, //是否有修改
        };
    }

    //保存修改
    hideModalok = () =>{
        const self = this;
        let item = this.state.item;
        let pandun = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;
        //判断价格是否合法
        if(pandun.test(this.state.price)){
            item.price = this.state.price;
            console.log('true');
      
        }else{
            Taro.showToast({
                title: '请输入大于0的两位小数或整数',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        //判断可售数量是否合法
        // let pandunnum = /^[1-9][0-9]*$/;
        let pandunnum = /^(0|\+?[1-9][0-9]*)$/;
        if(pandunnum.test(this.state.defect_num)){
            item.defect_num = this.state.defect_num;
            console.log('true');
    

        }else{
            Taro.showToast({
                title: '请输入大于等于0的整数',
                icon: 'none',
                duration: 2000
            });
            return;
        }
            let skuInfos = [];
            for(let j=0;j<1;j++){
                let skuone = {};
                skuone.skuId = item.sku_product_id;
                skuone.price = this.state.price;
                skuone.number = this.state.defect_num;
                skuInfos.push(skuone);
            }
            let skuInfosstr = JSON.stringify(skuInfos);
            let params = {};
                params.numIid=this.props.numIid;
                params.shopType=this.props.shopType;
                params.productID=this.props.productId;
                params.type='sku';
            if(self.props.onlyone){
                params.price=item.this.state.price;
                params.number=item.this.state.defect_num;

            }else{
                params.skuInfos=skuInfosstr;
            }
            NetWork.Get({
                url:'Orderreturn/changeProductSetting',
                params:params,
            },(data)=>{
                if(data.code == 200){
                    Taro.showToast({
                        title: '修改成功',
                        icon: 'none',
                        duration: 2000
                    });
                }else{
                    Taro.showToast({
                        title: '修改失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
            this.setState({
                item:item,
                changeing:false,
            });
    }
    componentWillMount(){
        this.setState({
            item:this.props.data,
            price:this.props.data.price,
            defect_num:this.props.data.defect_num,

        })
    }
    componentWillReceiveProps(){

        this.setState({
            item:this.props.data,
            price:this.props.data.price,
            defect_num:this.props.data.defect_num,
        })
    }
    //修改单个价格
    changeprice = (value) =>{
        let price = value;
        this.state.price = price
    }
    //修改单个库存
    changenum = (value) =>{
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
        let origin_price = 0;
        if(!IsEmpty(item.price)){
            price = (item.price*1).toFixed(2)
        };
        if(!IsEmpty(item.origin_price)){
            origin_price = (item.origin_price*1).toFixed(2)
        };
        let profit =  item.price*1-item.origin_price*1;
        if(!IsEmpty(profit)){
            profit = profit.toFixed(2)
        };
        return (
            <View>
                <View style={styles.skuone}>
                    <View style={styles.skuoneTop}>
                        <Text style={styles.skuoneTopLeft}>{item.prop_name}</Text>
                        {/* {this.props.all ?<Text onClick={this.props.showallModal} style={styles.skuoneTopRight}>批量设置价格</Text> :null} */}
                        {/* {this.state.changeing ?<Text onClick={this.hideModalok} style={styles.skuoneTopRight}>保存</Text>:<Text onClick={()=>{this.changeing()}} style={styles.skuoneTopRight}>修改</Text>} */}
                    </View>
                    <View style={styles.skuoneMid}>
                        <View style={styles.skuoneMidtext}>
                            <Text style={styles.skuoneMidtextLeft}>可售数量:&nbsp;</Text>
                            {
                                this.state.changeing ?<Input type={'number'} style={styles.skuoneMidtextRightinput} onChange={(value,e)=>{this.changenum(value)}} defaultValue={this.state.defect_num} />:<Text style={styles.skuoneMidtextRight}>{item.defect_num}</Text>
                            }
                        </View>
                        <View style={styles.skuoneMidtext}>
                            <Text style={styles.skuoneMidtextLeft}>单价:&nbsp;</Text>
                            {
                                this.state.changeing ?<Input type={'number'} maxLength={7} style={styles.skuoneMidtextRightinput} onChange={(value,e)=>{this.changeprice(value)}} defaultValue={this.state.price} />:<Text style={styles.skuoneMidtextRight}>{price}</Text>
                            }

                        </View>

                        {this.state.changeing ?<Text onClick={()=>{this.hideModalok()}} style={styles.skuoneTopRight}>保存</Text>:<ItemIcon onClick={()=>{this.changeing()}} code={"\ue60d"} iconStyle={{fontSize:px(24),color:'#9B9B9B'}}/>}
                    </View>
                    <View style={styles.skuoneBot}>
                        <Text style={styles.skuoneBotleft}>(采购价:{origin_price}元 利润约为:</Text>
                        <Text style={styles.skuoneBotmid}>{profit}</Text>
                        <Text style={styles.skuoneBotleft}>元)</Text>
                    </View>
                </View>

            </View>
        );
    }
}
