import px from '../../../Biz/px.js';
export default {
    batchHead:{
        height:px(90),
        backgroundColor:'#ffffff',
        flexDirection:'row',
        alignItems:'center',
        paddingLeft: px(20),
        paddingRight: px(20),
        borderBottomColor:'#e5e5e5',
        borderBottomWidth:px(2)
    },
    cancelBtn:{
        alignItems: 'center',
        justifyContent: 'center',
        width: px(150),
        height: px(70),
        marginRight:px(20),
        borderWidth:px(2),
        borderColor:'#DCDEE3',
        backgroundColor: '#ffffff',
        borderRadius: px(8),
        flexDirection: 'row'
    },
    cancelTouch:{
        position:'absolute',
        left:px(0),
        top:px(0),
        bottom:px(0),
        width:px(200)
    }
}
