/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 16:07:04
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-13 15:27:02
 */

import {
  fetchAsync
}
  from './../common/fetch'

/**
 * 添加成员
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchAddGroupMember (param) {
  return fetchAsync('/instant/instant/group/addGroupDetail', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(res => {
      if (res.success) {
        return res.obj || {};
      }
      JE.msg(res.message);
      return {};
    })
    .catch()
}

/**
 * 删除成员
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchDelGroupMember (param) {
  return fetchAsync('/instant/instant/group/delGroupDetail', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(res => {
      if (res.success) {
        return res.obj || {};
      }
      JE.msg(res.message);
      return {};
    })
    .catch()
}

/*
 * 退出群组
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchoutGroup (param) {
  return fetchAsync(`/instant/instant/group/outGroup`, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(res => {
      if (res.success) {
        return res.obj || {}
      }
      JE.msg(res.message);
      return {};
    })
    .catch();
}

/*
 * 删除群组
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchRemoveGroup (param) {
  return fetchAsync(`/instant/instant/group/disbindGroup`, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(res => {
      if (res.success) {
        return res.obj || {};
      }
      JE.msg(res.message);
      return {};
    })
    .catch();
}

/*
 * 群列表置顶功能
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGroupsActual (param) {
  return fetchAsync(`/instant/instant/actual/manageActual`, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(data => data)
    .catch();
}

/**
 * 创建群组
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchCreateGroup (param) {
  return fetchAsync('/instant/instant/group/createGroup', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(res => {
      if (res.success) {
        return res.obj || {};
      }
      JE.msg(res.message);
      return {};
    })
    .catch()
}

/**
 * 获取我的群组
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchMyGroups (param) {
  return fetchAsync('/instant/instant/group/getMyGroups', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(data => {
      if (data.success) {
        return data.obj || [];
      }
      JE.msg(data.message);
      return [];
    })
    .catch()
}

/**
 * 根据群组id获取群组信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGroups (param) {
  return fetchAsync('/instant/instant/group/getGroups', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(res => {
      if (res.success) {
        return res.obj || [];
      }
      JE.msg(res.message);
      return {};
    })
    .catch()
}

/**
 * 获取群成员信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGroupDetail (param) {
  return fetchAsync('/instant/instant/group/getGroupDetail', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(data => {
      if (data.success) {
        return data.obj || [];
      }
      JE.msg(data.message)
      return [];
    })
    .catch()
}

/*
 * 转让群主给群内成员
 * @param param
 * @returns {Promise<T | never>}
 */
export function updateGroupOwner (param) {
  return fetchAsync(`/instant/instant/group/updateGroupOwner`, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(res => {
      if (res.success) {
        return res.obj || {};
      }
      JE.msg(res.message);
      return {};
    })
    .catch();
}

/*
 * 修改群组的名称和群头像
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGroupsUpdate (param) {
  return fetchAsync(`/instant/instant/group/updateGroup`, {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded',
  })
    .then(res => {
      if (res.success) {
        return res.obj || {};
      }
      JE.msg(res.message);
      return {};
    })
    .catch();
}

/*
 * 上传群头像进行裁剪
 * @param param
 * @returns {Promise<T | never>}
 */

export function fetchGroupsAvatar (param) {
  return fetchAsync('/je/doc/document/doSaveDiyImg', {}, {
    type: 'post',
    data: param,
  })
    .then(data => {
      if (data.success) {
        return data.obj || {}
      }
      return {}
    })
    .catch();
}
