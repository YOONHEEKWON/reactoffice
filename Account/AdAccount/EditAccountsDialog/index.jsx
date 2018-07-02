import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'core/ui/Dialog';
import CheckBox from 'core/ui/CheckBox';
import InputBox from 'core/ui/InputBox';

import './style.scss';

class EditAccountsDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adAccounts: [],
      selectAccountIds: [],
      deselectAccountIds: [],
      searchKey: '',
      isAllDeselected: false,
    };
  }

  componentDidMount() {
    this.setState({
      adAccounts: this.props.adAccounts.map((acc) => {
        return {
          ...acc,
          isSelect: false,
        };
      }),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.adAccounts !== nextProps.adAccounts) {
      this.setState({
        adAccounts: this.props.adAccounts.map((acc) => Object({ ...acc })),
      });
    }
  }

  handleDialogButton = (action/*, index*/) => {
    const { close, useAdAccountsInStore } = this.props;
    const { selectAccountIds, deselectAccountIds } = this.state;

    if (action === 'submit') {
      if (this.isAllDeselected()) {
        this.setState({ isAllDeselected: true });
      } else {
        this.setState({ isAllDeselected: false });
        useAdAccountsInStore(selectAccountIds, deselectAccountIds);
        close();
      }
    } else {
      close();
    }
  };

  isFacebook = () => this.props.media === 'facebook';

  search = (e) => this.setState({ searchKey: e.target.value.trim() });

  filteredAccounts = () => {
    const { searchKey } = this.state;
    return this.props.adAccounts
      .filter((acc) => String(acc.accountId).startsWith(searchKey) || String(acc.accountName).startsWith(searchKey));
  };

  handleSelectAccount = (strAccountId, checked) => {
    const { selectAccountIds, deselectAccountIds } = this.state;
    const { adAccounts } = this.props;
    const accountId = parseInt(strAccountId, 10);
    const account = adAccounts.find((acc) => acc.accountId === accountId);

    if (checked) {
      if (account.used) {
        this.setState({ deselectAccountIds: deselectAccountIds.filter(id => id !== accountId) });
      } else {
        this.setState({ selectAccountIds: selectAccountIds.concat(accountId) });
      }
    } else {
      if (account.used) {
        this.setState({ deselectAccountIds: deselectAccountIds.concat(accountId) });
      } else {
        this.setState({ selectAccountIds: selectAccountIds.filter(id => id !== accountId) });
      }
    }
  };

  handleSelectAllAccounts = (empty, checked) => {
    const { adAccounts } = this.props;
    if (checked) {
      this.setState({
        deselectAccountIds: [],
        selectAccountIds: adAccounts
          .filter((acc) => !acc.used)
          .map((acc) => acc.accountId),
      });
    } else {
      this.setState({
        selectAccountIds: [],
        deselectAccountIds: adAccounts
          .filter((acc) => acc.used)
          .map((acc) => acc.accountId),
      });
    }
  };

  isAllDeselected = () => {
    const { adAccounts } = this.props;
    const { selectAccountIds, deselectAccountIds } = this.state;
    const 선택된계정이없다 = !selectAccountIds.length;
    const 선택된계정이모두선택해제되었다 = adAccounts
      .filter((acc) => acc.used)
      .every((acc) => deselectAccountIds.some((accountId) => accountId === acc.accountId));
    return 선택된계정이없다 && 선택된계정이모두선택해제되었다;
  };

  isAllSelected = () => {
    const { adAccounts } = this.props;
    const { selectAccountIds, deselectAccountIds } = this.state;
    const 선택해제된계정이없다 = !deselectAccountIds.length;
    const 선택안된계정이모두선택되었다 = adAccounts
      .filter((acc) => !acc.used)
      .every((acc) => selectAccountIds.some((accountId) => accountId === acc.accountId));
    return 선택해제된계정이없다 && 선택안된계정이모두선택되었다;
  };

  isSelected = (isAllSelected, account) => {
    const { selectAccountIds, deselectAccountIds } = this.state;
    const 사용하려한다 = selectAccountIds.some((accountId) => accountId === account.accountId);
    const 해지하려한다 = deselectAccountIds.some((accountId) => accountId === account.accountId);
    if (account.used && 사용하려한다) {
      return true;
    } else if (account.used && 해지하려한다) {
      return false;
    } else if (!account.used && 사용하려한다) {
      return true;
    } else if (!account.used && 해지하려한다) {
      return false;
    } else {
      return account.used;
    }
  };

  render() {
    const { isAllDeselected } = this.state;
    const accounts = this.filteredAccounts();
    const isAllSelected = this.isAllSelected();
    const dialogButtons = [
      {
        label: 'Cancel',
        description: 'Cancel',
        action: 'cancel',
        isSecondary: true,
      },
      {
        label: 'OK',
        description: 'Okay',
        action: 'submit',
        tooltip: { isShow: isAllDeselected, render: () => <span>At least 1 account must be selected.</span> },
      },
    ];

    return (
      <Dialog
        title={this.isFacebook() ? 'Facebook Accounts' : 'Google Accounts'}
        buttons={dialogButtons}
        modalClass="edit-accounts-popup"
        onClick={this.handleDialogButton}
      >
        <div className="clearfix">
          {/*<input type="text" data-type="search" className="search-input" name="" id="" placeholder="Search by Account Name or Account ID."/>*/}
          <InputBox
            data-type="search"
            className="search-input"
            placeholder="Search by Account Name or Account ID."
            onChange={this.search}
          />
          <p className="info">Select the accounts that you want to import to Adwitt.</p>
          <div className="table-default table-col h35" style={{ height: 300, overflow: 'auto' }}>
            {/*<p className="table-empty">No matching results found.</p>*/}
            <table>
              <colgroup>
                <col style={{ width: '30px' }}/>
                <col style={{ width: '130px' }}/>
                <col style={{ width: '130px' }}/>
                <col/>
              </colgroup>
              <thead>
                <tr>
                  <th className="center">
                    <CheckBox checked={isAllSelected} onChange={this.handleSelectAllAccounts}/>
                  </th>
                  <th className="left">Account Name</th>
                  <th className="left">Account ID</th>
                  <th className="left">
                    {this.isFacebook() ? <span>Business Manager (ID)</span> : <span>MCC Name (MCC Number)</span>}
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) =>
                  <tr key={`media-accounts-${account.accountId}`}>
                    <td className="center">
                      <CheckBox
                        checked={this.isSelected(isAllSelected, account)}
                        value={String(account.accountId)}
                        onChange={this.handleSelectAccount}/>
                    </td>
                    <td className="left"><span>{account.accountName}</span></td>
                    <td className="left"><span>{account.accountId}</span></td>
                    <td className="left"><span>{!account.ownerName ? '데이터없음' : account.ownerName} ({account.ownerId})</span></td>
                  </tr>,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Dialog>
    );
  }

}

EditAccountsDialog.propTypes = {
  media: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  useAdAccountsInStore: PropTypes.func.isRequired,

  adAccounts: PropTypes.object,
};

EditAccountsDialog.defaultProps = {
  media: 'facebook' // google
};

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  {},
)(EditAccountsDialog);
