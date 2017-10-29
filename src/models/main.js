import {createAction} from "../utils/index";
import {getItems} from "../services/app";

const items = [
  {key: '100', name: '首页', content: []},

  {
    key: '101',
    name: '报告填写与上报',
    content: [
      {key: '0', name: '填写与上报'},
      {key: '1', name: '暂存的报告'},
      {key: '2', name: '已上报的报告'},
    ],
  },
  {
    key: '102',
    name: '报告评价',
    content: [],
  },
  {
    key: '103',
    name: '质量评估',
    content: [
      {key: '3', name: '评估方案管理'},
      {key: '4', name: '数据抽样与质量评估'},
    ],
  },

  {
    key: '104',
    name: '数据统计与分析',
    content: [],
  },
  {
    key: '105',
    name: '数据导入与分析',
    content: [],
  },
  {
    key: '106',
    name: '医疗机械管理',
    content: [
      {key: '5', name: '添加医疗器械'},
      {key: '6', name: '管理医疗器械'},
    ],
  },
  {
    key: '107',
    name: '各级单位管理',
    content: [
      {key: '7', name: '注册市级监测机构'},
      {key: '8', name: '注册器械使用单位'},
      {key: '9', name: '管理市级监测机构'},
      {key: '10', name: '管理器械使用单位'},
      {key: '11', name: '修改本单位信息'},
    ],
  },
  {
    key: '108',
    name: '各级账号管理',
    content: [
      {key: '12', name: '账号注册'},
      {key: '13', name: '账号管理'},
      {key: '14', name: '我的账号'},
    ],
  },
  {
    key: '109',
    name: '公告管理',
    content: [],
  },
];

export default {
  namespace: 'main',
  state: {
    items:[],
    openKeys: [],
    selectedKeys: ['0'],
    contentTitle: '注册检测机构',
  },
  reducers: {
    changeGroup(state, {payload}) {
      return {
        ...state,
        openKeys: payload.openKeys
      }
    },
    changeItem(state, {payload}) {
      return {
        ...state,
        selectedKeys: [payload.itemId]
      };
    },
    setItems(state,{payload}){
      return{
        ...state,
        items:payload.items
      }
    }
  },
  effects: {
    *getItemsData({payload},{call,put}){
      let items=yield call(getItems,{accountRole:'ROLE_PROVINCE_ADMIN'})
      yield put(createAction('setItems')({items}))
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if(pathname.indexOf('/login')<0) {
          if (query.itemId !== undefined) {
            dispatch(createAction('changeItem')({itemId: query.itemId}))
            if(query.itemId>=0&&query.itemId<=2){
              dispatch(createAction('changeGroup')({openKeys:['101']}))
            }else if(query.itemId>=5&& query.itemId<=6){
              dispatch(createAction('changeGroup')({openKeys:['106']}))
            }else if(query.itemId>=7&& query.itemId<=11){
              dispatch(createAction('changeGroup')({openKeys:['107']}))
            }else if(query.itemId>=12&& query.itemId<=14){
              dispatch(createAction('changeGroup')({openKeys:['108']}))
            }
          }
          dispatch(createAction('getItemsData')())
        }
      });
    },
  }
};
