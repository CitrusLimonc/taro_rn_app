import px from '../../Biz/px.js';
export default {
    body:{
        alignItems: 'flex-start',
        flex:1,
        padding:24,
        backgroundColor:'#ffffff',
    },
    TopBody:{
        width:px(750),
        height:108,
        flexDirection:'row',
        alignItems:'center',
    },
    TopBodyPic:{
        width:70,
        height:70,
    },
    TopBodyText:{
        marginLeft:px(16),
        fontSize:40,
        fontFamily: 'PingFangSC-Regular',
        color: '#000000',
    },
    TipText:{
        fontSize:24,
        fontFamily: 'PingFangSC-Regular',
        color: '#666666',
    },
    TitleText:{
        fontSize:28,
        fontFamily: 'PingFangSC-Regular',
        color: '#333333',  
        marginTop:24,
        marginBottom:24,
    },
    TitleBody:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:40,
    },
    TitleInput:{
        fontSize:24,
        fontFamily: 'PingFangSC-Regular',
        color: '#999999',
        width:526,
        height:70,
        borderColor:'#E5E5E5',
        borderStyle:'solid',
        borderWidth:px(1),
        
    },
    TitleButton:{
        width:150,
        height:56,
        marginLeft:24,
    },
    TipRed:{
        fontSize:20,
        color:'red'
    },
    wangwangbody:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginTop:80,
    },
    wangwangLeft:{
        color: '#999999',
        fontSize: 28,

    },
    wangwangRight:{
        color: '#2DA9F7',
        fontSize: 28,

    },
    wangwangicon:{
        color: '#2DA9F7',
    }



}
