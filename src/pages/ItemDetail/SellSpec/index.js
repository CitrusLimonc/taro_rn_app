import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {IsEmpty} from '../../../Public/Biz/IsEmpty.js';
import styles from './styles';
/**
 * @author cy
 * 销售规格信息
 */
export default class SellSpec extends Component{
    constructor(props){
        super(props);
    }

    //获取所有价格区间
    getAllPrice = () =>{
        let doms=[];
        this.props.productInfo.saleInfo.priceRanges.map((item,key)=>{
            let startQuantity='';//起始价格
            let endQuantity='';//结束价格
            if (key<this.props.productInfo.saleInfo.priceRanges.length-1) {
                startQuantity=item.startQuantity;
                endQuantity='-'+(this.props.productInfo.saleInfo.priceRanges[key+1].startQuantity-1);
            }else {
                startQuantity='>='+item.startQuantity;
                endQuantity='';
            }
            doms.push(
                <View style={styles.tables}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.tableText}>
                            {startQuantity}
                            {endQuantity}
                            {this.props.productInfo.saleInfo.unit}:
                        </Text>
                    </View>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.tableText}>{parseInt(item.price).toFixed(2)}元/{this.props.productInfo.saleInfo.unit}</Text>
                    </View>
                </View>
            );
        });
        return doms;
    }

    //按数量报价获取sku属性对应的销售数量
    getSellNumber = () =>{
        let doms=[];
        this.props.productInfo.skuInfos.map((item,key)=>{
            let name='';
            item.attributes.map((val,index)=>{
                if (index==item.attributes.length-1) {
                    name+=val.attributeValue;
                }else {
                    name+=val.attributeValue;
                    name+=',';
                }
            });
            doms.push(
                <View style={{flexDirection:'row'}}>
                    <View style={[styles.tableBodyLine,{flex:2}]}>
                        <Text style={{fontSize:px(28),color:'#727272'}}>{name}</Text>
                    </View>
                    <View style={[styles.tableBodyLine,{flex:1}]}>
                        <Text style={{fontSize:px(28),color:'#727272'}}>{item.amountOnSale}</Text>
                    </View>
                </View>
            )
        });
        return doms;
    }

    //按数量报价
    getSkuNumber = () =>{
        let doms=[];
        this.props.productInfo.skuInfos.map((item,key)=>{
            let name='';
            item.attributes.map((val,index)=>{
                if (index==item.attributes.length-1) {
                    name+=val.attributeValue;
                }else {
                    name+=val.attributeValue;
                    name+=',';
                }
            });

            let height = 72;
            let rows = 1;
            let length = name.replace(/[\u0391-\uFFE5]/g,"aa").length;
            rows = Math.ceil(length/23);
            if (rows>1) {
                height = 72 + (rows-1) * 36;
            }

            console.log('length',length,'rows',rows);

            doms.push(
                <View style={{flexDirection:'row'}}>
                    <View style={[styles.tableBodyLine,{flex:1,height:height}]}>
                        <Text style={{fontSize:px(28),color:'#727272',textAlign:'center',width:332}}>{name}</Text>
                    </View>
                    <View style={[styles.tableBodyLine,{marginLeft:px(-2),flex:1,height:height}]}>
                        <Text style={{fontSize:px(28),color:'#727272'}}>{item.amountOnSale}</Text>
                    </View>
                </View>
            )
        });
        return doms;
    }

    //按规格报价
    getSkuNumberPrice = (hasSkuPrice) =>{
        let doms=[];
        this.props.productInfo.skuInfos.map((item,key)=>{
            let name='';
            item.attributes.map((val,index)=>{
                if (index==item.attributes.length-1) {
                    name+=val.attributeValue;
                }else {
                    name+=val.attributeValue;
                    name+=',';
                }
            });
            let height = 72;
            let rows = 1;
            let length = name.replace(/[\u0391-\uFFE5]/g,"aa").length;

            let textNumber = 23;
            if (IsEmpty(hasSkuPrice) || hasSkuPrice) {
				textNumber = 16;
			}
            rows = Math.ceil(length/textNumber);
            if (rows>1) {
                height = 72 + (rows-1) * 36;
            }

            let price = parseInt(item.price).toFixed(2);
            if (!IsEmpty(hasSkuPrice) && hasSkuPrice) {
                if (!IsEmpty(item.price)) {
                    price = item.price;
                } else if (!IsEmpty(item.consignPrice)) {
                    price = item.consignPrice;
                }
            }
            doms.push(
                <View style={{flexDirection:'row'}}>
                    <View style={[styles.tableBodyLine,{flex:1,height:height}]}>
                        <Text style={{fontSize:px(28),color:'#727272',width:221,textAlign:'center'}}>{name}</Text>
                    </View>
                    {
                        IsEmpty(hasSkuPrice) || hasSkuPrice ?
                        <View style={[styles.tableBodyLine,{marginLeft:px(-2),flex:1,height:height}]}>
                            <Text style={{fontSize:px(28),color:'#727272'}}>{price}</Text>
                        </View>
                        :
                        ''
                    }
                    <View style={[styles.tableBodyLine,{marginLeft:px(-2),flex:1,height:height}]}>
                        <Text style={{fontSize:px(28),color:'#727272'}}>{item.amountOnSale}</Text>
                    </View>
                </View>
            )
        });
        return doms;
    }

    render(){
        let content='';
        if (!IsEmpty(this.props.productInfo.saleInfo)) {
            if(this.props.productInfo.saleInfo.quoteType==0){
                let amount='';
                let sku='';
                if (!IsEmpty(this.props.productInfo.skuInfo)) {
                    if (this.props.productInfo.skuInfo.length>0) {
                        sku=
                        <View>
                            <View style={{flexDirection:'row',flex:1}}>
                                <View style={[styles.tableHead,{flex:2}]}>
                                    <Text style={{fontSize:px(24),color:'#9e9e9e'}}>规格</Text>
                                </View>
                                <View style={[styles.tableHead,{flex:1}]}>
                                    <Text style={{fontSize:px(24),color:'#9e9e9e'}}>可售数量({this.props.productInfo.saleInfo.unit})</Text>
                                </View>
                            </View>
                            {this.getSellNumber()}
                        </View>;
                    } else {
                        amount=this.props.productInfo.saleInfo.amountOnSale;
                    }
                } else {
                    amount=this.props.productInfo.saleInfo.amountOnSale;
                }
                content=
                <View style={styles.tags}>
                    <View style={{flexDirection:'row',height:px(80),alignItems:'center',marginTop:px(20)}}>
                        <Text style={styles.normalText}>网上订购：</Text>
                        <Text style={{fontSize:px(28)}}>{this.props.productInfo.saleInfo.supportOnlineTrade?'支持':'不支持'}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',height:px(70),alignItems:'center'}}>
                        <Text style={styles.normalText}>价格区间：</Text>
                    </View>
                    {this.getAllPrice()}
                    <View style={{flex:1,flexDirection:'row',height:px(70),alignItems:'center'}}>
                        <Text style={styles.normalText}>可售数量：</Text>
                        <Text style={{fontSize:px(28)}}>{amount}</Text>
                    </View>
                </View>;
            }else if (this.props.productInfo.saleInfo.quoteType==1) {
                content=
                <View style={styles.tags}>
                    <View style={{flexDirection:'row',height:px(80),alignItems:'center',marginTop:px(20)}}>
                        <Text style={styles.normalText}>网上订购：</Text>
                        <Text style={{fontSize:px(28)}}>{this.props.productInfo.saleInfo.supportOnlineTrade?'支持':'不支持'}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',height:px(70),alignItems:'center'}}>
                        <Text style={styles.normalText}>最小起订：</Text>
                        <Text style={{fontSize:px(28)}}>
                            {this.props.productInfo.saleInfo.minOrderQuantity}{this.props.productInfo.saleInfo.unit}
                        </Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',height:px(70),alignItems:'center'}}>
                        <Text style={styles.normalText}>规格报价：</Text>
                    </View>
                    <View>
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={[styles.tableHead,{flex:1}]}>
                                <Text style={{fontSize:px(24),color:'#9e9e9e'}}>规格</Text>
                            </View>
                            <View style={[styles.tableHead,{marginLeft:px(-2),flex:1}]}>
                                <Text style={{fontSize:px(24),color:'#9e9e9e'}}>单价(元)</Text>
                            </View>
                            <View style={[styles.tableHead,{marginLeft:px(-2),flex:1}]}>
                                <Text style={{fontSize:px(24),color:'#9e9e9e'}}>可售数量({this.props.productInfo.saleInfo.unit})</Text>
                            </View>
                        </View>
                        {this.getSkuNumberPrice()}
                    </View>
                </View>;
            }else if (this.props.productInfo.saleInfo.quoteType==2) {
                content=
                <View style={styles.tags}>
                    <View style={{flexDirection:'row',height:px(80),alignItems:'center',marginTop:px(20)}}>
                        <Text style={styles.normalText}>网上订购：</Text>
                        <Text style={{fontSize:px(28)}}>{this.props.productInfo.saleInfo.supportOnlineTrade?'支持':'不支持'}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',height:px(70),alignItems:'center'}}>
                        <Text style={styles.normalText}>价格区间：</Text>
                    </View>
                    {this.getAllPrice()}
                    <View style={{flex:1,flexDirection:'row',height:px(70),alignItems:'center'}}>
                        <Text style={styles.normalText}>可售数量：</Text>
                    </View>
                    <View>
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={[styles.tableHead,{flex:1}]}>
                                <Text style={{fontSize:px(24),color:'#9e9e9e'}}>规格</Text>
                            </View>
                            <View style={[styles.tableHead,{marginLeft:px(-2),flex:1}]}>
                                <Text style={{fontSize:px(24),color:'#9e9e9e'}}>可售数量({this.props.productInfo.saleInfo.unit})</Text>
                            </View>
                        </View>
                        {this.getSkuNumber()}
                    </View>
                </View>;
            }
        } else {
            if (!IsEmpty(this.props.productInfo.skuInfos)) {
                let hasSkuPrice = false;
                for (let key in this.props.productInfo.skuInfos) {
    				if (!IsEmpty(this.props.productInfo.skuInfos[key].priceRange)) {
    					hasSkuPrice = true;
    				}
    				if (!IsEmpty(this.props.productInfo.skuInfos[key].price)) {
    					hasSkuPrice = true;
    				}
                    if (!IsEmpty(this.props.productInfo.skuInfos[key].consignPrice)) {
    					hasSkuPrice = true;
    				}
    			}
                content=
                <View style={styles.tags}>
                    <View>
                        <View style={{flexDirection:'row',flex:1}}>
                            <View style={[styles.tableHead,{flex:1}]}>
                                <Text style={{fontSize:px(24),color:'#9e9e9e'}}>规格</Text>
                            </View>
                            {
                                hasSkuPrice ?
                                <View style={[styles.tableHead,{marginLeft:px(-2),flex:1}]}>
                                    <Text style={{fontSize:px(24),color:'#9e9e9e'}}>单价(元)</Text>
                                </View>
                                :
                                ''
                            }
                            <View style={[styles.tableHead,{marginLeft:px(-2),flex:1}]}>
                                <Text style={{fontSize:px(24),color:'#9e9e9e'}}>可售数量</Text>
                            </View>
                        </View>
                        {this.getSkuNumberPrice(hasSkuPrice)}
                    </View>
                </View>;
            } else {
                content = '';
            }
        }

        return content;
    }
}
