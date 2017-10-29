import React from 'react';
import styles from './RegisterMachineComponent.css';
import {Button, Cascader, Form, Input} from "antd";
import * as Constants from "../../common/Constants";
import {createAction} from "../../utils/index";
import TopTitle from "../widgets/TopTitle";

const FormItem = Form.Item;

function RegisterMachineComponent(props) {

  const {getFieldDecorator} = props.form;
  const formItemLayout = {
    labelCol: {span: 9},
    wrapperCol: {span: 8}
  };

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.dispatch(createAction('registerMonitor/registerMonitor')({data:values,orgLevel:'HOSPITAL'}))
      }
    });
  }

  return (
    <div className={styles.normal}>

      <TopTitle
        title={'注册器械使用单位'}
      />

      <div className={styles.formContainer}>
        <Form onSubmit={handleSubmit}>
          {
            props.data.map((item, index) => {
              let rules=[
                {required: item.required, message: `请输入${item.label}`},
              ]
              item.type==='email'? rules.push({type: 'email', message: '请输入正确的邮箱地址'}):null
              return (
                <FormItem key={index} className={styles.formItem}{...formItemLayout} label={item.label}>
                  {
                    getFieldDecorator(item.fieldName, {rules})
                    (
                      item.type==='select'?
                        <Cascader options={Constants[item.fieldName]} />
                        :
                      <Input placeholder={`请输入${item.label}`}/>
                    )
                  }
                </FormItem>
              );
            })
          }

          <FormItem style={{marginTop: 30}} className={styles.formItem} wrapperCol={{span: 16, offset: 9}}>
            <Button style={{backgroundColor: '#3459A3', color: '#ffffff'}} htmlType="submit">提交</Button>
            <Button style={{marginLeft: 60}}>取消</Button>
          </FormItem>

        </Form>
      </div>
    </div>
  );
}

export default Form.create()(RegisterMachineComponent);
