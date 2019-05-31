import px from '../../Biz/px.js';
export default {
    firstLine:{
        flexDirection: 'row',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5',
        backgroundColor: '#fff',
        paddingRight:px(20),
        paddingLeft:px(20),
        alignItems: 'center',
        height:px(92)
    },
    normalLine:{
        height: px(80),
        marginLeft: px(20),
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5',
        justifyContent: 'center'
    },
    clearBtn:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height:px(100),
    },
    clearText:{
        fontSize:px(28),
        color:'#666'
    },
    selectInput:{
        height: px(64),
        paddingLeft:px(24),
        flex: 1,
        borderColor:'rgba(0,0,0,0)',
        backgroundColor:'rgba(0,0,0,0)',
        color:'#e6e6e6',
        fontSize:px(24),
        borderRadius:px(8),
    },
    inputBox:{
        height: px(64),
        flex: 1,
        backgroundColor:'#f2f3f7',
        borderRadius:px(8),
        // alignItems:'center',
        paddingLeft:px(2),
        paddingRight:px(2)
    },
    deleteIcon:{
        position: 'absolute',
        right: px(15),
        top: px(8),
        width:px(50),
        height:px(50),
        fontSize:px(50),
        color:'rgba(0,0,0,0.5)'
    },
    historys:{
        flexDirection: 'row',
        marginLeft: px(20),
        height: px(74),
        alignItems: 'center',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5'
    },
    historyIcon:{
        fontSize: px(32),
        color: '#C7C7C7'
    },
    historyText:{
        flex:1,
        fontSize: px(28),
        color: '#838689',
        marginLeft: px(10),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lines:1
    },
    wrap:{
        flexDirection: 'row',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5',
        backgroundColor: '#fff',
        paddingRight:px(20),
        paddingLeft:px(20),
        alignItems: 'center',
        height:px(92)
    },
    normalTabBox:{
        width:128,
        height:76,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    activeTabBox:{
        width:128,
        height:76,
        borderBottomColor:'#ff6000',
        borderBottomStyle:'solid',
        borderBottomWidth:2,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    tabbarLine:{
        flexDirection:'row',
        height:76,
        alignItems:'center',
        borderBottomColor:'#e5e5e5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(1)
    },
    refresh: {
        height: 80,
        width: px(750),
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#666666',
    },
}
