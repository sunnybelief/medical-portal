import React from 'react';
import { connect } from 'dva';
import styles from './RegisterMachine.css';
import Main from "./Main";
import RegisterMachineComponent from "../components/unitManager/RegisterMachineComponent";

function RegisterMachine(props) {
  return (
      <RegisterMachineComponent {...props}/>
  );
}

function mapStateToProps(state) {
  return {...state.registerMachine};
}

export default connect(mapStateToProps)(RegisterMachine);
