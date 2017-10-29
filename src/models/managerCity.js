import {getCityData, updateOrganization} from "../services/manager";
import {createAction} from "../utils/index";
import {registerCityMonitorColumns} from "../common/Constants";
import {notification} from 'antd'

export default {
  namespace: 'managerCity',
  state: {
    columns:registerCityMonitorColumns,
    tableData: [],
    alterVisible:false,
    alterLoading:false,
    selectedKey:0,
    selectedData:{},
  },
  reducers: {

    setTableData(state, {payload}) {
      return ({
        ...state,
        tableData: payload.tableData
      })
    },
    setAlterModelVisible(state,{payload}){
      return({
        ...state,
        alterVisible:payload.alterVisible
      })
    },
    setAlterModelLoading(state,{payload}){
      return({
        ...state,
        alterLoading:payload.alterLoading
      })
    },
    changeSelectedKey(state,{payload}){
      return({
        ...state,
        selectedKey:payload.key,
      })
    },
    changeSelectedData(state,{payload}){
      return({
        ...state,
        selectedKey:payload.key,
        selectedData:state.tableData[payload.key]
      })
    }

  },
  effects: {
    * onTableItemSelect({payload},{call,put}){
      yield put(createAction('changeSelectedData')({key:payload.key}))
      yield put(createAction('setAlterModelVisible')({alterVisible:true}))
    },
    * getTableData({payload}, {call, put}) {
      let tableData = yield call(getCityData);
      if (tableData && tableData.length > 0) {
        tableData.map((item, index) => {
          item.key = index
        })
      }
      yield put(createAction('setTableData')({tableData}))
    },
    *updateData({payload},{call,put}){
      let postalCode=payload.data.postalCode
      let email=payload.data.email
      let contacts=payload.data.contacts
      let phoneNumber=payload.data.phoneNumber
      let fax=payload.data.fax
      let address=payload.data.address
      let id=payload.id
      yield call(updateOrganization,{id,postalCode,email,contacts,phoneNumber,fax,address})
      notification['success']({
        message: `修改成功`,
        description: ``,
        duration: 3,
        style:{height:80,paddingBottom:10},
      });
      yield put(createAction('getTableData')());
      yield put(createAction('setAlterModelVisible')({alterVisible:false}))
    }

  },
  subscriptions: {
    setup({dispatch, history}) {
      return (
        history.listen(({pathname, query}) => {
          pathname.indexOf('/ManagerCityMonitor')>=0 ?
            dispatch(createAction('getTableData')()) : null
        })
      )
    }
  },
};
