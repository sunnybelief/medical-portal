import React from 'react';
import {connect} from 'dva';
import styles from './ManagerAppliance.css';
import Main from "./Main";
import ManagerApplianceComponent from "../components/medicalAppliance/ManagerApplianceComponent";

function ManagerAppliance(props) {
  return (
    <ManagerApplianceComponent {...props}/>
  );
}

function mapStateToProps(state) {
  return {...state.managerAppliance};
}

export default connect(mapStateToProps)(ManagerAppliance);
