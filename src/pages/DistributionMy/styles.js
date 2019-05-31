import px from '../../Biz/px.js';
import {StyleSheet} from 'react-native';
export default StyleSheet.create({
    mask:{
        flex:1,
        backgroundColor:'transparent',
        paddingBottom:px(100),
    },
    mask2:{
        backgroundColor:'rgba(0,0,0,0.5)',
        alignItems: 'center',
    },
    nologmask:{
        width:px(570),
        height:px(332),
        backgroundColor:'#fff',
        borderRadius:px(8),
    },
    nologtip:{
        flex:1,
        paddingLeft:px(30),
        paddingRight:px(18),
        paddingTop:px(32),
    },
    nologtxt:{
        color:'#3D4145',
        fontSize:px(32)
    },
    nologT:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    famview:{
        borderBottomWidth:px(1),
        borderBottomColor:'#DCDDE3',
    },
    head:{ 
        height: px(150),
        backgroundColor: '#ffffff',
        borderBottomWidth: px(2),
        borderBottomColor: '#e5e5e5',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: px(36),
    },
    head_se:{
        height: px(106),
        backgroundColor: '#ffffff',
    },
    img:{
        height: px(100),
        width: px(100),
        borderRadius: px(50),
    },
    mid_view:{
        paddingLeft: px(40),
        height: px(150),
        flex: 1,
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'center'
    },
    mid_text:{
        color: '#4A4A4A',
        fontSize: px(28),
    },
    mid_textS:{
        marginTop:px(10),
        color: '#4A4A4A',
        fontSize: px(24),
    },
    tap_view:{
        backgroundColor: '#F48608',
        height: px(56),
        paddingLeft:px(12),
        paddingRight:px(12),
        borderBottomLeftRadius: px(28),
        borderTopLeftRadius: px(28),
        flexDirection: 'row',
        alignItems: 'center',
    },
    new:{
        fontSize:px(28),
        color: '#ffffff',
        height: px(28),
        width: px(28),
    },
    list_ix:{
        flexDirection: 'row',
        height: px(96),
        backgroundColor: '#ffffff',
    },
    list_iy:{
        paddingTop:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingLeft:px(24),
        height: px(96),
        width: px(96),
    },
    list_iz:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: px(24),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
    },
    list_iz_none:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: px(24),
        borderBottomColor: '#e5e5e5',
        borderBottomWidth:px(0)
    },
    list_txt:{
        fontSize: px(32),
        color: '#3D4145',
    },
    grey_view:{
        backgroundColor: '#F5F5F5',
        height: px(24),
    },
    img2:{
        height: px(100),
        width: px(100),
        borderRadius: px(50),
        position:'absolute',
        left:px(38),
        top:px(25)
    }
});