/*
 * @Author: Qinyonglian
 * @Date: 2019-08-12 16:07:04
 * @LastEditors: Qinyonglian
 * @LastEditTime: 2019-08-20 16:58:09
 */


import { fetchAsync } from './../common/fetch'

/**
 * 根据userId获取所有组织信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetAllOrg (param) {
  return fetchAsync('/instant/instant/rbac/getAllOrg', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(res => {
      if (res.success) {
        return res.obj || {}
      } else {
        JE.msg(res.message);
      }
      return {}

    })
    .catch()
}
/**
 * 根据id获取id下组织信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetOrg (param) {
  return fetchAsync('/instant/instant/rbac/getOrgs', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(data => data)
    .catch()
}

/**
 * 根据id获取部门详细信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetOrgById (param) {
  return fetchAsync('/instant/instant/rbac/getOrgById', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(data => data)
    .catch()
}

/**
 * 根据id获取用户详细信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetUserInfoById (param) {
  return fetchAsync('/instant/instant/rbac/getUserInfoById', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(data => data)
    .catch()
}

/**
 * 根据ids获取用户详细信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetUserInfoByIds (param) {
  return fetchAsync('/instant/instant/rbac/getUserInfoByIds', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(data => {
      if (data.success) {
        return data.obj || []
      }
      JE.msg(res.message)
      return [];
    })
    .catch()
}

/**
 * 根据组织id获取所有人员信息
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetUserByOrgId (param) {
  return fetchAsync('/instant/instant/rbac/getUserByOrgId', {}, {
    type: 'post',
    isFormSubmit: true,
    data: param,
    contentType: 'application/x-www-form-urlencoded'
  })
    .then(data => data)
    .catch()
}
/*
 * 根据租户ID获取这个租户下的所有人员
 * @param param
 * @returns {Promise<T | never>}
 */
export function fetchGetAllPeople (param) {
  return fetchAsync('/instant/instant/rbac/accessToTeanantInfo', {}, {
    type: 'post',
    data: param,
    isFormSubmit: true,
  })
    .then((data) => {
      if (data.success) {
        return data.obj || {}
      }
      JE.msg(res.message)
      return {};
    })
    .catch();
}
