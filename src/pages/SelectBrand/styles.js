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
    refresh: {
        height: 80,
        width: px(750),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#3089dc',
    },
    brandLine:{
        height:78,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        paddingLeft:24,
        paddingRight:24
    }
}