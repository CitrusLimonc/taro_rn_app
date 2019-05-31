import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import GoodsProductMap from '../../Component/GoodsProductMap';
import {GoToView} from '../../Public/Biz/GoToView.js';
import styles from './styles.js';
import { NetWork } from '../../Public/Common/NetWork/NetWork.js';

/**
 * @author wzm
 * 货源推荐列表页
 */
const PAGE_SIZE = 20;
export default class GoodsSource extends Component {
    constructor(props) {
        super(props);
        this.state={
			gridData :[], //数据源
			rowData:[],
			isRefreshing: false,
			refreshText: '↓ 下拉刷新',
            loadmore:false
		};
		this.gridDataSource = [];//所有推荐商品数据源
		this.page_no = 1;
		this.suppliersCount = 0;
		this.singleSuppliersCount = 0;//第一页供应商数
		this.relationModels = []; //供应商列表
		this.userInfo = {};
		this.getlisttoken = 0;
	}
	
	// config: Config = {
    //     navigationBarTitleText: '推荐货源'
    // }

    componentWillMount(){
		let self = this;
		//获取推荐货源
		// RAP.aop.request({
		// 	isOpenApi: true,
		// 	namespace: 'com.alibaba.account',
		// 	api: 'alibaba.account.basic',
		// 	version: '1',
		// }, (result) => {
		// 	if (result.success+"" == "true") {
		// 		self.userInfo = result.result;
				
		// 		// this.querySuppliers();
		// 	}
		// 	// console.log("basic", result);
		// }, (error) => {
		// 	console.error(error);
		// });
		this.getSumSuggest();

	}

	/**
	 * 根据 Api 获取所有推荐商品数据
	 */
	getSumSuggest = ()=>{
		let self = this;
		NetWork.Post({
			url:"Distributeproxy/guessDaiXiaoOffer",
			data:{
				companyMemberId: self.userInfo.memberId,
				pageSize: 100,
			}
		},(result)=>{
			console.log('gridDataSource', result);
            if (!IsEmpty(result.result) && !IsEmpty(result.result.result)) {
                result = result.result.result;
    			if (result.count > 0) {
    				let dataarr = [];
    				for (let i in result.offerList) {
    					try {
    						let data = {};
    						data.title = result.offerList[i].subject;
    						data.primaryID = result.offerList[i].id;
    						data.price = result.offerList[i].price;
    						data.image = result.offerList[i].imageUrlMobile;
    						data.bookedCount = result.offerList[i].bookedCount;//90天成交笔数
    						data.gmtPost = result.offerList[i].gmtPost;//发布时间
    						data.memberId = result.offerList[i].memberId;
    						data.quantitySumMonth = result.offerList[i].quantitySumMonth;//月销售件数
    						dataarr[dataarr.length] = data;
    					} catch (error) {
    						console.error(error);
    					}
    				}
    				self.gridDataSource = dataarr;
    				console.log('gridDataSource', self.gridDataSource);
    				self.getProductSuggest(self.page_no);
    			}
            }
		},(error)=>{
			console.error(error);
			if(self.getlisttoken<3){
				self.getSumSuggest();
				self.getlisttoken++;
			}
		});
	}
	/**
	 * 分页获取推荐商品
	 */
	getProductSuggest = (page_no)=>{
		this.page_no ++;
		let start = (page_no - 1) * PAGE_SIZE;
		let end = page_no * PAGE_SIZE;
		let subArr = this.gridDataSource.slice(start, end);
		console.log('pageNo',page_no,subArr);
		this.setState({
			gridData: this.state.gridData.concat(subArr),
            loadmore:false
		});

        this.refs.recommendList.resetLoadmore();
	}

    // 底部加载更多
	loadmore = () => {
        console.log('gridDataSource',this.gridDataSource.length);
        if (this.gridDataSource.length < 20) {
            return ;
        }
        this.setState({
            loadmore:true
		});
		this.getProductSuggest(this.page_no);
	};
	/**
	 * 跳转到页面
	 */
	goToView = (info) => {
		GoToView(info);
	}

    //下拉刷新操作
	handleRefresh = () => {
		this.setState({
			isRefreshing: true,
			refreshText: '加载中...',
		});
		this.page_no = 1;
		this.getlisttoken = 0;
        this.getSumSuggest();
        // this.querySuppliers();
		setTimeout(() => {
			this.setState({
				isRefreshing: false,
				refreshText: '↓ 下拉刷新',
			});
		}, 2000);
	}

    //渲染头部的下拉刷新
    renderHeader = () =>{
        return (
            <RefreshControl refreshing={this.state.isRefreshing} style={styles.itemRefresh} onRefresh={this.handleRefresh}>
                <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.state.refreshText}</Text>
            </RefreshControl>
        );
    }

    //渲染列表
    renderRow = () =>{
        let doms = [];
        doms.push(
            <View style={{marginTop:px(24),backgroundColor:"#fff"}}>
                <GoodsProductMap rows={2} dataSource={this.state.gridData} />
            </View>
        );

        return doms;
    }

    //渲染底部
    renderFooter = () => {
        return this.state.loadmore ? (
                <View style={styles.loadmore_view}>
                    <Text style={styles.loadmore_text}>加载更多</Text>
                </View>
            ):(null)
    }

    render(){
        return (
			<ListView
			ref = "recommendList"
			style = {{flex:1,backgroundColor:'#f5f5f5'}}
			onEndReachedThreshold = {800}
			onEndReached = {()=>{console.log('到底了。。',this.page_no);this.loadmore();}}
			renderFooter = {this.renderFooter}
			renderHeader = {this.renderHeader}
			renderRow = {this.renderRow}
			dataSource = {['null']}
			/>
        );
    }
}