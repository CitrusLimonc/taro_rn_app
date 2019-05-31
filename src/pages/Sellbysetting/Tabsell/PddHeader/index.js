import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Input,Button} from '@tarojs/components';
import styles from './styles';

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
        this.refs.input1.wrappedInstance.blur();
        this.refs.input2.wrappedInstance.blur();
        let self = this;
        Taro.showLoading({ title: '加载中...' });
        setTimeout(()=>{
            self.batchEdit();
            Taro.hideLoading();
        },1000);
    }

    batchEdit = () =>{
        let {multi_price,price} = this.state;
        let pandun = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;
        //判断价格是否合法
        if(!pandun.test(price)){
            Taro.showToast({
                title: '单买价需为大于0的小数或整数',
                icon: 'none',
                duration: 2000
            });
            return ;
        }
        if(!pandun.test(multi_price)){
            Taro.showToast({
                title: '团购价需为大于0的小数或整数',
                icon: 'none',
                duration: 2000
            });
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
                Taro.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 2000
                });
                this.props.updateItems(price,multi_price);
            } else {
                Taro.showToast({
                    title: rsp.msg,
                    icon: 'none',
                    duration: 2000
                });
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
                        <Input ref="input1" type={'number'} style={styles.skuoneMidtextRightinput} onChange={(value,e)=>{this.changePrice(value,'multi')}} defaultValue={multi_price} />
                    </View>
                    <View style={[styles.skuoneMidtext,{marginLeft:px(12)}]}>
                        <Text style={styles.skuoneMidtextLeft}>单买价:&nbsp;</Text>
                        <Input ref="input2" type={'number'} maxLength={7} style={styles.skuoneMidtextRightinput} onChange={(value,e)=>{this.changePrice(value,'single')}} defaultValue={price} />
                    </View>
                    <Button style={{height:50, width:150,marginLeft:px(18)}} type="secondary" onClick={()=>{this.blurInput()}}>批量修改</Button>
                </View>
            </View>
        );
    }
}