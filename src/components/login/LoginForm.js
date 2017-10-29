import React from 'react';
import styles from './LoginForm.css';
import {Button, Card, Form, Icon, Input} from "antd";
import PropType from 'prop-types';
const FormItem =Form.Item;

function LoginForm(props) {
  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.handleSubmit(values)
      }
    });
  }
  const {getFieldDecorator} = props.form;
  return (
    <Card title="请使用工号登录" bordered={false} className={styles.card}>
      <Form onSubmit={handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{required: true, message: '请输入工号'}],
          })(
            <Input className={styles.formInput} prefix={<Icon type="user" style={{fontSize: 13}}/>}
                   placeholder="请输入工号"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{required: true, message: '请输入密码'}],
          })(
            <Input className={styles.formInput} prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                   placeholder="请输入密码"/>
          )}
        </FormItem>
        <FormItem>
          <Button className={styles.formBtn} type="primary" loading={props.loading} htmlType="submit">
            登录
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
}
LoginForm.propTypes={
  handleSubmit:PropType.func.isRequired,
  loading:PropType.bool
}
LoginForm.defaultProps={

}

export default Form.create()(LoginForm);
