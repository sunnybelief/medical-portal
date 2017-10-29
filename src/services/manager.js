/**
 * Created by wangzhen on 2017/9/7.
 */
import {GET, POST} from "../utils/net";
import {baseUrl} from "../common/Constants";

export function getCityData() {
  return GET(baseUrl+'/getCityOrganization')
}

export function updateOrganization(params) {
  return POST(baseUrl+'/updateOrganization',{...params})
}

export function getHospitalOrganization(params) {
  return GET(baseUrl+'/getHospitalOrganization',{...params})
}
