import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import styles from './styles';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      pic: 'https://q.aiyongbao.com/wechatShop/ever.jpg',
    }
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View style={styles.body}>
        <Text style={styles.firstLine}>进入爱用旺铺小程序店铺</Text>
        <Text style={styles.firstText}>1.微信扫描下方二维码，进入您的小程序店铺</Text>
        <View style={styles.Picbody}>
          <Image src={this.state.pic} style={styles.Picbodypic}></Image>
        </View>
        <Text style={styles.firstText}>2.使用代发助手铺货的商品会自动同步到小程序店铺，就可以在小程序中分享商品啦；分享的商品如果有买家付款，订单会自动同步到代发助手的待采购列表。</Text>
        <View style={styles.wangwangbody} onClick={() => { }}>
          <Text style={styles.wangwangLeft}>添加店铺遇到问题？</Text>
          <Text style={styles.wangwangRight}>联系我们</Text>
          {/* <ItemIcon iconStyle={styles.wangwangicon} code={"\ue6ba"} /> */}
        </View>
      </View>
    )
  }
}
