import px from '../../../Biz/px.js';
export default {
    cardContent:{
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        paddingLeft: px(20),
        alignItems: 'center',
        paddingTop: px(15),
        paddingBottom: px(15),
        marginTop:px(2)
    },
    image:{
        width: px(140),
        height: px(140)
    },
    imgBox:{
        borderColor:'#fafafa',
        borderWidth:px(2),
        width: px(140),
        height: px(140),
        justifyContent:'center',
        alignItems:'center'
    },
    middleNum:{
        flexDirection: 'row',
        marginTop: px(10)
    },
    icon:{
        backgroundColor: '#F0F3F8',
        paddingLeft:px(3),
        paddingRight:px(3),
        paddingTop:px(3),
        paddingRight:px(3),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: px(5),
        position:'absolute',
        right:px(0),
        top:px(40)
    },
    circle:{
        width: px(10),
        height: px(10),
        backgroundColor: '#ffffff',
        borderRadius: px(5)
    },
    tagIcon:{
        color:'#fff',
        height:px(30),
        width:px(100),
        position:'absolute',
        left:px(-25),
        top:px(0),
        textAlign:'center',
        lineHeight:px(30),
        backgroundColor:'rgba(82,159,107,0.8)',
        transform:'rotate(-45deg)'
    },
    tagText:{
        fontSize: px(22),
        color: '#ffffff',
        fontWeight: '300',
        position: 'absolute',
        left: px(18),
        lineHeight:px(30),
        transform:'scale(0.8)'
    },
    mask:{
        position: 'absolute',
        left: px(0),
        right: px(0),
        top: px(0),
        bottom: px(0),
        backgroundColor: 'rgba(255,223,204,0.2)'
    },
    star:{
        color:'#fe6e09',
        fontSize:px(36)
    },
    darkStar:{
        color:'#dddddd',
        fontSize:px(36)
    },
    jiaobiao:{
        transform:'rotate(180deg)'
    },
    maskLine:{
        position:'absolute',
        left:px(0),
        right:px(0),
        bottom:px(0),
        backgroundColor:'#FF0000',
        opacity:0.5,
        flexDirection:'row',
        justifyContent:'center',
        height:px(36),
        alignItems:'center'
    }
}
