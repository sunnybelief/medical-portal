import {hospitalDegree, hospitalDegreeUtil, managerMachineColumns} from "../common/Constants";
import {getHospitalOrganization, updateOrganization} from "../services/manager";
import {createAction} from "../utils/index";
import {notification} from 'antd'

export default {
  namespace: 'manager',
  state: {
    columns: managerMachineColumns,
    title: '器械使用单位管理',
    tableData: [],
    selectedKey:-1,
    selectedData:{},
    alterVisible:false,
  },
  reducers: {
    setTableData(state, {payload}) {
      return {
        ...state,
        tableData: payload.tableData
      }
    },
    setSelectedKey(state,{payload}){
     return{
       ...state,
       selectedKey:payload.key,
       selectedData:state.tableData[payload.key]
     }
    },
    setAlterVisible(state,{payload}){
      return{
        ...state,
        alterVisible:payload.alterVisible
      }
    }

  },
  effects: {
    * onTableItemSelect({payload},{call,put}){
      yield put(createAction('setSelectedKey')({key:payload.key}))
      yield put(createAction('setAlterVisible')({alterVisible:true}))
    },

    * getData({payload}, {call, put}) {
      if (payload.values.addressCity) {
        payload.values.addressCity.length === 0 ?
          delete payload.values.addressCity :
          payload.values.addressCity = payload.values.addressCity[0] + '|' + payload.values.addressCity[1]
      }
      if (payload.values.hospitalDegree) {
        payload.values.hospitalDegree.length === 0 ?
          delete payload.values.hospitalDegree :
          payload.values.hospitalDegree = payload.values.hospitalDegree[0] + '|' + payload.values.hospitalDegree[1]
      }
      if (payload.values.isActive) {
        payload.values.isActive =
          payload.values.isActive === 1 ?
            payload.values.isActive = 'Y'
            : payload.values.isActive = 'N'
      }
      let tableData = yield call(getHospitalOrganization, {...payload.values})
      tableData.map((item, index) => {
          item.key = index
          let chars = item.hospitalDegree.split('|')
          item.hospitalDegree = hospitalDegreeUtil[chars[0]] + hospitalDegreeUtil.children[chars[1]]
          item.isActive= item.isActive==='Y'? '启用':'停用'
        }
      )
      yield put(createAction('setTableData')({tableData}))
    },

    * stopOrStart({payload},{select,call,put}){
      yield call(updateOrganization,{id:payload.id,isActive:payload.isActive})
      let tableData=JSON.parse(JSON.stringify(yield select(state=>state.manager.tableData)))
      tableData[payload.key].isActive=payload.isActive==='Y'? '启用':'停用'
      yield put(createAction('setTableData')({tableData}))
    },

    *updateData({payload},{call,put,select}){
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
      let selectedKey=yield  select(state=>state.manager.selectedKey)
      let tableData=JSON.parse(JSON.stringify(yield select(state=>state.manager.tableData)))
      console.log('tableData:'+JSON.stringify(tableData))
      tableData[selectedKey]={...tableData[selectedKey],postalCode,email,contacts,phoneNumber,fax,address}
      yield put(createAction('setTableData')({tableData}))
      yield put(createAction('setAlterVisible')({alterVisible:false}))
    }

  },

  subscriptions: {}
  ,
}
;
