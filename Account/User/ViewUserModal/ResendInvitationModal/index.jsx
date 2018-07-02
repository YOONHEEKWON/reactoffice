import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Crypto from 'crypto-js';
import EmailForm from 'core/constants/InvitationMail';
import Dialog from 'core/ui/Dialog';
import InputBox from 'core/ui/InputBox';

class ResendInvitationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.userEmail,
    };
  }

  handleClickButton = (action) => {
    if (action === 'submit') {

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
          to: `${this.state.email}`,
          body: '',
          subject: `${this.props.loginCompanyName} has invited you to work on the Adwitt Platform.`,
          templateBody: 'You’ve been invited to Adwitt!<br/>Please complete sign-up process by clicking “Get Started” button.',
          buttonLink: `${EmailForm.url.toSignUp}/${cryptedText}`,
          buttonLinkImage: EmailForm.button.started,
        },
      ];

      this.props.sendInvitationMail(mailData)
        .then((res) => {

          if (res.hasValidError) {
            alert(res.validMessage);

          } else {
            // Success send mail

            //alert('Invitation has been sent!');
            alert('Complete sending invitation!');
            this.props.onClickButton();
          }
        })
        .catch(() => {
          alert('An error occurred. Please try again.');
        });
    } else if (action === 'cancel') {
      this.props.onClickButton();
    }
  };

  onChangeText = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  render() {
    return (
      <Dialog
        title="Resend Invitation"
        width="700"
        modalClass="resend-invitation"
        onClick={this.handleClickButton}
      >
        <form>
          <label>
            <span
              className="inline-block"
              style={{
                width: '158px',
                fontWeight: '400',
                verticalAlign: 'middle',
              }}>E-mail</span>
            <InputBox
              type="email"
              value={this.state.email}
              onChange={this.onChangeText}
              style={{ width: '300px' }}/>
          </label>
        </form>
      </Dialog>
    );
  }
}

ResendInvitationModal.propTypes = {
  loginUserName: PropTypes.string,
  loginCompanyName: PropTypes.string,
  userEmail: PropTypes.string,
  onClickButton: PropTypes.func,
  sendInvitationMail: PropTypes.func.isRequired,
};

ResendInvitationModal.defaultProps = {
  userEmail: 'test@mail.com',
  loginUserName: 'Wisebirds',
  loginCompanyName: EmailForm.defaultCompany,
};

function mapStateToProps(state) {
  return {
    loginUserName: state.login.webToken.userName,
    loginCompanyName: state.login.webToken.companyName,
  };
}

export default connect(
  mapStateToProps,
  {},
)(ResendInvitationModal);
