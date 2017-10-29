/**
 * Created by wangzhen on 2017/7/13.
 */
import request from '../utils/request';
import qs ,{ parse } from 'qs';
import FormDataWrapper from 'object-to-formdata';
import merge from 'merge-object';
import {storageTokenKey} from "../common/Constants";

async function POST(url,params,isToken,isJson){
  let token=window.localStorage.getItem(storageTokenKey)
  let jsonConf = {
    headers: {
      'Authorization':`Bearer ${token===undefined?'':token}`,
    }
  }
  if(isJson === undefined){isJson = false};
  if(isToken=== undefined){isToken= true};
  return request( url,merge({
    method: 'POST',
    mode: 'cors',
    body:isJson?JSON.stringify(params):FormDataWrapper(params),
  },isToken?jsonConf:''));
}

async function GET(url,params){
  let token=window.localStorage.getItem(storageTokenKey)
  let jsonConf = {
    headers: {
      'Authorization':`Bearer ${token===undefined?'':token}`,
    }
  }
  return request( url + `?${qs.stringify(params)}`,merge({
    method: 'GET',
    mode: 'cors',
  },jsonConf));
}

export {POST,GET}
