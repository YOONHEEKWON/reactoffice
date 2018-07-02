import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from 'core/ui/Button';
import Icon from 'core/ui/Icon';
import InputBox from 'core/ui/InputBox';
import EditAccountsDialog from 'ai/pages/Account/AdAccount/EditAccountsDialog';
import Tooltip from 'core/ui/Tooltip';

export default class AdAccountsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adAccounts: null,
      editAccountsDialog: {
        show: false,
      },
      searchKey: '',
      tooltips: [], // [{id:1,reason:'이유'}]
    };
  }

  componentDidMount() {
    this.setState({
      adAccounts: this.props.adAccounts,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.adAccounts !== nextProps.adAccounts) {
      this.setState({
        adAccounts: nextProps.adAccounts,
      });
    }
  }

  selectAdAccount = (adAccountId) => () => {
    const adAccount = this.state.adAccounts.find((a) => a.accountId === adAccountId);
    if (this.selectValid(adAccount)) {
      const targetAdAccount = {
        ...adAccount,
        isCompleted: false,
      };
      this.props.addItemInGroupData(targetAdAccount);
    }
  };

  selectValid = (adAccount) => {
    const { tooltips } = this.state;
    const { groupData: { target: { accounts, edit: { add } } } } = this.props;
    const adAccountId = adAccount.accountId;
    const addedAccounts = accounts.concat(add);
    const notExist = !addedAccounts.some((a) => a.accountId === adAccountId);
    const currencyAndTimezoneValid = addedAccounts.every((a) => a.currency === adAccount.currency && a.timezone === adAccount.timezone);
    const totalCountValid = addedAccounts.length < 10;

    const injectTooltip = (reason) => {
      if (tooltips.some((t) => t.id === adAccountId)) {
        this.setState({
          tooltips: tooltips.filter((t) => t.id !== adAccountId),
        });
      } else {
        this.setState({
          tooltips: tooltips.filter((t) => t.id !== adAccountId)
            .concat({
              id: adAccountId,
              reason: reason,
            }),
        });
      }
    };

    if (!totalCountValid) {
      injectTooltip('You can select up to 10 ad accounts.');
    } else if (!currencyAndTimezoneValid) {
      injectTooltip('The accounts in the same account group must be in the same currency and time zone.');
    } else if (!notExist) {
      injectTooltip('이미 존재하는 계정입니다.');
    } else {
      return true;
    }
    return false;
  };

  isFacebook = () => {
    return this.props.media === 'facebook';
  };

  handleEditAccounts = () => () => {
    this.setState({
      editAccountsDialog: {
        show: true,
      },
    });
  };

  handleEditAccountsClose = () => {
    this.setState({
      editAccountsDialog: {
        show: false,
      },
    });
  };

  getAccountsFrom = (group) => {
    const { accounts, edit: { add } } = group;
    return accounts.concat(add);
  };

  getAccountsFromGroups = (groups) => {
    return groups
      .map(this.getAccountsFrom)
      .reduce((arr, accounts) => {
        return arr.concat(accounts);
      }, []);
  };

  excludeSelectedGroup = (groups) => {
    const { groupData: { target } } = this.props;
    return groups.filter((group) => group.groupName !== target.groupName);
  };

  filteredAdAccounts = () => {
    const { adAccounts, searchKey } = this.state;
    const { groupData } = this.props;
    const addingAccounts = this.getAccountsFrom(groupData.target);
    const addedAccounts = this.getAccountsFromGroups(this.excludeSelectedGroup(groupData.add))
      .concat(this.getAccountsFromGroups(this.excludeSelectedGroup(groupData.edit)));
    const excludeAccounts = addedAccounts.concat(addingAccounts);

    return adAccounts
      .filter((acc) => acc.used)
      .filter((acc) => !excludeAccounts.some((a) => a.accountId === acc.accountId))
      .filter((acc) => String(acc.accountName).startsWith(searchKey) || String(acc.accountId).startsWith(searchKey));
  };

  search = (e) => this.setState({ searchKey: e.target.value.trim() });

  isProblem = (id) => this.state.tooltips.some((t) => t.id === id);

  getProblemMsg = (id) => (this.state.tooltips.find((t) => t.id === id) || {}).reason;

  render() {
    if (this.state.adAccounts === null) {
      return null;
    }

    const { media, adAccounts, useAdAccountsInStore } = this.props;
    const { editAccountsDialog } = this.state;
    const filteredAdAccounts = this.filteredAdAccounts();

    return (
      <div className={classNames('link-accounts', `link-accounts--${this.isFacebook() ? 'fb' : 'gg'}`)}>
        <div className="link-accounts__heading">
          <Icon type={this.isFacebook() ? 'media-facebook' : 'media-google'}/>
          <h2 className="link-accounts__heading-text">{this.isFacebook() ? 'Facebook' : 'Google'} Accounts</h2>
          <span className="link-accounts__length">{filteredAdAccounts.length}</span>
          <Button.Icon
            icon="pencil"
            className="link-accounts__heading__edit fs-12"
            onClick={this.handleEditAccounts()}
          />
        </div>

        <div className="link-accounts__search">
          <InputBox
            data-type="search"
            placeholder="Search by Account Name or ID."
            style={{ width: '280px' }}
            onChange={this.search}
          />
        </div>

        <div className="link-accounts__list">
          {!filteredAdAccounts.length ? //
            <p className="no-match__info">No matching results founds.</p>
            : //
            <ul>
              {filteredAdAccounts.map((adAccount) =>
                <Tooltip
                  placement="topLeft"
                  overlay={<span>{this.getProblemMsg(adAccount.accountId)}</span>}
                  visible={this.isProblem(adAccount.accountId)}
                  key={`AdAccountsBox-accounts-${adAccount.accountId}`}
                  getTooltipContainer={() => this.refs[ `tt-acc-${adAccount.accountId}` ]}
                >
                  <li
                    ref={`tt-acc-${adAccount.accountId}`}
                    className={`link-accounts__item tt-acc-${adAccount.accountId}`}
                    onClick={this.selectAdAccount(adAccount.accountId)}
                  >
                    <strong className="link-accounts__name">{adAccount.accountName}</strong>
                    <span className="link-accounts__id">ID: {adAccount.accountId}</span>
                    <span className="link-accounts__currency">Currency: {adAccount.currency}</span>
                    <span className="link-accounts__time">Time Zone: {adAccount.timezone}</span>
                  </li>
                </Tooltip>,
              )}
            </ul>
          }
        </div>

        {editAccountsDialog.show ? //
          <EditAccountsDialog
            media={media}
            adAccounts={adAccounts}
            close={this.handleEditAccountsClose}
            useAdAccountsInStore={useAdAccountsInStore}
          >
          </EditAccountsDialog>
          : null
        }

      </div>
    );
  }
}

AdAccountsBox.propTypes = {
  media: PropTypes.string.isRequired, // facebook, google
  adAccounts: PropTypes.array,
  groupData: PropTypes.object,

  addItemInGroupData: PropTypes.func.isRequired,
  useAdAccountsInStore: PropTypes.func.isRequired,
};
