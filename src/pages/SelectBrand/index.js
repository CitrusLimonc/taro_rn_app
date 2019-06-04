import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,Input} from '@tarojs/components';
import Event from 'ay-event';
import {LocalStore} from '../../Public/Biz/LocalStore.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {Parse2json} from '../../Public/Biz/Parse2json.js';
import styles from './styles';
import px from '../../Biz/px.js';
/**
 * @author cy
 * 搜索品牌页
 */
export default class SelectBrand extends Component {
    constructor(props){
        super(props);
        this.state={
            searchValue:'', //搜索框的值
            dataSource:[], //所有品牌数据
            isRefreshing:false, //是否下拉刷新
            refreshText:'↓ 下拉刷新', //下拉刷新文字
            isLoading:false //是否正在加载中
        }
        this.pageNo = 1; //页码
        this.cid = '50000671'; //类目id
    }

    // config: Config = {
    //     navigationBarTitleText: '搜索品牌'
    // }
    
    componentDidMount(){
        Taro.showLoading({ title: '加载中...' });
        let self=this;
        //获取cid
        LocalStore.Get(['go_to_select_brands'],(result) => {
            console.log('go_to_select_brands',result);
            if (!IsEmpty(result)) {
                this.cid = Parse2json(result.go_to_select_brands);
            }

            // 获取第一页数据
            this.getBrands(1,(result)=>{
                this.setState({
                    dataSource:result
                });
                Taro.hideLoading();
            });

        });
    }

    //返回上一页并带回数据
    goBack = (item) =>{
        Event.emit('APP.add_search_back',item);
        GoToView({page_status:'pop'});
    }

    //获取所有品牌
    renderRow = (item, index) =>{
        return (
            <View style={styles.brandLine} onClick={()=>{this.goBack(item)}}>
                <Text style={{fontSize:px(28),color:'#4a4a4a'}}>{item.displayName}</Text>
            </View>
        );
    }

    //下拉刷新
    handleRefresh = () => {
        //显示加载中
        this.setState({
           isRefreshing: true,
           refreshText: '加载中...'
        });

        //获取第一页数据
        this.getBrands(1,(result)=>{
            this.setState({
                dataSource:result,
                isRefreshing:false,
                refreshText:'↓ 下拉刷新'
            });
        });
        if (this.state.dataSource.length>0) {
            this.refs.mylist.resetLoadmore();
        }
    }

    //下拉刷新头部
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

    /* 底部文本 */
    renderFooter = () =>{
        if(this.state.isLoading){
            return(
                <View style={{width:px(750),height:px(74),flexDirection:'row',backgroundColor:'#f5f5f5',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color: '#cccccc',fontSize: px(24)}}>加载中...</Text>
                 </View>
            );
        }
    }

    /* 无限滚动 */
    onEndReached = () =>{
        this.setState({
            isLoading:true
        });
        this.pageNo++;
        let self = this;
        self.getBrands(this.pageNo,(result)=>{
            self.setState({
                dataSource: self.state.dataSource.concat(result),
                isLoading:false
            });
        });
    }

    //搜索框的值发生改变时
    changeInput = (value) =>{
        this.setState({
            searchValue:value
        });
    }

    //搜索操作
    searchProduct = () =>{
        Taro.showLoading({ title: '加载中...' });
        this.refs.searchInput.wrappedInstance.blur();
        let self=this;
        setTimeout(()=>{
            self.getBrands(1,(result)=>{
                self.setState({
                    dataSource:result
                });
                Taro.hideLoading();
            });
        },1000);

    }

    //单页获取品牌
    getBrands = (pageNo,callback) =>{
        this.pageNo = pageNo;
        let params = {
            cid:this.cid,
            pageno:pageNo
        }
        if (!IsEmpty(this.state.searchValue)) {
            params.keyWords = this.state.searchValue;
        }
        NetWork.Get({
            url:'Distributeproxy/getItemProps',
            data:params
        },(rsp)=>{
            console.log('Distributeproxy/getItemProps',rsp);
            if(!IsEmpty(rsp.result)){
                callback(rsp.result);
            }
            else {
                callback([]);
            }
        },(error)=>{
            Taro.hideLoading();
            alert(JSON.stringify(error));
        });
    }
    //清除搜索
    clearAll = () =>{
        Taro.showLoading({ title: '加载中...' });
        this.setState({
            searchValue:''
        });
        this.getBrands(1,(result)=>{
            this.setState({
                dataSource:result
            });
            Taro.hideLoading();
        });
    }

    render(){

        let deleteIcon='';
        if (this.state.searchValue!='') {
            deleteIcon=
            <ItemIcon code={"\ue658"} iconStyle={styles.deleteIcon} onClick={()=>{this.clearAll()}}/>;
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
                            onChange={(value)=>{this.changeInput(value)}}/>
                            {deleteIcon}
                        </View>
                        <View style={{marginLeft:px(20)}} onClick={()=>{this.searchProduct()}}>
                            <Text style={{fontSize:px(30),fontWeight:'300',color:'#3D4145'}}>搜索</Text>
                        </View>
                    </View>
                    <ListView
                    style={{flex:1}}
                    ref='mylist'
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    renderHeader={this.renderHeader}
                    onEndReached={this.onEndReached}
                    showScrollbar={false}
                    />
                </View>
            </View>
        );
    }
}
