import px from '../../../Biz/px.js';
export default {
    tabbar:{
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    tabBtn:{
        paddingTop:px(0),
        paddingRight:px(15),
        paddingBottom:px(0),
        paddingLeft:px(15),
        alignItems: 'center',
        justifyContent: 'center',
        height: px(70),
        borderBottomWidth:px(2),
        borderBottomColor:'#fff'
    },
    tabBtnActive:{
        paddingTop:px(0),
        paddingRight:px(15),
        paddingBottom:px(0),
        paddingLeft:px(15),
        alignItems: 'center',
        justifyContent: 'center',
        height: px(70),
        borderBottomWidth:px(2),
        borderBottomColor:'#ff6000'
    },
    tabText:{
        fontSize: px(28),
        fontWeight: '300',
        color: '#4A4A4A'
    },
    tabTextActive:{
        fontSize: px(28),
        fontWeight: '300',
        color: '#ff6000'
    },
    priceLine:{
        flexDirection:'row',
        paddingTop:px(10),
        paddingRight:px(20),
        paddingBottom:px(10),
        paddingLeft:px(20),
        backgroundColor:'#fff'
    },
    statusBtn:{
        width: px(156),
        height: px(56),
        borderWidth:px(2),
        borderColor:'#ff6000',
        borderRadius: px(8),
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusText:{
        fontSize: px(28),
        color: '#ff6000',
        fontWeight: '300'
    },
    statusLine:{
        flexDirection: 'row',
        borderBottomWidth:px(2),
        borderBottomColor:'#ceced2',
        marginLeft: px(20),
        alignItems: 'center',
        height: px(80),
        paddingRight: px(20)
    },
    middleLine:{
        flexDirection: 'row',
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5',
        marginLeft: px(20),
        alignItems: 'center',
        height: px(80),
        paddingRight: px(20)
    },
    lastLine:{
        flexDirection: 'row',
        marginLeft: px(20),
        alignItems: 'center',
        height: px(80),
        paddingRight: px(20)
    },
    tags:{
        backgroundColor: '#fff',
        flex:1,
        paddingTop:px(20),
        paddingRight:px(40),
        paddingBottom:px(25),
        paddingLeft:px(38),
        marginBottom:px(120)

    },
    editRight:{
        position: 'absolute',
        right: px(20),
        top: px(20),
        width: px(60),
        height: px(60)
    },
    normalText:{
        fontSize: px(28),
        color: '#979797',
        fontWeight: '300'
    },
    tables:{
        borderWidth:px(2),
        borderColor:'#e3e3e3',
        backgroundColor: '#F8F8F8',
        alignItems: 'center',
        marginTop: px(-1),
        flexDirection: 'row',
        height: px(70)
    },
    tableText:{
        fontSize: px(28),
        color: '#4A4A4A'
    },
    footBtn:{
        position: 'absolute',
        height: px(100),
        left: px(0),
        right: px(0),
        bottom: px(0),
        flexDirection: 'row'
    },
    star:{
        fontSize: px(50),
        color: '#579CFC',
        marginLeft: px(20)
    },
    firstLine:{
        backgroundColor: '#f5f5f5',
        borderWidth:px(2),
        borderColor:'#f0f0f0',
        marginLeft: px(-1),
        flex:1,
        height: px(50),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px(-1)
    },
    nextLine:{
        backgroundColor: '#fff',
        borderWidth:px(2),
        borderColor:'#f0f0f0',
        marginLeft: px(-1),
        flex:1,
        height: px(80),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px(-1)
    },
    firstColumn:{
        backgroundColor: '#fff',
        borderWidth:px(2),
        borderColor:'#f0f0f0',
        marginLeft: px(-1),
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px(-1)
    },
    changeBtn:{
        width:px(200),
        height:px(64),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:px(8),
        backgroundColor:'#ff6000'
    },
    tableHead:{
        backgroundColor:'#f8f8f8',
        height:px(48),
        borderColor:'#eeeeee',
        borderWidth:px(2),
        alignItems:'center',
        justifyContent:'center'
    },
    tableBodyLine:{
        backgroundColor:'#fff',
        borderColor:'#eeeeee',
        borderWidth:px(2),
        marginTop:px(-2),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    }
}
