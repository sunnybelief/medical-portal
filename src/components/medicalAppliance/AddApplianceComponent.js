import React from 'react';
import styles from './AddApplianceComponent.css';
import {DatePicker, Button, Form, Input, Cascader,} from "antd";
import PropTypes from 'prop-types'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 9},
  wrapperCol: {span: 8}
};

function AddApplianceComponent(props) {

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.handleSubmit(values)
      }
    });
  }

  function setFormItem(item, index) {
    let rules = [
      {required: item.required, message: ` `},
    ]
    item.type === 'email' ? rules.push({type: 'email', message: ' '}) : null

    return (
      <FormItem key={index} style={{width: '45%', marginBottom: 5}} label={item.label} labelCol={{span: 6, offset: 3}}
                wrapperCol={{span: 15}}>
        {
          item.type === 'DatePicker' ?
            getFieldDecorator(item.fieldName, {rules})
            (
              <DatePicker/>
            )
            :
            item.type === 'select' ?
              getFieldDecorator(item.fieldName, {rules})
              (
                <Cascader options={props.category}/>
              )
              :
              getFieldDecorator(item.fieldName, {rules})
              (
                <Input placeholder={`请输入${item.label}`}/>
              )
        }
      </FormItem>
    );
  }

  const {getFieldDecorator} = props.form;

  return (
    <div className={styles.normal}>
      <div className={styles.topContainer}>
        <text>添加医疗器械</text>
        <div className={styles.line}/>
      </div>

      <div>
        <Form layout="inline" onSubmit={handleSubmit}>
          <div className={styles.partTitle}>
            <text>机械基本信息</text>
          </div>

          <div>
            {props.data1.map(setFormItem)}
          </div>

          <div style={{marginTop: 10}} className={styles.topContainer}>
            <div className={styles.line} style={{backgroundColor: '#EEEEEE'}}/>
          </div>

          <div className={styles.partTitle}>
            <text>机械基本信息</text>
          </div>

          <div>
            {props.data2.map(setFormItem)}
          </div>
          <FormItem style={{width: '100%'}} label='使用方法和备注' labelCol={{span: 4}} wrapperCol={{span: 16}}>
            {
              getFieldDecorator('extraInfo',)
              (
                <Input.TextArea style={{height: 100}}/>
              )
            }
          </FormItem>
          <FormItem className={styles.itemBtm} wrapperCol={{span: 6, offset: 9}}>
            <Button className={styles.btmBtn} htmlType="submit">提交</Button>
          </FormItem>

        </Form>

      </div>

    </div>
  );
}

AddApplianceComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  category: PropTypes.array.isRequired
}

export default Form.create()(AddApplianceComponent);
