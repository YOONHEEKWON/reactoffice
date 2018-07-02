import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EmailForm from 'core/constants/InvitationMail';
import Content from 'core/ui/Content';
import Dialog from 'core/ui/Dialog';

export default class DisapproveCommentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: '',
    };
  }

  handleClickButton = (action/*, index*/) => {
    switch (action) {
      case 'submit': {
        const changedValue = [
          {
            accessAuth: this.props.userAccess,
            comments: this.state.comments,
            role: this.props.userRole,
            status: 'DISAPPROVED',
          },
        ];

        const approvedMailData = [
          {
            from: `${this.props.loginUserName} <s2@adwitt.com>`,
            to: `${this.props.userInfo.email}`,
            body: '',
            subject: '[Adwitt] Your Adwitt account has been disapproved.',
            templateBody: `${this.props.userInfo.name}, your account ‘${this.props.userInfo.id}’ has been disapproved. Please refer to admin’s message below. “${this.state.comments}”`,
            // 로그인 후 my account 페이지로 이동해야함.
            buttonLink: `${EmailForm.url.toLogin}`,
            buttonLinkImage: EmailForm.button.go,
          },
        ];

        this.props.updateUserStatus(this.props.userId, changedValue)
          .then((res) => {
            if (res.data) {
              const result = res.data.message;
              if (result === 'Success') {
                this.props.onClose();

                // 바뀐 user 정보를 다시 조회한다.
                this.props.getUserInfo(this.props.userId);

                // 바뀐 history를 다시 조회한다.
                this.props.getUserHistory(this.props.userId);

                // 메일을 보낸다.
                this.props.sendInvitationMail(approvedMailData);
              }
            }
          });
        break;
      }
      case 'cancel':
        this.props.onClose();
        break;

      default:
        break;
    }
  };

  onChangeText = (type) => (e) => {
    this.setState({
      [`${type}`]: e.target.value,
    });
  };

  render() {
    return (
      <Dialog
        title="Disapprove User Account"
        width="700"
        modalClass="disapprove-user-account"
        onClick={this.handleClickButton}
      >
        <Content.Section title="Comment" medium secondary/>
        <form>
          <textarea name="" id="" cols="30" rows="10" style={{ height: '150px', marginTop: '10px' }} onChange={this.onChangeText('comments')}/>
        </form>
      </Dialog>
    );
  }
}

DisapproveCommentModal.propTypes = {
  loginUserName: PropTypes.string,
  userId: PropTypes.string,
  userRole: PropTypes.string,
  userAccess: PropTypes.string,
  userHistory: PropTypes.array,
  userInfo: PropTypes.object,

  getUserInfo: PropTypes.func,
  getUserHistory: PropTypes.func,
  onClose: PropTypes.func,
  updateUserStatus: PropTypes.func,
  sendInvitationMail: PropTypes.func,
};

DisapproveCommentModal.defaultProps = {
  onClose: () => console.warn('Function "onClose" not defined'),
};
