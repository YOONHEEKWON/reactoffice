import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Crypto from 'crypto-js';
import EmailForm from 'core/constants/InvitationMail';
import Button from 'core/ui/Button';
import Dialog from 'core/ui/Dialog';
import InputBox from 'core/ui/InputBox';
import Tooltip from 'core/ui/Tooltip';
import Validator from 'core/utils/Validator';
import validatorFormat from 'ai/constants/ValidatorFormat';
import './styles.scss';

export default class AddPartnerModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        companyName: null,
        email: null,
      },
      validationSucceed: false,
      companyNameChecked: false,
      companyNameInvalid: false,
    };

    this.validator = new Validator(validatorFormat.user.addPartner);
  }

  handleClickButton = (action/*, index*/) => {
    if (action === 'submit') {
      this.validator
        .validateAll({
          ...this.state.formData,
          companyNameChecked: this.state.companyNameChecked,
        })
        .then(({ isSuccess }) => {
          if (isSuccess) {
            const origForm = {
              companyName: this.props.loginCompanyName,
            };

            // Encryption by AES with crypto key
            const cryptedText = encodeURIComponent(
              Crypto.AES.encrypt(JSON.stringify(origForm), EmailForm.cryptoKey),
            );

            // TODO 로그인하는 사람 이메일 정보 필요함
            const mailData = [
              {
                from: `${this.props.loginUserName} <s2@adwitt.com>`,
                to: `<${this.state.formData.email}>`,
                body: '',
                subject: `${this.props.loginCompanyName} has invited you to work on the Adwitt Platform.`,
                templateBody: 'You’ve been invited to Adwitt!<br/>Please complete sign-up process by clicking “Get Started” button.',
                buttonLink: `${EmailForm.url.toSignUp}/${cryptedText}`,
                buttonLinkImage: EmailForm.button.started,
              },
            ];

            this.props.addPartner(this.state.formData)
              .then((res) => {
                if (res.hasValidError) {
                  alert(res.validMessage);
                } else {
                  // Success add partner
                  // partner list 호출
                  this.props.getUserListForAdwittMaster();

                  // Send mail
                  this.props.sendInvitationMail(mailData)
                    .then((res) => {
                      if (res.hasValidError) {
                        alert(res.validMessage);
                      } else {
                        // Success send mail
                        alert('Invitation has been sent!');
                        this.props.onClickButton();
                      }
                    })
                    .catch((/*err*/) => alert('An error occurred. Please try again.'));
                }
              });
          } else {
            this.setState({ validationSucceed: false });
          }
        });
    } else if (action === 'cancel') {
      this.props.onClickButton();
    }
  };

  onChangeText = (field) => (e) => {
    this.validator.clearError(field);
    this.validator.validate(field, e.target.value);

    if (field === 'companyName') {
      this.validator.clearError('companyNameChecked');
      this.setState({
        companyNameChecked: false
      });
    }

    this.setState({
      formData: {
        ...this.state.formData,
        [ field ]: e.target.value,
      },
    });
  };

  // 회사 이름 중복 확인
  onClickCompanyNameCheck = () => {
    this.validator.clearError('companyName');
    this.validator.validate('companyName', this.state.formData.companyName)
      .then(({ isSuccess }) => {
        if (isSuccess) {
          this.validator.clearError('companyNameChecked');
          this.props.checkPartnerCompany([ { companyName: this.state.formData.companyName } ])
            .then((res) => {
              if (res.data) {
                const result = res.data.data[ 0 ];
                if (result === 'true') {
                  // 회사이름이 존재할 경우
                  this.setState({ companyNameInvalid: true });
                } else {
                  // 회사이름이 존재하지 않을 경우
                  this.setState({ companyNameChecked: true });
                }
              }
            });
        } else {
          this.setState({ validationSucceed: false });
        }
      });
  };

  render() {
    return (
      <Dialog
        title="Add Partner"
        width="700"
        modalClass="add-partner"
        onClick={this.handleClickButton}
      >
        <p className="add-partner__row">
          <label>
            <strong className="add-partner__header fs-13">Company Name</strong>
            <Tooltip
              placement="top"
              visible={this.validator.hasError('companyName')}
              overlay={<span>{this.validator.getError('companyName')}</span>}
            >
              <InputBox
                value={this.state.formData.companyName}
                placeholder="Enter a company name"
                invalidated={this.validator.hasError('companyName')}
                style={{ width: '300px' }}
                onChange={this.onChangeText('companyName')}
              />
            </Tooltip>
          </label>

          <Tooltip
            placement="right"
            trigger="click"
            visible={this.validator.hasError('companyNameChecked')}
            overlay={<span>{this.validator.getError('companyNameChecked')}</span>}
          >
            <Button.Flat
              label="Check"
              description="Check Company Name is exist"
              className={classNames('medium', {
                primary: this.validator.hasError('companyNameChecked'),
              })}
              style={{ marginLeft: '10px' }}
              onClick={this.onClickCompanyNameCheck}
            />
          </Tooltip>

          <span className="add-partner__check-result" style={{ marginLeft: '10px' }}>
            {this.state.companyNameChecked ?
              <strong aria-label="Company name" style={{ color: '#3a5897' }}>* checked</strong>
              : null
            }
            {this.state.companyNameInvalid ?
              <strong aria-label="Company name" style={{ color: '#ff8a2f' }}>* invalid</strong>
              : null
            }
          </span>
        </p>
        <p className="add-partner__row">
          <label>
            <strong className="add-partner__header fs-13">E-mail</strong>
            <Tooltip
              placement="bottom"
              visible={this.validator.hasError('email')}
              overlay={<span>{this.validator.getError('email')}</span>}
            >
              <InputBox
                value={this.state.formData.email}
                placeholder="Adwitt invitation is sent to this E-mail."
                invalidated={this.validator.hasError('email')}
                style={{ width: '300px' }}
                onChange={this.onChangeText('email')}
              />
            </Tooltip>
          </label>
        </p>
      </Dialog>
    );
  }
}

AddPartnerModal.propTypes = {
  loginUserName: PropTypes.string,
  loginCompanyName: PropTypes.string,
  onClickButton: PropTypes.func.isRequired,
  checkPartnerCompany: PropTypes.func.isRequired,
  addPartner: PropTypes.func.isRequired,
  getUserListForAdwittMaster: PropTypes.func.isRequired,
  sendInvitationMail: PropTypes.func.isRequired,
};

AddPartnerModal.defaultProps = {
  loginCompanyName: EmailForm.defaultCompany,
  onClickButton: () => console.warn('Function "onClickButton" not defined'),
};
