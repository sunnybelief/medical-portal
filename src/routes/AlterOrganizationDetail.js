import React from 'react';
import { connect } from 'dva';
import styles from './AlterOrganizationDetail.css';
import ManagerCityForm from "../components/widgets/ManagerCityForm";
import TopTitle from "../components/widgets/TopTitle";
import {createAction} from "../utils/index";

function AlterOrganizationDetail(props) {

  function handleSubmit(values) {
    props.dispatch(createAction('alterOrganization/updataOrganization')({values}))
  }

  return (
    <div className={styles.normal}>

      <TopTitle title={'修改本单位信息'}/>

      <ManagerCityForm
        handleSubmit={handleSubmit}
        handleCancel={()=>{}}
        formData={props.formData}
        showFooterButton={true}
        initialValue={props.orgDetail}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.alterOrganization};
}

export default connect(mapStateToProps)(AlterOrganizationDetail);
