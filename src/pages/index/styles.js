import px from '../../Biz/px.js';
export default {
  body: {
    alignItems: 'flex-start',
    flex: 1,
    padding: px(24),
    backgroundColor: '#ffffff',
  },
  firstLine: {
    height: px(44),
    width: px(700),
    fontFamily: 'PingFangSC-Regular',
    fontSize: px(32),
    color: '#030303',
    // textAlign: 'left',
    // alignItems: 'flex-start',
  },
  firstText: {
    width: px(700),
    fontFamily: 'PingFangSC-Regular',
    fontSize: px(28),
    color: '#666666',
    marginTop: px(24),
  },
  Picbody: {
    width: px(700),
    alignItems: 'center',
    marginTop: px(32)
  },
  Picbodypic: {
    width: px(416),
    height: px(416),
  },
  Picbodybutton: {
    width: px(128),
    height: px(48),
    marginTop: px(24),
  },
  importText: {
    width: px(700),
    fontFamily: 'PingFangSC-Regular',
    fontSize: px(28),
    color: '#FF6000',
    marginTop: px(32),
  },
  wangwangbody: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px(80),
  },
  wangwangLeft: {
    color: '#999999',
    fontSize: px(28),

  },
  wangwangRight: {
    color: '#2DA9F7',
    fontSize: px(28),

  },
  wangwangicon: {
    color: '#2DA9F7',
  }
}
