import px from '../../Biz/px.js';
export default {
	gridcell: {
		flex:1,
		height: px(464),
		width: px(340),
		marginBottom: px(24),
		marginLeft: px(24),
	},
	rowData:{
		flex:1,
		height: px(244),
		width: px(218),
		marginLeft:px(20),
	},
	rowNoData: {
		flex: 1,
		height: px(218),
		width: px(218),
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: px(20),
		borderRadius: "20%",
		borderWidth: 1,
		borderColor: "#e5e5e5",
		backgroundColor: "#fff",
	},
	itemRefresh:{
        width:px(750),
        height:px(100),
        alignItems:'center',
        justifyContent:'center'
    },
	loadmore_view:{
        height: px(60),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadmore_text:{
        fontSize: px(24),
        color: '#FF6000'
	},
	wangwangicon:{
		color: '#2DA9F7',
		fontSize: px(36)
	},
	paginationStyle:{
		position: 'absolute',
		// width: 200,
		// height: 30,
		// left: 550,
		bottom:0,
	},
	shadow:{
		backgroundColor:'rgb(245,245,245)',
		width:700,
		height:6,
		// position:'relative',
		// top:0,
		// bottom:'-50',
		// alignItems:'center',
		// borderRadius: px(8),
		// borderWidth:px(1),
		// borderStyle:'solid',
		// borderColor:'#e5e5e5',
		marginBottom:24,
		// paddingTop:12,
		// paddingBottom:12
	},
	imgBody:{
        width:365,
		height:365,
		margin:px(5),
		borderRadius: px(8),	
    },
    titleImg:{
        width:px(750),
		height:150,
    },
    imgOne:{
        width:365,
		height:365,
		borderRadius: px(8),			
	},
	imgRow:{
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',		
	}
}
