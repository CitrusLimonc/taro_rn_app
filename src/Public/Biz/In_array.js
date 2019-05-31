  /**
 * 判断参数是否在数组中
 * @author lzy
 * @param {[type]} keys [description]
 */
var in_array = function(stringToSearch, arrayToSearch){
    if(typeof(arrayToSearch)=='string'){
        return false;
    }
    for (let s = 0; s < arrayToSearch.length; s++) {
        let Entry = arrayToSearch[s].toString();
        if (Entry == stringToSearch) {
          return true;
        }
      }
      return false;
};
export {in_array};
