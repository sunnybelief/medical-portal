import {alterMonitor, orgIdKey} from "../common/Constants";
import {createAction} from "../utils/index";
import {getHostOrganizationDetail} from "../services/app";
import {updateOrganization} from "../services/manager";
import {notification} from 'antd'

export default {
  namespace: 'alterOrganization',
  state: {
    formData: alterMonitor,
    orgDetail: {},
  },
  reducers: {
    setOrgDetail(state,{payload}){
      return{
        ...state,
        orgDetail:{...state.orgDetail,...payload.orgDetail}
      }
    }
  },
  effects: {
    * getData({payload}, {call, put}) {
      let orgDetail = yield call(getHostOrganizationDetail, {id: window.localStorage.getItem(orgIdKey)})
      yield put(createAction('setOrgDetail')({orgDetail}))
    },
    * updataOrganization({payload},{call,put}){
      yield call(updateOrganization,{id:window.localStorage.getItem(orgIdKey),...payload.values})
      yield put(createAction('setOrgDetail')({orgDetail:payload.values}))
       notification['success']({
        message: '修改成功',
        description: '',
        duration: 3,
        style: {height: 80, paddingBottom: 10},
      });
    }
  },
  subscriptions: {

    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname.indexOf('/AlterOrganizationDetail') >= 0) {
          dispatch(createAction('getData')())
        }

      });
    },

  },
};
