import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text , ScrollView} from '@tarojs/components';
import ItemIcon from '../../Component/ItemIcon';
import GoodsProductMap from '../../Component/GoodsProductMap';
import HeadLine from './HeadLine';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import styles from './styles';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 关联商品
 */
export default class CorrelationProduct extends Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource:{},
            gridData:[]
        };
        this.userNick = '';
        this.userId = '';
        this.memberId = '';
    }

    config = {
        navigationBarTitleText: '关联商品'
    }

    componentWillMount(){

        let self = this;
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
            console.log('getUserInfo',info);
            // self.userNick = info.extraInfo.result.loginId;
            // self.userId = info.extraInfo.result.userId;
            // self.memberId = info.extraInfo.result.memberId;
            self.userNick = '萌晓月cy';
            self.userId = '2190174972';
            self.memberId = 'b2b-2190174972';
            //获取当前商品
            // LocalStore.Get(['correlation_product_message'],(result) => {
            //     console.log('correlation_product_message',result);
            //     if (!IsEmpty(result)) {
            //         let resultData = Parse2json(result.correlation_product_message);
            //         console.log('correlation_product_message-------',resultData);
                let dataSource = {
                    shopType:'taobao',
                    shopName:'蓉萱工厂店',
                    productInfo:{
                        productId:'570679752437',
                        picUrl:'https://cbu01.alicdn.com/img/ibank/2018/589/194/8926491985_1362131451.400x400.jpg',
                        title:'春装女连衣裙2018新款长袖时尚气质女装春季韩版显瘦裙子',
                        productCargoNumber:'D4564',
                        amountOnSale:'12345',
                        price:'¥59.9'
                    }
                };
                //获取当前供应商的商品信息
                self.getProducts(dataSource.productInfo.productId,(result)=>{
                    let gridData = [];
                    if (!IsEmpty(result.offerList)) {
                        result.offerList.map((item,key)=>{
                            gridData.push({
                                title:item.subject,
                                image:item.imageUrl,
                                price:item.price,
                                memberId:item.memberId,
                                primaryID:item.id
                            });
                        });
                    }
                    self.setState({
                        dataSource:dataSource,
                        gridData:gridData
                    });
                });

            //     }
            // });

        // });

    }

    //获取商品
    getProducts = (taobaoOfferId,callback) =>{
        // RAP.aop.request({
        //     isOpenApi: true,
        //     namespace: 'cn.alibaba.open',
        //     api: 'alibaba.search.graph.offer.same.pages',
        //     version: '1',
        //     params: {
        //         taobaoOfferId: taobaoOfferId,
        //         beginPage: 1,
        //         pageSize: 9,
        //     }
        // }, (result) => {
        //     console.log(result);
        //     callback(result.result);
        // }, (error) => {
        //     console.error(error);
        // });
    }


    render(){
        const {dataSource} = this.state;
        let shopUrl = '';
        switch (dataSource.shopType) {
            case 'taobao':{
                shopUrl = 'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png';
            } break;
            case 'pdd':{
                shopUrl = 'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png';
            } break;
            default: break;
        }
        return (
            <ScrollView style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <HeadLine dataSource={dataSource}/>
                <View style={{marginTop:px(24),backgroundColor:"#fff"}}>
                    <View style={styles.likeLine}>
                        <Text style={{color:"#333333",fontSize:px(28)}}>相似货源</Text>
                        <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                            <Text style={{fontSize:px(28),color:'#999999'}}>更多</Text>
                        </View>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#999999'}}/>
                    </View>
                    <GoodsProductMap size={"small"} horizontal={true} dataSource={this.state.gridData} goProduct={true}/>
                </View>
            </ScrollView>
        );
    }
}
