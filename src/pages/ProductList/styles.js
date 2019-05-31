import px from '../../Biz/px.js';
export default {
    arrowDown:{
        alignItems:'center',
        justifyContent:'center',
        width:px(84),
        height:px(60),
        position:'absolute',
        right:px(0),
        top:px(16),
        borderLeftWidth:px(1),
        borderLeftColor:'#999',
        borderLeftStyle:'solid',
        backgroundColor:'#fff'
    },
    refresh: {
        height: px(80),
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
        position:'fixed',
        bottom: px(0),
        left: px(0),
        right: px(0),
        borderTopColor:'#e5e5e5',
        borderTopStyle:'solid',
        borderTopWidth:px(2)
    },
    footBtn:{
        flex:1,
        borderRightWidth:px(2),
        borderRightColor:'#e5e5e5',
        borderRightStyle:'solid',
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
        justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft: px(25),
        paddingRight: px(100),
        borderBottomColor:'#e5e5e5',
        borderBottomStyle:'solid',
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
        flex: 1,
        backgroundColor:'#f2f3f7',
        borderRadius:px(8),
        // alignItems:'center',
        paddingLeft:px(2),
        paddingRight:px(2)
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
        borderTopStyle:'solid',
        borderTopWidth:px(2)
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
}
