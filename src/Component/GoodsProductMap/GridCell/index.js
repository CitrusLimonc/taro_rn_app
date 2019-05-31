import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import styles from './styles';
import {IsEmpty}from '../../../Public/Biz/IsEmpty.js';
import {DoBeacon} from '../../../Public/Biz/DoBeacon';
import px from '../../../Biz/px.js';

/**
 * @author SmingPro
 * 浏览货源列表-card
 */
export default class GridCell extends Component {
	constructor(props) {
		super(props);
		this.state={
            loginId:'',
        }
	}
	componentWillMount(){
        const self = this;
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
            self.state.loginId = '萌晓月cy';
            // if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
            //     self.state.loginId = info.extraInfo.result.loginId;
            // } else {
            //     self.state.loginId = info.nick;
            // }
        // });
	}
	//点击图片操作
	clickimg=()=>{
		const self = this;
		if(self.props.from =='suppliergoods'){
			DoBeacon('TD20181012161059','supplierpage_click_goods',this.state.loginId);
		}else{
			DoBeacon('TD20181012161059','goods_guess_click',this.state.loginId);
		}
		self.props.callback();

	}

	render(){
		const self = this;
		let dataSource = this.props.dataSource;
		let size = this.props.size;
		let textstyle = this.props.textstyle == undefined ? "" : this.props.textstyle;
		let imageDom = [];
		if (IsEmpty(dataSource.image)) {
			imageDom.push(
				<View style={styles['gridcellnoimage'+size]}></View>
			);
		}else{
			let imgUrl = dataSource.image;
			if (imgUrl.substr(0,4) != 'http') {
				imgUrl = 'https:' + imgUrl;
			}
			imageDom.push(
				<Image
				src = {
					imgUrl
				}
				style = {
					styles['gridcellimage'+size]
				}
				autoFit={false}
				/>
			);
		}
		let titleDom = [];
		if (dataSource.title == undefined) {
		}else if(dataSource.title == ""){
			titleDom.push(<View style={{backgroundColor: "#fafafa",height:px(64),marginTop: px(8),}}></View>);
		}else{
			titleDom.push(<Text style={[styles.gridtitle,{marginTop:px(8)}]} numberOfLines={2}>{dataSource.title}</Text>);
		}
		let priceDom = [];
		if (dataSource.price == undefined) {
		} else if (dataSource.price == "") {
			priceDom.push(<View style={{height:px(28),width:px(100),backgroundColor:"#fafafa",marginTop:px(8)}}></View>);
		}else{
			priceDom.push(<Text style={{fontSize:px(24),color:"#333333",marginTop:px(8)}}>¥{dataSource.price}</Text>);
		}
        return (

			<View style={styles['gridcell'+size]}>
				<View onClick={()=>{this.clickimg()}}>
				{/* <View  onClick={this.props.callback}> */}
					{imageDom}
				</View>
				<View style={styles['gridcelltitle'+textstyle]}>
					{
						titleDom
					}
					{priceDom}
				</View>
			</View>
        );
    }
}
