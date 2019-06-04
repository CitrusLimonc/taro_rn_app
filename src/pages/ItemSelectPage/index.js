import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, ScrollView,Input} from '@tarojs/components';
import Event from 'ay-event';
import GoodsProductMap from '../../Component/GoodsProductMap';
import ItemIcon from '../../Component/ItemIcon';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import { GoToView } from '../../Public/Biz/GoToView.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import styles from './styles';
import {DoBeacon} from '../../Public/Biz/DoBeacon';
import px from '../../Biz/px.js';

/**
 * @author cy
 * 搜索页
 */
export default class ItemSelectPage extends Component {
    constructor(props){
        super(props);
        this.state={
            //搜索历史
            history:[],
            searchValue:'',
            tabStatus:[
                {name:'综合',hasSort:false},
                {name:'新品',hasSort:true,sortType:'post_time'},
                {name:'销量',hasSort:true,sortType:'booked'},
                {name:'价格',hasSort:true,sortType:'price'}
            ],
            lastTabStatus:'综合',
            searchStatus:false,
            offerList:[],
            showLoading:false,
            totalRecords:0,
            refreshText: '↓ 下拉刷新',//下拉刷新的文字
            isRefreshing:false,//是否正在刷新
        }
        this.searchProduct=this.searchProduct.bind(this);
        this.from = GetQueryString({name:'from'});
        this.type = '';
        this.loginId = '';
        this.isvDaixiaoOfferRequest = {
            pageNo:1,
            pageSize:10
        };
        let self=this;

    }

    // config: Config = {
    //     navigationBarTitleText: this.from == 'searchSource' ? '搜索货源' : '搜索'
    // }

    componentWillMount(){
        this.from = GetQueryString({name:'from'});
        this.type = GetQueryString({name:'type'});

        let self=this;
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
            self.loginId = '萌晓月cy';
            // if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
            //     self.loginId = info.extraInfo.result.loginId;
            // } else {
            //     self.loginId = info.nick;
            // }
            DoBeacon('TD20181012161059','page_search_shows',self.loginId);
        // });
        var p1=new Promise(function(resolve,reject){
            let history=[];//搜索历史
            //获取搜索历史
            LocalStore.Get(['searchHistory_distributor'],(result)=>{
                if (!IsEmpty(result) && result!='empty') {
                    if (result.searchHistory_distributor=="[]") {
                        history=[];
                    } else {
                        if (typeof(result.searchHistory_distributor)=="string") {
                            history=JSON.parse(result.searchHistory_distributor);
                        } else {
                            history=result.searchHistory_distributor;
                        }

                    }
                } else {
                    history=[];
                }
                resolve({
                    history:history
                });
            });
        });

        var p2=new Promise(function(resolve,reject){
            LocalStore.Get(['search_list_subjectkey_distributor'],(result)=>{
                if (!IsEmpty(result) && result!='empty') {
                    let subjectKey=result.search_list_subjectkey_distributor;
                    // console.log('取出',result);
                    resolve({
                        searchValue:subjectKey
                    });

                    LocalStore.Remove(['search_list_subjectkey_distributor']);
                } else {
                    resolve({
                        searchValue:''
                    });
                }
            });
        });


        Promise.all([p1,p2]).then(function(result){
            self.setState({
                ...result[0],
                ...result[1]
            });
        });
    }

    //获取所有搜索历史
    getHistory = () =>{
        let doms=[];
        this.state.history.map((item,key)=>{
            doms.push(
                <View style={styles.historys} onClick={()=>{this.goToListPage(item)}}>
                    <ItemIcon code={"\ue6ac"} iconStyle={styles.historyIcon}/>

                    <Text style={styles.historyText}>{item}</Text>
                </View>
            )
        });
        return doms;
    }

    //从搜索历史跳转到指定页面
    goToListPage = (val) =>{
        if (this.from == 'searchSource') {
            this.state.searchValue = val;
            Taro.showLoading({ title: '加载中...' });
            this.getOffers((data)=>{
                this.setState({
                    searchStatus:true,
                    offerList:data
                });
                Taro.hideLoading();
            });
        } else {
            let data = {
                subjectKey:val,
                lastTab:'list'
            };
            LocalStore.Set({'homeSubjectKey_distributor':val});
            if(this.type == 'recycle'){
                Event.emit('App.recylelist_search',data);
            }else{
                Event.emit('App.list_search',data);
            }
            GoToView({page_status:'pop'});
        }
    }

    //搜索框的值发生改变时
    changeInput = (value) =>{
        //console.log('searchValue',value);
        this.setState({
            searchValue:value
        });
    }

    //搜索操作
    searchProduct = () =>{
        console.log('搜索操作');
        this.refs.searchInput.wrappedInstance.blur();
        let self=this;
        setTimeout(function(){
            let newHistory=self.state.history;
            let flag=true;
            if (IsEmpty(self.state.searchValue)) {
                flag=false;
            }
            self.state.history.map((item,key)=>{
                if (item==self.state.searchValue) {
                    flag=false;
                }
            });
            if (flag) {
                newHistory.unshift(self.state.searchValue);
            }
            if (newHistory.length>7) {
                newHistory.splice(7,newHistory.length-7);
            }
            if (newHistory.length>0) {
                let query={
                    'searchHistory_distributor':JSON.stringify(newHistory)
                };
                LocalStore.Set(query);
            }

            self.setState({
                history:newHistory
            });

            if (self.from == 'searchSource') {
                Taro.showLoading({ title: '加载中...' });
                self.getOffers((data)=>{
                    self.setState({
                        searchStatus:true,
                        offerList:data
                    });
                    Taro.hideLoading();
                });
            } else {
                let data = {
                    subjectKey:self.state.searchValue,
                    lastTab:'list'
                };
                LocalStore.Set({'homeSubjectKey_distributor':self.state.searchValue});
                if(self.type == 'recycle'){
                    Event.emit('App.recylelist_search',data);
                }else{
                    Event.emit('App.list_search',data);
                }
                GoToView({page_status:'pop'});
            }
        },100);
    }

    //清除历史搜索
    clearHistory = () =>{
        LocalStore.Remove(['searchHistory_distributor']);
        this.setState({
            history:[]
        });
    }

    //搜索货源
    getOffers = (callback) =>{
        if (!IsEmpty(this.state.searchValue)) {
            this.isvDaixiaoOfferRequest.keywords = this.state.searchValue;
        }
        console.log('isvDaixiaoOfferRequest',this.isvDaixiaoOfferRequest);
        NetWork.Get({
            url:'Orderreturn/searchDaixiaoOffer',
            data:this.isvDaixiaoOfferRequest
        },(rsp)=>{
            console.log('Orderreturn/searchDaixiaoOffer',rsp);
            //有结果
            if (!IsEmpty(rsp.offerList)) {
                this.state.totalRecords = rsp.count;
                let dataarr = [];
                rsp.offerList.map((item,key)=>{
                    let data = {};
                    data.title = item.subject;
                    data.primaryID = item.id;
                    data.price = item.price;
                    data.image = item.imageUrl;
                    data.bookedCount = item.bookedCount;//90天成交笔数
                    data.gmtPost = item.gmtPost;//发布时间
                    data.memberId = item.memberId;
                    data.quantitySumMonth = item.quantitySumMonth;//月销售件数
                    data.type = item.type;
                    dataarr.push(data);
                });
                callback(dataarr);
            } else {
                callback([]);
            }
        },(error)=>{
            callback([]);
            alert(JSON.stringify(error));
        });
    }

    changeTabber = (tab) =>{
        let {tabStatus,lastTabStatus,searchValue} = this.state;
        if (tab.name == '综合' && lastTabStatus == '综合') {
            return ;
        }

        this.isvDaixiaoOfferRequest = {
            pageNo:1,
            pageSize:10
        };

        Taro.showLoading({ title: '加载中...' });

        tabStatus.map((item,key)=>{
            if (tab.name == item.name) {
                if (tab.name != '综合') {
                    if (IsEmpty(item.descendOrder)) {
                        tabStatus[key].descendOrder = false;
                    } else {
                        tabStatus[key].descendOrder = !tabStatus[key].descendOrder;
                    }
                    this.isvDaixiaoOfferRequest.sorting = tabStatus[key].descendOrder;
                    this.isvDaixiaoOfferRequest.sortType = tabStatus[key].sortType;
                }
            } else {
                tabStatus[key].descendOrder = undefined;
            }
        });

        this.getOffers((data)=>{
            this.setState({
                tabStatus:tabStatus,
                lastTabStatus:tab.name,
                searchStatus:true,
                offerList:data
            });
            Taro.hideLoading();
        });
    }

    getTabbars = () =>{
        let {tabStatus,lastTabStatus} = this.state;
        let doms = [];
        tabStatus.map((item,key)=>{
            doms.push(
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}} onClick={()=>{this.changeTabber(item)}}>
                    <View style={lastTabStatus == item.name ? styles.activeTabBox:styles.normalTabBox}>
                        <Text style={lastTabStatus == item.name ? {fontSize:px(28),color:'#ff6000'}:{fontSize:px(28),color:'#333333'}}>
                        {item.name}
                        </Text>
                        {
                            item.hasSort ?
                            <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                <ItemIcon
                                code={"\ue74c"}
                                iconStyle={[{fontSize:px(28),color:'#666666'},!IsEmpty(item.descendOrder) && item.descendOrder == false ? {color:'#ff6000'}:{}]}
                                />
                                <ItemIcon
                                code={"\ue74d"}
                                iconStyle={[{fontSize:px(28),color:'#666666'},!IsEmpty(item.descendOrder) && item.descendOrder == true ? {color:'#ff6000'}:{}]}
                                boxStyle={{marginTop:px(-24)}}
                                />
                            </View>
                            :
                            ''
                        }
                    </View>
                </View>
            )
        });
        return doms;
    }

    renderRow = () =>{
        return (
            <GoodsProductMap rows={2} dataSource={this.state.offerList} />
        );
    }

    //底部文本
    renderFooter = () => {
        let foot = '';
        if (this.state.showLoading) {
            foot =
            <View style={{width:px(750),height:px(72),flexDirection:'row',backgroundColor:'#f5f5f5',justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'#cccccc',fontSize:px(24)}}>加载中...</Text>
            </View>;
        }
        return foot;
    }

    onLoadMore = () => {
        console.log('render------onLoadMore');
        this.refs.itemListView.resetLoadmore();
        if(this.state.totalRecords < 10){
            return ;
        }
        this.setState({
            showLoading:true
        });
        //获取下一页数据
        this.isvDaixiaoOfferRequest.pageNo += 1;
        this.getOffers((data)=>{
            this.setState({
                offerList:this.state.offerList.concat(data),
                showLoading:false
            });
        });
    }

    //下拉刷新
    handleRefresh = () => {
        this.setState({
           isRefreshing: true,
           refreshText: '加载中...'
        });
        this.isvDaixiaoOfferRequest.pageNo = 1;
        this.getOffers((data)=>{
            this.setState({
                offerList:data,
                isRefreshing:false,
                refreshText:'↓ 下拉刷新'
            });
        });

        if (this.state.offerList.length>0) {
            this.refs.itemListView.resetLoadmore();
        }
    };

    //列表的头部
    renderHeader = () =>{
        // console.log("renderHeader");
        let text='';

        if (this.state.isRefreshing) {
            text=this.state.refreshText;
        } else {
            text='↓ 下拉刷新';
        }

        //console.log('下拉刷新',text);
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


    render(){
        const {history,searchValue,searchStatus} = this.state;
        let clearBtn='';
        if (this.state.history.length>0) {
            clearBtn=
            <View style={styles.clearBtn} onClick={()=>{this.clearHistory()}}>
                <Text style={styles.clearText}>清空搜索历史</Text>
            </View>;
        }

        let deleteIcon='';
        if (this.state.searchValue!='') {
            deleteIcon=
            <ItemIcon code="\ue658" iconStyle={styles.deleteIcon} onClick={()=>{this.setState({searchValue:''});}}/>;
        }

        return (
            <View>
                <View style={{flex:1,backgroundColor:'#fff'}}>
                    <View style={styles.firstLine}>
                        <View style={styles.inputBox}>
                            <Input ref={"searchInput"}
                            value={this.state.searchValue}
                            placeholder={"输入搜索关键词"}
                            style={styles.selectInput}
                            onChange={(value)=>{this.changeInput(value)}}
                            onFocus={()=>{
                                this.isvDaixiaoOfferRequest={
                                    pageNo:1,
                                    pageSize:10
                                };
                                this.setState({
                                    tabStatus:[
                                        {name:'综合',hasSort:false},
                                        {name:'新品',hasSort:true,sortType:'post_time'},
                                        {name:'销量',hasSort:true,sortType:'booked'},
                                        {name:'价格',hasSort:true,sortType:'price'}
                                    ],
                                    lastTabStatus:'综合',
                                    searchStatus:false
                                });
                            }}
                            />
                        </View>
                        <View style={{marginLeft:px(20)}} onClick={()=>{this.searchProduct()}}>
                            <Text style={{fontSize:px(30),fontWeight:'300',color:'#3D4145'}}>搜索</Text>
                        </View>
                    </View>
                    {
                        searchStatus ?
                        ''
                        :
                        <View style={styles.normalLine}>
                            <Text style={{color:'#C7C7C7',fontSize:px(28),fontWeight:'300'}}>搜索历史</Text>
                        </View>
                    }
                    {
                        searchStatus ?
                        <View style={{flex:1}}>
                            <View style={styles.tabbarLine}>
                            {this.getTabbars()}
                            </View>
                            <ListView
                            ref="itemListView"
                            style={{flex:1,marginTop:px(24)}}
                            dataSource={['null']}
                            renderHeader={this.renderHeader}
                            renderRow={this.renderRow}
                            renderFooter={this.renderFooter}
                            onEndReached={this.onLoadMore}
                            onEndReachedThreshold={800}
                            showScrollbar={false}
                            />
                        </View>
                        :
                        <ScrollView>
                            {this.getHistory()}
                            {clearBtn}
                        </ScrollView>
                    }
                </View>
            </View>
        );
    }
}
