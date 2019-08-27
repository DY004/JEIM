/*
 * @Author: Qinyonglian
 * @Date: 2019-08-10 09:44:04
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-23 11:54:48
 */
import {
  fetchGetAllPeople, fetchGetAllOrg,
} from '../actions/organ';
import OrganItem from '../model/Organ';


export default class Organ {
  // 同步树数据
  treeNode = [];

  /*
   * 创建对象
   */
  create(vm) {
    return new Organ(vm);
  }

  constructor(vm) {
    this.vm = vm;
  }

  /*
   * 获取租户下所有最后一级人员的列表（包括总数）为了搜索的时候用
   * @param {*} tenantId
   */
  static async init(tenantId) {
    const res = await fetchGetAllPeople({ tenantId });
    const list = res.rows || [];
    window._im_people_list = list.map(item => OrganItem.create(item));
  }

  /*
  * 同步获取组织树的人员
  * @param {*} tenantId
  */
  async getUserInfoByUserId(userId) {
    const res = await fetchGetAllOrg({
      userId,
    });
    // data为需要修改的tree，为点击组织树做处理
    const addKey = (data) => {
      const item = [];
      data.map((list) => {
        list.type === '1' && (list.photo = JE.getUserPhoto(list.id, true));
        const newData = { ...list };
        newData.open = false;
        newData.children = list.children.length ? addKey(list.children) : []; // 如果还有子集，就再次调用自己
        item.push(newData);
      });
      return item;
    };
    return this.treeNode = addKey(res).map(items => ({ ...items, open: true }));
  }


  /*
   * 获取某一个item
   * @param userid
   * @return: {}
   */
  getUserItem(userid) {
    return this.peopleList.find(item => item.userid === userid);
  }
}
