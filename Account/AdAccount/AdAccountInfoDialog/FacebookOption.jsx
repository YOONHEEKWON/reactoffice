import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getPages,
  getApps,
  getProductCatalogs,
} from 'ai/pages/Account/AdAccount/action';

import OptionSelectBox from './OptionSelectBox';

class FacebookOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      productCatalogs: [],
    };
  }

  componentDidMount() {
    const { pages, getPages, getApps, getProductCatalogs, accountId } = this.props;
    getApps(accountId)
      .then((res) => this.setState({ apps: res.data.data }))
      .catch(console.log);
    getProductCatalogs(accountId)
      .then((res) => this.setState({ productCatalogs: res.data.data }))
      .catch(console.log);
    if (!pages.length) {
      getPages();
    }
  }

  render() {
    const { selectedData, onSelect, onDelete } = this.props;

    return (
      <div className="ad-account-info__divider">
        <dl className="clearfix ad-account-info__row">
          <dt className="float-left ad-account-info__header">Page</dt>
          <dd className="float-left fs-12 ad-account-info__body">

            <OptionSelectBox
              data={[ { id: 1, text: 'pages aa' }, { id: 2, text: 'pages bb' }, { id: 3, text: 'pages cc' } ]}
              selectedData={selectedData.pages}
              onSelect={onSelect('pages')}
              onDelete={onDelete('pages')}
              placeholder="Select Page"
            />

          </dd>
        </dl>

        <dl className="clearfix ad-account-info__row">
          <dt className="float-left ad-account-info__header">App</dt>
          <dd className="float-left fs-12 ad-account-info__body">

            <OptionSelectBox
              data={[ { id: 1, text: 'apps aa' }, { id: 2, text: 'apps bb' }, { id: 3, text: 'apps cc' } ]}
              selectedData={selectedData.apps}
              onSelect={onSelect('apps')}
              onDelete={onDelete('apps')}
              placeholder="Select App"
            />

          </dd>
        </dl>

        <dl className="clearfix ad-account-info__row">
          <dt className="float-left ad-account-info__header">Product Catalog</dt>
          <dd className="float-left fs-12 ad-account-info__body">

            <OptionSelectBox
              data={[ { id: 1, text: 'catalogs aa' }, { id: 2, text: 'catalogs bb' }, { id: 3, text: 'catalogs cc' } ]}
              selectedData={selectedData.catalogs}
              onSelect={onSelect('catalogs')}
              onDelete={onDelete('catalogs')}
              placeholder="Select Product Catalog"
            />

          </dd>
        </dl>
      </div>
    );
  }
}

FacebookOption.propTypes = {
  pages: PropTypes.array,
  getPages: PropTypes.func.isRequired,
  getApps: PropTypes.func.isRequired,
  getProductCatalogs: PropTypes.func.isRequired,

  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,

  accountId: PropTypes.number.isRequired,
  selectedData: PropTypes.array.isRequired,
};

FacebookOption.defaultProps = {};

function mapStateToProps(state) {
  return {
    pages: state.adAccount.pages,
  };
}

export default connect(
  mapStateToProps,
  {
    getPages,
    getApps,
    getProductCatalogs,
  },
)(FacebookOption);
