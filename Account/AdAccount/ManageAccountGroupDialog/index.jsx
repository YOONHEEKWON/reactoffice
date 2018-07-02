import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAdAccounts,
  getAdAccountGroups,
  deleteAdAccountGroups,
  updateAdAccountGroups,
  addAdAccountGroups,
  resetUsedInAdAccounts,
  useAdAccountsInStore,
  useAdAccounts,
  disuseAdAccounts,
} from 'ai/pages/Account/AdAccount/action';
import Dialog from 'core/ui/Dialog';
import AdAccountsBox from 'ai/pages/Account/AdAccount/ManageAccountGroupDialog/AdAccountsBox';
import AdAccountGroupsBox from 'ai/pages/Account/AdAccount/ManageAccountGroupDialog/AdAccountGroupsBox';
import './style.scss';

const initTargetGroupData = () => {
  return {
    editorMode: 'none', // add, edit
    groupName: '',
    accounts: [],
    edit: { groupName: '', add: [], del: [] },
    isCompleted: false,
  };
};

// 그룹명/계정(추가/삭제) 변경한 내역이 있는 그룹 필터
const filterEditGroup = (group) => !!group.edit.add.length || !!group.edit.del.length || group.groupName !== group.oldGroupName;

let CALL_COUNT = 0;

class ManageAccountGroupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupData: {
        selectedGroupName: null,
        target: {
          editorMode: 'none', // add, edit
          groupName: '',
          accounts: [],
          edit: { groupName: '', add: [], del: [] },
          isCompleted: false,
        },
        add: [],
        edit: [],
        del: [],
      },
    };
  }

  componentDidMount() {
    const { getAdAccounts, resetUsedInAdAccounts, adAccounts, groupName } = this.props;
    const { groupData } = this.state;
    this.setState({
      groupData: {
        ...groupData,
        selectedGroupName: groupName,
        edit: [ ...this.groupByAccountGroups() ],
      },
    });

    if (!adAccounts.length) {
      getAdAccounts();
    }

    resetUsedInAdAccounts();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.adAccountGroups !== nextProps.adAccountGroups) {
      const { groupData } = this.state;
      this.setState({
        groupData: {
          ...groupData,
          edit: [ ...this.groupByAccountGroups(nextProps.adAccountGroups) ],
        },
      });
    }
  }

  callDeleteGroups = () => {
    const { groupData } = this.state;
    if (groupData.del.length > 0) {
      CALL_COUNT++;
      this.props.deleteAdAccountGroups(groupData.del.map((groupName) => ({ groupName: groupName })))
        .then(() => CALL_COUNT--);
    }
  };

  callEditGroups = () => {
    const { groupData } = this.state;
    const editGroupList = groupData.edit.filter(filterEditGroup);
    if (editGroupList.length > 0) {
      CALL_COUNT++;
      this.props.updateAdAccountGroups(editGroupList.map((group) => ({
        groupName: group.groupName,
        oldGroupName: group.oldGroupName,
        ids: group.accounts.map((acc) => acc.accountId).concat(group.edit.add.map((acc) => acc.accountId)),
      })))
        .then(() => CALL_COUNT--);
    }
  };

  callAddGroups = () => {
    const { groupData } = this.state;
    if (groupData.add.length > 0) {
      CALL_COUNT++;
      this.props.addAdAccountGroups(groupData.add.map((group) => ({
        groupName: group.groupName,
        ids: group.accounts.map((acc) => acc.accountId),
      })))
        .then(() => CALL_COUNT--);
    }
  };

  callUseAdAccounts = () => {
    //const { adAccounts, useAdAccounts } = this.props;
    //if (adAccounts.some((acc) => acc.used !== acc.originUsed && acc.used)) {
    //  const 사용하려는계정들API데이터형태로조합후사용하기 = adAccounts.filter((acc) => acc.used !== acc.originUsed && acc.used);
    //  useAdAccounts(사용하려는계정들API데이터형태로조합후사용하기);
    //}
  };

  callDisuseAdAccounts = () => {
    //const { adAccounts, disuseAdAccounts } = this.props;
    //if (adAccounts.some((acc) => acc.used !== acc.originUsed && !acc.used)) {
    //  const 사용해제하려는계정들API데이터형태로조합후사용하기 = adAccounts.filter((acc) => acc.used !== acc.originUsed && !acc.used);
    //  disuseAdAccounts(사용해제하려는계정들API데이터형태로조합후사용하기);
    //}
  };

  handleDialogButton = (action/*, index*/) => {
    const { resetUsedInAdAccounts, getAdAccountGroups } = this.props;

    if (action === 'submit') {
      this.callUseAdAccounts();
      this.callDisuseAdAccounts();
      this.callDeleteGroups();
      this.callEditGroups();
      this.callAddGroups();

      const interval = setInterval(() => {
        if (CALL_COUNT === 0) {
          getAdAccountGroups();
          clearInterval(interval);
        }
      }, 500);

    } else {
      resetUsedInAdAccounts();
    }

    this.props.close('manageAccountGroup');
  };

  addItemInGroupData = (adAccount) => {
    const { groupData, groupData: { target, target: { accounts, editorMode, edit, edit: { add } } } } = this.state;

    switch (editorMode) {
      case 'none':
      case 'add':
        this.setState({
          groupData: {
            ...groupData,
            target: {
              ...target,
              accounts: accounts.concat(adAccount),
            },
          },
        });
        break;
      case 'edit':
        this.setState({
          groupData: {
            ...groupData,
            target: {
              ...target,
              edit: {
                ...edit,
                add: add.concat(adAccount),
              },
            },
          },
        });
        break;
      default:
        break;
    }
  };

  deleteItemInGroupData = (adAccountId) => {
    const { groupData, groupData: { target, target: { accounts, editorMode, edit, edit: { add, del } } } } = this.state;

    switch (editorMode) {
      case 'none':
      case 'add':
        this.setState({
          groupData: {
            ...groupData,
            target: {
              ...target,
              accounts: accounts.filter((acc) => acc.accountId !== adAccountId),
            },
          },
        });
        break;
      case 'edit': {
        const isExist = accounts.some((acc) => acc.accountId === adAccountId);
        this.setState({
          groupData: {
            ...groupData,
            target: {
              ...target,
              accounts: accounts.filter((acc) => acc.accountId !== adAccountId),
              edit: {
                ...edit,
                del: del.concat(isExist ? accounts.find((acc) => acc.accountId === adAccountId) : []),
                add: add.filter((acc) => acc.accountId !== adAccountId),
              },
            },
          },
        });
        break;
      }
      default:
        break;
    }
  };

  completeGroupEditor = (groupName) => {
    const { groupData, groupData: { target, target: { editorMode } } } = this.state;

    if (editorMode === 'none') {
      this.setState({
        groupData: {
          ...groupData,
          target: initTargetGroupData(),
          add: groupData.add.concat({
            ...target,
            groupName,
            isCompleted: true,
          }),
        },
      });
    } else {
      this.setState({
        groupData: {
          ...groupData,
          target: initTargetGroupData(),
          [ editorMode ]: groupData[ editorMode ].map((group) => {
            if (group.groupName === target.groupName) {
              return {
                ...target,
                groupName,
                isCompleted: true,
              };
            }
            return group;
          }),
        },
      });
    }
  };

  cancelGroupEditor = () => {
    const { groupData } = this.state;

    this.setState({
      groupData: {
        ...groupData,
        target: initTargetGroupData(),
      },
    });
  };

  editingGroup = (groupName) => () => {
    const { groupData, groupData: { add, edit } } = this.state;

    if (add.some((group) => group.groupName === groupName)) {
      const targetGroup = add.find((group) => group.groupName === groupName);
      targetGroup.editorMode = 'add';
      this.setState({
        groupData: {
          ...groupData,
          target: targetGroup,
        },
      });
    } else {
      const targetGroup = edit.find((group) => group.groupName === groupName);
      targetGroup.editorMode = 'edit';
      this.setState({
        groupData: {
          ...groupData,
          target: targetGroup,
        },
      });
    }
  };

  groupByAccountGroups = (accountGroups) => {
    const adAccountGroups = accountGroups || this.props.adAccountGroups;
    return adAccountGroups
      .filter((account) => !!account.groupName)
      .reduce((groups, account) => {
        if (groups.some((group) => group.groupName === account.groupName)) {
          if (account.channel) { // unlink 기능으로인해 그룹만 넘어오는 경우가 있음.
            const group = groups.find((group) => group.groupName === account.groupName);
            group.accounts = group.accounts.concat(account);
          }
        } else {
          groups.push({
            editorMode: 'edit',
            groupName: account.groupName,
            oldGroupName: account.groupName,
            accounts: account.channel ? [ account ] : [], // unlink 기능으로인해 그룹만 넘어오는 경우가 있음.
            edit: { groupName: '', add: [], del: [] },
            isCompleted: true,
          });
        }
        return groups;
      }, []);
  };

  deleteGroup = (groupName) => () => {
    const { groupData } = this.state;
    const targetGroup = [ ...groupData.add, ...groupData.edit ].find((group) => group.groupName === groupName);

    switch (targetGroup.editorMode) {
      case 'add':
        this.setState({
          groupData: {
            ...groupData,
            target: initTargetGroupData(),
            add: groupData.add.filter((group) => group.groupName !== groupName),
          },
        });
        break;
      case 'edit':
        this.setState({
          groupData: {
            ...groupData,
            target: initTargetGroupData(),
            edit: groupData.edit.filter((group) => group.groupName !== groupName),
            del: groupData.del.concat(groupName),
          },
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { adAccounts, useAdAccountsInStore } = this.props;
    const { groupData } = this.state;

    return (
      <div>
        <Dialog
          title="Manage Account Group"
          width={1020}
          onClick={this.handleDialogButton}
        >
          <div className="manage-account-group-popup clearfix">
            <AdAccountsBox
              media="facebook"
              adAccounts={adAccounts.filter((a) => a.channel === 'FB')}
              groupData={groupData}
              addItemInGroupData={this.addItemInGroupData}
              useAdAccountsInStore={useAdAccountsInStore}
            />
            <AdAccountsBox
              media="google"
              adAccounts={adAccounts.filter((a) => a.channel === 'GG')}
              groupData={groupData}
              addItemInGroupData={this.addItemInGroupData}
              useAdAccountsInStore={useAdAccountsInStore}
            />
            <AdAccountGroupsBox
              groupData={groupData}
              deleteItemInGroupData={this.deleteItemInGroupData}
              completeGroupEditor={this.completeGroupEditor}
              cancelGroupEditor={this.cancelGroupEditor}
              editingGroup={this.editingGroup}
              deleteGroup={this.deleteGroup}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

ManageAccountGroupDialog.propTypes = {
  close: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,

  adAccounts: PropTypes.array,
  adAccountGroups: PropTypes.array,

  getAdAccounts: PropTypes.func.isRequired,
  getAdAccountGroups: PropTypes.func.isRequired,
  deleteAdAccountGroups: PropTypes.func.isRequired,
  updateAdAccountGroups: PropTypes.func.isRequired,
  addAdAccountGroups: PropTypes.func.isRequired,
  resetUsedInAdAccounts: PropTypes.func.isRequired,
  useAdAccountsInStore: PropTypes.func.isRequired,
  useAdAccounts: PropTypes.func.isRequired,
  disuseAdAccounts: PropTypes.func.isRequired,
};

ManageAccountGroupDialog.defaultProps = {};

function mapStateToProps(state) {
  return {
    adAccounts: state.adAccount.adAccounts,
    adAccountGroups: state.adAccount.adAccountGroups,
  };
}

export default connect(
  mapStateToProps,
  {
    getAdAccounts,
    getAdAccountGroups,
    deleteAdAccountGroups,
    updateAdAccountGroups,
    addAdAccountGroups,
    resetUsedInAdAccounts,
    useAdAccountsInStore,
    useAdAccounts,
    disuseAdAccounts,
  },
)(ManageAccountGroupDialog);
