import React from 'react';
import { connect } from 'dva';
import styles from './Manager.css';
import Main from "./Main";
import ManagerComponent from "../components/unitManager/ManagerComponent";

function Manager(props) {
  return (
      <ManagerComponent {...props}/>
  );
}

function mapStateToProps(state) {
  return {...state.manager};
}

export default connect(mapStateToProps)(Manager);
