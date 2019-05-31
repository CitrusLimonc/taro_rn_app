/**
 * 判断这字符串是否为指定格式
 * @author cy
 * 用到啥自己加 = = 别指望我给加，不可能！！
 */
var MatchNumber = {};

//判断是否为正整数
MatchNumber.isPositiveInteger = function(s){
    let re = /^[0-9]+$/;
    return re.test(s);
};

//判断是否为数字，包括小数和负数
MatchNumber.isNumber = function(s){
    let re = /^-?\d+(?=\.{0,1}\d+$|$)/;
    return re.test(s);
};

//是否为正负整数和0
MatchNumber.isNumberAr = function(s){
    let re=/^(0|[1-9][0-9]*|-[1-9][0-9]*)$/;
    return re.test(s);
};

//是否为正数
MatchNumber.isPositiveNumber = function(s){
    let re=/^[0-9]+\.?[0-9]{0,9}$/;
    return re.test(s);
}


export default MatchNumber;
