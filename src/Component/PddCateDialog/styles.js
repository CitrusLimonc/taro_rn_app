import px from '../../Biz/px.js';
export default {
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
    categoryModel:{
        width: px(750),
        position:'absolute',
        height:px(750),
        left:px(0),
        right:px(0),
        bottom:px(0)
    },
}
