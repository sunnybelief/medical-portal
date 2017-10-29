import React from 'react';
import {Layout, Menu, Card, Breadcrumb, Icon} from 'antd';
import {connect} from 'dva';
import {Link} from 'react-router';
import styles from './MainContainer.css';
import * as Types from '../../utils/Constants';
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem.d";
import {createAction} from "../../utils/index";
import {routerRedux} from 'dva/router';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

function MainContainer(props) {

// 头部
  function renderHeader() {
    return (
      <div className={styles.headerContainer}>
        <text className={styles.headerText}>国家医疗器械监测平台(沈阳市检测机构)</text>
        <div className={styles.headerRightContainer}>
          1
        </div>
      </div>
    );
  }

// 左边选择
  function renderLeft() {
    return (
      <div
        style={{width: 210}}
        className={styles.leftCardView}
      >
        <Menu
          onClick={e => handleItemSelected(e)}
          className={styles.leftMenu}
          openKeys={props.openKeys}
          selectedKeys={props.selectedKeys}
          onOpenChange={openKeys => onOpenChange(openKeys, props.dispatch)}
          mode="inline"
        >
          {
            props.items.map((item) => {
              return (
                item.content.length === 0 ?
                  <Menu.Item key={item.key}>
                    {/*<Icon type="setting"/>*/}
                    <div className={styles.leftMenuItemContainer}>
                      <img src={`../../assets/${item.image}`}/>
                      <span>{item.name}</span>
                    </div>
                  </Menu.Item>
                  :
                  <SubMenu
                    className={styles.leftMenuTitle}
                    key={item.key}
                    title={<div className={styles.leftMenuItemContainer}><img
                      src={`../../assets/${item.image}`}/><span>{item.name}</span></div>}
                  >
                    {
                      item.content.map((temp) => {
                        return (<Menu.Item key={temp.key}>{temp.name}</Menu.Item>);
                      })
                    }
                  </SubMenu>
              );
            })
          }
        </Menu>
      </div>
    );
  }

// 选中时回调
  function handleItemSelected(e) {
    switch (e.key) {
      case '100'://首页
        window.open('/home/index', '_self');
        //props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '102'://报告评价
        window.open('/report/doReview', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '104'://数据统计与分析
        window.open('/data/analysis', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '105'://数据导入与分析
        window.open('/data/importAnalysis', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '109'://公告管理
        window.open('/notice/management', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '110'://报告浏览
        window.open('/report/queryLook', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '0'://报告填写与上报
        window.open('/report/selectCategory', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '1'://暂存的报告
        window.open('/report/tempStorage', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '2'://已上报的报告
        window.open('/report/haveSend', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '103'://质量评估
        window.open('/quality/doEvaluate', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '5'://添加医疗器械
        props.dispatch(routerRedux.push({pathname: '/addAppliance', query: {itemId: e.key}}));
        break;
      case '6'://管理医疗器械
        props.dispatch(routerRedux.push({pathname: '/managerAppliance', query: {itemId: e.key}}));
        break;
      case '7'://注册市级监测机构
        props.dispatch(routerRedux.push({pathname: '/RegisterMonitor', query: {itemId: e.key}}));
        break;
      case '8'://注册机械使用单位
        props.dispatch(routerRedux.push({pathname: '/RegisterMachine', query: {itemId: e.key}}));
        break;
      case '9'://管理市级监测机构
        props.dispatch(routerRedux.push({pathname: '/ManagerCityMonitor', query: {itemId: e.key}}));
        break;
      case '10'://管理机械使用单位
        props.dispatch(routerRedux.push({pathname: '/Manager', query: {itemId: e.key}}));
        break;
      case '11'://修改本单位信息
        props.dispatch(routerRedux.push({pathname: '/AlterOrganizationDetail', query: {itemId: e.key}}));
        break;
      case '12'://账号注册
        window.open('/account/register', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '13'://账号管理
        window.open('/account/management', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
      case '14'://我的账号
        window.open('/account/self', '_self');
        // props.dispatch(routerRedux.push({pathname: '/html', query: {itemId: e.key}}));
        break;
    }
  }

// 组打开时回调
  function onOpenChange(openKeys) {
    props.dispatch(createAction('main/changeGroup')({openKeys}))
  }

// 中间内容
  function renderContent() {
    return (
      <div style={{height: '100%'}}>
        {props.children}
      </div>
    );
  }

  return (
    <Layout className={styles.normal}>
      <Header className={styles.header}>
        {renderHeader()}
      </Header>

      <Layout>
        <Sider width={210} className={styles.slider}>
          {renderLeft(props)}
        </Sider>

        <Content className={styles.content}>
          {renderContent(props)}
        </Content>
      </Layout>

    </Layout>
  );
}

export default MainContainer;
