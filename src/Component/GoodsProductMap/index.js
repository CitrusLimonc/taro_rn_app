import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,ScrollView} from '@tarojs/components';
import { Grid } from '@ant-design/react-native';
import GridCell from './GridCell';
import {GoToView} from '../../Public/Biz/GoToView.js';
import { IsEmpty } from '../../Public/Biz/IsEmpty';
import px from '../../Biz/px.js';
/**
 * @author SmingPro
 * 浏览货源列表
 */
export default class GoodsProductMap extends Component {
	constructor(props) {
		super(props);
	}
	renderGridCell = (item, index) => {

		let size = this.props.size == undefined ? "" : this.props.size;
		let title = item.title;
		let dataSource = {
			title: title,
			image: item.image,
			price: item.price,
		}

		let supplierMemberId = item.memberId;
		//是否来自代销货品页面
		if (this.props.needMid == true && !IsEmpty(this.props.supplierMemberId)) {
			supplierMemberId = this.props.supplierMemberId;
		}

		return (
			<GridCell
				size={size}
				key = {index}
				dataSource={dataSource}
				from ={this.props.from}
				callback = {
					this.goToView.bind(this, {
						status: 'ProductDetail',
						query: {
							offerid: item.primaryID,
							bookedCount: item.bookedCount,
							// // gmtPost: item.gmtPost,
							quantitySumMonth: item.quantitySumMonth,
							memberId: supplierMemberId,
							from:this.props.from,
							type: item.type
						}
					})
				}
				buttonText={this.props.buttonText}
				buttonCallback = {
					this.buttonCallback.bind(this, item.primaryID)
				}
			/>
		);
	}
	/**
	 * 显示货源列表
	 */
	showMap = () =>{
		let dataSource = this.props.dataSource;
		if (IsEmpty(dataSource) || dataSource.length == 0) {//画骨架图
			dataSource = [
				{
					title : "",
					primaryID: "",
					price: "",
					image: "",
				},{
					title: "",
					primaryID: "",
					price: "",
					image: "",
				},{
					title: "",
					primaryID: "",
					price: "",
					image: "",
				}, {
					title: "",
					primaryID: "",
					price: "",
					image: "",
				}
			];
		}
		let rows = this.props.rows;
		let horizontal = this.props.horizontal;
		let size = this.props.size == undefined ? "" : this.props.size;
		//横向显示
		if (horizontal) {
			let doms = [];
			for (let i in dataSource) {

				let callback = this.goToView.bind(this, {
					status: 'SupplierDetails',
					query: {
						memberId: dataSource[i].primaryID,
						supplierLoginId: encodeURI(dataSource[i].supplierLoginId)
					}
				});
				if (this.props.goProduct) {
					let query = {offerid: dataSource[i].primaryID};
					query.type = dataSource[i].type;
					if (this.props.needMid) {
						query.memberId = dataSource[i].memberId;
					}
					callback = this.goToView.bind(this, {
						status: 'ProductDetail',
						query: query
					});
				}

				if (dataSource[i].primaryID == 'source') {
					callback = this.goToView.bind(this,{status:'SupplierList'})
				} else if (dataSource[i].primaryID == 'supperlierList') {
					callback = this.goToView.bind(this,{
						status:'SupplierDetails',
						query:{
							supplierLoginId: encodeURIComponent(this.props.supplierLoginId),
							memberId:this.props.memberId
						}
					})
				}
				doms.push(
					<GridCell
					key = {i}
					textstyle={"center"}
					size={size}
					from ={this.props.from}
					dataSource={dataSource[i]}
					callback={callback}/>
				);
			}

			let viewHeight = px(324);
			if (size == 'small') {
				viewHeight = px(312);
				if(this.props.hasprice){
					viewHeight = px(332);

				}
				if (this.props.type == 'price') {
					viewHeight = px(264);
				}
			}
			return (
				<ScrollView
				scrollX={true}
				style={{ backgroundColor: '#ffffff', flex: 1, width: px(750),height:viewHeight }}
				>
					{doms}
				</ScrollView>
			);
		}else{ //多列展示
			return (
				<ScrollView>
					<Grid
					data = { dataSource }
					columnNum = { rows }
					renderItem = {this.renderGridCell}
					/>
				</ScrollView>
			);
		}
	}
	/**
	 * 跳转到页面
	 */
	goToView = (info) => {
		GoToView(info);
	}
	/**
	 *
	 */
	buttonCallback = (primaryID) => {
		console.log(primaryID);
	}
	render(){
        return (
			<View>
				{
					this.props.from =='DistributionResult'?(                    
					<View style={{backgroundColor:'#ffffff',marginTop:px(24),paddingBottom: px(30), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(30),flexDirection:'row',alignItems:'center'}}>
					<Text style={{ color: "#333333", fontSize: px(28)}}>您可能还想代销</Text>
					</View>):null
				}
				{this.showMap()}
			</View>
        );
    }
}
