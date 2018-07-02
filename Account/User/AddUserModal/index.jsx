import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Crypto from 'crypto-js';
import EmailForm from 'core/constants/InvitationMail';
import Dialog from 'core/ui/Dialog';
import Icon from 'core/ui/Icon';
import Radio from 'core/ui/Radio';
import SelectBox from 'core/ui/SelectBox';
import Text from 'core/ui/Text';
import Tooltip from 'core/ui/Tooltip';
import InputBox from 'core/ui/InputBox/index';
import Validator from 'core/utils/Validator';
import validatorFormat from 'ai/constants/ValidatorFormat';
import './styles.scss';

export default class AddUserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isViewClicked: false,
      isShowUserInfoForm: false, // radio버튼을 선택할 때 컨텐츠 show/hide 용도
      isNewUser: false, // add user OK 버튼 눌렀을 때 어떤 정보를 보낼건지 구분 용도
      newUserEmail: '',
      newUserEmailOnly: '',
      existUserEmail: '',
      expanded: {}, // toggle
      placeholder: {},
      isChangedFbSelect: false, // 셀렉트박스 컨텐츠 선택했을 때 플레이스홀더 내용 구분 용도
      searchText: '',
      filteredData: [],
      validationSuccess: true,
    };

    this.validator = new Validator(validatorFormat.user.addUser);
  }

  componentWillMount() {
    if (this.props.linkedChannel.FB) {
      this.props.getFBBusinessManagerList();
    } else {
      // 새로운 사용자 이메일 입력을 기본값으로
      this.setState({
        isNewUser: true,
      });
    }
  }

  onChangeText = (field) => (e) => {
    this.validator.validate(field, e.target.value);
    this.setState({ [ field ]: e.target.value });
  };

  // radio button
  onChangeUserInfoRadio = (e) => {
    this.validator.clearError(); // 선택 변경시 밸리데이션 오류 모두 삭제

    switch (e.target.value) {
      case 'existing':
        this.setState({
          isShowUserInfoForm: false,
          isNewUser: false,
          validationSuccess: true,
        });
        break;
      case 'new':
        this.setState({
          isShowUserInfoForm: true,
          isNewUser: true,
          validationSuccess: true,
        });
        break;
      default:
        break;
    }
  };

  // Action: Add user
  submitAddUser = () => {
    const origForm = {
      companyName: this.props.loginCompanyName,
    };

    // Encryption by AES with crypto key
    const cryptedText = encodeURIComponent(
      Crypto.AES.encrypt(JSON.stringify(origForm), EmailForm.cryptoKey),
    );

    // 페이스북 토큰 연동 안된 add user 화면 input
    if (!this.props.linkedChannel.FB) {
      this.setState({ newUserEmail: this.state.newUserEmailOnly });
    }

    const addUserData = {
      companyId: this.props.companyId,
      email: this.state.isNewUser ? this.state.newUserEmail : this.state.existUserEmail,
    };

    // TODO 로그인하는 사람 이메일 정보 필요함
    const mailData = [
      {
        from: `${this.props.loginUserName} <s2@adwitt.com>`,
        to: `<${addUserData.email}>`,
        body: '',
        subject: `${this.props.loginCompanyName} has invited you to work on the Adwitt Platform.`,
        templateBody: 'You’ve been invited to Adwitt!<br/>Please complete sign-up process by clicking “Get Started” button.',
        buttonLink: `${EmailForm.url.toSignUp}/${cryptedText}`,
        buttonLinkImage: EmailForm.button.started,
      },
    ];

    this.props.addUser(addUserData)
      .then((res) => {
        // Email already exists
        if (res.hasValidError) {
          alert(res.validMessage);

        } else {
          // user list 호출
          this.props.getUserList();

          // 초대장 보내기
          this.props.sendInvitationMail(mailData)
            .then((res) => {
              if (res.hasValidError) {
                alert(res.validMessage);
              } else {
                // Success send mail
                alert('Invitation has been sent!');
                this.props.onClose();
              }
            })
            .catch((/*err*/) => alert('An error occurred. Please try again.'));
        }
      });
  };

  handleClick = (action/*, index*/) => {
    if (action === 'submit') {
      if (!this.state.isNewUser) {
        // FB business manager select에서 선택한 경우
        this.validator.validate('isChangedFbSelect', this.state.isChangedFbSelect)
          .then(({ isSuccess }) => {
            isSuccess && this.submitAddUser();
            this.setState({ validationSuccess: isSuccess });
          });
      } else if (this.props.linkedChannel.FB) {
        // 새로운 이메일을 직접 입력한 경우
        this.validator.validate('newUserEmail', this.state.newUserEmail)
          .then(({ isSuccess }) => {
            isSuccess && this.submitAddUser();
            this.setState({ validationSuccess: isSuccess });
          });
      } else {
        // 새로운 이메일을 직접 입력한 경우
        this.validator.validate('newUserEmailOnly', this.state.newUserEmailOnly)
          .then(({ isSuccess }) => {
            isSuccess && this.submitAddUser();
            this.setState({ validationSuccess: isSuccess });
          });
      }
    } else if (action === 'cancel') {
      this.props.onClose();
    }
  };

  onClickToggleFbList = (name) => () =>
    this.setState({
      expanded: {
        ...this.state.expanded,
        [ name ]: !this.state.expanded[ name ],
      },
    });

  onClickFbSelectContent = (e) => {
    if (e.target.className.match(/^fb-user-list__group/)) {
      // Group 클릭시 SelectBox 컨텐츠를 닫지 않게 한다.
      return true;
    } else {
      // Children 클릭시
      let name, email;
      if (e.target.tagName === 'LI') {
        name = e.target.querySelectorAll('.fb-user-list__name')[ 0 ].innerHTML;
        email = e.target.querySelectorAll('.fb-user-list__email')[ 0 ].innerHTML;

      } else if (e.target.tagName === 'SPAN' || e.target.tagName === 'I') {
        const children = e.target.parentNode;
        name = children.querySelectorAll('.fb-user-list__name')[ 0 ].innerHTML;
        email = children.querySelectorAll('.fb-user-list__email')[ 0 ].innerHTML;
      }

      this.setState({
        isChangedFbSelect: true,
        existUserEmail: email,
        placeholder: {
          name: name,
          email: email,
        },
      });

      return false;
    }
  };

  getFilteredData = () => {
    if (this.props.fbBusinessManagerList && this.props.fbBusinessManagerList.length) {
      const groupedData = this.props.fbBusinessManagerList;
      return groupedData.map(item => {
        return item.children.map(childItem => {
          const searchText = String(this.state.searchText).toLowerCase();
          return childItem[ 'filtered' ] = !(String(childItem.name).toLowerCase().includes(searchText) ||
            String(childItem.email).toLowerCase().includes(searchText)
          );
        });
      });
    }
    return [];
  };

  handleChangeSearchText = (e/*, type*/) =>
    this.setState({ searchText: e.target.value }, () => this.setState({ filteredData: this.getFilteredData() }));

  renderPlaceholder = () => {
    if (!this.state.isChangedFbSelect) {
      return 'Select a User';
    } else {
      return (
        <span className="clearfix">
          <span className="float-left" style={{ width: '27%' }}>{this.state.placeholder.name}</span>
          <span className="float-right" style={{ width: '73%' }}>{this.state.placeholder.email}</span>
        </span>
      );
    }
  };

  renderDataTemplate = (item/*, index*/) => {
    if (item.isGroup) {
      return (
        <div>
          <button
            className={classNames('fb-user-list__group', { expand: this.state.expanded[ item.businessName ] })}
            onClick={this.onClickToggleFbList(item.businessName)}
          >
            <strong className="fb-user-list__group-name fs-12">{item.businessName}</strong>
          </button>

          {!this.state.expanded[ item.businessName ] ?
            <ul className="fb-user-list">
              {item.children.filter(childItem => childItem.filtered === false)
                .map((childItem, childIndex) =>
                  <li className="fb-user-list__child fb-user-list__depth2 clearfix" key={`fb-manager-${childIndex}`}>
                    {childItem.role === 'ADMIN' ?
                      <Icon type="admin-badge" className="fb-user-list__badge"/>
                      : null
                    }
                    <span className="fb-user-list__child fb-user-list__name float-left">{childItem.name}</span>
                    <span className="fb-user-list__child fb-user-list__email float-left">{childItem.email}</span>
                  </li>,
                )}
            </ul>
            : null
          }
        </div>
      );
    } else {
      return (
        <span>
          <Icon type="admin-badge" className="fb-user-list__badge"/>
          <span className="fb-user-list__name float-left">{item.name}</span>
          <span className="fb-user-list__email float-left">{item.email}</span>
        </span>
      );
    }
  };

  render() {
    return (
      <Dialog
        title="Add User"
        //hideDimmed={this.state.isViewClicked}
        width="700"
        modalClass="add-user"
        onClick={this.handleClick}
      >
        {this.props.linkedChannel.FB && this.props.linkedChannel.GG ?
          <Text.Notify>
            You can select users from Facebook Business Manager or enter a user information directly in order to
            add to Adwitt. As you click OK, the invitation containing the encoded adwitt URL will be sent via email.
          </Text.Notify>
          :
          <Text.Notify>
            You can enter a user information in order to add to Adwitt.<br/>
            As you click OK, the invitation containing the encoded adwitt URL will be sent via email.
          </Text.Notify>
        }
        <dl className="clearfix" style={{ marginTop: '25px' }}>
          <dt className="float-left fs-13" style={{ width: '25%', fontWeight: '400' }}>
            User Info
          </dt>

          {/*로그인한 사용자가 구글 페이스북 모두 연동되었을 때*/}
          {this.props.linkedChannel.FB && this.props.linkedChannel.GG ?
            <dd className="float-left" style={{ width: '75%' }}>
              <Radio
                group="addUserWay"
                label="Select from Facebook Business Manager"
                value="existing"
                defaulted
                onChange={this.onChangeUserInfoRadio}
              />
              <div style={{ paddingLeft: '15px' }}>
                <Tooltip
                  placement="top"
                  trigger="click"
                  //visible={this.validator.hasError('isChangedFbSelect') && !this.state.isChangedFbSelect && !this.state.isNewUser}
                  visible={this.validator.hasError('isChangedFbSelect') && !this.state.isNewUser}
                  overlay={<span>{this.validator.getError('isChangedFbSelect')}</span>}
                >
                  <SelectBox
                    data={this.props.fbBusinessManagerList}
                    dataTemplate={this.renderDataTemplate}
                    placeholder={this.renderPlaceholder}
                    groupKey="businessName"
                    noChangeAction
                    style={{ marginTop: '10px', marginBottom: '20px' }}
                    onClickContent={this.onClickFbSelectContent}
                  >
                    <div className="selectbox-default-search fb-user-list__search">
                      <InputBox
                        type="search"
                        placeholder="Search by Account(Group) Name or ID"
                        value={this.state.searchText}
                        className="fb-user-list__search"
                        onChange={this.handleChangeSearchText}
                      />
                    </div>
                  </SelectBox>
                </Tooltip>
              </div>

              <Radio
                group="addUserWay"
                label="Create New User"
                value="new"
                onChange={this.onChangeUserInfoRadio}
              />

              <div style={{ paddingLeft: '15px' }}>
                <label className="clearfix" style={{ display: 'block', marginTop: '10px' }}>
                  <span className="float-left" style={{ width: '18%', lineHeight: '25px' }}>E-mail</span>
                  <div className="float-left" style={{ width: '82%' }}>
                    <Tooltip
                      placement="top"
                      trigger="click"
                      //visible={this.validator.hasError('newUserEmail') && !this.state.newUserEmail && this.state.isNewUser}
                      visible={this.validator.hasError('newUserEmail') && this.state.isNewUser}
                      overlay={<span>{this.validator.getError('newUserEmail')}</span>}
                    >
                      <InputBox
                        type="email"
                        placeholder="Adwitt invitation is sent to this E-mail."
                        disabled={!this.state.isShowUserInfoForm}
                        invalidated={this.validator.hasError('newUserEmail')}
                        style={{ width: '369px' }}
                        onChange={this.onChangeText('newUserEmail')}
                      />
                    </Tooltip>
                  </div>
                </label>
              </div>
            </dd>
            :
            <dd className="float-left" style={{ width: '75%' }}>
              {/*구글 토큰만 가지고 있을 때*/}
              <div>
                <label className="clearfix" style={{ display: 'block' }}>
                  <span className="float-left" style={{ width: '18%', lineHeight: '25px' }}>E-mail</span>
                  <div className="float-left" style={{ width: '82%' }}>
                    <Tooltip
                      placement="top"
                      trigger="click"
                      //visible={this.validator.hasError('newUserEmailOnly') && !this.state.newUserEmailOnly && this.state.isNewUser}
                      visible={this.validator.hasError('newUserEmailOnly') && this.state.isNewUser}
                      overlay={<span>{this.validator.getError('newUserEmailOnly')}</span>}
                    >
                      <InputBox
                        type="email"
                        placeholder="Adwitt invitation is sent to this E-mail."
                        invalidated={this.validator.hasError('newUserEmailOnly')}
                        style={{ width: '100%' }}
                        onChange={this.onChangeText('newUserEmailOnly')}
                      />
                    </Tooltip>
                  </div>
                </label>
              </div>
            </dd>
          }
        </dl>

        <dl className="clearfix" style={{ marginTop: '30px' }}>
          <dt className="float-left fs-13" style={{ width: '25%', lineHeight: '25px', fontWeight: '400' }}>
            Role
          </dt>
          <dd className="float-left" style={{ width: '75%' }}>
            <p>User roles and permissions can be set when User subscription is approved.</p>
          </dd>
        </dl>
      </Dialog>
    );
  }
}

AddUserModal.propTypes = {
  companyId: PropTypes.number,
  loginUserName: PropTypes.string,
  loginCompanyName: PropTypes.string,
  linkedChannel: PropTypes.object,
  fbBusinessManagerList: PropTypes.array,
  getFBBusinessManagerList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
  sendInvitationMail: PropTypes.func.isRequired,
};

AddUserModal.defaultProps = {
  loginCompanyName: EmailForm.defaultCompany,
};
