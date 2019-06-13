import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Input} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import AyButton from '../../../../Component/AyButton/index';
import styles from './styles';
import px from '../../../../Biz/px.js';

/**
 * @author wzm
 * 批量修改组件
 */
export default class PddHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            multi_price:0,
            price:0,
        };
        this.loading = '';
    }

    //修改全部价格
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

    //点击批量修改
    blurInput=()=>{
        let self = this;
        this.loading = Toast.loading('加载中...');
        setTimeout(()=>{
            self.batchEdit();
            Portal.remove(self.loading);
        },1000);
    }

    batchEdit = () =>{
        let {multi_price,price} = this.state;
        let pandun = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;
        //判断价格是否合法
        if(!pandun.test(price)){
            Toast.info('单买价需为大于0的小数或整数', 2);
            return ;
        }
        if(!pandun.test(multi_price)){
            Toast.info('团购价需为大于0的小数或整数', 2);
            return ;
        }

        let params = {
            numIid:this.props.numIid,
            shopId:this.props.shopId,
            editType:'batchSku',
            singlePrice:price,
            groupPrice:multi_price
        };
        this.props.editItemForPdd(params,(rsp)=>{
            if (rsp.code == '200') {
                Toast.info('修改成功', 2);
                this.props.updateItems(price,multi_price);
            } else {
                Toast.info(rsp.msg, 2);
            }
        });
    }

    render(){
        let {multi_price,price} = this.state;
        return (
            <View style={styles.body}>
                <View style={styles.whiteBody}>
                    <View style={styles.skuoneMidtext}>
                        <Text style={styles.skuoneMidtextLeft}>团购价:&nbsp;</Text>
                        <Input ref="input1" type={'number'} style={styles.skuoneMidtextRightinput} onInput={(value)=>{this.changePrice(value,'multi')}} defaultValue={multi_price} />
                    </View>
                    <View style={[styles.skuoneMidtext,{marginLeft:px(12)}]}>
                        <Text style={styles.skuoneMidtextLeft}>单买价:&nbsp;</Text>
                        <Input ref="input2" type={'number'} maxLength={7} style={styles.skuoneMidtextRightinput} onInput={(value)=>{this.changePrice(value,'single')}} defaultValue={price} />
                    </View>
                    <AyButton style={{height:px(50), width:px(150),marginLeft:px(18)}} type="primary" onClick={()=>{this.blurInput()}}>批量修改</AyButton>
                </View>
            </View>
        );
    }
}