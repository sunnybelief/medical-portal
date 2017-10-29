import {addAppliance, getAllCategory} from "../services/app";
import {notification} from 'antd'
import {usernameKey} from "../common/Constants";
import {createAction} from "../utils/index";

const data1 = [
  {required: true, label: '器械名称', fieldName: 'name', type: ''},
  {required: true, label: '器械类别', fieldName: 'categoryId', type: 'select'},
  {required: true, label: '注册证号', fieldName: 'registNumber', type: ''},
  {required: true, label: '规格型号', fieldName: 'modelVersion', type: ''},
  {required: true, label: '产品编号', fieldName: 'productNumber', type: ''},
  {required: false, label: '有效截止日期', fieldName: 'validityDate', type: 'DatePicker'},
]
const data2 = [
  {required: true, label: '企业名称', fieldName: 'factoryName', type: ''},
  {required: true, label: '联系电话', fieldName: 'phoneNumber', type: ''},
  {required: true, label: '所属地区', fieldName: 'addressCity', type: ''},
  {required: true, label: '邮编', fieldName: 'postalCode', type: ''},
  {required: true, label: '联系地址', fieldName: 'address', type: ''},
  {required: true, label: '邮箱', fieldName: 'email', type: 'email'},
  {required: true, label: '联系人', fieldName: 'contactor', type: ''},
]
export default {
  namespace: 'addAppliance',
  state: {
    data1,
    data2,
    category: [],
  },
  reducers: {
    setCategory(state,{payload}){
     return{
       ...state,
       category:payload.category
     }
    }
  },
  effects: {
    * getApplianceCategory({payload}, {call, put}) {
      let category = yield call(getAllCategory)
      let temp = [];
      for (let item of category) {
        let a={};
        a.label = item.categoryName
        a.value=item.id+'|'+item.categoryName
        temp.push(a);
      }
      yield put(createAction('setCategory')({category:temp}))
    },
    * addAppliance({payload}, {call, put}) {
      let gmtUpdator = window.localStorage.getItem(usernameKey)
      payload.values.validityDate = payload.values.validityDate.toDate()
      console.log(payload.values)
      payload.values.categoryName=payload.values.categoryId[0].split('|')[1]
      payload.values.categoryId=payload.values.categoryId[0].split('|')[0]
      console.log(payload.values)
      let result = yield call(addAppliance, {gmtCreator: gmtUpdator, gmtUpdator, ...payload.values})
      if (result) notification['success']({
        message: '添加成功',
        description: '',
        duration: 3,
        style: {height: 80, paddingBottom: 10},
      });
    }

  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if(pathname.indexOf('/addAppliance')>=0){
          dispatch(createAction('getApplianceCategory')())
        }
      });
    },
  }
};
