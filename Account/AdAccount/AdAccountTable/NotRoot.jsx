import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';
import Content from 'core/ui/Content';
import Icon from 'core/ui/Icon';
import Button from 'core/ui/Button';
import InputBox from 'core/ui/InputBox';
import Tooltip from 'core/ui/Tooltip';
import ArrowButton from 'ai/pages/Account/AdAccount/ArrowButton';
import LinkMediaDialog from 'ai/pages/Account/AdAccount/LinkMediaDialog';
import ManageAccountGroupDialog from 'ai/pages/Account/AdAccount/ManageAccountGroupDialog';
import AdAccountInfoDialog from 'ai/pages/Account/AdAccount/AdAccountInfoDialog';

import './NotRoot.scss';

class NotRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adAccountGroups: null,
      filteredData: null,
      toggle: null,
      sort: {
        uiName: null, // sort-asc, sort-desc
        accountId: null,
        channel: null,
        industry: null,
        timezone: null,
      },
      dialog: {
        linkMedia: false,
        manageAccountGroup: false,
        adAccountInfo: false,
        accountId: null,
        media: null,
        groupName: null,
      },
    };
  }

  componentDidMount() {
    this.props.getAdAccountGroups();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.adAccountGroups === null || nextProps.adAccountGroups !== this.props.adAccountGroups) {
      const groupData = this.sortting(this.toGroupData(nextProps.adAccountGroups), 'uiName');
      this.setState({
        adAccountGroups: groupData,
        filteredData: groupData,
        toggle: groupData,
      });
    }
  }

  sortting = (filteredData, type) => {
    const { sort } = this.state;
    const compare = (a, b) => sort[ type ] === 'sort-asc' ? //
      String(b[ type ])
        .localeCompare(String(a[ type ])) //
      : //
      String(a[ type ])
        .localeCompare(String(b[ type ]));
    const compareName = (a, b) => sort[ type ] === 'sort-asc' ? //
      String(b.accountName)
        .localeCompare(String(a.accountName)) //
      : //
      String(a.accountName)
        .localeCompare(String(b.accountName));

    let groupData;
    switch (type) {
      case 'uiName':
        groupData = filteredData.sort(compare);
        groupData
          .filter((group) => group.isGroup)
          .forEach((group) => {
            group.children = group.children.sort(compareName);
          });
        break;
      default:
        groupData = filteredData.sort(compare);
        groupData
          .filter((group) => group.isGroup)
          .forEach((group) => {
            group.children = group.children.sort(compare);
          });
        break;
    }
    return groupData;
  };

  // 팝업창 여닫기
  toggleDialog = (type, accountId) => () => {
    const { dialog } = this.state;
    this.setState({
      dialog: {
        ...dialog,
        [ type ]: !dialog[ type ],
        accountId: dialog[ type ] ? null : accountId,
      },
    });
  };

  toggleManageGroupDialog = (groupName) => () => {
    const { dialog } = this.state;
    this.setState({
      dialog: {
        ...dialog,
        manageAccountGroup: !dialog.manageAccountGroup,
        groupName: dialog.manageAccountGroup ? null : groupName,
      },
    });
  };

  toggleAdAccountInfoDialog = (accountId, channel) => () => {
    const { dialog } = this.state;
    this.setState({
      dialog: {
        ...dialog,
        adAccountInfo: !dialog.adAccountInfo,
        accountId: accountId,
        media: channel === 'FB' ? 'facebook' : 'google',
      },
    });
  };

  // 테이블의 행을 펼칠지 감지한다.
  isOpen = (groupName) => {
    const { filteredData, toggle } = this.state;

    if (!filteredData) {
      return true;
    }

    if (groupName === 'ALL') {
      return filteredData.length === toggle.length;
    }
    return toggle.some(group => group.groupName === groupName);
  };

  // 테이블의 행을 펼침/닫힘
  toggle = (groupName) => () => {
    const { filteredData, toggle } = this.state;
    if (groupName === 'ALL') {
      if (filteredData.length === toggle.length) {
        this.setState({
          toggle: [],
        });
      } else {
        this.setState({
          toggle: filteredData,
        });
      }
      return;
    }

    const exist = toggle.some(group => group.groupName === groupName);
    if (exist) {
      this.setState({
        toggle: toggle.filter(group => group.groupName !== groupName),
      });
    } else {
      this.setState({
        toggle: toggle.concat({ groupName: groupName }),
      });
    }
  };


  toGroupData = (adAccountGroups) => {
    return adAccountGroups
    // group list
      .filter((account) => !!account.groupName)
      .reduce((a, b) => {
        if (a.some((group) => group.uiName === b.groupName)) {
          a.find((group) => group.groupName === b.groupName)
            .children
            .push({ ...b, uiName: b.accountName, });
        } else {
          a.push({
            //...b,
            accountId: '',
            accountName: '',
            channel: '',
            currency: '',
            timezone: '',
            groupName: b.groupName,
            uiName: b.groupName,
            isGroup: true,
            children: [ { ...b, uiName: b.accountName } ],
          });
        }
        return a;
      }, []) // group list
      // group list + group level account list
      .concat(
        adAccountGroups
          .filter((account) => !account.groupName)
          .map((account) => {
            return { ...account, uiName: account.accountName, isGroup: false };
          }),
      ); // group list + group level account list
  };

  handleSort = (type) => () => {
    const { filteredData, sort } = this.state;
    this.setState({
      sort: {
        ...sort,
        [ type ]: sort[ type ] === null ? 'sort-asc' : sort[ type ] === 'sort-asc' ? 'sort-desc' : 'sort-asc',
      },
      filteredData: this.sortting(filteredData, type),
    });
  };

  classNameSort = (type) => {
    const res = this.state.sort[ type ];
    switch (res) {
      case null:
        return 'sort-none';
      case 'sort-asc':
        return 'sort-desc';
      case 'sort-desc':
        return 'sort-asc';
      default:
        break;
    }
  };

  handleSearch = (e) => {
    const { value } = e.target;
    const { adAccountGroups } = this.state;

    if (!value.trim()) {
      this.setState({
        filteredData: adAccountGroups,
        sort: {
          uiName: null, // sort-asc, sort-desc
          accountId: null,
          channel: null,
          industry: null,
          timezone: null,
        },
      });
      return;
    }

    const toLowerCase = (str) => String(str)
      .toLocaleLowerCase();
    const isSame = (group) =>
      toLowerCase(group.uiName).startsWith(toLowerCase(value))
      || toLowerCase(group.accountId).startsWith(toLowerCase(value));

    const cloneAdAccountGroups = _.cloneDeep(adAccountGroups);

    const children = cloneAdAccountGroups
      .filter((group) => group.isGroup)
      .reduce((a, b) => a.concat(b.children.filter(isSame)), []);

    const groups = cloneAdAccountGroups
      .map((group) => {
        group.children = [];
        return group;
      })
      .filter(isSame);
    groups
      .filter((group) => group.isGroup)
      .forEach((group) => {
        group.children = children.filter((act) => act.groupName === group.groupName);
      });

    // group 이 조회되지 않은 children 계정들 포함하기.
    const supplementGroups = children
      .filter((act) => !groups.some((group) => group.groupName === act.groupName))
      .reduce((groups, act) => {
        if (groups.some((group) => group.groupName === act.groupName)) {
          groups
            .find((group) => group.groupName === act.groupName)
            .children
            .push(act);
        } else {
          const g = _.cloneDeep(adAccountGroups)
            .find((group) => group.isGroup && group.groupName === act.groupName);
          g.children = [ act ];
          groups.push(g);
        }
        return groups;
      }, []);


    this.setState({
      filteredData: this.sortting(groups.concat(supplementGroups), 'uiName'),
      sort: {
        uiName: null, // sort-asc, sort-desc
        accountId: null,
        channel: null,
        industry: null,
        timezone: null,
      },
    });
  };

  renderGroup = () => {
    const { filteredData } = this.state;
    if (filteredData === null || filteredData.length === 0) {
      return this.renderEmptyTable();
    }

    return filteredData
      .map((account) => {
        const isEmptyGroup = account.isGroup ? account.children.every((acc) => !acc.channel) : true;
        return (
          account.isGroup ? //
            <tbody key={`group-list-${account.uiName}`}>
              <tr>
                <td className="left">
                  <span>{account.uiName}</span>
                  <Tooltip
                    placement="top"
                    overlay={<span>Test Tooltip.</span>}>
                    <span><Icon type="exclamation-circle" className={classNames('info-icon')}/></span>
                  </Tooltip>
                  {isEmptyGroup ? null : <ArrowButton isToggle={this.isOpen(account.uiName)} handleClick={this.toggle(account.uiName)}/>}
                </td>
                <td className="left" colSpan={5}>
                </td>
                <td className="left">
                  <span>
                    <Button.Flat label="Edit" className="xsmall" onClick={this.toggleManageGroupDialog(account.uiName)}/>
                  </span>
                </td>
              </tr>

              {isEmptyGroup ?
                null :
                this.renderChildAccount(account.groupName)
              }

            </tbody>
            : this.renderGroupLevelAccount(account)
        );
      });
  };

  renderGroupLevelAccount = (account) => {
    return (
      <tbody key={`${account.uiName}_${account.accountId}`}>
        <tr>
          <td className="left">
            <span>{account.uiName}</span>
            <Tooltip
              placement="top"
              overlay={<span>Test Tooltip.</span>}>
              <span><Icon type="exclamation-circle" className={classNames('info-icon')}/></span>
            </Tooltip>
          </td>

          <td className="left">
            <span>{account.accountId}</span>
          </td>
          <td className="left">
            <span>{account.channel === 'FB' ? 'Facebook' : 'Google'}</span>
          </td>
          <td className="left">
            <span>{!account.industry ? null : `${account.industryMainName} / ${account.industrySubName}`}</span>
          </td>
          <td className="left">
            <span>{account.currency}</span>
          </td>
          <td className="left">
            <span>{account.timezone}</span>
          </td>
          <td className="left">
            <span>
              <Button.Flat label="Edit" className="xsmall" onClick={this.toggleAdAccountInfoDialog(account.accountId, account.channel)}/>
            </span>
          </td>
        </tr>
      </tbody>
    );
  };

  renderChildAccount = (groupName) => {
    const { filteredData } = this.state;
    return (
      filteredData
        .find((act) => act.groupName === groupName)
        .children
        .map((act, index) => {
          return (
            <tr key={`${act.accountId}-${index}`} data-group_name={act.groupName}
              className={classNames('child', 'row-gray', { active: this.isOpen(act.groupName) })}>
              <td className="left">
                <span className="name">{act.accountName}</span>
                <Tooltip
                  placement="top"
                  overlay={<span>Test Tooltip.</span>}>
                  <span><Icon type="exclamation-circle" className={classNames('info-icon')}/></span>
                </Tooltip>
              </td>
              <td className="left"><span>{act.accountId}</span></td>
              <td className="left"><span>{act.channel === 'FB' ? 'Facebook' : 'Google'}</span></td>
              <td className="left"><span>{act.industry}</span></td>
              <td className="left"><span>{act.currency}</span></td>
              <td className="left"><span>{act.timezone}</span></td>
              <td className="left">
                <span>
                  <Button.Flat label="Edit" className="xsmall" secondary onClick={this.toggleAdAccountInfoDialog(act.accountId, act.channel)}/>
                </span>
              </td>
            </tr>
          );
        })
    );
  };

  renderEmptyTable = () => {
    return (
      <tbody key="empty">
        <tr>
          <td className="left" colSpan={7}>
            비엇다!!
          </td>
        </tr>
      </tbody>
    );
  };

  render() {
    return (
      <div>
        <Content.Card className="ad-account-table-not-root">
          <div className="contents-search_and_button">
            <span className="left-search">
              <InputBox
                data-type="search"
                placeholder="Search by ID, Name or Company Name."
                style={{ width: '360px' }}
                onChange={this.handleSearch}
              />
            </span>
            <span className="right-button">
              <Button.Flat label="Refresh List" primary className="medium" onClick={this.props.refreshAdAccounts}/>
              <Button.Flat label="Link Media" className="medium" onClick={this.toggleDialog('linkMedia')}/>
              <Button.Flat label="Manage Account Group" className="medium" onClick={this.toggleManageGroupDialog(null)}/>
            </span>
          </div>
          <div className="table-default ad-account-table table-col">
            <table>
              <colgroup>
                <col/>
                <col style={{ width: '165px' }}/>
                <col style={{ width: '120px' }}/>
                <col/>
                <col style={{ width: '100px' }}/>
                <col style={{ width: '110px' }}/>
                <col style={{ width: '110px' }}/>
              </colgroup>
              <thead>
                <tr>
                  <th className="left" ref="nameTh">
                    <span>Account Group & Account Name</span>
                    <span className={classNames('sort', this.classNameSort('uiName'))} onClick={this.handleSort('uiName')}/>
                    <ArrowButton isToggle={this.isOpen('ALL')} handleClick={this.toggle('ALL')}/>
                  </th>
                  <th className="left">Account ID
                    <span className={classNames('sort', this.classNameSort('accountId'))} onClick={this.handleSort('accountId')}/>
                  </th>
                  <th className="left">Media
                    <span className={classNames('sort', this.classNameSort('channel'))} onClick={this.handleSort('channel')}/>
                  </th>
                  <th className="left">Industry
                    <span className={classNames('sort', this.classNameSort('industry'))} onClick={this.handleSort('industry')}/>
                  </th>
                  <th className="left">Currency
                    <span className={classNames('sort', this.classNameSort('currency'))} onClick={this.handleSort('currency')}/>
                  </th>
                  <th className="left">Time Zone
                    <span className={classNames('sort', this.classNameSort('timezone'))} onClick={this.handleSort('timezone')}/>
                  </th>
                  <th className="left">Edit</th>
                </tr>
              </thead>

              {this.renderGroup()}

            </table>
          </div>
        </Content.Card>

        {!this.state.dialog.linkMedia ?
          null :
          <LinkMediaDialog close={this.toggleDialog('linkMedia')}/>
        }
        {!this.state.dialog.manageAccountGroup ?
          null :
          <ManageAccountGroupDialog
            groupName={this.state.dialog.groupName}
            close={this.toggleDialog('manageAccountGroup')}
          />
        }
        {!this.state.dialog.adAccountInfo ?
          null :
          <AdAccountInfoDialog
            media={this.state.dialog.media}
            accountId={this.state.dialog.accountId}
            close={this.toggleDialog('adAccountInfo')}
          />
        }
      </div>
    );
  }
}

NotRoot.propTypes = {
  getAdAccountGroups: PropTypes.func,
  refreshAdAccounts: PropTypes.func,
  adAccountGroups: PropTypes.array,
};

NotRoot.defaultProps = {};

function mapStateToProps(state) {
  return {
    adAccountGroups: state.adAccount.adAccountGroups,
  };
}

export default connect(
  mapStateToProps,
  {},
)(NotRoot);
