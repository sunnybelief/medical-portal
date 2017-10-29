
import {notification} from 'antd'
import {registerMonitorUnit} from "../services/app";
import {registerMonitor} from "../common/Constants";

export default {
  namespace: 'registerMonitor',
  state: {
    forms:registerMonitor,
  },
  reducers: {

  },
  effects: {
   *registerMonitor({payload},{call,put}){
     payload.data.addressCity=payload.data.addressCity? payload.data.addressCity[0]+'|'+payload.data.addressCity[1]:null;
     payload.data.hospitalDegree=payload.data.hospitalDegree?payload.data.hospitalDegree[0]+'|'+payload.data.hospitalDegree[1]:null;
     payload.data.higherOrgName=payload.data.higherOrgName?payload.data.higherOrgName[0]:null
     payload.data.orgLevel=payload.orgLevel;
     payload.data.gmtCreator='test';
     payload.data.gmtUpdator='test';
     let result=yield call(registerMonitorUnit,{...payload.data});
     if(result)  notification['success']({
       message: '注册成功',
       description: '',
       duration: 5,
       style:{height:80,paddingBottom:10},
     });
   },
  },
  subscriptions: {

  },
};
