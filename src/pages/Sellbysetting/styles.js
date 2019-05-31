import px from '../../Biz/px.js';
export default {
    topLine:{
        // flex:1,
        height:242,
        paddingLeft:24,
        paddingRight:24,
        paddingTop:32,
        paddingBottom:24
    },
    tagImage:{
        width:80,
        height:80,
        borderRadius:8,
        borderStyle:'solid',
        borderWidth:2,
        borderColor:'#E5E5E5',
        marginTop:24,
        alignItems:'center',
        justifyContent:'center'
    },
    tagImageActive:{
        width:80,
        height:80,
        borderRadius:8,
        borderStyle:'solid',
        borderWidth:2,
        borderColor:'#0077FF',
        marginTop:24,
        alignItems:'center',
        justifyContent:'center'
    },
    commonLine:{
        flex:1,
        flexDirection:'row',
        borderBottomStyle:'solid',
        borderBottomWidth:2,
        borderBottomColor:'#e7e7e9',
        alignItems:'center',
        marginLeft:px(24),
        paddingTop:px(24),
        paddingBottom:px(20)
    },
    columnLine:{
        flex:1,
        borderBottomStyle:'solid',
        borderBottomWidth:2,
        borderBottomColor:'#e7e7e9',
        justifyContent:'center',
        marginLeft:px(24),
        paddingTop:px(24),
        paddingBottom:px(20)
    },
    commonRight:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',
        paddingRight:24
    },
    mask:{
        backgroundColor:'transparent'// 可以修改默认的灰底
    },
    modalStyle: {
        width: px(750),
        position:'absolute',
        bottom:0,
        left:0,
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
        borderBottomStyle:'solid',
        borderBottomWidth:px(1),
    },
    textHead:{
        color:'#3d4145',
        fontSize:32,
    },
    text:{
        fontSize:px(28),
        paddingTop:px(10),
        paddingRight:px(10),
        paddingBottom:px(10),
        paddingLeft:px(10),
        color:'#3089dc',
        borderColor:'#3089dc',
        borderStyle:'solid',
        borderWidth:px(1),
        marginRight:px(20)
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
    dlgBtnSeperator:{
        color:'#dddddd'
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
    categoryModel:{
        width: px(750),
        position:'absolute',
        height:px(750),
        left:0,
        right:0,
        bottom:0
    },
    categoryLine:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        marginLeft:px(24),
        height:px(88)
    },
    cateTopLine:{
        backgroundColor:'#EFEFF4',
        borderBottomColor:'#e5e5e5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        paddingLeft:px(24),
        height:px(60),
        flexDirection:'row',
        alignItems:'center'
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
    cancelBtn:{
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
    fontStyle:{
        fontSize:px(32),
        color:'#272636'
    },
    tokenBody:{
        height:216,
        paddingLeft:40,
        paddingRight:40,
        alignItems:'center',
        justifyContent:'center'
    },
    footBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(2),
        borderStyle:'solid',
        borderColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomLeftRadius:px(8)
    },
    tabContent: {
        flex: 1,
        height:2000,
        backgroundColor: '#dddddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabText: {
        fontSize: 30,
        height:1000,
        textAlign: 'center'
    },
    item: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabtxt:{
        fontSize:28,
    },
    activeBorder: {
        borderBottomColor: '#ff6600',
        borderBottomWidth:px(3),
    }
};
