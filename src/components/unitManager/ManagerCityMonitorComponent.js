import React from 'react';
import styles from './ManagerCityMonitorComponent.css';
import {connect} from "dva";
import {Form, Modal, Table} from 'antd'
import {createAction} from "../../utils/index";
import ManagerCityForm from "../widgets/ManagerCityForm";
import {alterMonitor, registerMonitor} from "../../common/Constants";

class ManagerCityMonitorComponent extends React.Component{

  // 构造
    constructor(props) {
      super(props);
      this.handleAlterCancel=this.handleAlterCancel.bind(this)
      this.handleAlterOk=this.handleAlterOk.bind(this)
      this.renderAlterModel=this.renderAlterModel.bind(this)
    }

  renderAlterModel(){
    const formItemLayout={
      labelCol: {span: 6},
      wrapperCol: {span: 16}
    }
    return(
      <div className={styles.modelContainer}>
        <ManagerCityForm
          handleCancel={this.handleAlterCancel}
          handleSubmit={this.handleAlterOk}
          formData={alterMonitor}
          formItemLayout={formItemLayout}
          initialValue={this.props.selectedData}
          showFooterButton={true}
        />
      </div>
    )
  }

  handleAlterOk(values){
    this.props.dispatch(createAction('managerCity/updateData')({data:values,id:this.props.tableData[this.props.selectedKey].id}))
  }

  handleAlterCancel() {
    this.props.dispatch(createAction('managerCity/setAlterModelVisible')({alterVisible:false}))
  }

  render(){

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
      }),
    };

    let columns = JSON.parse(JSON.stringify(this.props.columns));
    columns.push(
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <a onClick={() => {
                this.props.dispatch(createAction('managerCity/onTableItemSelect')({key:record.key}))
              }}>查看/编辑</a>
            </div>
          );
        }
      }
    )

    return(
      <div className={styles.normal}>
        <div className={styles.topContainer}>
          <text>市级监测机构管理</text>
          <div className={styles.line}/>
        </div>
        <Table
          bordered
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={this.props.tableData}
        />
        <Modal
          key={this.props.selectedKey}
          title="修改监测机构信息"
          visible={this.props.alterVisible}
          onOk={this.handleAlterOk}
          confirmLoading={this.props.alterLoading}
          onCancel={this.handleAlterCancel}
          closable={false}
          maskClosable={false}
          footer={null}
        >
          {this.renderAlterModel()}
        </Modal>
      </div>
    )
  }
}



function mapStateToProps(state) {
  return {
    ...state.managerCity
  }
}

export default connect(mapStateToProps)(ManagerCityMonitorComponent);
