'use strict';

import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import px from '../../../Biz/px.js';
/*
* @author cy
* 留言
*/
export default class Remark extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { remark } = this.props;
        return (
                <View style={styles.line_item}>
		                <Text style={[styles.text_grey,{marginLeft:px(24)}]}>{`买家留言：`}</Text>
		                <Text style={styles.text_content}>{remark}</Text>
                </View>
        );
    }
}
const styles = {
    line_item:{
        flexDirection: 'row',
        height: px(72),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        alignItems: 'center',
    },
    text_grey:{
        fontSize: px(24),
        color: '#999999',
    },
    text_content:{
        fontSize: px(24),
    },
    image:{
        height: px(36),
        width: px(32),
    },
}
