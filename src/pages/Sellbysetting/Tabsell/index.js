import Taro, { Component, Config } from '@tarojs/taro';
import { View,ScrollView} from '@tarojs/components';
import { Toast , Portal } from '@ant-design/react-native';
import styles from './styles';
import Skuone from './Skuone';
import PddSku from './PddSku';
import Changeall from './Changeall';
import PddHeader from './PddHeader';

import {IsEmpty} from '../../../Public/Biz/IsEmpty';
import {NetWork} from '../../../Public/Common/NetWork/NetWork.js';
/**
 * @author wzm
 * 销售规格组件
 */
export default class Tabsell extends Component {
    constructor(props){
        super(props);
        this.state = {
            skus:[ //sku信息
            ],
            allprice:0, //价格
            changeradio:1,
            onlyone:false, //是否单规格
        };
        this.loading = '';
    }
    componentWillMount(){
        const self = this;
        if(IsEmpty(self.props.alldata.skuInfos)){
            //没有sku时
            let skus =[];
            skus[0].name='默认';
            skus[0].price=self.props.alldata.list_price;
            skus[0].defect_num=self.props.alldata.num;
            this.setState({
                skus:skus,
            })
        }else{
            this.setState({
                skus:self.props.alldata.skuInfos,
            })
        }

    }
    componentWillReceiveProps(nextProps){
        if (nextProps.alldata) {
            if(IsEmpty(nextProps.alldata.skuInfos)){
                let skus =[];
                skus[0].name='默认';
                skus[0].price=nextProps.alldata.list_price;
                skus[0].defect_num=nextProps.alldata.num;
                this.setState({
                    skus:skus,
                })
            }else{
                this.setState({
                    skus:nextProps.alldata.skuInfos,
                })
            }
        }

    }

    //保存修改
    hideallModalok = (data) =>{
        this.loading = Toast.loading('加载中...');
        if(!IsEmpty(data)){
            let skuInfos = '';
            const self = data;
            let skus = this.state.skus;
            let pandun = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;
            if(pandun.test(self.allprice)){
                for(let i=0;i<skus.length;i++){
                    skus[i].price = self.allprice;
                }
                skuInfos = self.allprice.toString();
                this.setState({
                    skus:skus,
                });
                // this.refs.changeallDialog.hide();
            }else{
                Toast.info('请输入大于0的两位小数或整数', 2);
                return;
            }
            NetWork.Post({
                url:'Orderreturn/changeProductSetting',
                params:{
                    numIid:this.props.numIid,
                    // numIid:537794396775,
                    shopType:this.props.shopType,
                    productID:this.props.productId,
                    type:'sku',
                    batchType:self.changeradio,
                    price:skuInfos,
                }
            },(data)=>{
                if(data.code == 200){
                    Toast.info('修改成功', 2);
                    Portal.remove(this.loading);
                }else{
                    Toast.info('修改失败', 2);
                    Portal.remove(this.loading);
                }
            });
        }

    }
    //渲染每一项
    skuone =()=>{
        let body =[];
        let pics = [];
        pics = this.state.skus;
        if(!pics==false){
            pics.map((item,index)=>{
                if (this.props.alldata.shop_type == 'pdd') {
                    body.push(
                        <PddSku 
                        ref={'Skuone'} 
                        onlyone={this.state.onlyone} 
                        productId={this.props.productId} 
                        numIid={this.props.numIid} 
                        shopType={this.props.shopType} 
                        shopId={this.props.alldata.shop_id}
                        data={item} 
                        editItemForPdd={this.props.editItemForPdd}
                        />
                    );
                } else {
                    body.push(
                        <Skuone 
                        ref={'Skuone'} 
                        onlyone={this.state.onlyone} 
                        productId={this.props.productId} 
                        numIid={this.props.numIid} 
                        shopId={this.props.alldata.shop_id}
                        shopType={this.props.shopType} 
                        data={item} 
                        />
                    );
                }
            })
        }
        return body;
    }

    updateItems = (price,multi_price) =>{
        let {skus} = this.state;
        skus.map((item,key)=>{
            skus[key].price = price;
            skus[key].multi_price = multi_price;
        });
        this.setState({
            skus:skus
        });
    }


    render(){
        const {alldata} = this.props;
        return (
            <View style={{flex:1}}>
                {
                    alldata.shop_type == 'pdd' ? 
                    <PddHeader 
                    editItemForPdd={this.props.editItemForPdd}
                    numIid={this.props.numIid}
                    shopId={alldata.shop_id}
                    shopType={this.props.shopType}
                    productId={this.props.productId}
                    updateItems={this.updateItems}
                    />
                    :
                    <Changeall  
                    hideallModalok={this.hideallModalok}
                    />
                }
                <ScrollView style={styles.commonLine}>
                    {/* <View style={{height:250,width:750}} ></View> */}
                    {this.skuone()}
                </ScrollView>
            </View>
        );
    }
}
//showallModal= {this.showallModal()}
