/**
 * Created by wangzhen on 2017/9/6.
 */

import {GET, POST} from "../utils/net";
import {baseUrl} from "../common/Constants";

export function getItems(params) {
  return GET(baseUrl+'/getDynamicMenu/by/role',{...params});
}

export function registerMonitorUnit(params) {
  return POST(baseUrl+'/registerOrganization',{...params});
}

export function login(params) {
 return POST(baseUrl+'/login',{...params})
}

export function addAppliance(params) {
  return POST(baseUrl+'/medicAppliance/add',{...params})
}

export function getAllCategory() {
  return GET(baseUrl+'/medicAppliance/allCategory')
}

export function getHostOrganizationDetail(params) {
  return GET(baseUrl+'/getOrganization/by/id',{...params})
}
