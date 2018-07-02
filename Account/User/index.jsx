import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { redirectPage } from 'ai/action';
import {
  getUserList,
  addUser,
  addPartner,
  checkPartnerCompany,
  clearUserHistory,
  clearUserInfo,
  getUserListForAdwittMaster,
  getFBBusinessManagerList,
  getUserHistory,
  getUserInfo,
  getUserInfoForNoId,
  sendInvitationMail,
  updatePartnerInfo,
  updateUserInfo,
  updateUserInfoForNoId,
  updateUserRole,
  updateUserStatus,
} from './action';
import { ROOT, EMPLOYEE } from 'ai/constants/Role';

import Button from 'core/ui/Button';
import Content from 'core/ui/Content';
import Header from 'ai/ui/Header';
import Icon from 'core/ui/Icon';
import InputBox from 'core/ui/InputBox';
import SelectBox from 'core/ui/SelectBox';
import Status from 'ai/ui/Status';
import StickyTable from 'core/ui/StickyTable';

import AddPartnerModal from 'ai/pages/Account/User/AddPartnerModal';
import AddUserModal from 'ai/pages/Account/User/AddUserModal';
import ViewUserModal from 'ai/pages/Account/User/ViewUserModal';
import './styles.scss';

const selectBoxDataStatus = [
  'All', 'APPROVED', 'DISAPPROVED', 'PENDING_REVIEW', 'INVITATION_SENT',
];

const renderSelectBoxDataStatus = (item) =>
  <span style={{ textTransform: 'capitalize' }}>{item.toLowerCase().replace('_', ' ')}</span>;

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowAddPartnerModal: false,
      isShowAddUserModal: false,
      isShowViewUserModal: false,
      currentUserId: '',
      currentUserEmail: '',
      currentUserSeq: '',
      isLoadedUserList: false,
      query: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userList !== nextProps.userList) {
      // TODO: jwt 토큰에 companyId 정보 추가되면
      // 리스트에서 해당 내용 가져오는 부분 수정필요
      this.setState({
        companyId: nextProps.userList[ 0 ].companyId,
      });
    }
  }

  componentWillMount() {
    this.columns = [
      {
        key: 'id', label: 'ID', isSortable: true, renderCell: (value, rowData) => {
          if (rowData.approvalStatus === 'INVITATION_SENT') {
            return (
              <span style={{ color: '#c2c2c2' }}>(Not Registered)</span>
            );
          } else {
            return (
              <span>{value}</span>
            );
          }
        },
      },
      { key: 'name', label: 'Name', isSortable: true },
      {
        key: 'numberOfAccount', label: 'Number of Accounts', isSortable: true, renderCell: (value, rowData) => {

          let htmlGG = '';
          let htmlFB = '';
          if (rowData.numberOfAccount) {
            if (rowData.numberOfAccount.FB) {
              htmlFB = (
                <span style={{ marginRight: '20px' }}>
                  <Icon type="media-facebook" style={{ fontSize: '17px', marginRight: '3px' }}/>
                  {Number(rowData.numberOfAccount.FB)}
                </span>
              );
            }
            if (rowData.numberOfAccount.GG) {
              htmlGG = (
                <span>
                  <Icon type="media-google" style={{ fontSize: '17px', marginRight: '3px' }}/>
                  {Number(rowData.numberOfAccount.GG)}
                </span>
              );
            }
            return <span>{htmlFB} {htmlGG}</span>;

          } else {
            return null;
          }
        },
      },
      { key: 'companyName', label: 'Company Name', isSortable: true },
      { key: 'role', label: 'Role', isSortable: true },
      {
        key: 'approvalStatus', label: 'Approval Status', isSortable: true, renderCell: (value, rowData) => {
          switch (rowData.approvalStatus) {
            case 'INVITATION_SENT':
              return <Status status="Invitation Sent" showText/>;
            case 'PENDING_REVIEW':
              return <Status status="Pending Review" showText/>;
            case 'APPROVED':
              return <Status status="Approved" showText/>;
            case 'DISAPPROVED':
              return <Status status="Disapproved" showText/>;
            default:
              break;
          }
        },
      },
      { key: 'createDate', label: 'Create Date', isSortable: true },
      { key: 'updateDate', label: 'Update Date', isSortable: true },
      {
        key: '', label: 'View', width: '100px', renderCell: (value, rowData, colInfo) => {
          return (
            <Button.Flat label="View" className="xsmall" onClick={this.onClickViewUserModal(rowData)}/>
          );
        },
      },
    ];

    if (this.props.authority === EMPLOYEE) {
      // user 페이지는 EMPLOYEE 접근 불가.
      this.props.redirectPage('home', this.props.history.push);
    }
  }

  componentDidMount() {
    if (this.props.authority === ROOT) {
      this.props.getUserListForAdwittMaster();
    } else {
      this.props.getUserList();
    }

    // this.props.addUser({
    //   "companyName": "ksg_company",
    //   "email": "2014ksg@adwitt.com"
    // });
    // this.props.updateUserInfo('12345', [{
    //   "email": "kykkyn2@adwitt.com",
    //   "mobilePhoneNumber": "010-9232-1728",
    //   "name": "애드윗_박정현2"
    // }]);
    // this.props.updateUserStatus('myborn_adwitt', {
    //   comments: 'test 전송입니다. -강상규',
    //   status: DISAPPROVED,
    // });
    // this.props.sendInvitationMail([{
    //   "from":"2014ksg@adwitt.com",
    //   "to":"2014ksg@adwitt.com",
    //   "body":"template메일적용시 생략가능 2014ksg",
    //   "subject":"애드윗 초대메일 2014ksg에게 ",
    //   "templateBody":"애드윗,<br/>you’ve been invited to Adwitt!<br/>Please complete sign-up process by clicking “Get Started” button.",
    //   "buttonLink":"http://www.adwitt.com",
    //   "buttonLinkImage":"http://file.adwitt.com/email/wisebirds_card_button_started.png"
    // }]);
    //this.props.getUserListForAdwittMaster();
    // this.props.getFBBusinessManagerList();
    // test 호출
  }

  onChangeText = (e, action) => {
    if (action !== 'blur') {
      //alert(`ACTION: ${action || 'normally input'} / VALUE: ${e.target.value}`);
    } else {
      //console.log('Blurring InputBox..');
    }
  };

  onClickAddPartner = () => this.setState({ isShowAddPartnerModal: true });

  onCloseAddPartner = () => this.setState({ isShowAddPartnerModal: false });

  onClickAddUser = () => this.setState({ isShowAddUserModal: true });

  onCloseAddUser = () => this.setState({ isShowAddUserModal: false });

  onClickViewUserModal = (user) => () => {
    this.setState({
      isShowViewUserModal: true,
      currentUser: user,
      currentUserId: user.id,
      currentUserEmail: user.email,
      currentUserSeq: user.seq,
    });
  };

  onCloseViewUserModal = () => {
    this.setState({
      isShowViewUserModal: false,
    });

    if (this.props.authority === ROOT) {
      this.props.getUserListForAdwittMaster();
    } else {
      this.props.getUserList();
    }
  };

  onChangeSearchText = (e) => {
    this.setState({
      query: {
        AND: this.state.query.AND,
        OR: {
          id: e.target.value,
          name: e.target.value,
          companyName: e.target.value,
        },
      },
    });
  };

  onChangeStatusFilter = (value) => {
    if (value === 'All') {
      this.setState({
        query: {},
      });
    } else {
      this.setState({
        query: {
          OR: {
            approvalStatus: (itemValue) => itemValue === value,
          },
        },
      });
    }
  };

  renderPlaceholder = (index) => {
    if (selectBoxDataStatus && index >= 0) {
      const item = selectBoxDataStatus[ index ];
      return renderSelectBoxDataStatus(item);
    }
  };

  render() {
    if (!this.props.isLoadedUserList) {
      return null;
    }

    return (
      <div>
        <Header name="user"/>
        {/*<p>{this.props.authority === ROOT ? 'Root' : 'Nope'}</p>*/}
        {/*<UserPageFilter/>*/}

        <Content.Card title="Approval Status" noWrap className="filter-wrap--user">
          <SelectBox
            contentWidth="150px"
            data={selectBoxDataStatus}
            dataTemplate={renderSelectBoxDataStatus}
            selectedIcon
            onChange={this.onChangeStatusFilter}
            placeholder={this.renderPlaceholder}
            titleWidth="150px"
            selectedIndex={0}
          />
          {/*<Button.Flat label="OK" primary className="medium" style={{marginLeft: '10px'}}/>*/}
        </Content.Card>

        <Content.Card className="table--user-list">
          <div className="clearfix">
            <div className="float-left">
              <InputBox
                placeholder="Search by ID, Name or Company Name."
                onChange={this.onChangeSearchText}
                style={{ width: '360px' }}
              />
            </div>

            {this.props.authority === ROOT ?
              <Button.Flat
                label="Add Partner"
                className="medium float-right"
                onClick={this.onClickAddPartner}
              />
              : <Button.Flat
                label="Add User"
                className="medium float-right"
                onClick={this.onClickAddUser}
              />
            }

            {/*Modal - Add Partner*/}
            {this.state.isShowAddPartnerModal ?
              <AddPartnerModal
                onClickButton={this.onCloseAddPartner}
                checkPartnerCompany={this.props.checkPartnerCompany}
                addPartner={this.props.addPartner}
                getUserListForAdwittMaster={this.props.getUserListForAdwittMaster}
                loginUserName={this.props.loginUserName}
                loginCompanyName={this.props.loginCompanyName}
                sendInvitationMail={this.props.sendInvitationMail}
              />
              : null
            }

            {/*Modal - Add User*/}
            {this.state.isShowAddUserModal ?
              <AddUserModal
                addUser={this.props.addUser}
                companyId={this.state.companyId}
                fbBusinessManagerList={this.props.fbBusinessManagerList}
                getFBBusinessManagerList={this.props.getFBBusinessManagerList}
                loginUserName={this.props.loginUserName}
                loginCompanyName={this.props.loginCompanyName}
                onClose={this.onCloseAddUser}
                sendInvitationMail={this.props.sendInvitationMail}
                getUserList={this.props.getUserList}
                linkedChannel={this.props.linkedChannel}
              />
              : null
            }
          </div>

          <div style={{ marginTop: '20px' }}>
            <StickyTable
              columns={this.columns}
              data={this.props.userList}
              dataGroupKey=""
              dataKey="id"
              headAlign="left"
              query={this.state.query}
            />
          </div>

          {/*Modal - View user*/}
          {this.state.isShowViewUserModal ?
            <ViewUserModal
              authority={this.props.authority}
              checkPartnerCompany={this.props.checkPartnerCompany}
              clearUserHistory={this.props.clearUserHistory}
              clearUserInfo={this.props.clearUserInfo}
              currentUser={this.state.currentUser}
              getUserInfo={this.props.getUserInfo}
              getUserInfoForNoId={this.props.getUserInfoForNoId}
              getUserHistory={this.props.getUserHistory}
              loginUserName={this.props.loginUserName}
              onClickButton={this.onCloseViewUserModal}
              sendInvitationMail={this.props.sendInvitationMail}
              updatePartnerInfo={this.props.updatePartnerInfo}
              updateUserInfo={this.props.updateUserInfo}
              updateUserInfoForNoId={this.props.updateUserInfoForNoId}
              updateUserRole={this.props.updateUserRole}
              updateUserStatus={this.props.updateUserStatus}
              userId={this.state.currentUserId}
              userInfo={this.props.userInfo}
              userInfoForNoId={this.props.userInfoForNoId}
              userHistory={this.props.userHistory}
            />
            : null
          }
        </Content.Card>
      </div>
    );
  }
}

User.propTypes = {
  authority: PropTypes.string,
  linkedChannel: PropTypes.object,
  loginUserName: PropTypes.string,
  loginCompanyName: PropTypes.string,
  fbBusinessManagerList: PropTypes.array,
  userList: PropTypes.array,
  userInfo: PropTypes.object,
  userInfoForNoId: PropTypes.object,
  userHistory: PropTypes.array,
  isLoadedUserList: PropTypes.bool,

  addUser: PropTypes.func.isRequired,
  addPartner: PropTypes.func.isRequired,
  checkPartnerCompany: PropTypes.func.isRequired,
  clearUserHistory: PropTypes.func,
  clearUserInfo: PropTypes.func.isRequired,
  getFBBusinessManagerList: PropTypes.func.isRequired,
  getUserHistory: PropTypes.func.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  getUserInfoForNoId: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
  getUserListForAdwittMaster: PropTypes.func.isRequired,
  redirectPage: PropTypes.func.isRequired,
  sendInvitationMail: PropTypes.func.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  updateUserInfoForNoId: PropTypes.func.isRequired,
  updateUserRole: PropTypes.func.isRequired,
  updateUserStatus: PropTypes.func.isRequired,
  updatePartnerInfo: PropTypes.func,

  history: PropTypes.object.isRequired, // React Router
  location: PropTypes.object.isRequired, // React Router
};

function mapStateToProps(state) {
  return {
    authority: state.login.webToken.authorities ? state.login.webToken.authorities[ 0 ].authority : '',
    linkedChannel: state.login.webToken.channeltoken[ 0 ],
    loginUserName: state.login.webToken.userName,
    loginCompanyName: state.login.webToken.companyName,
    fbBusinessManagerList: state.user.fbBusinessManagerList,
    userList: state.user.userList,
    userInfo: state.user.userInfo,
    userInfoForNoId: state.user.userInfoForNoId,
    userHistory: state.user.userHistory,
    isLoadedUserList: state.user.isLoadedUserList,
  };
}

export default withRouter(connect(
  mapStateToProps,
  {
    addUser,
    addPartner,
    checkPartnerCompany,
    clearUserHistory,
    clearUserInfo,
    getFBBusinessManagerList,
    getUserHistory,
    getUserInfo,
    getUserInfoForNoId,
    getUserList,
    getUserListForAdwittMaster,
    redirectPage,
    sendInvitationMail,
    updateUserInfo,
    updateUserInfoForNoId,
    updateUserRole,
    updateUserStatus,
    updatePartnerInfo,
  },
)(User));
