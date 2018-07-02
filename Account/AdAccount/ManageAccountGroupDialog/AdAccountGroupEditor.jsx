import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InputBox from 'core/ui/InputBox';
import Tooltip from 'core/ui/Tooltip';

export default class AdAccountGroupEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      tooltip: {
        show: false,
        reason: '',
      },
    };
  }

  componentDidMount() {
    this.setState({
      groupName: this.props.groupData.target.groupName,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.groupName !== nextProps.groupData.target.groupName) {
      this.setState({
        groupName: nextProps.groupData.target.groupName,
        tooltip: { show: false, reason: '' },
      });
    }
  }

  filteredGroupData = () => {
    const { groupData: { target: { accounts, edit: { add, del } } } } = this.props;
    return accounts
      .concat(add)
      .filter((acc) => !del.some((a) => a.accountId === acc.accountId)); // 삭제 하고자하는 계정은 제외
  };

  changeInput = (e) => {
    this.setState({
      groupName: e.target.value.trim(),
    });
  };

  editorValid = () => {
    const { groupData } = this.props;
    const { groupName } = this.state;
    const emptyGroupName = !groupName.trim();
    const existGroupName = groupData.target.groupName !== groupName && [
      ...groupData.edit,
      ...groupData.add,
    ].some((group) => group.groupName === groupName);
    const lessThenTwoAccounts = groupData.target.accounts.length + groupData.target.edit.add.length < 2;

    if (emptyGroupName) {
      this.setState({ tooltip: { show: true, reason: 'Group Name field is required.' } });
      return false;
    } else if (existGroupName) {
      this.setState({ tooltip: { show: true, reason: 'This group name is already in use.' } });
      return false;
    } else if (lessThenTwoAccounts) {
      this.setState({ tooltip: { show: true, reason: 'At least 2 accounts must be selected to create an account group.' } });
      return false;
    }
    this.setState({ tooltip: { show: false, reason: '' } });
    return true;
  };

  handleCompleteGroupEditor = () => {
    const { completeGroupEditor } = this.props;
    const { groupName } = this.state;

    if (this.editorValid()) {
      completeGroupEditor(groupName);
      this.setState({ groupName: '' });
    }
  };

  handleCancelGroupEditor = () => {
    this.setState({ groupName: '' });
    this.props.cancelGroupEditor();
  };

  render() {
    const { deleteItemInGroupData, groupData: { target: { editorMode, groupName } } } = this.props;
    const { tooltip } = this.state;
    const adAccountsInGroupData = this.filteredGroupData();

    return (
      <div className="account-group-maker">
        {!adAccountsInGroupData.length && !groupName ? //
          <div className="link-accounts__list"><p className="account-group-maker__info">Add your accounts.</p></div>
          : //
          <div>
            <div data-k-v-if="selectedList.length>0 || activeEditGroup" className="account-group-maker__name clearfix">
              <p className="account-group-maker__name-label">Group Name</p>
              <div className="account-group-maker__name-input">
                <InputBox
                  placeholder="Group Name"
                  onChange={this.changeInput}
                  value={this.state.groupName}/>
              </div>
            </div>
            <div className="link-accounts__list">
              <ul>
                {adAccountsInGroupData.map((adAccount, index) =>
                  <li className="link-accounts__item" key={`adding-group-${adAccount.accountId}-${index}`}>
                    <span className={classNames('icon', 'channel', `adwitt-media-${adAccount.channel === 'FB' ? 'facebook' : 'google'}`)}> </span>
                    <strong className="link-accounts__name">{adAccount.accountName}</strong>
                    <span className="link-accounts__id">ID: {adAccount.accountId}</span>
                    <span className="link-accounts__currency">Currency: {adAccount.currency}</span>
                    <span className="link-accounts__time">Time Zone: {adAccount.timezone}</span>
                    <button
                      type="button"
                      className="link-accounts__exclude icon adwitt-x-circle"
                      onClick={() => deleteItemInGroupData(adAccount.accountId)}
                      data-k-click="clickSelectedItem(item, index)">
                    </button>
                  </li>,
                )}
              </ul>
            </div>
            <div className="footer--button-group small center" data-k-v-if="selectedList.length>0 || activeEditGroup">
              <Tooltip
                placement="top"
                visible={tooltip.show}
                overlay={<span>{tooltip.reason}</span>}
              >
                <button className="button-basic xsmall" onClick={this.handleCompleteGroupEditor}>
                  {editorMode === 'edit' ? 'Edit' : 'Add'}
                </button>
              </Tooltip>
              <button className="button-basic secondary xsmall" onClick={this.handleCancelGroupEditor}>Cancel</button>
            </div>
          </div>
        }
      </div>
    );
  }
}

AdAccountGroupEditor.propTypes = {
  groupData: PropTypes.object,

  deleteItemInGroupData: PropTypes.func.isRequired,
  completeGroupEditor: PropTypes.func.isRequired,
  cancelGroupEditor: PropTypes.func.isRequired,
};
