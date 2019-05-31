import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,Input,ScrollView} from '@tarojs/components';
import {GoToView} from '../../Public/Biz/GoToView.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import EvaluationIcon from './EvaluationIcon';
import styles from './styles';
/**
 * @author 
 * 
 */
const PAGE_SIZE = 20;
export default class EvaluationFeedback extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showValue:"",
			submit_bgcolor: "#ff6000", //ff6000
			submit_tcolor:"#ffffff",
			submit_text: "请评价工具满意度", //请填写服务态度差评原因
			input_val: "工具满足你的期待吗？说说它的优点和不足的地方，帮助我们继续改进吧",
			time_num:5,
			complete_num:5,
			success_rate_num:5,
			attitude_num:5,
			time_icon_color: "#ff6000",
			complete_icon_color: "#ff6000",
			success_rate_icon_color: "#ff6000",
			attitude_icon_color: "#ff6000",
			time_icon_text: "超赞",
			complete_icon_text: "超赞",
			success_rate_icon_text: "超赞",
			attitude_icon_text: "超赞",
		};
		// this.type_arr = ['time', 'complete', 'success_rate', 'attitude'];
		this.eva_level = ['非常差','差','一般','满意','超赞'];
		this.eva_level_color = ['#a3a6af', '#a3a6af', '#f3b518', '#ff6000', '#ff6000'];
		this.showValue;
	}

	// config: Config = {
    //     navigationBarTitleText: '反馈'
    // }

	componentWillMount() {
		let self = this;
		// RAP.on('App.check_eva', (res) => {
		// 	let set_state = {};
			
		// 	set_state[res.type + "_icon_text"] = self.eva_level[res.num-1];
		// 	set_state[res.type + "_icon_color"] = self.eva_level_color[res.num-1];

		// 	let has_true = true;
		// 	if (res.type == "attitude" && parseInt(res.num) < 3) {
		// 		has_true = false;
		// 	}

		// 	if (has_true) {
		// 		set_state["submit_bgcolor"] = "#ff6000";
		// 		set_state["submit_tcolor"] = "#ffffff";
		// 		set_state["submit_text"] = "请评价工具满意度";
		// 	}else{
		// 		set_state["submit_bgcolor"] = "#e8e8e8";
		// 		set_state["submit_tcolor"] = "#000000";
		// 		set_state["submit_text"] = "请填写服务态度差评原因";
		// 	}
			
		// 	set_state[res.type+"_num"] = res.num;
		// 	self.setState(set_state);

		// });
	}
	//input框的修改
	inputChange = (value) => {
		console.log(value);
		this.showValue = value.value;
	}

	//input框失去焦点
	inputOnBlur = () => {
		this.setState({
			submit_bgcolor: "#ff6000",
			submit_tcolor: "#ffffff",
			showValue: this.showValue
		});
	}

	save =()=>{
		
		let self = this;
		
		if (self.state.submit_text == "请评价工具满意度" || (self.state.submit_text == "请填写服务态度差评原因" && self.state.showValue != "")) {
			NetWork.Post({
				url: 'Orderreturn/eva_feedback',
				params: {
					time_num: self.state.time_num,
					complete_num: self.state.complete_num,
					success_rate_num: self.state.success_rate_num,
					attitude_num:self.state.attitude_num,
					showValue:self.state.showValue
				}
			}, (data) => {
				Taro.showToast({
					title: '评价完成',
					icon: 'none',
					duration: 2000
				});
				GoToView({
					page_status: 'pop'
				});
			}, (error) => {
				// alert(JSON.stringify(error));
			})
		}else{
			Taro.showToast({
				title: '请填写服务态度差评原因',
				icon: 'none',
				duration: 2000
			});
		}
	}

	render(){
		let submit_style = { 
			position: 'fixed',
			bottom: 0,
			left: 0,
			right: 0,
			backgroundColor: this.state.submit_bgcolor,
			height: px(96),
			alignItems: 'center',
			justifyContent: 'center'
		};
		let submit_textstyle = { color: this.state.submit_tcolor, fontSize: px(32) } 
		return (
            <View>
				<ScrollView style={{
					flex: 1,
					paddingLeft:24,
					paddingRight:24,
					backgroundColor:'#ffffff'}}>
					<View style={{
						flexDirection:'row',
						width:700,
						height:70,
						alignItems:'center',
						paddingTop: 28,
						paddingBottom: 20,
						borderBottomColor: "#e8e8e8",
						borderBottomWidth: 2}}><Text style={{fontSize:26}}>感谢您花时间参与我们的调研，请给下列内容打分</Text></View>
					<View style={{paddingTop: 24}}><Text style={{fontSize:36}}>铺货速度</Text></View>
					<EvaluationIcon icon_color={this.state.time_icon_color} icon_text={this.state.time_icon_text} type={"time"}  num={this.state.time_num}/>
					<View style={{paddingTop: 24,flexDirection:"row",alignItems:"center"}}><Text style={{fontSize:36}}>铺货完整度</Text><Text style={{fontSize:26}}>（主图、详情、属性的完整度）</Text></View>
					<EvaluationIcon icon_color={this.state.complete_icon_color} icon_text={this.state.complete_icon_text} type={"complete"}  num={this.state.complete_num}/>
					<View style={{paddingTop: 24,}}><Text style={{fontSize:36}}>铺货成功率</Text></View>
					<EvaluationIcon icon_color={this.state.success_rate_icon_color} icon_text={this.state.success_rate_icon_text} type={"success_rate"}  num={this.state.success_rate_num}/>
					<View style={{paddingTop: 24,}}><Text style={{fontSize:36}}>服务态度</Text></View>
					<EvaluationIcon icon_color={this.state.attitude_icon_color} icon_text={this.state.attitude_icon_text} type={"attitude"}  num={this.state.attitude_num}/>
					<View style={{paddingTop: 24,}}><Text style={{fontSize:36}}>欢迎吐槽</Text></View>
					<Text style={{fontSize:26,color:"#a3a6af"}}>{this.state.input_val}</Text>
					<Input style={styles.inputStyle}
					value={this.state.showValue}
					multiple = {
						true
					}
					maxLength={
						500
					}
					rows = {
						1
					}
					onInput={(value)=>{this.inputChange(value)}}
					onChange={()=>{this.inputOnBlur()}}
					/>
					<View style={submit_style} onClick={()=>{this.save()}}>
						<Text style={submit_textstyle}>{this.state.submit_text}</Text>
					</View>
				</ScrollView>
            </View>
        );
	}
}