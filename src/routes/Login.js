import React from 'react';
import { connect } from 'dva';
import styles from './Login.css';
import LoginForm from "../components/login/LoginForm";
import {createAction} from "../utils/index";

function Login(props) {
  function onLoginClick(values) {
    props.dispatch(createAction('login/login')({...values}))
  }

  return (
    <div className={styles.normal}>
      <LoginForm
        handleSubmit={onLoginClick}
        loading={props.loading}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.login,loading: state.loading.models.login};
}

export default connect(mapStateToProps)(Login);
