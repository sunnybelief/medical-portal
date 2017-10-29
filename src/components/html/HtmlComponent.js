import React from 'react';
import styles from './HtmlComponent.css';
import Iframe from 'react-iframe'
import {connect} from "dva";

function HtmlComponent(props) {
  return (
    <div className={styles.normal}>
      <Iframe
        styles={{ minHeight:'100%',overflowY:'hidden'}}
        url={props.url}
        display="initial"
        position="relative"
        width="100%"
        height="100%"
        allowFullScreen
      />
    </div>
  );
}

function mapStateToProps(state) {
 return{
   ...state.html
 }
}
export default connect(mapStateToProps)(HtmlComponent);
