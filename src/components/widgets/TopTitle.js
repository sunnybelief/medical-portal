import React from 'react';
import styles from './TopTitle.css';
import PropTypes from 'prop-types'

function TopTitle(props) {
  return (
    <div className={styles.topContainer}>
      <text>{props.title}</text>
      <div className={styles.line}/>
    </div>
  );
}
TopTitle.propTypes={
 title:PropTypes.string.isRequired
}

export default TopTitle;
