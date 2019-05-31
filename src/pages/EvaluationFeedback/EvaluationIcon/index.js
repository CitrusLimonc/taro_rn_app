import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text} from '@tarojs/components';
import styles from './styles';
import ItemIcon from '../../../Component/ItemIcon';


/*
* @author SmingPro
* 评分卡片
超赞、满意、一般、差、非常差
*/
export default class EvaluationIcon extends Component {
    constructor(props) {
        super(props);
        this.state={
		};
		this.MAX_COUNT = 5;
		this.type;
		this.num;
		this.icon_color;
		this.icon_text;
    }

    componentDidMount(){

	}
	//点击五角星操作
	clickicon = (num) => {
		let self = this;
		// RAP.emit('App.check_eva', {
		// 	type: self.type,
		// 	num: num
		// });
	}
	/**
	 * 显示评分五角星
	 * @param {*} count 
	 */
	showIcon(sum_count){
		let jsx = [];
		let count = 0;
		for (let index = 1; index <= sum_count; index++) {
			count = index;
			let click_num = count+"";
			jsx.push(
				<View  onClick={()=>{this.clickicon(click_num)}}>
					<ItemIcon code={"\ue730"} iconStyle={[styles.checkicon,{color:this.icon_color}]}/>
				</View>
			);
		}

		for (; count < this.MAX_COUNT; ) {
			let click_num = ++count + "";
			jsx.push(
				<View  onClick={()=>{this.clickicon(click_num)}}>
					<ItemIcon code={"\ue730"} iconStyle={[styles.icon]}/>
				</View>
			)
			;
		}
		
		return jsx;
	}

    render() {
        const {
        	type,
			num,
			icon_text,
			icon_color
		} = this.props;
		
		let count = num;

		this.num = count;
		this.type = type;
		this.icon_text = icon_text;
		this.icon_color = icon_color;

		let jsx = this.showIcon(count);

        return (
            <View style={{
				width:px(750),
				height:60,
				marginTop:  24,
				marginBottom:  24,
				flexDirection: 'row',
				alignItems: 'center',
			}}>
				{jsx}
				<View style={{justifyContent: 'flex-end',alignItems: 'center',}}><Text style={{color:this.icon_color,fontSize:26}}>{this.icon_text}</Text></View>
			</View>
        );
    }
}
