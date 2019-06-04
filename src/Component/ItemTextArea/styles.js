import px from '../../Biz/px.js';
export default {
    memoContent:{
        paddingTop:px(15),
        paddingRight:px(20),
        paddingBottom:px(15),
        paddingLeft:px(20),
        backgroundColor: '#ffffff',
        marginBottom: px(20)
    },
    textArea:{
        position: 'relative',
        left:px(0),
        right: px(0),
        top: px(0),
        height: px(130),
        paddingTop:px(15),
        paddingRight:px(15),
        paddingBottom:px(15),
        paddingLeft:px(15),
        color: '#9b9b9b',
        borderWidth:px(2),
        borderColor:'#C4C6CF',
        borderRadius: px(8),
        fontSize: px(28),
        lineHeight: px(36)
    },
    triangle:{
        position: 'absolute',
        left: px(0),
        top: px(0)
    },
    triangleText:{
        fontSize:px(20),
        color:'#fff',
        position: 'absolute',
        left: px(12),
        top: px(9)
    },
    placehold:{
        position: 'absolute',
        color: '#F23C3C',
        fontSize: px(24),
        fontWeight: '300',
        bottom: px(70),
        right: px(25)
    },
    radioText:{
        fontSize: px(28),
        fontWeight: '300',
        color: '#4A4A4A',
        marginLeft: px(10)
    },
    activeRadio:{
        fontSize: px(28),
        fontWeight: '300',
        color: '#F57745',
        marginLeft: px(10)
    },
    radio:{
        width: px(40),
        height: px(40)
    },
    normalText:{
        fontSize:px(26),
        textAlign:'right',
        color:'#ababab'
    },
    overText:{
        fontSize:px(26),
        textAlign:'right',
        color:'#ff0000'
    }
}
