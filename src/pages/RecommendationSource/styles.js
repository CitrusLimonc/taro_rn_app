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
		bottom:px(0),
	},
	shadow:{
		backgroundColor:'rgb(245,245,245)',
		width:px(700),
		height:px(6),
		marginBottom:px(24),
	},
	imgBody:{
        width:px(365),
		height:px(365),
		margin:px(5),
		borderRadius: px(8),	
    },
    titleImg:{
        width:px(750),
		height:px(150),
    },
    imgOne:{
        width:px(365),
		height:px(365),
		borderRadius: px(8),			
	},
	imgRow:{
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',		
	}
}
