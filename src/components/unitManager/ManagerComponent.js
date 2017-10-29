import React from 'react';
import styles from './ManagerComponent.css';
import {Modal,Popconfirm,Table, Button, Form, Input, Radio, Cascader} from "antd";
import {createAction} from "../../utils/index";
import {addressCity, alterMonitor, hospitalDegree} from "../../common/Constants";
import ManagerCityForm from "../widgets/ManagerCityForm";

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

function ManagerComponent(props) {

  const {getFieldDecorator} = props.form;

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
  };

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      values.isActive === 0 ? delete values.isActive : null
      console.log('values:' + JSON.stringify(values))
      if (!err) {
        props.dispatch(createAction('manager/getData')({values}))
      }
    });
  }

  let columns = JSON.parse(JSON.stringify(props.columns));
  columns.push(
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => {
              props.dispatch(createAction('manager/onTableItemSelect')({key:record.key}))
            }}>查看/编辑</a>
            <Popconfirm title={`确认${record.isActive === '启用' ? '停用' : '启用'}?`} onConfirm={()=>{onTableItemStartOrStop(record)}} okText="确认" cancelText="取消">
              <a style={{marginLeft: 10}} > {record.isActive === '启用' ? '停用' : '启用'}</a>
            </Popconfirm>
          </div>
        );
      }
    }
  )

  function onTableItemStartOrStop(record) {
    console.log('record:'+JSON.stringify(record));
    let isActive=record.isActive==='启用'? 'N':'Y';
    props.dispatch(createAction('manager/stopOrStart')({id:record.id,isActive,key:record.key}))
  }

  function onModalOk(values) {
    props.dispatch(createAction('manager/updateData')({data:values,id:props.selectedData.id}))
  }

  function onModalCancel() {
    props.dispatch(createAction('manager/setAlterVisible')({alterVisible:false}))
  }

  function renderAlterModel() {
    const formItemLayout={
      labelCol: {span: 6},
      wrapperCol: {span: 16}
    }
    return(
      <div className={styles.modelContainer}>
        <ManagerCityForm
          handleCancel={onModalCancel}
          handleSubmit={onModalOk}
          formData={alterMonitor}
          formItemLayout={formItemLayout}
          initialValue={props.selectedData}
          showFooterButton={true}
        />
      </div>
    )
  }

  return (
    <div className={styles.normal}>
      <div className={styles.topContainer}>
        <text>{props.title}</text>
        <div className={styles.line}/>
      </div>

      <div className={styles.contentContainer}>
        <Form layout="inline" onSubmit={handleSubmit}>
          <div>
            <FormItem style={{width: '45%', marginBottom: 5}} label="机构名称" labelCol={{span: 5, offset: 2}}
                      wrapperCol={{span: 16}}>
              {
                getFieldDecorator('orgName')(<Input/>)
              }
            </FormItem>
            <FormItem style={{width: '45%'}} label="医院级别" labelCol={{span: 5}} wrapperCol={{span: 16}}>
              {
                getFieldDecorator('hospitalDegree')(
                  <Cascader options={hospitalDegree}/>
                )
              }
            </FormItem>
            <FormItem style={{width: '45%', marginBottom: 5}} label="所属地区" labelCol={{span: 5, offset: 2}}
                      wrapperCol={{span: 16}}>
              {
                getFieldDecorator('addressCity')(
                  <Cascader options={addressCity}/>
                )
              }
            </FormItem>
            <FormItem style={{width: '45%'}} label="启用状态" labelCol={{span: 5}} wrapperCol={{span: 16}}>
              {
                getFieldDecorator('isActive', {initialValue: 0})(
                  <RadioGroup>
                    <Radio value={0}>全部</Radio>
                    <Radio value={1}>启用</Radio>
                    <Radio value={2}>停用</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem style={{width: '45%', marginBottom: 5}} label="上级机构" labelCol={{span: 5, offset: 2}}
                      wrapperCol={{span: 16}}>
              {
                getFieldDecorator('higherOrgName')(<Input/>)
              }
            </FormItem>
            <FormItem style={{width: '50%'}} wrapperCol={{offset: 1}} labelCol={{span: 24}}>
              <Button style={{backgroundColor: '#3459A3', color: '#ffffff'}} htmlType="submit">查询</Button>
              <Button style={{marginLeft: 20}}>取消</Button>
              <Button style={{marginLeft: 20}}>导出excel</Button>
            </FormItem>
          </div>
        </Form>
      </div>

      <div className={styles.tableContainer}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={props.tableData}
          bordered
        />

        <Modal
          key={props.selectedKey}
          title="修改器械使用单位信息"
          visible={props.alterVisible}
          onOk={onModalOk}
          // confirmLoading={props.alterLoading}
          onCancel={onModalCancel}
          closable={false}
          maskClosable={false}
          footer={null}
        >
          {renderAlterModel()}
        </Modal>

      </div>

    </div>
  );
}

export default Form.create()(ManagerComponent);
