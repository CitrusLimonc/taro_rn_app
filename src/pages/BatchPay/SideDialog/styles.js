import px from '../../../Biz/px.js';
export default {
    maskStyle:{
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalStyle:{
        position: 'absolute',
        right: px(0),
        top: px(0),
        bottom: px(0),
        width: px(560),
        backgroundColor: '#ffffff',
    },
    normalLine:{
        backgroundColor: '#f5f5f5',
        height: px(90),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px(20)
    },
    filterItem:{
        backgroundColor:'#eeefee',
        height:px(52),
        flexDirection:'row',
        paddingLeft:px(12),
        paddingRight:px(12),
        borderRadius:px(4),
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#eeefee',
        borderWidth:px(2),
        marginLeft:px(20),
        marginTop:px(20)
    },
    filterActive:{
        backgroundColor:'#ffefe5',
        height:px(52),
        flexDirection:'row',
        paddingLeft:12,
        paddingRight:12,
        borderRadius:px(4),
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ff6000',
        borderWidth:px(2),
        marginLeft:px(20),
        marginTop:px(20)
    },
    filterItemText:{
        fontSize:px(24),
        color:'#333333'
    },
    filterActiveText:{
        fontSize:px(24),
        color:'#ff6000'
    },
    items:{
        flexDirection:'row',
        flexWrap:'wrap'
    },
    filterFoot:{
        position:'absolute',
        bottom:px(0),
        left:px(0),
        right:px(0),
        height:px(100),
        flexDirection:'row',
        borderTopWidth: px(1),
        borderTopColor: '#DCDDE3',
    },
    filterFootLeft:{
        flex:1,
        backgroundColor:'#fff',
        height:px(100),
        alignItems:'center',
        justifyContent:'center'
    },
    filterFootRight:{
        flex:1,
        backgroundColor:'#ff6000',
        height:px(100),
        alignItems:'center',
        justifyContent:'center'
    },
    subjectText:{
        color:'#333333',
        fontSize:px(28),
        width:px(555)
    },
    mask:{
        flex:1,
        width:px(750),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    tagIcon:{
        position:'absolute',
        right:0,
        bottom:0,
        color:'#ff6000',
        fontSize:px(28),
    },
    selectInput:{
        height: px(64),
        paddingLeft:px(50),
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
        paddingLeft:px(2),
        paddingRight:px(2),
        marginLeft:px(20),
        marginRight:px(20),
    },
    selectIcon:{
        color:'#a8a8a8',
        position:'absolute',
        left:px(24),
        top:px(15),
        fontSize:px(35)
    },
    subjectTag:{
        height:px(50),
        top:px(7),
        paddingLeft:px(20),
        paddingRight:px(15),
        position: 'absolute',
        left: px(62),
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
    inputLine:{
        flexDirection:'row',
        height:px(88),
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5'
    },
    filterLine:{
        marginTop:px(36),
        paddingBottom:px(24),
        borderBottomWidth:px(2),
        borderBottomColor:'#f5f5f5',
    },
    selectTouch:{
        position:'absolute',
        left:px(0),
        right:px(0),
        top:px(0),
        bottom:px(0),
        height:px(88),
        width:px(520)
    },
    deleteIcon:{
        position: 'absolute',
        right: px(15),
        top: px(8),
        width:px(50),
        height:px(50),
        fontSize:px(50),
        color:'rgba(0,0,0,0.5)'
    }
}
