import px from '../../../Biz/px.js';
export default {
    commonLine:{
        flex:1,
        backgroundColor:'#EEEEEE',
    },
    title:{
        height:px(176),
        padding:px(24),
        backgroundColor:'#ffffff',
    },
    titleTop:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: px(28),
        color: '#999999',
    },
    titleText:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: px(28),
        color: '#333333',
        marginTop:px(18),
    },
    lineText:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: px(28),
        color: '#333333',
        flex:1,
    },
    lineTextgray:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: px(28),
        color: '#999999',
        flex:1,
    },
    line:{
        flexDirection:'row',
        alignItems:'center',
        height:px(82),
        backgroundColor:'#ffffff',
        marginTop:px(2),
        paddingLeft:px(24),
        paddingRight:px(24),
    },
    mask:{
        backgroundColor:'transparent'// 可以修改默认的灰底
    },
    categoryModel:{
        width: px(750),
        position:'absolute',
        height:px(750),
        left:px(0),
        right:px(0),
        bottom:px(0)
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
        borderBottomWidth:px(1),
    },
    textHead:{
        color:'#3d4145',
        fontSize:px(32),
    },
    attrLine:{
        flexDirection:'row',
        marginLeft:px(24),
        marginRight:px(24),
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(1),
        height:px(72),
        alignItems:'center'
    },
    attrText:{
        overflow:'hidden',
        textOverflow:'ellipsis',
        whiteSpace:'nowrap',
        fontSize:px(28),
        color:'#4a4a4a'
    },
    footer: {
        borderTopColor:'#dddddd',
        flexDirection:'row',
        borderTopWidth:px(1),
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
        borderColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomLeftRadius:px(8)
    },
    submitBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(1),
        borderTopColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomRightRadius:px(8)
    },
    radioLine:{
        flexDirection:'row',
        height:px(96),
        flex:1,
        alignItems:'center',
        paddingLeft:px(24),
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:px(2),
        paddingRight:px(24)
    },
}
