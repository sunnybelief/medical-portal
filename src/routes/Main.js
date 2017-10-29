import React from 'react';
import {connect} from 'dva';
import styles from './Main.css';
import MainContainer from '../components/main/MainContainer';
import UserComponent from "../components/user/UserComponent";

function Main(props) {
  return (
    <div className={styles.normal}>
      <MainContainer {...props}>
        {props.children}
      </MainContainer>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.main};
}

export default connect(mapStateToProps)(Main);
