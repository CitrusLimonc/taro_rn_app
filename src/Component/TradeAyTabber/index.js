import Taro, { Component, Config } from '@tarojs/taro';
import { View ,Text} from '@tarojs/components';
import px from '../../Biz/px.js';
/**
* @author lzy
* 不同订单状态所显示的按钮
**/

export default class AyTabber extends Component{
    /**
    *taps [{checked:boolean txt:string}]
    *默认第一个选中状态
    */
    constructor(props) {
        super(props);
        const { taps } = this.props;
        let checks = [];
        for(let i in taps){
        	let obj = {};
        	obj.txt = taps[i];
        	if(i==0){
        		obj.checked = true;
        	}else{
        		obj.checked = false;
        	}
        	checks.push(obj);
        }
        this.state={
        	tap_check:checks,
        };

    }

    /**
    *index int
    *切换tab并向父组件返回下标
    */
    checkStatus(index){
        let new_tapcheck = this.state.tap_check;
        for(let i in new_tapcheck){
            if(index == i){
                new_tapcheck[i].checked = true;
            }else{
                new_tapcheck[i].checked = false;
            }
        }
        this.props.checkStatus(index);
        this.setState({tap_check:new_tapcheck});
    }

    render(){
    	const { tap_check } = this.state;
    	let fidex = tap_check.length-1;
      	return(
      		<View style={styles.tap_view2}>
	      		<View style={styles.tap_consor}>
	      			{tap_check.map((item,index)=>{
	      				return(
	      					<View key={index} onClick={()=>{this.checkStatus(index)}}
                            style={[styles.tap_btn,index==0?styles.left_r:{},index==fidex?styles.right_r:{},{backgroundColor:tap_check[index].checked?'#FF6000':'#ffffff'}]}>
			                    <Text style={[styles.tap_txt,{color:tap_check[index].checked?'#ffffff':'#FF6000'}]}>{item.txt}</Text>
			                </View>
      					)
	      			})}
	            </View>
            </View>
      	)

    }
}
const styles = {
    tap_view2:{
        paddingTop:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingLeft:px(18),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: px(106),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
    },
    tap_consor:{
        flexDirection: 'row',
        alignItems: 'center',
        height: px(56),
        flex:1,
    },
    tap_btn:{
        flex: 1,
        height: px(56),
        borderWidth: px(2),
        borderColor: '#FF6000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    right_r:{
        borderTopRightRadius: px(6),
        borderBottomRightRadius: px(6),
    },
    left_r:{
        borderTopLeftRadius: px(6),
        borderBottomLeftRadius: px(6),
    },
     tap_txt:{
        fontSize: px(28),
        color: '#FF6000',
    },
}
