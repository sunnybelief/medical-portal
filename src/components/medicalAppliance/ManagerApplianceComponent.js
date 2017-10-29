import React from 'react';
import styles from './ManagerApplianceComponent.css';
import {Form} from "antd";

function ManagerApplianceComponent(props) {
  return (
    <div className={styles.normal}>
      <div className={styles.topContainer}>
        <text>{props.title}</text>
        <div className={styles.line}/>
      </div>

    </div>
  );
}

export default Form.create()(ManagerApplianceComponent);
