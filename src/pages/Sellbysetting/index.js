import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import ItemConfirmDialog from '../../Component/ItemConfirmDialog';
import ItemTextArea from '../../Component/ItemTextArea';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import { GoToView } from '../../Public/Biz/GoToView.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import styles from './styles';
import Tabmessage from './Tabmessage';
import Tabsell from './Tabsell';
import Tabdetails from './Tabdetails';
import ProductStatus from './ProductStatus';

/*
 * 代销铺货设置页面
 * @author wzm
 */
export default class Sellbysetting extends Component {
    constructor(props) {
        super(props);
        this.state={
            shopList:[],  /* 店铺列表 */
            chooseShop:'', /* 当前选中的店铺 */
            lastShopType:'wc',
            batchChanges:[],  /* 批量设置 */
            hasChanged:false,
            content:'',  /* 二次确认弹窗的内容 */
            openchangeall:false,
            alldata:[],
            shopListone:'',
            pageStatus:[
                {status:'基本信息',},
                {status:'销售规格',},
                {status:'详情描述',}
            ],
            nowPageStatus:{status:'基本信息',},//当前页面状态
            newSubject:''
        }

        this.cidNumber = 0;
        this.willShowShop="";
        this.from = '';
        this.numIid = '';
        this.productId = '';
        let self = this;
        // RAP.on('App.changeAlldata', (data) => {
        //     Taro.showLoading({ title: '加载中...' });
        //     let params = {
        //         numIid:self.numIid,
        //         shopType:self.state.lastShopType,
        //         productID:self.productId,
        //         shopId:self.state.chooseShop
        //     };
        //     self.getOneGoodSetting(params,(data)=>{
        //         self.setState({
        //             alldata:data,
        //         })
        //         Taro.hideLoading();
        //     });
        // }).then(result => {
        //     console.log('注册成功');
        // }).catch(error => {
        //     console.log('注册失败');
        // })
    }

    // config: Config = {
    //     navigationBarTitleText: '代销设置'
	// }

    componentDidMount(){
        let self = this;
        Taro.showLoading({ title: '加载中...' });

        let shopId = GetQueryString({name:'shopid'});
        let numIid = GetQueryString({name:'numIid'});
        let productId = GetQueryString({name:'productId'});

        this.numIid = numIid;
        this.productId = productId;
        self.getAllSettings(shopId,(result)=>{
            Taro.hideLoading();
            console.log('getAllSettings',result);
            let params = {
                numIid:numIid,
                shopType:result.lastShopType,
                productID:productId,
                shopId:shopId
            };
            self.getOneGoodSetting(params,(data)=>{
                if (!IsEmpty(data.code) && data.code == px(100)) {
                    Taro.showToast({
                        title: '该商品不存在',
                        icon: 'none',
                        duration: 2000
                    });
                    GoToView({page_status:'pop'});
                }
                self.setState({
                    ...result,
                    alldata:data,
                    newSubject:data.name
                });
            });
        });
        
        console.log('shopId',shopId);
        console.log('numIid',numIid);
        console.log('productId',productId);
        
    }

    getOneGoodSetting = (params,callback) =>{
        NetWork.Get({
            url:'Orderreturn/getOneGoodSetting',
            params:params
        },(data)=>{
            console.log('Orderreturn/getOneGoodSetting',data);
            callback(data);
        });
    }

    //改变状态
    changeStaus = (item) => {
        switch (item.status) {
            case '基本信息':{
                this.setState({
                    nowPageStatus:{status:'基本信息',}
                })
            } break;
            case '销售规格':{
                this.setState({
                    nowPageStatus:{status:'销售规格',}
                })
            } break;
            case '详情描述':{
                this.setState({
                    nowPageStatus:{status:'详情描述',}
                })
            } break;
            default: break;
        }
    }
    //获取设置信息
    getAllSettings = (shopId,callback) =>{
        let self = this;
        //获取所有店铺
        NetWork.Get({
            url:'Orderreturn/getShopsForItem',
            data:{
                productId:this.productId
            }
        },(rsp)=>{
            console.log('Orderreturn/getShopsForItem',rsp);
            //有数据
            if (!IsEmpty(rsp)) {
                let shopList = rsp;
                let lastShopType = '';
                let shopListone='';
                if (IsEmpty(shopId)) {
                    shopId = shopList[0].shop_id;
                }
                shopList.map((item,key)=>{
                    if (shopId == item.shop_id) {
                        lastShopType = item.shop_type;
                        shopListone = item;
                    }
                });
                callback({
                    shopList:shopList,
                    lastShopType:lastShopType,
                    chooseShop:shopId,
                    shopListone:shopListone,
                });
            } else {
                callback({}); 
            }
        },(error)=>{
            callback({});
            alert(JSON.stringify(error));
        });
    }

    //选择店铺
    changShopTag = (item) =>{
        let self = this;
        if (this.state.hasChanged) {
            self.willShowShop = item.shop_id;
        } else {
            Taro.showLoading({ title: '加载中...' });
            // 获取铺货设置  加loading
            self.getAllSettings(item.shop_id,(result)=>{
                Taro.hideLoading();
                console.log('getAllSettings',result);
                let params = {
                    numIid:item.num_iid,
                    shopType:item.shop_type,
                    productID:this.productId,
                    shopId:item.shop_id
                };
                self.getOneGoodSetting(params,(data)=>{
                    if (!IsEmpty(data.code) && data.code == px(100)) {
                        Taro.showToast({
                            title: '该商品不存在',
                            icon: 'none',
                            duration: 2000
                        });
                    } else {
                        this.numIid = item.num_iid;
                        this.state.lastShopType = item.shop_type;
                        this.state.chooseShop = item.shop_id;
                        self.setState({
                            ...result,
                            alldata:data,
                            newSubject:data.name
                        });
                    }
                });
            });
        }

    }

    //渲染店铺列表tag
    renderShopTags = () =>{
        let tagDom = [];
        this.state.shopList.map((item,key)=>{
            let pic_url = item.pic_url;
            if (IsEmpty(pic_url)) {
                if (!IsEmpty(item.shop_url)) {
                    pic_url = item.shop_url;
                } else {
                    pic_url = 'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png';
                }
            }

            if (item.shop_type != 'taobao') {
                tagDom.push(
                    <View style={[{alignItems:'center',marginRight:24},key==4?{marginRight:0}:{}]}>
                        <View style={[this.state.chooseShop == item.shop_id ? styles.tagImageActive:styles.tagImage]}
                        onClick={()=>{this.changShopTag(item)}}>
                            <Image src={pic_url} style={{width:76,height:76}}/>
                        </View>
                        <View style={{marginTop:px(6),width:px(140),alignItems:'center'}}>
                            <Text style={{fontSize:px(20),color:'#999999',textAlign:'center'}}>{item.shop_name}</Text>
                        </View>
                    </View>
                );
            }
        });
        return tagDom;
    }

    //是否显示批量修改
    openchangeall = (e) =>{
        let openchangeall=false;
        if(e.next=='tabsell'){
            openchangeall = true;
        }else{
            openchangeall = false;
        };
        this.setState({
            openchangeall:openchangeall,
        })
    }

    editItemForPdd = (param,callback) =>{
        NetWork.Post({
            url:'Orderreturn/editItemForPdd',
            data:param
        },(rsp)=>{
            console.log('distribution/getTemplateModel',rsp);
            //有数据
            callback(rsp);
        },(error)=>{
            callback({});
            alert(JSON.stringify(error));
        });
    }

    //获取从TextArea中获取的value
    getValue = (newSubject) =>{
        this.setState({
            newSubject:newSubject
        });
    }

    submitChangeTitle = () =>{
        let {alldata} = this.state;
        let param = {
            numIid:this.numIid,
            shopId:this.state.chooseShop,
            editType:'title',
            title:this.state.newSubject
        };
        Taro.showLoading({ title: '加载中...' });
        this.editItemForPdd(param,(rsp)=>{
            Taro.hideLoading();
            this.refs.editTitle.hide();
            if (rsp.code == '200') {
                Taro.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 2000
                });
                alldata.name = this.state.newSubject;
                this.setState({
                    alldata:alldata
                });
            } else {
                Taro.showToast({
                    title: '修改失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    }

    render() {
        let html ='';
        switch (this.state.nowPageStatus.status) {
            case '基本信息':{
                html = 
                <Tabmessage 
                shopListone={this.state.shopListone} 
                alldata = {this.state.alldata} 
                productId={this.productId} 
                numIid={this.numIid} 
                shopType={this.state.lastShopType}
                shopId = {this.state.chooseShop}
                editItemForPdd = {this.editItemForPdd}
                showEditTitle = {()=>{this.refs.editTitle.show();}}
                hideEditTitle = {()=>{this.refs.editTitle.hide();}}
                />
            } break;
            case '销售规格':{
                html = 
                <Tabsell 
                refs={'Tabsell'} 
                alldata = {this.state.alldata} 
                productId={this.productId} 
                numIid={this.numIid} 
                shopType={this.state.lastShopType}
                shopId = {this.state.chooseShop}
                editItemForPdd = {this.editItemForPdd}
                />
            } break;
            case '详情描述':{
                html =
                <Tabdetails 
                alldata = {this.state.alldata} 
                productId={this.productId} 
                numIid={this.numIid} 
                shopType={this.state.lastShopType}
                shopId = {this.state.chooseShop}
                editItemForPdd = {this.editItemForPdd}
                />
            } break;
            default: break;
        }

        let content = 
        <View style={{flex:1}}>
            <ItemTextArea value={this.state.alldata.name}
            height=px(150) multiple={true}
            maxLength={60}
            getValue={this.getValue}/>
        </View>;
        return (
            <View>
                <View style={{backgroundColor:'#f5f5f5',flex:1}}>
                    <View style={styles.topLine}>
                        <Text style={{fontSize:px(32),color:'#787993'}}>选择店铺</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            {this.renderShopTags()}
                        </View>
                    </View>
                        <ProductStatus pageStatus={this.state.pageStatus} nowPageStatus={this.state.nowPageStatus} changeStaus={this.changeStaus} />
                        {html}
                </View>
                {/* <View style={{position:'fixed',bottom:0,left:0,right:0,height:px(96),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <View style={{backgroundColor:'#ffffff',width:375,height:px(96),alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#333333',fontSize:px(32)}}>取消代销</Text>
                    </View>
                    <View style={{backgroundColor:'#ff6000',width:375,height:px(96),alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#ffffff',fontSize:px(32)}}>同步信息</Text>
                    </View>
                </View> */}
                <ItemConfirmDialog
                ref="editTitle"
                title={"修改商品标题"}
                submit={()=>{this.submitChangeTitle()}} cancel={()=>{this.refs.editTitle.hide()}}
                content={content}
                color="#ff6000"
                textColor="#ffffff"/>
            </View>
        );
  }
}