import Taro, { Component, Config } from '@tarojs/taro';
import { View,Text,Input} from '@tarojs/components';
import ProductCard from './ProductCard';
import SideDialog from './SideDialog';
import ItemIcon from '../../Component/ItemIcon';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import styles from './styles';
import {Domain} from '../../Env/Domain';

/**
* @author wzm
* 库存预警日志
**/
export default class SyncLoglist extends Component{
    constructor(props) {
        super(props);
        this.state={
            dataSource:[

            ],//列表数据源
            pageNo:1,//页码
            pageSize:20,//每页展示数量
            showLoading:false,//加载状态
            isLoading:true,//加载状态
            searchtext:'',//搜索关键词
            refreshText: '↓ 下拉刷新',//下拉刷新的文字
            isRefreshing:false,//是否正在刷新
            lastShop:{},//当前店铺信息
            synctime:{shop_name:'近7天',id:'7'},//当前筛选时间
            issuccess:{shop_name:'全部',id:'all'},//当前筛选是否成功
            shopList:[],
        };
        //用户信息
        this.userNick = '';
        this.userId = '';
        this.memberId = '';
    }

    // config: Config = {
    //     navigationBarTitleText: '库存预警'
    // }

    componentDidMount(){
        let self = this;
        Taro.showLoading({ title: '加载中...' });
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     console.log('getUserInfo',info);
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.userNick = info.extraInfo.result.loginId;
        //         self.userId = info.extraInfo.result.userId;
        //         self.memberId = info.extraInfo.result.memberId;
        //     } else {
        //         self.userNick = info.nick;
        //         self.userId = info.userId;
        //     }
            self.loadData();
        // }).catch((error) => {
        //     console.log(error);
        // });
    }
    //加载店铺列表
    loadData = () =>{
        let self = this;
        self.getShopLists((shopList)=>{
            let lastShop = {};
            if (!IsEmpty(shopList)) {
                lastShop = shopList[0];
                if (!IsEmpty(this.state.lastShop)) {
                    shopList.map((item,key)=>{
                        if (item.id == this.state.lastShop.id) {
                            lastShop = Parse2json(JSON.stringify(item));
                        }
                    });
                }
                this.state.lastShop = lastShop;
                let params = {
                    pageNo:1,
                };
                self.getData(params);
            } else {
                self.setState({
                    showLoading:false
                });
                Taro.hideLoading();
            }
        });
    }
    //获取店铺列表
    getShopLists = (callback) =>{
        NetWork.Get({
            url:'Distributeproxy/getProxyShopInfo',
            data:{}
        },(rsp)=>{
            console.log('Distributeproxy/getProxyShopInfo',rsp);
            //有结果
            if (!IsEmpty(rsp)) {
                let allshop = {id:'all',shop_name:'全部'};
                rsp.result.unshift(allshop);
                this.state.shopList = rsp.result;
                callback(rsp.result);
            } else {
                callback([]);
            }
        },(error)=>{
            callback([]);
            alert(JSON.stringify(error));
        });
    }


    //底部文本
    renderFooter = () => {
        let foot = '';
        if (this.state.showLoading) {
            foot =
            <View style={{width: px(750),height: px(50),flexDirection: 'row',backgroundColor: '#f5f5f5',justifyContent: 'center',alignItems: 'flex-start'}}>
                <Text style={{color: '#cccccc',fontSize: px(24)}}>加载中...</Text>
            </View>;
        }
        return foot;
    }

    //无限滚动
    onLoadMore = () => {
        const self = this;
        let pageNo = this.state.pageNo + 1;
        let param = {
            pageNo:pageNo,
        };

        this.setState({
            showLoading:true
        });
        //获取下一页数据
        this.getData(param);
    }

    //获取数据
    getData = (param) =>{
        param.shopId = this.state.lastShop.id;
        param.user_id = this.userId;
        param.search_txt = this.state.searchtext;
        param.is_success = this.state.issuccess.id;
        param.search_time = this.state.synctime.id;
        param.pagenum = 20;
        if (IsEmpty(param.pageNo)) {
            param.pageNo = 1;
        }
        NetWork.Get({
            url:'dishelper/getsynclog',
            host:Domain.WECHART_URL,
            data:param
        },(rsp)=>{
            //有结果
            let dataSource = this.state.dataSource;
            let initData = {};
            if(!IsEmpty(rsp)){
                if (param.pageNo > 1) {
                    dataSource = this.state.dataSource.concat(rsp.value);
                } else {
                    dataSource = rsp.value;
                }
                initData.dataSource = dataSource;
            }

            this.setState({
                ...initData,
                pageNo:param.pageNo,
                showLoading:false,
                isLoading:false,
                isRefreshing: false,
            });
            Taro.hideLoading();
        },(error)=>{
            this.setState({
                dataSource:[],
                pageNo:param.pageNo,
                showLoading:false,
                isLoading:false,
                isRefreshing: false,
            });
            Taro.hideLoading();
        });
    }


    //下拉刷新
    handleRefresh = () => {

        this.setState({
           isRefreshing: true,
           refreshText: '加载中...'
        });
        this.state.pageNo = 1;
        let params = {
            pageNo:1,
        };

        this.getData(params);
    };

    //列表的头部
    renderHeader = () =>{
        let text='';

        if (this.state.isRefreshing) {
            text=this.state.refreshText;
        } else {
            text='↓ 下拉刷新';
        }

        return (
            <RefreshControl
            style={styles.refresh}
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleRefresh}
            >
                <Text style={styles.loadingText}>{text}</Text>
            </RefreshControl>
        );
    }

    //空列表的内部
    renderNull = (item,index) =>{
        return (
            <View style={{flex:1}}>
                <View style={styles.midContent}>
                    <ItemIcon code={"\ue61d"} iconStyle={{fontSize:px(140),color:'#e6e6e6'}}/>
                    <Text style={{fontSize:px(24),color:'#666',marginTop:px(40)}}>没有符合条件的日志</Text>
                </View>
            </View>
        );
    }

    //获取商品
    getProductLists = (item, index) => {
        if (item == "null") {
            return ;
        }
        return (
            <ProductCard item={item} shopList={this.state.shopList} />
        )
    }
    //搜索关键字
    onChangetext = (value) =>{
        let self = this;
        Taro.showLoading({ title: '加载中...' });
        this.setState({
            searchtext:value,
        })
        this.state.pageNo = 1;
        let params = {
            pageNo:1,
        };

        this.getData(params);
    }

    //确认筛选
    submitFilter = (lastShop,issuccess,synctime) =>{
        Taro.showLoading({ title: '加载中...' });
        let params = {
            pageNo:1
        };
        this.state.pageNo = 1;
        this.state.lastShop = lastShop;
        this.state.issuccess = issuccess;
        this.state.synctime = synctime;
        if (!IsEmpty(lastShop)) {
            params.shopId = lastShop.id;
            params.search_txt = lastShop.id;
            params.is_success = issuccess.id;
            params.search_time = synctime.id;
            params.user_id = this.userId;
        }

        this.getData(params);
    }
    //隐藏弹窗
    cancel = () =>{
        this.refs.sureDialog.hide();
    }

    render(){
        let headSelect='';//搜索、选择状态
        let {isLoading,dataSource,shopList} = this.state;

        //批量状态的头部
            headSelect= (
            <View style={styles.headSelect}>
                <View style={styles.headLeft}>
                    <Input style={styles.headInput} placeholder={"输入搜索关键词"} onChange={this.onChangetext}/>
                    <ItemIcon code={"\ue6ac"} iconStyle={styles.searchIcon}/>
                </View>
                <View style={styles.headRight} onClick={()=>{this.refs.slideDialog.show()}}>
                    <Text style={{fontSize:px(28),color:'#4A4A4A'}}>筛选</Text>
                    <ItemIcon code={"\ue6f1"} iconStyle={{fontSize:px(38),marginLeft:px(10),color:'#4A4A4A'}} onClick={()=>{this.refs.slideDialog.show()}}/>
                </View>
            </View>
            );
        let content = '';
        if (isLoading) {
            content = '';
        } else {
            if (IsEmpty(dataSource)) {
                content =
                <ListView
                ref="itemListView"
                dataSource={['null']}
                renderHeader={this.renderHeader}
                renderRow={this.renderNull}
                showScrollbar={false}
                />;
            } else {
                content =
                <ListView
                ref="itemListView"
                dataSource={dataSource}
                renderRow={this.getProductLists}
                renderHeader={this.renderHeader}
                renderFooter={this.renderFooter}
                onEndReached={this.onLoadMore}
                onEndReachedThreshold={300}
                showScrollbar={false}
                />;
            }
        }

        return (
            <View>
                <View style={{flex:1,backgroundColor:'#F5F5F5'}}>
                    <View>
                        {headSelect}
                    </View>
                    {content}
                </View>
                <SideDialog
                ref='slideDialog'
                submitFilter={this.submitFilter}
                shopId = {this.state.lastShop.id}
                synctime = {this.state.synctime.id}
                issuccess = {this.state.issuccess.id}
                shopList={shopList}
                ></SideDialog>
            </View>
        );
    }
}