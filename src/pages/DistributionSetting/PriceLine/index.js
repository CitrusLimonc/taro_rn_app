import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,Checkbox,Input,Radio,RadioGroup} from '@tarojs/components';
import px from '../../../Biz/px.js';
import styles from './styles';
/**
 * @author cy
 * 价格行组件
 * title 主标题
 * subTitle 副标题
 * mulNum 价格所乘百分比
 * addNum 价格所加数
 * isRemovePoint 是否去掉小数点
 * removeWay 四舍五入（1）或直接去掉（2）
 * pointCallback checkbox的回调
 * removeCallback radio的回调
 * priceWay 售价设置类型
 */
export default class PriceLine extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const {title,subTitle,mulNum,addNum,isRemovePoint,removeWay,callback,priceWay,onlypercent} = this.props;
        console.log('组件名字',title)
        return (
            <View style={styles.commonLine}>
                <Text style={{fontSize:px(32),color:'#030303'}}>{title}</Text>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:px(8)}}>
                    { title == '售价设置'?
                    (
                        <RadioGroup onChange={(value)=>{callback(value,title,'priceWay')}} value={priceWay}>
                        <View style={styles.input}>
                            <Radio size="small" value={"0"} type="dot" style={{width:px(44),height:px(44)}}></Radio>
                            <Text style={styles.smallText}>{'采购价'}</Text>
                            <Text style={[styles.smallText,{marginLeft:px(8),marginRight:px(8)}]}>x</Text>
                            <Input style={styles.smallInput}
                            value={mulNum} onChange={(value)=>{callback(value,title,'mulNum')}}
                            type={"number"}/>
                            <Text style={[styles.smallText,{marginLeft:px(8),marginRight:px(8)}]}>% +</Text>
                            <Input value={addNum}
                            style={styles.smallInput}
                            onChange={(value)=>{callback(value,title,'addNum')}}
                            type={"number"}/>
                            <Text style={[styles.smallText,{marginLeft:px(8)}]}>元</Text>
                        </View>
                        <View style={styles.input}>
                        <Radio size="small" value={"1"} type="dot" style={{width:px(44),height:px(44)}}></Radio>
                            <Text style={styles.smallText}>{'利润率'}</Text>
                            <Text style={[styles.smallText,{marginLeft:px(10),marginRight:px(10)}]}>:</Text>
                            <Input style={styles.smallInput}
                            value={onlypercent} onChange={(value)=>{callback(value,title,'onlypercent')}}
                            type={"number"}/>
                            <Text style={[styles.smallText,{marginLeft:px(8),marginRight:px(8)}]}>% </Text>
                        </View>
                    </RadioGroup>
                    ):
                    (
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:px(8)}}>
                            <Text style={styles.smallText}>{subTitle}</Text>
                            <Text style={[styles.smallText,{marginLeft:px(8),marginRight:px(8)}]}>x</Text>
                            <Input style={styles.smallInput}
                            value={mulNum} onChange={(value)=>{callback(value,title,'mulNum')}}
                            type={"number"}/>
                            <Text style={[styles.smallText,{marginLeft:px(8),marginRight:px(8)}]}>% +</Text>
                            <Input value={addNum}
                            style={styles.smallInput}
                            onChange={(value)=>{callback(value,title,'addNum')}}
                            type={"number"}/>
                            <Text style={[styles.smallText,{marginLeft:px(8)}]}>元</Text>
                        </View>
                        )
                    
                    }
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Checkbox checked={isRemovePoint} size="small"
                        onChange={(checked)=>{callback(checked,title,'point')}}
                        style={{borderRadius:px(4),width:px(40),height:px(40)}}
                        checkedStyle={{borderRadius:px(4),width:px(40),height:px(40)}}/>
                        <Text style={styles.smallText} onClick={()=>{callback('none',title,'point')}}>去掉小数点价格</Text>
                    </View>
                    <RadioGroup style={{flexDirection:'row',alignItems:'center'}} value={removeWay} onChange={(value)=>{callback(value,title,'remove')}}>
                        <View style={styles.radioLine} onClick={()=>{callback("1",title,'remove')}}>
                            <Radio size="small" value={"1"} type="dot" disabled={!isRemovePoint}></Radio>
                            <Text style={{fontSize:px(28),color:'#333333'}}>四舍五入</Text>
                        </View>
                        <View style={styles.radioLine} onClick={()=>{callback("2",title,'remove')}}>
                            <Radio size="small" value={"2"} type="dot" disabled={!isRemovePoint}></Radio>
                            <Text style={{fontSize:px(28),color:'#333333'}}>直接去掉</Text>
                        </View>
                    </RadioGroup>
                </View>
            </View>
        );
    }
}
