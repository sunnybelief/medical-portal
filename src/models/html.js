import {createAction} from "../utils/index";

export default {
  namespace: 'html',
  state: {
    url: '',
  },
  reducers: {
    setUrl(state, {payload}) {
      return {
        ...state,
        url: payload.url
      }
    },

  },
  effects: {},
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        // if (pathname.indexOf('/html') >= 0) {
        //   switch (query.itemId) {
        //     case '100'://首页
        //       dispatch(createAction('setUrl')({url: '/home/index'}));
        //       break;
        //     case '102'://报告评价
        //       let url = '';
        //       if (query.step === 1) {
        //         url = '/report/selectCategory'
        //       } else if (query.step === 2) {
        //         url = '/report/selectCategory'
        //       } else if (query.step === 3) {
        //         url = '/report/selectCategory'
        //       }
        //       dispatch(createAction('setUrl')({url}));
        //       break;
        //     case '104'://数据统计与分析
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '105'://数据导入与分析
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '109'://公告管理
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '0'://报告填写与上报
        //       dispatch(createAction('setUrl')({url: 'http://www.baidu.com'}));
        //       break;
        //     case '1'://暂存的报告
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '2'://已上报的报告
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '3'://评估方案管理
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '4'://数据抽样与质量评估
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '12'://账号注册
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '13'://账号管理
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //     case '14'://我的账号
        //       dispatch(createAction('setUrl')({url: '/report/selectCategory'}));
        //       break;
        //   }
        // }
      });
    },
  }
};
