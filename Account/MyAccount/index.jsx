import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ROOT, EMPLOYEE } from 'ai/constants/Role';
import { PENDING_REVIEW, DISAPPROVED, APPROVED } from 'ai/constants/UserStatus';
import { throwIfError } from 'ai/utils/Error';
import { changePassword, getUserInfo, updateUserInfo, resubmit, updateEmailNotiForUser, getDisapprovedReason } from './action';
import Button from 'core/ui/Button';
import ChangePasswordModal from 'ai/pages/Account/MyAccount/ChangePasswordModal';
import CheckBox from 'core/ui/CheckBox';
import Content from 'core/ui/Content';
import Header from 'ai/ui/Header';
import Icon from 'core/ui/Icon';
import InputBox from 'core/ui/InputBox';
import './styles.scss';

const YES = 'Y';
const NO = 'N';

class MyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowModal: false,
      editMode: {
        userInfo: false,
        emailNoti: false,
      },
      userData: {
        name: null,
        email: null,
        mobilePhoneNumber: null,
      },
      notiData: {
        notificationSetting: null,
      },
      disapprovedReason: null,
    };
  }

  componentDidMount() {
    const { getUserInfo, getDisapprovedReason, userId } = this.props;
    getUserInfo(userId);
    getDisapprovedReason(userId)
      .then((histories) => this.setState({
        disapprovedReason: histories
          .reverse()
          .find((history) => history.status === DISAPPROVED),
      }));
    // test 호출
    //this.props.updateUserInfo({
    //  'email': 'qkrwjdgus@adwitt.com',
    //  'mobilePhoneNumber': '010-1111-4444',
    //  'name': '애드윗_박',
    //});
    // this.props.resubmit(this.props.userId, {
    //     "comments": "안녕하세요. 저는 강상규입니다. my account 페이지의 resubmit 기능을 확인하기위해 호출합니다.",
    //     //"status": PENDING_REVIEW
    //     //"status": DISAPPROVED
    //     "status": APPROVED
    // });
    // this.props.updateEmailNotiForUser({
    //   "email": "2014@adwitt.com",
    //   "mobilePhoneNumber": "010-3080-8802",
    //   "name": "test_ksg"
    // });
    // test 호출
  }

  componentWillReceiveProps(nextProps) {
    const { userInfo } = nextProps;
    if (this.props.userInfo !== userInfo) {
      this.resetUserData(userInfo);
      this.resetNotiData(userInfo);
    }
  }

  resetUserData = (userInfo) => {
    this.setState({
      userData: {
        name: userInfo.name,
        email: userInfo.email,
        mobilePhoneNumber: userInfo.mobilePhoneNumber,
      },
    });
  };

  resetNotiData = (userInfo) => {
    this.setState({
      notiData: {
        notificationSetting: userInfo.notificationSetting,
      },
    });
  };

  onClickShowModal = (e) => {
    e.preventDefault();

    this.setState({
      isShowModal: true,
    });
  };

  onClickCloseModal = () => {
    this.setState({
      isShowModal: false,
    });
  };

  toggleEdit = (type) => () => {
    this.setState({
      editMode: {
        ...this.state.editMode,
        [ type ]: !this.state.editMode[ type ],
      },
    });

    if (type === 'userInfo' && !this.state.editMode.userInfo) {
      this.resetUserData(this.props.userInfo);
    }

    if (type === 'emailNoti') {
      this.resetNotiData(this.props.userInfo);
    }
  };

  editUserInfo = () => {
    const { updateUserInfo } = this.props;
    const { userData } = this.state;
    updateUserInfo(userData)
      .then(this.toggleEdit('userInfo'));
  };

  resubmit = () => {
    this.props
      .resubmit(this.props.userId, {
        comments: 'my account 페이지의 resubmit 호출',
        status: PENDING_REVIEW,
      })
      .then(throwIfError)
      .then(() => this.props.getUserInfo(this.props.userId));
  };

  handleChangeInput = (type) => (e) => {
    this.setState({
      userData: {
        ...this.state.userData,
        [ type ]: e.target.value.trim(),
      },
    });
  };

  handleChangeCheckBox = (type) => () => {
    const { notiData } = this.state;
    this.setState({
      notiData: {
        ...notiData,
        [ type ]: notiData[ type ] === YES ? NO : YES,
      },
    });
  };

  changeNoti = () => {
    this.props
      .updateEmailNotiForUser(this.state.notiData)
      .then(this.toggleEdit('emailNoti'));
  };

  renderInfoText = () => {
    const { authority, userInfo } = this.props;
    const { disapprovedReason } = this.state;

    if (authority !== ROOT) {
      switch (userInfo.approvalStatus) {
        case PENDING_REVIEW:
          return (
            <div style={{ marginBottom: 15 }}>
              <p className="text-info">
                We are reviewing your account approval request. You can only use Account > My Account, Ad Account. Once
                your account is approved, we will send you an email.
              </p>
            </div>
          );
        case DISAPPROVED:
          return (
            <div style={{ marginBottom: 15 }}>
              <p className="fs-13">
                <Icon type="exclamation-triangle" style={{ marginRight: 5, color: '#ff8a2f' }}/>
                Your account approval request has been disapproved. {disapprovedReason ? `“(${ disapprovedReason.comment})”` : null}
                <Button.Flat
                  label="Resubmit"
                  className="small-15"
                  onClick={this.resubmit}
                  primary
                  style={{ marginLeft: 10 }}/>
              </p>
            </div>
          );
        default:
          break;
      }
    }
    return null;
  };

  renderEmailNoti = () => {
    const { userInfo, authority } = this.props;
    const { editMode, notiData } = this.state;

    if (authority === EMPLOYEE || userInfo.approvalStatus !== APPROVED) {
      return null;
    }

    return (
      <div>
        <Content.Section
          title="E-mail Notification Setting"
          component={!editMode.emailNoti ? //
            <button style={{ position: 'absolute', top: 8, left: 225 }} onClick={this.toggleEdit('emailNoti')}>
              <Icon type="pencil"/>
            </button>
            : //
            <span style={{ position: 'absolute', right: 10, top: -2 }}>
              <Button.Flat className="small fixed" style={{ width: '54px' }} primary onClick={this.changeNoti}>OK</Button.Flat>
              <Button.Flat className="small fixed" style={{ width: '54px' }} secondary onClick={this.toggleEdit('emailNoti')}>Cancel</Button.Flat>
            </span>
          }
          medium
          secondary={!editMode.emailNoti}/>
        <div>
          <Content.Item>
            <CheckBox
              label="Notify me once every new account approval request"
              checked={notiData.notificationSetting === YES}
              disabled={!editMode.emailNoti}
              onChange={this.handleChangeCheckBox('notificationSetting')}/>
          </Content.Item>
        </div>
      </div>
    );
  };

  render() {
    const { userId, authority, userInfo } = this.props;
    const { editMode, isShowModal, userData } = this.state;
    return (
      <div className="page-myaccount fs-12">
        <Header name="myAccount"/>

        <Content.Card>
          {this.renderInfoText()}

          <Content.Section title="Login Info" medium secondary className="mgt0"/>
          <div>
            <Content.Item title="ID" titleWidth={178} titleClassName="fs-13">{userId}</Content.Item>
            <Content.Item title="Password" titleWidth={178} titleClassName="fs-13">
              <p>******</p>
              <Button.Flat
                label="Change Password"
                className="medium"
                style={{ marginTop: '20px' }}
                onClick={this.onClickShowModal}
              />
            </Content.Item>
          </div>

          {authority === ROOT ?
            null :
            <div>
              <Content.Section
                title="User Info"
                component={!editMode.userInfo ? //
                  <button style={{ position: 'absolute', top: 8, left: 100 }} onClick={this.toggleEdit('userInfo')}>
                    <Icon type="pencil"/>
                  </button>
                  : //
                  <span style={{ position: 'absolute', right: 10, top: -2 }}>
                    <Button.Flat
                      primary
                      className="small fixed"
                      style={{ width: '54px' }}
                      onClick={this.editUserInfo}>OK</Button.Flat>
                    <Button.Flat
                      secondary
                      className="small fixed"
                      style={{ width: '54px' }}
                      onClick={this.toggleEdit('userInfo')}>Cancel</Button.Flat>
                  </span>
                }
                medium
                secondary={!editMode.userInfo}/>
              <div>
                <Content.Item title="Name" titleWidth={178} titleClassName="fs-13">
                  {editMode.userInfo ? //
                    <InputBox style={{ width: '450px' }} onChange={this.handleChangeInput('name')} value={userData.name}/> //
                    : //
                    <span>{userInfo.name}</span>
                  }
                </Content.Item>
                <Content.Item title="E-mail" titleWidth={178} titleClassName="fs-13">
                  {editMode.userInfo ? //
                    <InputBox style={{ width: '450px' }} onChange={this.handleChangeInput('email')} value={userData.email}/> //
                    : //
                    <span>{userInfo.email}</span>
                  }
                </Content.Item>
                <Content.Item title="Mobile Phone Number" titleWidth={178} titleClassName="fs-13">
                  {editMode.userInfo ? //
                    <InputBox style={{ width: '450px' }} onChange={this.handleChangeInput('mobilePhoneNumber')} value={userData.mobilePhoneNumber}/> //
                    : //
                    <span>{userInfo.mobilePhoneNumber}</span>
                  }
                </Content.Item>
                <Content.Item title="Company Name" titleWidth={178} titleClassName="fs-13">{userInfo.companyName}</Content.Item>
                <Content.Item title="Role" titleWidth={178} titleClassName="fs-13">{userInfo.userRole}</Content.Item>
              </div>

              {this.renderEmailNoti()}

            </div>
          }

        </Content.Card>

        {isShowModal ? <ChangePasswordModal onChangePassword={this.props.changePassword} onClose={this.onClickCloseModal}/>
          : null
        }
      </div>
    );
  }
}

MyAccount.propTypes = {
  userId: PropTypes.string.isRequired,
  authority: PropTypes.string.isRequired,
  userInfo: PropTypes.object.isRequired,

  changePassword: PropTypes.func.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  resubmit: PropTypes.func.isRequired,
  updateEmailNotiForUser: PropTypes.func.isRequired,
  getDisapprovedReason: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    userId: state.login.webToken.userId,
    authority: state.login.webToken.authorities ? state.login.webToken.authorities[ 0 ].authority : '',
    userInfo: state.myAccount.userInfo,
  };
}

export default connect(
  mapStateToProps,
  {
    changePassword,
    getUserInfo,
    updateUserInfo,
    resubmit,
    updateEmailNotiForUser,
    getDisapprovedReason,
  },
)(MyAccount);
