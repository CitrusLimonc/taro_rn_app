import px from '../../../Biz/px.js';
export default {
    statusList:{
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        borderBottomStyle:'solid'
    },
    statusItem:{
        flexDirection: 'row',
        flex:1,
        height: px(80),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: px(15),
        marginRight: px(15),
        borderBottomWidth:px(4),
        borderBottomColor:'#fff',
        borderBottomStyle:'solid'
    },
    activeStatus:{
        flexDirection: 'row',
        flex:1,
        height: px(80),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth:px(4),
        borderBottomColor:'#ff6000',
        borderBottomStyle:'solid',
        marginLeft: px(15),
        marginRight: px(15)
    },
    normalText:{
        color: '#333333',
        fontSize: px(28)
    },
    normalNum:{
        color: '#333333',
        fontSize: px(22),
        marginLeft: px(10)
    },
    activeText:{
        color: '#ff6000'
    }
}
