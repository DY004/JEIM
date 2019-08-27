/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 19:09:14
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-23 13:16:23
 */
/**
 * 群组会话模型
 */
export default class GroupItem {
  constructor(options) {
    this._init(options);
  }

  /*
   * 映射属性
   */
  _init(options) {
    this.createId = options.createId;
    this.createTime = options.createTime;
    this.groupUserNum = options.groupUserNum;
    this.id = options.id;
    this.oldName = options.name;
    this.nameModifyStatus = options.nameModifyStatus;
    this.photo = options.photo;
    this.type = options.type;
  }

  get name() {
    return this.oldName.length > 20 ? `${this.oldName.substring(0, 20)}...` : this.oldName;
  }

  /*
   * 创建对象
   */
  static create(options) {
    return new GroupItem(options);
  }
}
// let func =  defineReact('phone', _options)
// func.call(this)
// func = null;
// function defineReact(key,options){
//   let _options = options
//   return function(){
//     Object.defineProperty(this,key,{
//       get:function(){
//         return _options
//       },
//       set:function(){

//       }
//     })
//   }
// }
