import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text} from '@tarojs/components';
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
        navigationBarTitleText: 'Homepage'
    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    render () {
        return (
            <View style={styles.body}>
                <Text style={styles.firstLine}>这里是Homepage</Text>
                <Text style={styles.firstText}>1.微信扫描下方二维码，进入您的小程序店铺</Text>
            </View>
        )
    }
}
