import px from '../../Biz/px.js';
export default {
    buttons:{
        paddingTop: px(20),
        paddingRight: px(20),
        paddingBottom: px(20),
        paddingLeft: px(20),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#F7F8FA',
        width:px(750),
    },
    button:{
        paddingTop:px(16),
        paddingBottom:px(16),
        paddingLeft:24,
        paddingRight:24,
        borderRadius:8
    },
    btnText:{
        color:'#333'
    },
    footer:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: px(94),
    },
    dlgBtn:{
        flex:1,
        backgroundColor: '#FF6000',
        fontSize: px(32),
    },
    deliverys:{
        backgroundColor: '#fff',
    },
    addIcon:{
        flex: 1,
        textAlign: 'right',
        fontSize: px(40),
        color: '#b5b5b5',
    },
    methodHead:{
        flex:1,
        height:px(100),
        textAlign:'center',
        fontSize:px(32),
        color:'#5a5a5a',
        fontWeight:'300',
        lineHeight: px(100),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        backgroundColor:'#fff',
    },
    title:{
        color:'#3089dc',
        height:'88',
        lineHeight:'88',
        fontSize:px(30)
    },
    groupWrap:{
        backgroundColor:'#fff',
        flexDirection:'column',
        paddingLeft:px(30),
        paddingRight:px(30),
    },
    item:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        paddingTop:px(10),
        paddingRight:px(20),
        paddingBottom:px(10),
        paddingLeft:px(20),
        backgroundColor:'transparent',
    },
    firstLine:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    delayValue:{
        color: '#666',
        fontSize: px(30),
    },
    activedValue:{
        fontSize: px(30),
        color:'#f6834e',
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
    footer: {
        borderTopColor:'#dddddd',
        flexDirection:'row',
        borderTopWidth:1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: px(94)
    },
    dlgBtn:{
        flex:1,
    },
    closeTag:{
        position:'absolute',
        right:24,
        top:34,
        fontSize:28,
        color:'#999999'
    }
}
