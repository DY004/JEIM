/**
 * 时间过滤，返回
 * @param {*} value 
 */
export function time(value) {
  if (!value) return "";
  let tmpDate = new Date(value);
  return `${zero(tmpDate.getMonth() +1)}/${zero(tmpDate.getDate())} ${zero(tmpDate.getHours())}:${zero(tmpDate.getMinutes())}`;
}


/**
 * 时间过滤，返回 yyyy-mm-dd
 * @param {*} value 
 */
export function dateFormate(value) {
  if (!value) return "";
  let tmpDate = new Date(value);
  return `${tmpDate.getFullYear()}-${zero(tmpDate.getMonth() +1)}-${zero(tmpDate.getDate())}`;
}

/**
 * 补零
 * @param {*} val 
 */
function zero(val) {
  if (!(val.toString())) return val
  if (parseInt(val) < 10) {
    return `0${val}`
  } else {
    return val
  }
}