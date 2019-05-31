import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Button,Input} from '@tarojs/components';
import styles from './styles';
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
        this.refs.allinput.wrappedInstance.blur();
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
                            style={{ flex:1,marginLeft:12,height: 56, width:180,marginRight:12}}
                            // placeholder={'请输入售价'}
                            defaultValue={this.state.allprice}
                            onChange={(value,e)=>{this.changeallprice(value)}}
                        />
                        <Button style={{height:56, width:150,}} type="secondary" onClick={()=>{this.blurinput()}}>批量修改</Button>
                    </View>
            </View>
        );
    }
}
//showallModal= {this.showallModal()}
