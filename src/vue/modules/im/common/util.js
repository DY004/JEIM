/*
 * @Author: Qinyonglian
 * @Date: 2019-07-26 09:55:31
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-22 18:07:25
 */

/**
 * date时间操作类,依赖dayjs类库
 * @module JE/date
 */

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CHAT_CONTENT_TYPE } from './params';
// 设置时间
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

/*
 * 创建一个单聊或者群组之后调的方法,处理逻辑思路TODO
 * @param {string} url 样式地址
 */
export function createDialogitem(list, listItem) {
  const Item = listItem.detail;
  Item.updateTime = this.dateFormat4Time(Item.createTime);
  if (Item.type === '1' || Item.type === '3') {
    const index = list.findIndex(item => item.id == Item.id);
    const item = list[index];
    if (index > -1) {
      list.splice(index, 1);
      if (item.zd) {
        list.unshift(item);
      } else {
        const noTopIndex = list.findIndex(items => items.zd === '');
        list.splice(noTopIndex, 0, item);
      }
    } else {
      Item.otherInfo.name = this.substrText(Item.otherInfo.name, 13);
      const noTopIndex = list.findIndex(items => items.zd === '');
      list.splice(noTopIndex, 0, Item);
    }
    return list;
  }
}

/*
 * @param {type} 截取文字，超过length显示...
 * @return:
 */
export function substrText(text, len) {
  return text.length >= len ? `${text.substr(0, len)}...` : text;
}

/*
 * @param {type} 通过key值找到想要的Item
 * @return:
 */
export function getItem(key, value, list) {
  return list.find(item => item[key] === value);
}

/*
 * @param {type} 移除某一条会话
 * @return:
 */
export function removeItem(key, value, list) {
  const index = this.getItemIndex(key, value, list);
  return list.splice(index, 1);
}

/*
 * @param {type} 获取会话的索引值
 * @return:
 */
export function getItemIndex(key, value, list) {
  return list.findIndex(item => item[key] == value);
}

/* 处理最后一条消息TEXT：1// 当为文字的时候，要注意a链接不可以点击跳转 || 绝对路径的地址不能跳转
 * @param {type}
 * @return:
 */
export function changeALink(link) {
  // 当为文字的时候，要注意a链接不可以点击跳转 || 绝对路径的地址不能跳转
  const isHasA = /<a[^>]+href=['"]([^'"]*)['"]>/gi;
  const reURL = /^(https?|ftp|file):\/\/.+$/;
  if (link.match(isHasA)) {
    const hrefArr = link.match(isHasA)[0];
    const hrefUrl = /href=\"(.+)\"/g.exec(hrefArr)[1];
    if (hrefUrl && reURL.test(hrefUrl)) {
      return hrefUrl;
    }
  }
  return link;
}

/*
  * 改变最后接收消息以及列表的时间显示格式
  * @param lastMsg: contentType的来源是消息 ---- 1文本要注意a链接不可以点击; 2图片 3文件 4语音
  * @return item:
  */
export function changeTime(time) {
  return this.dateFormat4Time(time);
}

/*
* 改变最后一条消息的展示格式
* @param lastMsg: contentType的来源是消息 ---- 1文本要注意a链接不可以点击; 2图片 3文件 4语音
* @param msgType的来源是会话列表
* @return item:
*/
export function changeLastMsg(type, lastMsg, length) {
  if (type === CHAT_CONTENT_TYPE.TEXT) {
    return this.substrText(this.changeALink(lastMsg), length);
  }
  if (type === CHAT_CONTENT_TYPE.IMG) {
    return '[图片]';
  }
  if (type === CHAT_CONTENT_TYPE.FILE) {
    return '[文件]';
  }
  if (type === CHAT_CONTENT_TYPE.VOICE) {
    return '[语音]';
  }
}
// 格式化时间
export function formatDateTime (theDate) {
  var _hour = theDate.getHours();
  var _minute = theDate.getMinutes();
  var _second = theDate.getSeconds();
  var _year = theDate.getFullYear();
  var _month = theDate.getMonth();
  var _date = theDate.getDate();
  if (_hour < 10) {
      _hour = "0" + _hour;
  }

  if (_minute < 10) {
      _minute = "0" + _minute;
  }

  if (_second < 10) {
      _second = "0" + _second;
  }
  _month = _month + 1;
  if (_month < 10) {
      _month = "0" + _month;
  }
  if (_date < 10) {
      _date = "0" + _date;
  }
  return (
      _year +
      "-" +
      _month +
      "-" +
      _date +
      " " +
      _hour +
      ":" +
      _minute +
      ":" +
      _second
  );
}

export function dateFormat4Time(date, time) {
  if (JE.isEmpty(date)) { return ''; }

  const today = dayjs();
  const formatDate = dayjs(date);
  const curYear = dayjs().year();
  const curMonth = dayjs().month() + 1;
  const curDay = dayjs().date();
  const curDate = `${curYear}-${curMonth}-${curDay}`;
  const time24 = dayjs(`${curDate} 00:00`);
  const diff1 = formatDate.diff(today, 'day'); // 相差天数
  const diff2 = time24.diff(today, 'hour'); // 今天的相差小时数
  const diff3 = formatDate.diff(today, 'hour');// 相差小时数
  const week = today.day();// 星期

  let msg = '';
  const absNum = Math.abs(diff1);
  const absHour = Math.abs(diff2); // 当天从零点开始到目前的小时数
  const absrelHour = Math.abs(diff3); // 相差小时

  if (time) {
    if (absrelHour <= absHour) { // 当天的日期显示 时：分
      msg = formatDate.format('HH:mm');
    } else if (absrelHour > absHour && (absrelHour - absHour) < 24) { // 昨天的日期显示昨天
      msg = `昨天 ${formatDate.format('HH:mm')}`;
    } else if (week - absNum > 0) { // 本周的日期显示本周
      msg = `${formatDate.format('dddd')} ${formatDate.format('HH:mm')}`;
    } else if (formatDate.format('YYYY') == today.format('YYYY')) { // 本年的显示月和日
      msg = `${formatDate.format('MM-DD')} ${formatDate.format('HH:mm')}`;
    } else { // 完整时间
      msg = `${formatDate.format('YYYY-MM-DD')} ${formatDate.format('HH:mm')}`;
    }
  }
  if (!time) {
    if (absrelHour < absHour) { // 当天的日期显示 时：分
      msg = formatDate.format('HH:mm');
    } else if (absrelHour > absHour && (absrelHour - absHour) < 24) { // 昨天的日期显示昨天
      msg = '昨天';
    } else if (week - absNum > 0) { // 本周的日期显示本周
      msg = formatDate.format('dddd');
    } else if (formatDate.format('YYYY') == today.format('YYYY')) { // 本年的显示月和日
      msg = formatDate.format('MM-DD');
    } else { // 完整时间
      msg = formatDate.format('YYYY-MM-DD');
    }
  }
  // 列表：
  // 当天：时：分
  // 昨天：昨天，时：分
  // 本周：周几，时：分
  // 当前：月 - 日，时：分
  // 更早：年 - 月 - 日，时：分
  return msg;
}
