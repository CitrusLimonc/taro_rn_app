/**
*  @author cy
*  参数
*  time 必须为合法时间字符串 不传为当前时间
*  matchStr （格式）  例：YY-MM-DD hh:mm:ss
**/

var GetTimeString = function (matchStr,time) {
    let nowDate = new Date();
    if(time){
        //日期字符串中的'-'改为'/'，否则会出NaN的问题
        if(typeof(time) == 'string'){
            nowDate = new Date( time.replace( new RegExp(/-/gm) , "/" ) );
        } else {
            nowDate = new Date();
        }
    }

    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1;
    if ( month<= 9 ) {
        month = "0" + month;
    }
    let date = nowDate.getDate();
    if ( date<= 9 ) {
        date = "0" + date;
    }
    let hours = nowDate.getHours();
    if ( hours<= 9 ) {
        hours = "0" + hours;
    }
    let minutes = nowDate.getMinutes();
    if ( minutes<= 9 ) {
        minutes = "0" + minutes;
    }
    let seconds = nowDate.getSeconds();
    if ( seconds<= 9 ) {
        seconds = "0" + seconds;
    }

    if (matchStr) {
        matchStr = matchStr.replace('YY',year);
        matchStr = matchStr.replace('MM',month);
        matchStr = matchStr.replace('DD',date);
        matchStr = matchStr.replace('hh',hours);
        matchStr = matchStr.replace('mm',minutes);
        matchStr = matchStr.replace('ss',seconds);
        return matchStr;
    } else {
        return year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;
    }
};

export default GetTimeString;
