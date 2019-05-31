import px from '../../Biz/px.js';
export default {
    commonLine:{
        flex:1,
        backgroundColor:'#EEEEEE',
    },
    title:{
        height:176,
        padding:24,
        backgroundColor:'#ffffff',
    },
    titleTop:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#999999',
    },
    titleText:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#333333',
        marginTop:18,
    },
    lineText:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#333333',
        flex:1,
    },
    lineTextgray:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#999999',
        flex:1,
    },
    line:{
        flexDirection:'row',
        alignItems:'center',
        height:82,
        backgroundColor:'#ffffff',
        marginTop:2,
        paddingLeft:24,
        paddingRight:24,
    },
    mask:{
        backgroundColor:'transparent'// 可以修改默认的灰底
    },
    categoryModel:{
        width: px(750),
        position:'absolute',
        height:px(750),
        left:0,
        right:0,
        bottom:0
    },
    body: {
        flex:1,
        backgroundColor: '#ffffff',
    },
    head:{
        paddingTop:px(24),
        paddingBottom:px(24),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor:'#eeeeee',
        borderBottomStyle:'solid',
        borderBottomWidth:px(1),
    },
    textHead:{
        color:'#3d4145',
        fontSize:32,
    },
    attrLine:{
        flexDirection:'row',
        marginLeft:24,
        marginRight:24,
        borderBottomColor:'#e5e5e5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(1),
        height:72,
        alignItems:'center'
    },
    attrText:{
        overflow:'hidden',
        textOverflow:'ellipsis',
        whiteSpace:'nowrap',
        fontSize:28,
        color:'#4a4a4a'
    },
    footer: {
        borderTopColor:'#dddddd',
        flexDirection:'row',
        borderTopStyle:'solid',
        borderTopWidth:1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: px(94)
    },
    dlgBtn:{
        flex:1,
    },
    maskStyle:{
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalStyle:{
        position: 'absolute',
        right: px(0),
        top: px(0),
        bottom: px(0),
        width: px(500)
    },
    modal2Style:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    dialogContent:{
        flex:1,
        borderRadius: px(8),
        backgroundColor: '#fff',
        paddingTop:px(20),
        width: px(612)
    },
    submitBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(1),
        borderTopStyle:'solid',
        borderTopColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomRightRadius:px(8)
    },
    fontStyle:{
        fontSize:px(32),
        color:'#272636'
    },
    foot:{
        width:px(612),
        flexDirection:'row',
        height:px(96),
        marginTop:px(20)
    },
    footBtnDialog:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(2),
        borderStyle:'solid',
        borderColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomLeftRadius:px(8)
    },
    submitBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(1),
        borderTopStyle:'solid',
        borderTopColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomRightRadius:px(8)
    },
    radioLine:{
        flexDirection:'row',
        height:96,
        flex:1,
        alignItems:'center',
        paddingLeft:px(24),
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        paddingRight:px(24)
    },
}
