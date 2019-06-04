import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text} from '@tarojs/components';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import GoodsProductMap from '../../Component/GoodsProductMap';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import ItemIcon from '../../Component/ItemIcon';
import styles from './styles.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {DoBeacon} from '../../Public/Biz/DoBeacon';
import {Domain} from '../../Env/Domain';
import px from '../../Biz/px.js';
/**
 * @author wzm
 * 优质供应商商品列表页
 */
const PAGE_SIZE = 20;
export default class SupplierGoods extends Component {
    constructor(props) {
        super(props);
        this.state={
			gridData :[], //当前显示推荐商品数据
			momentData :[], //暂时存储商品数据
			supplierdata:[], //供应商信息
			isRefreshing: false, //是否下拉刷新
			refreshText: '↓ 下拉刷新', //下拉刷新的文字
			loadmore:false, //是否加载更多
			loginId:'', //用户名
			token:false,
		};
		this.gridDataSource = [];//所有推荐商品数据源
		this.page_no = 1; //当前页码
		this.apiPageNo = 1;
	}
	
	// config: Config = {
    //     navigationBarTitleText: '优质供应商'
	// }

    componentWillMount(){
		const self = this;
		let supplierdata = GetQueryString({name:'supplierdata'});
		let supplierdatanew = decodeURI(supplierdata);
		console.log('supplier',supplierdatanew);
		let supplier = JSON.parse(supplierdatanew);
		console.log('supplier2',supplier);
        //获取商品列表
		this.getproducts(supplier,function(gridData){
			self.setState({
				gridData:gridData,
				supplierdata:supplier,
			})
		});

	}
	componentDidMount(){
		const self = this;
		// RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     self.state.loginId = info.extraInfo.result.loginId;
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.state.loginId = info.extraInfo.result.loginId;
        //     } else {
        //         self.state.loginId = info.nick;
		// 	}
		// 	DoBeacon('TD20181012161059','qualitysupplierpage_show',self.state.loginId);
        // });
	}
    //获取商品列表
	getproducts = (supplier,callback) =>{
		let self = this;
		NetWork.Post({
			url:'dishelper/getproductlist',
			host:Domain.WECHART_URL,  
			params:{
				memberId:supplier.memberId,
				page:self.apiPageNo,
				pagenum:10,
			}
		},(rsp)=>{
			if(rsp.code == 200){
				let gridData = [];
				self.apiPageNo = rsp.apiPageNo;
				for(let i=0;i<rsp.value.length;i++){
					if(rsp.value[i].offerStatus=='published'){
						let gridDataone = {};
						gridDataone.image = "https://cbu01.alicdn.com/"+rsp.value[i].picURI;
						gridDataone.price = rsp.value[i].sellPrice;
						gridDataone.title = rsp.value[i].productTitle;
						gridDataone.primaryID = rsp.value[i].productId;
						gridDataone.bookedCount = '';
						gridDataone.quantitySumMonth = '';
						gridDataone.memberId = supplier.memberId;
						gridData.push(gridDataone);
					}
				}
				if(!IsEmpty(self.state.momentData)){
					gridData = self.state.momentData.concat(gridData);
				}
				if(gridData.length>=10){
					self.state.momentData = [];
					gridData = gridData.slice(0,10);
					if(gridData.length%2 !=0){
						gridData.pop();
					}
					callback(gridData);
				}else{
					self.state.momentData = gridData;
					self.getproducts(supplier,callback);
				}


			}else{
				Taro.showToast({
					title: rsp.value,
					icon: 'none',
					duration: 2000
				});
				self.setState({
					loadmore:false,
				})
			}

		});
	}
    // 底部加载更多
	loadmore = () => {
		const self = this;
		let selfdata = this.state.supplierdata;
		let pageno = this.page_no;
		if(!self.token){
			this.setState({
				loadmore:true
			});
		}
		this.getproducts(selfdata,function(gridData){
			self.refs.recommendList.resetLoadmore();
			let gridDatanew = self.state.gridData.concat(gridData);
			if(!IsEmpty(gridData)){
				self.page_no = self.page_no + 1;
			}else{
				self.token = true;
			}
			self.setState({
				gridData:gridDatanew,
				loadmore:false,
			})
		});
	};
	/**
	 * 跳转到页面
	 */
	goToView = (info) => {
		GoToView(info);
	}

    //下拉刷新
	handleRefresh = () => {
		const self =this;
		let selfdata = this.state.supplierdata;
		this.setState({
			isRefreshing: true,
			refreshText: '加载中...',
		});
		this.page_no = 1;
		this.apiPageNo = 1;
		this.token = false;
		this.getproducts(selfdata,function(gridData){
			self.setState({
				gridData:gridData,
				isRefreshing: false,
				refreshText: '↓ 下拉刷新',
			})
		});
	}
    //渲染头部的下拉刷新
    renderHeader = () =>{
        return (
            <RefreshControl refreshing={this.state.isRefreshing} style={styles.itemRefresh} onRefresh={this.handleRefresh}>
                <Text style={{fontSize:"px(28)",color:"#3089dc"}}>{this.state.refreshText}</Text>
            </RefreshControl>
        );
	}
    //渲染供应商的标签
	gettag = () => {
		let doms=[];
        let tags =[];
        if (!IsEmpty(this.state.supplierdata) && !IsEmpty(this.state.supplierdata.suppliertag)) {
            tags = this.state.supplierdata.suppliertag.split(',');
        }
		tags.map((item,key)=>{
			doms.push(
				<Text style={{flexDirection:"row",backgroundColor:"rgb(238,103,35)",width:84,height:24,marginLeft:12,color:'#ffffff',fontSize: px(20),alignItems:'center',justifyContent:'center',borderRadius:4}}>{item}</Text>
			);
		});
		return doms;
	}
    //渲染页面主体
    renderRow = () =>{
		const self = this;
		let doms = [];
		let phone = this.state.supplierdata.supplierphone;
        doms.push(
            <View style={{backgroundColor:"#fff"}}>
				<View style={{flexDirection:"row",alignItems:'center',height:82,paddingLeft:32,borderBottomWidth:px(2),borderBottomColor:'#e5e5e5',}}>
					<Text style={{ color: "#121314", fontSize: "px(28)",}}>{this.state.supplierdata.suppliertitle}</Text>
					<ItemIcon onClick={()=>{UitlsRap.openChat(this.state.supplierdata.supplierwangwang)}} code={"\ue6ba"} iconStyle={{fontSize:px(40),color:'#2DA9F7',marginLeft:16}}/>
					{this.gettag()}
				</View>
               	<View style={{flexDirection:"row",alignItems:'center',justifyContent:'flex-end',height:98}}>
				   {/* <Button type="normal" style={{height:48,width:128,marginRight:24}} onpress={()=>{}}>拨打电话</Button> */}
				   {/* <Link style={{height:48,width:128,marginRight:24,flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:px(1),borderColor:'#c5c5c5',borderRadius:4,}} onClick={()=>{console.log('usephone');DoBeacon('TD20181012161059','supplierpage_btn_call',self.state.loginId);}} href={`tel:${phone}`}>
						<Text style={{color: "#999999", fontSize: "px(28)",}}>拨打电话</Text>
					</Link> */}
					<View style={{height:48,width:128,marginRight:24,flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:px(1),borderColor:'#c5c5c5',borderRadius:4,}} onClick={()=>{
					DoBeacon('TD20181012161059','supplierpage_btn_apply',self.state.loginId);
					GoToView({
						status:"https://page.1688.com/html/fa9028cc.html?sellerId=" + this.state.supplierdata.memberId,
						page_status:'special'
					});
					}}>
						<Text style={{color: "#999999", fontSize: "px(28)",}}>申请代销</Text>
					</View>
				</View>
            </View>
        );
        doms.push(
			<View style={{marginTop:px(24),backgroundColor:"#fff"}}>
				<View style={{paddingBottom: px(30), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(30),flexDirection:'row',alignItems:'center'}}>
					<Text style={{ color: "#333333", fontSize: "px(28)"}}>推荐货源</Text>
				</View>
				<GoodsProductMap from={'suppliergoods'} rows={2} dataSource={this.state.gridData} />
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