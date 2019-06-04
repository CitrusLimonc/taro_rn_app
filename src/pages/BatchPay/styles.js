import px from '../../Biz/px.js';
export default {
    selectView:{
        backgroundColor: '#fff',
        height: px(92),
        alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft: px(12),
        paddingRight: px(100),
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(1)
    },
    selectLeft:{
        height:px(92),
        backgroundColor:'#fff',
        alignItems:'center',
        flexDirection:'row'
    },
    arrowDown:{
        alignItems:'center',
        justifyContent:'center',
        width:px(84),
        height:px(60),
        position:'absolute',
        right:px(0),
        top:px(16),
        borderLeftWidth:px(1),
        borderLeftColor:'#999',
        backgroundColor:'#fff'
    },
    tabBox:{
        borderBottomColor:'#ff6000',
        borderBottomWidth:px(4),
        paddingLeft:px(12),
        paddingRight:px(12),
        height:px(92),
        alignItems: 'center',
        justifyContent:'center'
    },
    tabText:{
        fontSize:px(28),
        color:'#ff6000'
    },
    refresh: {
        height: px(80),
        width: px(750),
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#666666',
    },
    midContent:{
        width:px(750),
        height:px(750),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column'
    },
}
