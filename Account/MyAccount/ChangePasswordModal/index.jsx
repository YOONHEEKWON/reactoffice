import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'core/ui/Dialog';
import InputBox from 'core/ui/InputBox';
import Tooltip from 'core/ui/Tooltip';
import Validator from 'core/utils/Validator';
import { PASSWORD_CHANGE_SUCCESS } from 'core/constants/ResponseStatus';
import validatorFormat from 'ai/constants/ValidatorFormat';

export default class ChangePasswordModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        password: '',
        newPassword: '',
        confirmPassword: '',
      },
      validationSuccess: true,
    };

    this.validator = new Validator(validatorFormat.myAccount.changePassword);
  }

  handleClickButton = (action/*, index*/) => {
    if (action === 'submit') {
      const { formData } = this.state;

      this.validator
        .validateAll({
          ...formData,
          isPasswordConfirmed: formData.newPassword === formData.confirmPassword,
        })
        .then(({ isSuccess }) => {
          this.setState({ validationSuccess: isSuccess });

          if (isSuccess) {
            const submitData = [
              {
                newPassword: this.state.formData.newPassword,
                password: this.state.formData.password,
              },
            ];
            this.props.onChangePassword(submitData)
              .then((res) => {
                alert(res.statusMessage);

                // success code
                if (res.statusCode === PASSWORD_CHANGE_SUCCESS) {
                  this.props.onClose();
                } else {
                  this.setState({
                    formData: {
                      password: '',
                      newPassword: '',
                      confirmPassword: '',
                    },
                  });
                }
              });
          }
        });
    } else {
      this.props.onClose();
    }
  };

  onChangeText = (field) => (e) => {
    this.validator.validate(field, e.target.value);
    this.setState({
      formData: {
        ...this.state.formData,
        [ field ]: e.target.value,
      },
    });
  };

  render() {
    return (
      <Dialog
        title="Change Password"
        onClick={this.handleClickButton}
      >
        <table>
          <colgroup>
            <col style={{ width: '160px' }}/>
            <col/>
          </colgroup>
          <tbody>
            <tr>
              <th style={{ fontWeight: '400', textAlign: 'left' }}>
                Current Password
              </th>
              <td>
                <Tooltip
                  placement="right"
                  visible={this.validator.hasError('password')}
                  overlay={<span>{this.validator.getError('password')}</span>}
                >
                  <InputBox
                    type="password"
                    name="password"
                    placeholder="Enter more than 6 characters."
                    value={this.state.formData.password}
                    invalidated={this.validator.hasError('password')}
                    style={{ width: '300px' }}
                    onChange={this.onChangeText('password')}
                  />
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th style={{ fontWeight: '400', textAlign: 'left' }}>
                New Password
              </th>
              <td style={{ padding: '10px 0' }}>
                <Tooltip
                  placement="right"
                  visible={this.validator.hasError('newPassword')}
                  overlay={<span>{this.validator.getError('newPassword')}</span>}
                >
                  <InputBox
                    type="password"
                    name="newPassword"
                    placeholder="Enter more than 6 characters."
                    value={this.state.formData.newPassword}
                    invalidated={this.validator.hasError('newPassword')}
                    style={{ width: '300px' }}
                    onChange={this.onChangeText('newPassword')}
                  />
                </Tooltip>
              </td>
            </tr>
            <tr>
              <th style={{ fontWeight: '400', textAlign: 'left' }}>
                Confirm New Password
              </th>
              <td>
                <Tooltip
                  placement="right"
                  visible={this.validator.hasError([ 'confirmPassword', 'isPasswordConfirmed' ])}
                  overlay={<span>{this.validator.getError([ 'confirmPassword', 'isPasswordConfirmed' ])}</span>}
                >
                  <InputBox
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter more than 6 characters."
                    value={this.state.formData.confirmPassword}
                    invalidated={this.validator.hasError('confirmPassword')}
                    style={{ width: '300px' }}
                    onChange={this.onChangeText('confirmPassword')}
                  />
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </Dialog>
    );
  }
}

ChangePasswordModal.propTypes = {
  onChangePassword: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
