import React from 'react';
import { connect } from 'dva';
import styles from './RegisterMonitor.css';
import Main from "./Main";
import RegisterMonitorComponent from "../components/unitManager/RegisterMonitorComponent";

function RegisterMonitor(props) {
  return (
      <RegisterMonitorComponent {...props}/>
  );
}

function mapStateToProps(state) {
  return {...state.registerMonitor};
}

export default connect(mapStateToProps)(RegisterMonitor);
