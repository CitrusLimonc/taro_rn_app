import px from '../../Biz/px.js';
export default {
    attLines:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#ffffff',
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5',
        paddingLeft:px(24),
        paddingRight:px(24),
        width:px(750),
        height:px(80)
    },
    mask:{
        backgroundColor:'transparent'// 可以修改默认的灰底
    },
    modalStyle: {
        width: px(750),
        position:'absolute',
        bottom:px(0),
        left:px(0),
        maxHeight: px(750),
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
    text:{
        fontSize:px(28),
        paddingTop:px(10),
        paddingRight:px(10),
        paddingBottom:px(10),
        paddingLeft:px(10),
        color:'#3089dc',
        borderColor:'#3089dc',
        borderWidth:px(1),
        marginRight:px(20)
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
    dlgBtnSeperator:{
        color:'#dddddd'
    },
    categoryModel:{
        width: px(750),
        position:'absolute',
        height:px(900),
        left:px(0),
        right:px(0),
        bottom:px(0)
    },
    categoryLine:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:px(2),
        marginLeft:px(24),
        height:px(88)
    },
    cateTopLine:{
        backgroundColor:'#EFEFF4',
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(2),
        paddingLeft:px(24),
        height:px(60),
        flexDirection:'row',
        alignItems:'center'
    },
    footRight:{
        backgroundColor:'#ff6000',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    footLine:{
        position:'fixed',
        bottom:px(0),
        left:px(0),
        right:px(0),
        height:px(96),
        flexDirection:'row',
        borderTopColor:'#e5e5e5',
        borderTopWidth:px(1)
    },
    radioLine:{
        flexDirection:'row',
        paddingTop:px(20),
        paddingBottom:px(20),
        flex:1,
        alignItems:'center',
        paddingLeft:px(24),
        borderTopColor:'#f5f5f5',
        borderTopWidth:px(2),
        paddingRight:px(24)
    },
    inputStyle:{
        width:px(260),
        height:px(48),
        borderColor:'#fff',
    },
    maskStyle:{
        backgroundColor:'rgba(0,0,0,0.5)'
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
    foot:{
        width:px(612),
        flexDirection:'row',
        height:px(96),
        marginTop:px(20)
    },
    fontStyle:{
        fontSize:px(32),
        color:'#272636'
    },
    tokenBody:{
        height:px(216),
        paddingLeft:px(40),
        paddingRight:px(40),
        alignItems:'center',
        justifyContent:'center'
    },
    footBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(2),
        borderColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomLeftRadius:px(8)
    },
}
