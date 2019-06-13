import px from '../../Biz/px.js';
export default {
    arrowDown:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:60,
        position:'absolute',
        right:0,
        top:px(16),
        paddingLeft:px(16),
        paddingRight:24,
        borderLeftWidth:px(1),
        borderLeftColor:'#999',
        backgroundColor:'#fff'
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
    midContent:{
        width:px(750),
        height:px(750),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column'
    },
    footBox:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffff',
        height: px(100),
        paddingTop: px(10),
        paddingBottom: px(10),
        position:'absolute',
        bottom: px(0),
        left: px(0),
        right: px(0),
        borderTopColor:'#e5e5e5',
        borderTopWidth:px(2)
    },
    footBtn:{
        flex:1,
        borderRightWidth:px(2),
        borderRightColor:'#e5e5e5',
        alignItems:'center',
        justifyContent: 'center',
        height: px(80)
    },
    footText:{
        fontSize: px(32),
        color: '#3D4145',
        fontWeight: '300'
    },
    subjectTag:{
        height:px(50),
        top:px(21),
        paddingLeft:px(20),
        paddingRight:px(15),
        position: 'absolute',
        left: px(34),
        backgroundColor:'#e9e9e9',
        borderRadius:px(8),
        flexDirection:'row',
        alignItems:'center',
        paddingRight:px(20),
        maxWidth:px(500)
    },
    subjectText:{
        flex:1,
        maxWidth:px(410),
        fontSize:px(24),
        overflow:'hidden',
        textOverflow:'ellipsis',
        whiteSpace:'nowrap',
        lines:1
    },
    closeIcon:{
        fontSize:px(30),
        color:'#7c8088',
        marginLeft:px(15)
    },
    selectView:{
        backgroundColor: '#fff',
        height: px(92),
        alignItems: 'center',
        justifyContent: 'space-bwteen',
        flexDirection: 'row',
        paddingLeft: px(25),
        paddingRight: px(100),
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(1)
    },
    selectInput:{
        height: px(64),
        paddingLeft:px(50),
        flex: 1,
        borderColor:'rgba(0,0,0,0)',
        backgroundColor:'rgba(0,0,0,0)',
        color:'#e6e6e6',
        fontSize:px(24),
        borderRadius:px(32),
    },
    inputBox:{
        height: px(64),
        width:570,
        backgroundColor:'#f2f3f7',
        borderRadius:px(8),
        // alignItems:'center',
        paddingLeft:px(16),
        paddingRight:px(2),

    },
    touchInput:{
        position: 'absolute',
        left: px(0),
        top:px(0),
        bottom: px(0),
        width: px(650)
    },
    searchIcon:{
        fontSize: px(32),
        color: '#a8a8a8',
        position: 'absolute',
        left: px(35),
        top: px(31),
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
    dialogText:{
        fontSize:px(28),
        color:'#4a4a4a'
    },
    dialogFoot:{
        flex:1,
        marginTop:px(30),
        height:px(96),
        alignItems:'center',
        justifyContent:'center',
        borderTopColor:'#f5f5f5',
        borderTopWidth:px(2)
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
    headSelect:{
        height:px(80),
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#ffffff',
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(1)
    },
    headLeft:{
        width:px(560),
        height:px(64),
        marginLeft:px(20),
        marginRight:px(20),
        marginTop:px(14),
        marginBottom:px(14),
        backgroundColor:'#f2f3f7',
        borderRadius:px(8),
        paddingLeft:px(2),
        paddingRight:px(2)
    },
    headInput:{
        height: px(64),
        paddingLeft:px(40),
        flex: 1,
        borderColor:'rgba(0,0,0,0)',
        backgroundColor:'rgba(0,0,0,0)',
        color:'#e6e6e6',
        fontSize:px(24),
    },
    searchIcon:{
        position:'absolute',
        left:px(10),
        top:px(18),
        color:'#b3b3b4',
        fontSize:px(32)
    },
    headRight:{
        borderLeftColor:'#e5e5e5',
        borderLeftWidth:px(1),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:px(150),
        height:px(56)
    },
}
