import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Input} from '@tarojs/components';
import AyButton from '../../../../Component/AyButton/index';
import styles from './styles';
import px from '../../../../Biz/px.js';
/**
 * @author wzm
 * 批量修改组件
 */
export default class Changeall extends Component {
    constructor(props){
        super(props);
        this.state = {
            skus:[
            ], //sku信息
            allprice:0, //价格
            onlyone:false, //是否单sku
            };
    }

    //修改全部价格
    changeallprice = (value) =>{
        let allprice = value;
        this.setState({
            allprice :allprice,
        })
    }

    //点击批量修改
    blurinput=()=>{
        setTimeout(()=>{
            this.props.hideallModalok(this.state);
        },1000);
    }


    render(){
        const self = this.state;
        return (
            <View style={styles.body}>
                {/* <View style={styles.head}><Text style={styles.textHead}>批量设置单价</Text></View> */}
                    <View style={styles.input}>
                        <Text style={styles.inputText}>批量修改，价格统一设置为</Text>
                        <Input
                            ref = {'allinput'}
                            type={'number'}
                            style={{ flex:1,marginLeft:px(12),height: px(56), width:px(180),marginRight:px(12)}}
                            // placeholder={'请输入售价'}
                            defaultValue={this.state.allprice}
                            onChange={(value,e)=>{this.changeallprice(value)}}
                        />
                        <AyButton style={{height:px(56), width:px(150),}} type="primary" onClick={()=>{this.blurinput()}}>批量修改</AyButton>
                    </View>
            </View>
        );
    }
}
//showallModal= {this.showallModal()}
