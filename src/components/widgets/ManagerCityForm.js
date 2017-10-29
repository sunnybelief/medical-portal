/**
 * Created by wangzhen on 2017/9/8.
 */
import React from 'react';
import styles from './ManagerCityForm.css';
import {Button, Cascader, Form, Input, Radio} from "antd";
import * as Constants from "../../common/Constants";
import PropTypes from 'prop-types';

const FormItem = Form.Item

class ManagerCityForm extends React.Component {
  static propTypes = {
    formData: PropTypes.array.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    showFooterButton: PropTypes.bool,
    formItemLayout: PropTypes.object,
    initialValue: PropTypes.object,
  }
  static defaultProps = {
    showFooterButton: false,
    formItemLayout: {
      labelCol: {span: 9},
      wrapperCol: {span: 8}
    }
  }

  // 构造
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setValue = this.setValue.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values)
      }
    });
  }

  setValue() {
    this.props.form.setFields({
      orgName: {value: this.props.initialValue.orgName},
      orgLevel: {value: this.props.initialValue.orgLevel === 'PROVINCE' ? '省' : this.props.initialValue.orgLevel === 'CITY' ? '市' : '医院'},
      addressCity: {value: this.props.initialValue.addressCity},
      higherOrgName: {value: this.props.initialValue.higherOrgName},
      postalCode: {value: this.props.initialValue.postalCode},
      email: {value: this.props.initialValue.email},
      contacts: {value: this.props.initialValue.contacts},
      phoneNumber: {value: this.props.initialValue.phoneNumber},
      fax: {value: this.props.initialValue.fax},
      address: {value: this.props.initialValue.address},
    })
  }

  componentDidMount() {
    this.props.initialValue ?
      this.setValue() : null
  }

  componentDidUpdate(nextProps) {
   if(nextProps.initialValue!==this.props.initialValue) {
      this.setValue()
   }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={styles.formContainer}>
        <Form onSubmit={this.handleSubmit}>
          {
            this.props.formData.map((item, index) => {
              let rules = [
                {required: item.required, message: `请输入${item.label}`},
              ]
              let content = {
                rules,
              }
              item.type === 'email' ? rules.push({type: 'email', message: '请输入正确的邮箱地址'}) : null
              item.type === 'radios' ? content.initialValue = 0 : null
              return (
                <FormItem key={index} className={styles.formItem}{...this.props.formItemLayout} label={item.label}>
                  {
                    getFieldDecorator(item.fieldName, content)
                    (
                      item.type === 'select' ?
                        <Cascader options={Constants[item.fieldName]}/>
                        :
                        item.type === 'radios' ?
                          <Radio.Group>
                            <Radio value={0}>市</Radio>
                          </Radio.Group>
                          :
                          < Input disabled={item.disabled} placeholder={`请输入${item.label}`}/>
                    )
                  }
                </FormItem>
              );
            })
          }
          {
            this.props.showFooterButton ?
              <FormItem style={{marginTop: 30}} className={styles.formItem} wrapperCol={{span: 24}}>
                <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                  <Button style={{backgroundColor: '#3459A3', color: '#ffffff'}} htmlType="submit">提交</Button>
                  <Button style={{marginLeft: 60}} onClick={() => {
                    this.props.handleCancel()
                  }}>取消</Button>
                </div>
              </FormItem>
              : null
          }
        </Form>
      </div>
    )
  }
}

export default Form.create()(ManagerCityForm);
