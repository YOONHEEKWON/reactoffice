import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Content from 'core/ui/Content';
import InputBox from 'core/ui/InputBox';
import StickyTable from 'core/ui/StickyTable';

import './Root.scss';

const columns = [
  { key: 'companyName', label: 'Company Name', align: 'center' },
  { key: 'accountName', label: 'Account Name', align: 'center' },
  { key: 'accountId', label: 'Account ID', align: 'center' },
  {
    key: 'channel', label: 'Media', align: 'center', renderCell: (value, rowData, colInfo) =>
      value === 'FB' ? <span>Facebook</span> : <span>Google</span>,
  },
  { key: 'industryDisplayName', label: 'Industry', align: 'center' },
  { key: 'currency', label: 'Currency', align: 'center' },
  { key: 'timezone', label: 'Time Zone', align: 'center' },
];

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adAccounts: [],
      searchKey: '',
    };
  }

  componentDidMount() {
    this.props.getAdAccountsForRoot();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.adAccounts !== nextProps.adAccounts) {
      this.setState({
        adAccounts: nextProps.adAccounts.map((acc) => {
          return {
            ...acc,
            industryDisplayName: !acc.industryName ? '' : `[${acc.industryName}] ${acc.industrySubName}`,
          };
        }),
      });
    }
  }

  search = (e) => {
    this.setState({
      searchKey: e.target.value,
    });
  };

  filteredData = () => {
    const { adAccounts, searchKey } = this.state;
    const lcKey = searchKey.toLowerCase();
    return adAccounts.filter((a) =>
      String(a.companyName).toLowerCase().startsWith(lcKey) || String(a.accountName).toLowerCase().startsWith(lcKey),
    );
  };

  render() {
    const accounts = this.filteredData();

    return (
      <Content.Card className="ad-account-table-root">
        <div className="contents-search_and_info">
          <span className="search-box">
            <InputBox
              data-type="search"
              placeholder="Search by ID, Name or Company Name."
              style={{ width: '360px' }}
              onChange={this.search}
            />
          </span>
          <p className="info">
            <strong>{accounts.length}</strong>
            <span>ad accounts</span>
          </p>
        </div>
        <div className="content-table">
          <StickyTable columns={columns} data={accounts}/>
        </div>
      </Content.Card>
    );
  }
}

Root.propTypes = {
  getAdAccountsForRoot: PropTypes.func,
  adAccounts: PropTypes.array,
};

Root.defaultProps = {};

function mapStateToProps(state) {
  return {
    adAccounts: state.adAccount.adAccounts,
  };
}

export default connect(
  mapStateToProps,
  {},
)(Root);
