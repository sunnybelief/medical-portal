import React from 'react';
import {connect} from 'dva';
import styles from './Users.css';
import MainContainer from "../components/main/MainContainer";
import UserComponent from "../components/user/UserComponent";
import Main from "./Main";

function Users() {
  return (
    <UserComponent/>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Users);
