/*
 * @Author: Qinyonglian
 * @Date: 2019-08-20 15:16:12
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-21 15:14:57
 */
/**
 * 会话数据模型
 */
export default class OrganItem {
  constructor(options) {
    const _options = options.values;
    this._init(_options);
  }

  /**
   * 映射属性
   */
  _init(_options) {
    // 邮箱
    this.companyemail = _options.COMPANYEMAIL;
    // 性别
    this.gender = _options.GENDER;
    // 入职时间
    this.createtime = _options.CREATETIME;
    // 部门
    this.deptname = _options.DEPTNAME;
    this.easyname = _options.EASYNAME;
    this.otheremail = _options.OTHEREMAIL;
    this.phone = _options.PHONE;
    this.rolenames = _options.ROLENAMES;
    // 职位
    this.sentrynames = _options.SENTRYNAMES;
    // 手机
    this.usercode = _options.USERCODE;
    // userid
    this.userid = _options.USERID;
    // 直接领导
    this.zsldname = _options.ZSLDNAME;
    // 座机
    this.zuoji = _options.ZUOJI;
    // 名字
    this.name = _options.USERNAME;
  }

  get photo() {
    return JE.getUserPhoto(this.userid, true);
  }

  get char() {
    return JE.toPinYin(this.name, 'pinyin').substr(0, 1).toUpperCase();
  }

  /**
   * 创建对象
   */
  static create(options) {
    return new OrganItem(options);
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
