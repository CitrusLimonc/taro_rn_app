import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image} from '@tarojs/components';
import styles from './styles';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import ItemIcon from '../../Component/ItemIcon';
/**
 * @author wzm
 * 扫描二维码进入旺铺
 */
export default class Intowd extends Component {
    constructor(props){
        super(props);
        this.state={
            searchValue:'',
            pic:'https://q.aiyongbao.com/wechatShop/ever.jpg',
        }
    }

    // config: Config = {
    //     navigationBarTitleText: '进入小程序店铺'
    // }

    render(){
        return (
            <View style={styles.body}>
                <Text style={styles.firstLine}>进入爱用旺铺小程序店铺</Text>
                <Text style={styles.firstText}>1.微信扫描下方二维码，进入您的小程序店铺</Text>
                <View style={styles.Picbody}>
                    <Image src={this.state.pic} style={styles.Picbodypic}></Image>
                </View>
                {/* <Text style={styles.importText}>注意：这是您的开通爱用旺铺的专属二维码，请不要分享给除您以外的任何人，分享行为带来的风险，由您自行承担</Text> */}
                <Text style={styles.firstText}>2.使用代发助手铺货的商品会自动同步到小程序店铺，就可以在小程序中分享商品啦；分享的商品如果有买家付款，订单会自动同步到代发助手的待采购列表。</Text>
                <View style={styles.wangwangbody} onClick={()=>{UitlsRap.openChat('爱用科技1688')}}>
                    <Text style={styles.wangwangLeft}>添加店铺遇到问题？</Text>
                    <Text style={styles.wangwangRight}>联系我们</Text>
                    <ItemIcon iconStyle={styles.wangwangicon} code={"\ue6ba"}/>
                </View>
            </View>
        );
    }
}