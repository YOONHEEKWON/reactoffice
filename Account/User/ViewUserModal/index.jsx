import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ROOT, MASTER, ADMIN } from 'ai/constants/Role';
import EmailForm from 'core/constants/InvitationMail';
import Button from 'core/ui/Button';
import Content from 'core/ui/Content';
import Dialog from 'core/ui/Dialog';
import InputBox from 'core/ui/InputBox';
import SelectBox from 'core/ui/SelectBox';
import Status from 'ai/ui/Status';
import Tooltip from 'core/ui/Tooltip';
import ResendInvitationModal from 'ai/pages/Account/User/ViewUserModal/ResendInvitationModal';
import DisapproveCommentModal from 'ai/pages/Account/User/ViewUserModal/DisapproveCommentModal';
import './styles.scss';

const selectDataForRole = [
  { id: 'MASTER', text: 'Master Admin' },
  { id: 'ADMIN', text: 'Admin' },
  { id: 'EMPLOYEE', text: 'Employee' },
];
const selectDataForArea = [
  { id: 'CREATE', text: 'Report & Create Campaign' },
  { id: 'REPORT', text: 'Report Only' },
];
const dialogButton = [
  { label: 'Cancel', description: 'Cancel', isSecondary: true, action: 'cancel' },
  { label: 'OK', description: 'Okay', action: 'submit' },
];

export default class ViewUserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        companyName: '',
        createDate: '',
        approvalStatus: '',
        email: '',
      },
      companyNameChecked: false,
      companyNameInvalid: false,
      isEditPartnerInfo: false,
      isEditUserInfo: false,
      isShowResendInvitation: false,
      isShowDisapproveCommentModal: false,
      isLoadedUserHistory: false, // history를 한번만 그리기 위한
      userRoleSelectedIndex: 2, // 셀렉트박스 기본 선택
      userAccessAuthSelectedIndex: 0, // 셀렉트박스 기본 선택
      isChangedSelect: false, // 권한 셀렉트 박스 변경했을 때 안내문구 노출
      hover: {
        selectForRole: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userInfo !== nextProps.userInfo) {
      this.setState({
        formData: {
          companyName: nextProps.userInfo.companyName,
          createDate: nextProps.userInfo.createDate,
          approvalStatus: nextProps.userInfo.approvalStatus,
          email: nextProps.userInfo.email,
        },
      });
    }

    if (this.props.userInfoForNoId !== nextProps.userInfoForNoId) {
      this.setState({
        formData: {
          companyName: nextProps.userInfoForNoId.companyName,
          createDate: nextProps.userInfoForNoId.createDate,
          approvalStatus: 'INVITATION_SENT',
          email: nextProps.userInfoForNoId.email,
        },
      });
    }

    // For role selectbox
    if (this.props.userInfo !== nextProps.userInfo) {
      const userRoleSelectedIndex = selectDataForRole.findIndex((item) => item.id === nextProps.userInfo.userRole);
      const userAccessAuthSelectedIndex = selectDataForArea.findIndex((item) => item.id === nextProps.userInfo.userAccessAuth);
      this.setState({
        userRoleSelectedIndex,
        userAccessAuthSelectedIndex,
      });
    }

    // For history
    if (this.props.userHistory !== nextProps.userHistory) {
      this.setState({
        isLoadedUserHistory: true,
      });
    }
  }

  componentWillMount() {
    if (this.props.userId) {

      // 회원가입을 하여 id가 있는 user 조회
      this.props.getUserInfo(this.props.userId);

      // history
      if (!this.state.isLoadedUserHistory) {
        this.props.getUserHistory(this.props.userId);
      }
    } else {

      // 회원가입이 안되어 id로 조회못하는 user
      this.props.getUserInfoForNoId(this.props.currentUser.seq);
    }
  }

  handleClickButton = (action/*, index*/) => {
    this.props.clearUserInfo();
    this.props.clearUserHistory();

    this.setState({
      formData: {
        companyName: '',
      },
    });

    if (action === 'submit') {
      alert('Invitation has been sent!');
      this.props.onClickButton();

      // fail
      // alert('An error occurred. Please try again.');
    } else if (action === 'cancel') {
      this.props.onClickButton();
    }
  };

  onClickEditPartnerInfo = (e) => {
    e.preventDefault();

    this.setState({
      isEditPartnerInfo: !this.state.isEditPartnerInfo,
      formData: {
        ...this.state.formData,
        companyName: this.props.userInfo.companyName,
      },
    });
  };

  // Partner info: 수정 OK 버튼 클릭 시
  onClickDoneEditPartnerInfo = () => {

    if (this.props.userInfo.companyName === this.state.formData.companyName) {
      alert('변경된 사항이 없습니다.');
      return false;
    }

    const changedValue = [
      {
        seq: this.props.currentUser.seq,
        companyName: this.state.formData.companyName,
        email: this.props.userInfo.email,
      },
    ];
    this.props.updatePartnerInfo(changedValue)
      .then((res) => {
        if (res.data) {
          const result = res.data.message;
          if (result === 'Success') {
            this.setState({
              isEditPartnerInfo: !this.state.isEditPartnerInfo,
            });
          }
        }
      });
  };

  onClickEditUserInfo = (e) => {
    e.preventDefault();

    this.setState({
      isEditUserInfo: !this.state.isEditUserInfo,
      isChangedSelect: false,
    });
  };

  onClickCancelUserInfo = () => {
    if (this.state.formData.approvalStatus === 'INVITATION_SENT') {
      this.setState({
        formData: {
          ...this.state.formData,
          email: this.props.userInfoForNoId.email,
        },
        isEditUserInfo: !this.state.isEditUserInfo,
      });

    } else {
      this.setState({
        isEditUserInfo: !this.state.isEditUserInfo,
        isChangedSelect: false,
      });
    }
  };

  // User Info 수정
  onClickDoneEditUserInfo = () => {

    // TODO: 백엔드 작업 필요함.
    // 회원가입 전에는 아이디값이 없으므로 api를 사용할 수 없음.
    if (this.state.formData.approvalStatus === 'INVITATION_SENT') {

      // 회원가입 전: user 정보 수정
      const userInfo = [
        {
          email: this.state.formData.email,
        },
      ];
      this.props.updateUserInfoForNoId(this.props.userInfoForNoId.seq, userInfo);

      // edit 모드 완료
      this.setState({
        isEditUserInfo: !this.state.isEditUserInfo,
      });

    } else {

      // 회원가입 후: user 정보 수정
      const changedValue = [
        {
          userRole: selectDataForRole[ this.state.userRoleSelectedIndex ].id,
          userAccessAuth: selectDataForArea[ this.state.userAccessAuthSelectedIndex ].id,
        },
      ];

      // User Role 수정
      this.props.updateUserRole(this.props.userId, changedValue);

      // edit 모드 완료
      this.setState({
        isEditUserInfo: !this.state.isEditUserInfo,
        isChangedSelect: false,
      });
    }
  };

  onChangeText = (type) => (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [ `${type}` ]: e.target.value,
      },
      companyNameChecked: type === 'companyName' ? false : this.state.companyNameChecked,
      companyNameInvalid: type === 'companyName' ? false : this.state.companyNameInvalid,
    });
  };

  onClickResendInvitationModal = () => this.setState({ isShowResendInvitation: true });

  onCloseResendInvitationModal = () => this.setState({ isShowResendInvitation: false });

  onClickDisapproveCommentModal = () => this.setState({ isShowDisapproveCommentModal: true });

  onCloseDisapproveCommentModal = () => this.setState({ isShowDisapproveCommentModal: false });


  // Partner info > Company name: check 버튼 눌렀을 때
  onClickCompanyNameCheck = () => {
    if (this.state.formData.companyName) {
      this.props.checkPartnerCompany([ { companyName: this.state.formData.companyName } ])
        .then((res) => {
          if (res.data) {
            const result = res.data.data[ 0 ];
            if (result === 'true') {
              this.setState({
                companyNameInvalid: true,
              });

            } else {
              this.setState({
                companyNameChecked: true,
              });
            }
          }
        });
    }
  };

  onClickApprove = () => {
    if (this.props.userId) {
      const changedValue = [
        {
          accessAuth: selectDataForArea[ this.state.userAccessAuthSelectedIndex ].id,
          role: selectDataForRole[ this.state.userRoleSelectedIndex ].id,
          status: 'APPROVED',
        },
      ];

      const approvedMailData = [
        {
          from: `${this.props.loginUserName} <s2@adwitt.com>`,
          to: `${this.state.formData.email}`,
          body: '',
          subject: '[Adwitt] Your Adwitt account has been approved.',
          templateBody: `${this.props.userInfo.name}, your account ‘${this.props.userInfo.id}’ has been approved and is ready to use.`,
          buttonLink: `${EmailForm.url.toLogin}`,
          buttonLinkImage: EmailForm.button.go,
        },
      ];

      this.props.updateUserStatus(this.props.userId, changedValue)
        .then((res) => {
          if (res.data) {
            const result = res.data.message;
            if (result === 'Success') {

              // 바뀐 user 정보를 다시 조회한다.
              this.props.getUserInfo(this.props.userId);

              // 바뀐 History를 다시 조회한다.
              this.props.getUserHistory(this.props.userId);

              // 메일을 보낸다.
              this.props.sendInvitationMail(approvedMailData);
            }
          }
        });
    }
  };

  renderHistoryText = (item) => {

    switch (item.status) {
      case 'REQUEST':
        return (
          <p className="view-user__history__line clearfix">
            <time className="float-left" style={{ width: '28%' }}>{item.dateTime}</time>
            <span className="float-left" style={{ width: '72%' }}>
              <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
              <span> requested account approval.</span>
            </span>
          </p>
        );

      case 'APPROVED':
        return (
          <p className="view-user__history__line clearfix">
            <time className="float-left" style={{ width: '28%' }}>{item.dateTime}</time>
            <span className="float-left" style={{ width: '72%' }}>
              <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
              <span> approved account.</span>
            </span>
          </p>
        );

      case 'DISAPPROVED':
        return (
          <div>
            <p className="view-user__history__line clearfix">
              <time className="float-left" style={{ width: '28%' }}>{item.dateTime}</time>
              <span className="float-left" style={{ width: '72%' }}>
                <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
                <span> disapproved account.</span><br/>
              </span>
            </p>
            <p className="view-user__history__line clearfix">
              <time className="float-left" style={{ width: '28%' }}>{item.dateTime}</time>
              <span className="float-left" style={{ width: '72%' }}>
                <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
                <span> (비승인 주체) left a comment. <br/> “{item.comment}”</span>
              </span>
            </p>
          </div>
        );

      case 'PENDING':
      case 'INVITATION_SENT':
        break;

      // no default
    }
  };

  renderApproveText = (userInfo) => {

    switch (userInfo.approvalStatus) {
      case 'PENDING_REVIEW':
        return (
          <div className="view-user__status clearfix">
            <p className="view-user__status__text float-left">
              <Status status="Pending Review" showText/>
              Pending review by {userInfo.name} on {userInfo.createDate}
            </p>
            <div className="float-right">
              <Button.Flat
                label="Approve"
                className="small"
                onClick={this.onClickApprove}/>
              <Button.Flat
                label="Disapprove"
                className="small"
                secondary
                onClick={this.onClickDisapproveCommentModal}/>
            </div>
          </div>
        );

      case 'APPROVED':
        return (
          <div className="view-user__status clearfix">
            <p className="view-user__status__text float-left">
              <Status status="Approved" showText/>
              Approved by {userInfo.name} on {userInfo.createDate}
            </p>
            <div className="float-right">
              <Button.Flat
                label="Disapprove"
                className="small"
                secondary
                onClick={this.onClickDisapproveCommentModal}/>
            </div>
          </div>
        );

      case 'DISAPPROVED':
        return (
          <div className="view-user__status clearfix">
            <p className="view-user__status__text float-left">
              <Status status="Disapproved" showText/>
              Disapproved by {userInfo.name} on {userInfo.createDate}
            </p>
            <div className="float-right">
              <Button.Flat
                label="Approve"
                className="small"
                onClick={this.onClickApprove}/>
            </div>
          </div>
        );

      case 'REQUEST':
        return (
          <div>REQUEST</div>
        );

      case 'INVITATION_SENT':
        return (
          <div className="view-user__status clearfix">
            <p className="view-user__status__text float-left">
              <Status status="Invitation Sent"/>
              Invitation was sent by Adwitt Master on {userInfo.createDate}
            </p>
            <div className="float-right">
              <Button.Flat
                label="Resend Invitation"
                className="small"
                onClick={this.onClickResendInvitationModal}/>
            </div>
          </div>
        );

      default:
        return (
          <div className="view-user__status clearfix">
            <p className="view-user__status__text float-left">
              <Status status="Invitation Sent"/>
              Invitation was sent by Adwitt Master(승인자 정보 필요) on {this.props.currentUser.createDate}
            </p>
            <div className="float-right">
              <Button.Flat
                label="Resend Invitation"
                className="small"
                onClick={this.onClickResendInvitationModal}/>
            </div>
          </div>
        );

      // no default
    }
  };

  renderSelectDataPlaceholder = (index) => <span>{selectDataForRole[ index ].text}</span>;

  renderSelectDataForRole = (item) => <span>{item.text}</span>;

  renderSelectPlaceholderForAccessAuth = (index) => <span>{selectDataForArea[ index ].text}</span>;

  renderSelectDataForAccessAuth = (item) => <span>{item.text}</span>;

  onChangeItem = (item, index) => this.setState({
    userRoleSelectedIndex: index,
    isChangedSelect: true,
  });

  onChangeItemForAccessAuth = (item, index) => this.setState({
    userAccessAuthSelectedIndex: index,
    isChangedSelect: true,
  });

  onMouseEnterSelect = (type) => () => {
    !this.state.hover[ type ] && this.setState({ hover: { ...this.state.hover, [ type ]: true } });
  };

  onMouseLeaveSelect = (type) => () => (this.state.hover[ type ] && this.setState({ hover: { ...this.state.hover, [ type ]: false } }));

  render() {
    return (
      <Dialog
        title="View User"
        buttons={dialogButton}
        width="1050"
        onClick={this.handleClickButton}
      >
        <div className="columns-2">
          <div className="column">
            <Content.Section
              title="Approve Status"
              secondary
            />
            <div style={{ paddingLeft: '20px', paddingTop: '30px', paddingBottom: '30px', paddingRight: '20px' }}>
              {this.renderApproveText(this.props.userInfo)}
            </div>

            {/*Modal: Disapprove User Account*/}
            {this.state.isShowDisapproveCommentModal ?
              <DisapproveCommentModal
                getUserInfo={this.props.getUserInfo}
                getUserHistory={this.props.getUserHistory}
                loginUserName={this.props.loginUserName}
                userInfo={this.props.userInfo}
                onClose={this.onCloseDisapproveCommentModal}
                sendInvitationMail={this.props.sendInvitationMail}
                updateUserStatus={this.props.updateUserStatus}
                userId={this.props.userId}
                userHistory={this.props.userHistory}
                userRole={selectDataForRole[ this.state.userRoleSelectedIndex ].id}
                userAccess={selectDataForArea[ this.state.userAccessAuthSelectedIndex ].id}
              />
              : null
            }

            {/*Modal: Email*/}
            {this.state.isShowResendInvitation ?
              <ResendInvitationModal
                //handleResendInvitation={this.onClickResendInvitation}
                onClickButton={this.onCloseResendInvitationModal}
                userEmail={this.props.userInfo.email}
                userName={this.props.userInfo.name}
                sendInvitationMail={this.props.sendInvitationMail}
              />
              : null
            }

            {/*Partner Info*/}
            {this.props.authority === ROOT ?
              <div>
                <Content.Section
                  title="Partner Info"
                  secondary
                  component={!this.state.isEditPartnerInfo ?
                    <Button.Icon
                      icon="pencil"
                      description="Edit partner info"
                      onClick={this.onClickEditPartnerInfo}
                    />
                    :
                    <div className="float-right">
                      <Button.Flat
                        label="OK"
                        className="xsmall fixed"
                        style={{ width: '53px' }}
                        primary
                        onClick={this.onClickDoneEditPartnerInfo}
                      />
                      <Button.Flat
                        label="Cancel"
                        className="xsmall fixed"
                        style={{ width: '53px' }}
                        secondary
                        onClick={this.onClickEditPartnerInfo}
                      />
                    </div>
                  }
                />
                <div style={{ paddingLeft: '20px', paddingTop: '20px', paddingBottom: '20px' }}>

                  {/*Company Name*/}
                  <p className="view-user__info__row">
                    <label>
                      <span className="view-user__info__header">Company Name</span>
                      <InputBox
                        style={{ width: '165px' }}
                        //value={this.props.userInfo.companyName}
                        value={this.state.formData.companyName}
                        onChange={this.onChangeText('companyName')}
                        readOnly={!this.state.isEditPartnerInfo}
                      />
                    </label>
                    {this.state.isEditPartnerInfo ?
                      <span>
                        <Button.Flat
                          label="Check"
                          className="medium2"
                          onClick={this.onClickCompanyNameCheck}
                          style={{ marginLeft: '10px' }}
                        />
                        <span className="add-partner__check-result" style={{ marginLeft: '10px', verticalAlign: 'middle' }}>
                          {this.state.companyNameChecked ? <strong aria-label="Company name" style={{ color: '#3a5897' }}>*checked</strong>
                            : null
                          }
                          {this.state.companyNameInvalid ? <strong aria-label="Company name" style={{ color: '#ff8a2f' }}>*invalid</strong>
                            : null
                          }
                        </span>
                      </span>
                      : null
                    }
                  </p>

                  {/*Create Date*/}
                  <p className="view-user__info__row">
                    <span className="view-user__info__header">Create Date</span>
                    <time style={{ verticalAlign: 'middle' }}>{this.state.formData.createDate}</time>
                  </p>
                </div>
              </div>

              : null
            }

            {/*User info*/}
            <Content.Section
              title="User Info"
              secondary
              component={!this.state.isEditUserInfo ?
                <Button.Icon
                  icon="pencil"
                  description="Edit user info"
                  onClick={this.onClickEditUserInfo}
                />
                :
                <div className="float-right">
                  <Button.Flat
                    label="OK"
                    className="xsmall fixed"
                    style={{ width: '53px' }}
                    primary
                    onClick={this.onClickDoneEditUserInfo}/>
                  <Button.Flat
                    label="Cancel"
                    className="xsmall fixed"
                    style={{ width: '53px' }}
                    secondary
                    onClick={this.onClickCancelUserInfo}/>
                </div>
              }
            />
            <div style={{ paddingLeft: '20px', paddingTop: '20px', paddingBottom: '20px' }}>

              {/*ID*/}
              {this.props.userInfo && this.state.formData.approvalStatus === 'INVITATION_SENT' ?
                null :
                <p className="view-user__info__row">
                  <span className="view-user__info__header">ID</span>
                  <span>{this.props.userInfo.id}</span>
                </p>
              }

              {/*Name*/}
              {this.props.authority === 'ROOT' && this.state.formData.approvalStatus === 'INVITATION_SENT' ?
                null :
                <p className="view-user__info__row">
                  <span className="view-user__info__header">Name</span>
                  <InputBox
                    onChange={this.onChangeText}
                    style={{ width: '195px' }}
                    value={this.props.userInfo.name}
                    readOnly={!this.state.isEditUserInfo || this.state.formData.approvalStatus !== 'INVITATION_SENT'}
                  />
                </p>
              }

              {/*E-mail - all 전부 다 나옴*/}
              <p className="view-user__info__row">
                <span className="view-user__info__header">E-mail</span>
                <InputBox
                  onChange={this.onChangeText('email')}
                  type="email"
                  style={{ width: '195px' }}
                  value={this.state.formData.email}
                  readOnly={!this.state.isEditUserInfo || this.state.formData.approvalStatus !== 'INVITATION_SENT'}
                />
              </p>

              {/*Mobile Phone*/}
              {this.props.userInfo && this.state.formData.approvalStatus === 'INVITATION_SENT' ?
                null :
                <p className="view-user__info__row">
                  <span className="view-user__info__header">Mobile Phone Number</span>
                  <span style={{ verticalAlign: 'middle' }}>{this.props.userInfo.mobilePhoneNumber}</span>
                </p>
              }

              {/*Master, Admin이 INVITATION_SENT인 user의 view user 팝업을 볼때*/}
              {this.props.userInfo && this.state.formData.approvalStatus === 'INVITATION_SENT' ?
                <div className="view-user__info__row">
                  <span className="view-user__info__header">Role</span>

                  {/*아직 User의 가입 신청서 작성이 이루어지지 않았기 때문에 Add User 시 나왔던 문구가 그대로 표시됨.*/}
                  <p style={{
                    display: 'inline-block',
                    width: '260px',
                    verticalAlign: 'top',
                    lineHeight: '1.5',
                  }}>User roles and permissions can be set when User subscription is approved.</p>
                </div>
                :
                <div className="view-user__info__row">
                  <span className="view-user__info__header">Role</span>

                  {!this.state.isEditUserInfo ?
                    <div className="inline-block">
                      <span>{selectDataForRole[ this.state.userRoleSelectedIndex ].text}</span><br/>
                      <span>({selectDataForArea[ this.state.userAccessAuthSelectedIndex ].text})</span>
                    </div>

                    :

                    <div className="inline-block" style={{ width: '300px' }}>

                      {/*툴팁은 셀렉트박스가 비활성화 일 때 안내하는 용도*/}
                      <Tooltip
                        placement="top"
                        overlay={<span>In order to change Master Admin role, <br/>user with Master Admin role must assign <br/>other user as Master Admin first.<br/> Once it's done, existing Master Admin role<br/> will be automatically changed to Admin role.</span>}
                        visible={(this.props.authority === ROOT) && this.state.hover.selectForRole}
                      >
                        <SelectBox
                          data={selectDataForRole}
                          dataTemplate={this.renderSelectDataForRole}
                          placeholder={this.renderSelectDataPlaceholder}
                          selectedIcon
                          titleWidth="195px"
                          contentWidth="195px"
                          selectedIndex={this.state.userRoleSelectedIndex}
                          disabled={this.props.authority === ROOT}
                          onChange={this.onChangeItem}
                          onMouseEnter={this.onMouseEnterSelect('selectForRole')}
                          onMouseLeave={this.onMouseLeaveSelect('selectForRole')}
                        />
                      </Tooltip>

                      <SelectBox
                        data={selectDataForArea}
                        dataTemplate={this.renderSelectDataForAccessAuth}
                        placeholder={this.renderSelectPlaceholderForAccessAuth}
                        selectedIcon
                        titleWidth="195px"
                        contentWidth="195px"
                        style={{ marginTop: '10px' }}
                        selectedIndex={this.state.userAccessAuthSelectedIndex}
                        onChange={this.onChangeItemForAccessAuth}
                      />
                      {this.state.isChangedSelect ?
                        <p
                          className="text-primary"
                          style={{ marginTop: '10px' }}>
                          Changed role will be applied when user login again.
                        </p>
                        : null
                      }
                    </div>
                  }
                </div>
              }

              {this.props.authority === MASTER || this.props.authority === ADMIN ?
                <p className="view-user__info__row">
                  <span className="view-user__info__header">Company Name</span>
                  <time style={{ verticalAlign: 'middle' }}>{this.props.userInfo.companyName}</time>
                </p>
                : null
              }

              {this.props.authority === MASTER || this.props.authority === ADMIN ?
                <p className="view-user__info__row">
                  <span className="view-user__info__header">Create Date</span>
                  <time style={{ verticalAlign: 'middle' }}>{this.props.userInfo.createDate}</time>
                </p>
                : null
              }

            </div>
          </div>
          {/*column*/}

          {/*column*/}
          <div className="column">
            <Content.Section
              title="History"
              secondary
            />
            <div className="view-user__history">
              {this.props.userHistory.length ?
                this.props.userHistory.map((item, index) => {
                  const renderHistoryText = this.renderHistoryText(item);
                  return renderHistoryText ? <div key={`history-row-${index}`}>{renderHistoryText}</div> : null;
                })
                : null
              }
            </div>
          </div>
          {/*column*/}
        </div>
      </Dialog>
    );
  }
}

ViewUserModal.propTypes = {
  authority: PropTypes.string,
  currentUser: PropTypes.object,
  loginUserName: PropTypes.string,
  userId: PropTypes.string,
  userInfo: PropTypes.object,
  userInfoForNoId: PropTypes.object,
  userHistory: PropTypes.array,

  clearUserHistory: PropTypes.func.isRequired,
  clearUserInfo: PropTypes.func.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  getUserInfoForNoId: PropTypes.func.isRequired,
  sendInvitationMail: PropTypes.func.isRequired,
  getUserHistory: PropTypes.func.isRequired,
  onClickButton: PropTypes.func.isRequired,

  updateUserInfo: PropTypes.func.isRequired,
  updateUserInfoForNoId: PropTypes.func.isRequired,
  updatePartnerInfo: PropTypes.func,
  checkPartnerCompany: PropTypes.func.isRequired,
  updateUserRole: PropTypes.func.isRequired,
  updateUserStatus: PropTypes.func.isRequired,
};

ViewUserModal.defaultProps = {
  userInfo: {},
  userInfoForNoId: {},
  userHistory: [],
};
