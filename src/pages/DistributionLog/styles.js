import px from '../../Biz/px.js';
export default {
    listImg:{
        width:px(140),
        height:px(140)
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
    returnBtn:{
        height:px(48),
        width:px(136),
        alignItems:'center',
        justifyContent:'center',
        borderWidth:px(2),
        borderColor:'#e0e2e7',
        borderRadius:px(5),
        backgroundColor:'#ffffff'
    },
    returnText:{
        color:'#5F646E',
        fontSize:px(28)
    },
    cardLine:{
        width:px(750),
        paddingTop:14,
        paddingBottom:14,
        paddingLeft:px(24),
        paddingRight:px(24),
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
    },
    cardRight:{
        marginLeft:px(10),
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    cardTop:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    titleTop:{
        flex:1,
        flexDirection:'row',
        alignItems:'flex-start',
    },
    cardBottom:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    titleBottom:{
        flex:1,
        flexDirection:'row',
        alignItems:'flex-start',
    },
    leftText:{
        fontSize:px(24),
        lineHeight:px(35),
        color:'#666666'
    },
    rightText:{
        fontSize:px(24),
        lineHeight:px(35),
        color:'#333333',
    },
    newText:{
        fontSize:px(24),
        color:'#ff6000',
        marginLeft:px(5)
    },
    cardLast:{
        width:px(750),
        height:px(96),
        paddingLeft:px(30),
        paddingRight:px(30),
        borderBottomColor:'#DCDDE3',
        borderBottomWidth:px(1),
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#FAF9FA',
    },
    returnCardLast:{
        width:px(750),
        height:px(96),
        paddingLeft:px(30),
        paddingRight:px(30),
        borderBottomColor:'#DCDDE3',
        borderBottomWidth:px(1),
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
        backgroundColor:'#FAF9FA',
    },
    timeText:{
        color:'#5F646E',
        fontSize:px(28),
        fontWeight:'300'
    },
    timeText2:{
        color:'#979797',
        fontSize:px(28),
        fontWeight:'300'
    },
    triangle:{
        transform:'rotate(180deg)'
    },
    triangleIcon:{
        color:'#ffaa3a',
        fontSize:px(100)
    },
    triangleText:{
        position:'absolute',
        transform:'rotate(-45deg)',
        color:'#fff',
        fontSize:px(24),
        bottom:px(18),
        right:px(5),
        fontWeight:'300'
    },
    tag:{
        position:'absolute',
        right:px(0),
        bottom:px(0)
    },
    returnedText:{
        fontSize:px(24),
        lineHeight:px(35),
        color:'#979797',
        textDecoration:'line-through'
    },
    returnTimeText:{
        color:'#ffaa3a',
        fontSize:px(28),
        lineHeight:px(40),
        fontWeight:'300'
    },
    faildText:{
        fontSize:px(24),
        color:'#ff6000'
    },
    faildCardLast:{
        paddingTop:px(8),
        paddingRight:px(30),
        paddingBottom:px(8),
        paddingLeft:px(30),
        borderBottomColor:'#DCDDE3',
        borderBottomWidth:px(1),
        flexDirection:'column',
        justifyContent:'center',
        lineHeight:px(45),
        backgroundColor:'#FAF9FA',
    },
    faildReson:{
        fontSize:px(28),
        lineHeight:px(40),
        color:'#ff6000'
    },
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
        height:px(50),
        width:px(160),
        borderRadius:px(10),
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#fff',
        borderStyle:'sollid',
        borderWidth:px(2),
        marginLeft:px(20),
        marginTop:px(20)
    },
    filterActive:{
        backgroundColor:'#f1f7fc',
        height:px(50),
        width:px(160),
        borderRadius:px(10),
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#a2cbf0',
        borderStyle:'sollid',
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
        color:'#a2cbf0'
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
        borderTopColor: '#DCDDE3'
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
        backgroundColor:'#3794e0',
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
    dialogContainer:{
        width:px(570),
        backgroundColor:'#ffffff',
        borderRadius:px(8)
    },
    dialogContainer2:{
        width:px(500),
        height:px(156),
        backgroundColor:'#ffffff',
        borderRadius:px(8)
    },
    dialogTitle:{
        height:px(50),
        marginTop:px(30),
        paddingLeft:px(30),
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    dialogTitleText:{
        fontSize:px(36),
        color:'#333333'
    },
    dialogBody:{
        minHeight:px(110),
        paddingTop:px(30),
        paddingRight:px(30),
        paddingBottom:px(30),
        paddingLeft:px(30),
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    dialogBody2:{
        width:px(500),
        height:px(156),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    dialogBodyText:{
        fontSize:px(32),
        color:'#5F646E',
    },
    dialogBodyText2:{
        fontSize:px(36),
        color:'#333333',
    },
    dialogButton:{
        height:px(80),
        paddingTop:px(30),
        paddingRight:px(30),
        paddingBottom:px(30),
        paddingLeft:px(30),
        borderTopWidth:px(1),
        borderTopColor:'#DCDEE3',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    dialogButtonText:{
        fontSize:px(32),
        color:'#333333'
    },
    tagIcon:{
        color:'#fff',
        height:px(70),
        width:px(140),
        position:'absolute',
        right:px(-50),
        bottom:px(-10),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-start',
        fontFamily:"Microsoft YaHei",
        backgroundColor:'#ffaa3a',
        transform:'rotate(-45deg)'
    },
    tagText:{
        marginTop:px(10),
        fontSize: px(22),
        color: '#ffffff',
        fontWeight: '300',
    },
    searchMask:{
        position:'absolute',
        left:px(0),
        top:px(0),
        right:px(0),
        bottom:px(0),
        backgroundColor:'rgba(0,0,0,0)'
    },
    refresh: {
        height: 80,
        width: px(750),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#3089dc',
    },
    midContent:{
        flexDirection:'column',
        width:px(750),
        height:px(750),
        alignItems:'center',
        justifyContent:'center'
    },
    statusList:{
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
    },
    statusItem:{
        flexDirection: 'row',
        flex:1,
        height: px(80),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: px(15),
        marginRight: px(15),
        borderBottomWidth:px(4),
        borderBottomColor:'#fff',
    },
    activeStatus:{
        flexDirection: 'row',
        flex:1,
        height: px(80),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth:px(4),
        borderBottomColor:'#ff6000',
        marginLeft: px(15),
        marginRight: px(15)
    },
    normalText:{
        color: '#333333',
        fontSize: px(28)
    },
    normalNum:{
        color: '#333333',
        fontSize: px(22),
        marginLeft: px(10)
    },
    activeText:{
        color: '#ff6000'
    },
    icon:{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: px(5),
        position:'absolute',
        right:px(0),
        top:px(40)
    },
    btnLine:{
        backgroundColor:'#f8f8f8',
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(2),
        height:px(92),
        paddingLeft:px(24),
        paddingRight:px(24),
        flexDirection:'row',
        alignItems:'center'
    },
    btnLineright:{
        backgroundColor:'#f8f8f8',
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(2),
        height:px(92),
        paddingLeft:px(24),
        paddingRight:px(24),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
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
    dialogBody:{
        paddingTop:28,
        paddingLeft:40,
        paddingRight:40
    },
    shopLine:{
        borderBottomColor:'#E5E5E5',
        borderBottomWidth:1,
        paddingTop:24,
        paddingBottom:24,
        flexDirection:'row',
        alignItems:'center',
        flex:1
    },
    imgBox:{
        width:74,
        height:74,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#e5e5e5',
        borderWidth:2,
        borderRadius:8
    }
}
