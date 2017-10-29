import {
  addressKey,
  emailKey,
  fullNameKey,
  orgIdKey,
  roleKey,
  sexKey,
  storageTokenKey,
  userIdKey,
  usernameKey,
  orgNameKey,
  orgLevelKey,
  higherOrgKey,
  addressCityKey,
  backSystemUrl,
} from "../common/Constants";
import {routerRedux} from "dva/router";
import {login} from "../services/app.js";

export default {
  namespace: 'login',
  state: {},
  reducers: {},
  effects: {
    * login({payload}, {call, put}) {
      let response = yield call(login, {username: payload.userName, password: payload.password})
      console.log(response)
      window.localStorage.setItem(addressKey, response.address);
      window.localStorage.setItem(emailKey, response.email);
      window.localStorage.setItem(userIdKey, response.id);
      window.localStorage.setItem(fullNameKey, response.name);
      window.localStorage.setItem(orgIdKey, response.orgId);
      window.localStorage.setItem(roleKey, response.roles[0].authority);
      window.localStorage.setItem(sexKey, response.sex);
      window.localStorage.setItem(storageTokenKey, response.token);
      window.localStorage.setItem(usernameKey, response.username);
      window.localStorage.setItem(orgNameKey, response.orgName);
      window.localStorage.setItem(orgLevelKey, response.orgLevel);
      window.localStorage.setItem(higherOrgKey, response.higherOrg);
      window.localStorage.setItem(addressCityKey, response.addressCity);
      window.localStorage.setItem(backSystemUrl, 'http://127.0.0.1:9090');
      // yield put(routerRedux.push({pathname:'/html',query:{itemId:100}}))
      window.open('/home/index','_self');
    },
  },
  subscriptions: {},
};
