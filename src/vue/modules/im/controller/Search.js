/*
 * 搜索
 * @Author: Qinyonglian
 * @Date: 2019-08-21 19:16:15
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-23 17:23:55
 */
import searchMatch from 'pinyin-match';

export default class Search {
   searchArr = [];

   /**
   * 创建对象
   */
   static create(vm) {
     return new Search(vm);
   }

   constructor(vm) {
     this.vm = vm;
   }

   /**
   * @param {type} 单聊还是群聊， 1 || 3
   * @param {text} 搜索的关键字
   * @param {show} 默认只展示3个，传true
   * @param {list} 数据
   * @return:
   */
   searchList(text, type, show, lists) {
     this.searchArr = [];
     const searchText = text.trim();
     // if (!searchText) return false;
     // 如果查询的包含'.'就让为查询失败
     if (searchText.includes('.')) return [];
     lists.map((item) => {
       const searchArray = searchMatch.match(item.name, searchText);
       if (searchArray && searchArray.length) {
         item.newname = item.name.replace(item.name.substr(searchArray[0], searchText.length), `<span style='color:#546EFE;'>${item.name.substr(searchArray[0], searchText.length)}</span>`);
         this.searchArr.push(item);
       }
     });
     const isMore = this.searchArr.length > 3;
     if (show) {
       return {
         list: this.searchArr.slice(0, 3) || [],
         isMore,
       };
     }
     return {
       list: this.searchArr || [],
       isMore,
     };
   }
}
