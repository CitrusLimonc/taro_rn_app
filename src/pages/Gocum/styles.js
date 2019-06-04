import px from '../../Biz/px.js';
export default {
    body:{
        alignItems: 'flex-start',
        flex:1,
        padding:px(24),
        backgroundColor:'#ffffff',
    },
    TopBody:{
        width:px(750),
        height:px(108),
        flexDirection:'row',
        alignItems:'center',
    },
    TopBodyPic:{
        width:px(70),
        height:px(70),
    },
    TopBodyText:{
        marginLeft:px(16),
        fontSize:px(40),
        fontFamily: 'PingFangSC-Regular',
        color: '#000000',
    },
    TipText:{
        fontSize:px(24),
        fontFamily: 'PingFangSC-Regular',
        color: '#666666',
    },
    TitleText:{
        fontSize:px(28),
        fontFamily: 'PingFangSC-Regular',
        color: '#333333',  
        marginTop:px(24),
        marginBottom:px(24),
    },
    TitleBody:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:px(40),
    },
    TitleInput:{
        fontSize:px(24),
        fontFamily: 'PingFangSC-Regular',
        color: '#999999',
        width:px(526),
        height:px(70),
        borderColor:'#E5E5E5',
        borderWidth:px(1),
        
    },
    TitleButton:{
        width:px(150),
        height:px(56),
        marginLeft:px(24),
    },
    TipRed:{
        fontSize:px(20),
        color:'red'
    },
    wangwangbody:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginTop:px(80),
    },
    wangwangLeft:{
        color: '#999999',
        fontSize: px(28),

    },
    wangwangRight:{
        color: '#2DA9F7',
        fontSize: px(28),

    },
    wangwangicon:{
        color: '#2DA9F7',
    }



}
