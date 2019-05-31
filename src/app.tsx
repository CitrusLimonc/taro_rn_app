import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        pages: [
          'pages/BatchPay/index',
          'pages/Changepic/index',
          'pages/ConfrimSubOrders/index',
          'pages/CorrelationProduct/index',
          'pages/Courses/index',
          'pages/DistributionChanges/index',
          'pages/DistributionIndex/index',
          'pages/DistributionLog/index',
          'pages/DistributionMy/index',
          'pages/DistributionResult/index',
          'pages/DistributionSetting/index',
          'pages/DistributionShops/index',
          'pages/EvaluationFeedback/index',
          'pages/Gocum/index',
          'pages/GoodsSource/index',
          'pages/HomePage/index',
          'pages/index/index',
          'pages/Intowd/index',
          'pages/ItemDetail/index',
          'pages/ItemSelectPage/index',
          'pages/Openwd/index',
          'pages/OrderDetail/index',
          'pages/OrderList/index',
          'pages/ProductDetail/index',
          'pages/ProductList/index',
          'pages/RecommendationSource/index',
          'pages/SelectBrand/index',
          'pages/Sellbysetting/index',
          'pages/SupplierDetails/index',
          'pages/SupplierGoods/index',
          'pages/SupplierList/index',
          'pages/SyncLoglist/index',
          'pages/SyncNumber/index',
          'pages/WechartMsg/index'
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black'
        },
        tabBar: {
            list: [
              {
                pagePath: "pages/DistributionMy/index",
                text: "我的",
                iconPath: "./images/source_a.png",
                selectedIconPath: "./images/source_c.png"
            },
            {
                pagePath: "pages/DistributionIndex/index",
                text: "首页",
                iconPath: "./images/source_a.png",
                selectedIconPath: "./images/source_c.png"
            },
            {
                pagePath: "pages/ProductList/index",
                text: "商品列表",
                iconPath: "./images/source_a.png",
                selectedIconPath: "./images/source_c.png"
            },
            {
                pagePath: "pages/OrderList/index",
                text: "订单列表",
                iconPath: "./images/source_a.png",
                selectedIconPath: "./images/source_c.png"
            },
            {
                pagePath: "pages/RecommendationSource/index",
                text: "货源",
                iconPath: "./images/source_a.png",
                selectedIconPath: "./images/source_c.png"
            }
            ]
        }
    }

    componentDidMount () {}

    componentDidShow () {}

    componentDidHide () {}

    componentDidCatchError () {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render () {
        return (
            <Index />
        )
    }
}

Taro.render(<App />, document.getElementById('app'))