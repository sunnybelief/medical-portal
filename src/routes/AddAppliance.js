import React from 'react';
import { connect } from 'dva';
import styles from './AddAppliance.css';
import Main from "./Main";
import AddApplianceComponent from "../components/medicalAppliance/AddApplianceComponent";
import {createAction} from "../utils/index";

function AddAppliance(props) {
  function handleSubmit(values) {
    props.dispatch(createAction('addAppliance/addAppliance')({values}))
  }
  return (
      <AddApplianceComponent
        data1={props.data1}
        data2={props.data2}
        handleSubmit={handleSubmit}
        category={props.category}
      />
  );
}

function mapStateToProps(state) {
  return {...state.addAppliance};
}

export default connect(mapStateToProps)(AddAppliance);
