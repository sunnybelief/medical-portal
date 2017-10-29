import React from 'react';
import styles from './RegisterMonitorComponent.css';
import {createAction} from "../../utils/index";
import ManagerCityForm from "../widgets/ManagerCityForm";

function RegisterMonitorComponent(props) {

  function handleSubmit(values) {
    props.dispatch(createAction('registerMonitor/registerMonitor')({data: values,orgLevel:'CITY'}))
  }

  return (
    <div className={styles.normal}>
      <div className={styles.topContainer}>
        <text>注册监测机构</text>
        <div className={styles.line}/>
      </div>
      <ManagerCityForm
        handleSubmit={handleSubmit}
        handleCancel={()=>{}}
        formData={props.forms}
        showFooterButton={true}
      />
    </div>
  )
}

export default RegisterMonitorComponent;
