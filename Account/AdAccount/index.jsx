import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAdAccounts,
  getAdAccountsForRoot,
  refreshAdAccounts,
  getAdAccountGroups,
  unlink,
  addAdAccountGroups,
  deleteAdAccountGroups,
  updateAdAccountGroups,
  getAdAccount,
  getApps,
  getIndustries,
  getPages,
  getProductCatalogs,
} from './action';
import { ROOT } from 'ai/constants/Role';
import Header from 'ai/ui/Header';
import AdAccountTable from './AdAccountTable';
import './styles.scss';

class AdAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // test 호출
    //this.props.getAdAccounts();
    // this.props.refreshAdAccounts(res => console.log(res));
    //this.props.getAdAccountGroups();
    // this.props.unlink('FB' or 'GG');
    // this.props.addAdAccountGroups([{
    //   "groupName": "테스트그룹-강상규1",
    //   "ids": [
    //     1135082372,2599226295,4132680613
    //   ]
    // }]);
    // this.props.deleteAdAccountGroups([
    //   {
    //     "groupName": "NSY그룹"
    //   }
    // ]);
    // this.props.updateAdAccountGroups([{
    //   "groupName": "박그룹_NEW",
    //   "ids": [
    //     2120724622791, 4943278333, 4399531977
    //   ],
    //   "oldGroupName": "박그룹"
    // }]);
    // this.props.getAdAccount(accountId);
    // this.props.getApps(accountId);
    // this.props.getIndustries(accountId);
    // this.props.getPages(accountId);
    // this.props.getProductCatalogs(accountId);
    // test 호출
  }

  render() {
    const { getAdAccountsForRoot, getAdAccountGroups, refreshAdAccounts } = this.props;

    return (
      <div className="page-ad-account">
        <Header name="adAccount"/>
        {this.props.role === ROOT ? //
          <AdAccountTable.Root getAdAccountsForRoot={getAdAccountsForRoot}/>
          : //
          <AdAccountTable.NotRoot getAdAccountGroups={getAdAccountGroups} refreshAdAccounts={refreshAdAccounts}/>
        }
      </div>
    );
  }
}

AdAccount.propTypes = {
  role: PropTypes.string.isRequired,

  getAdAccounts: PropTypes.func.isRequired,
  getAdAccountsForRoot: PropTypes.func.isRequired,
  refreshAdAccounts: PropTypes.func.isRequired,
  getAdAccountGroups: PropTypes.func.isRequired,
  unlink: PropTypes.func.isRequired,
  addAdAccountGroups: PropTypes.func.isRequired,
  deleteAdAccountGroups: PropTypes.func.isRequired,
  updateAdAccountGroups: PropTypes.func.isRequired,
  getAdAccount: PropTypes.func.isRequired,
  getApps: PropTypes.func.isRequired,
  getIndustries: PropTypes.func.isRequired,
  getPages: PropTypes.func.isRequired,
  getProductCatalogs: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    role: state.login.webToken.authorities[ 0 ].authority,
  };
}

export default connect(
  mapStateToProps,
  {
    getAdAccounts,
    getAdAccountsForRoot,
    refreshAdAccounts,
    getAdAccountGroups,
    unlink,
    addAdAccountGroups,
    deleteAdAccountGroups,
    updateAdAccountGroups,
    getAdAccount,
    getApps,
    getIndustries,
    getPages,
    getProductCatalogs,
  },
)(AdAccount);
