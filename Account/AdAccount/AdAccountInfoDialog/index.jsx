import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'core/ui/Dialog';
import Icon from 'core/ui/Icon';
import {
  getAdAccount,
} from 'ai/pages/Account/AdAccount/action';
import FacebookOption from './FacebookOption';
import IndustryOption from './IndustryOption';
import './style.scss';

class AdAccountInfoDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adAccount: {},
      selected: {
        pages: [],
        apps: [],
        catalogs: [],
        industries: [],
      },
    };
  }

  componentDidMount() {
    const { getAdAccount, accountId } = this.props;
    getAdAccount(accountId)
      .then((res) => this.setState({ adAccount: res.data.data[ 0 ] }));
  }

  handleDialogButton = (action/*, index*/) => {
    if (action === 'submit') {
      //
    } else {
      this.props.close();
    }
  };

  isGoogle = () => {
    return this.props.media === 'google';
  };

  handelSelect = (selectedType) => (item) => {
    const { selected } = this.state;
    this.setState({
      selected: {
        ...selected,
        [ selectedType ]: selected[ selectedType ].concat(item),
      },
    });
  };

  handelDelete = (selectedType) => (id) => () => {
    const { selected } = this.state;
    this.setState({
      selected: {
        ...selected,
        [ selectedType ]: selected[ selectedType ].filter((item) => item.id !== id),
      },
    });
  };

  render() {
    const { media, accountId } = this.props;
    const { adAccount, selected } = this.state;
    return (
      <Dialog
        title="Ad Account Info"
        width="700px"
        modalClass="ad-account-info"
        onClick={this.handleDialogButton}
      >
        <div className="fs-13">
          <dl className="clearfix ad-account-info__row">
            <dt className="float-left ad-account-info__header">Name</dt>
            <dd className="float-left fs-12 ad-account-info__body">{adAccount.accountName}</dd>
          </dl>
          <dl className="clearfix ad-account-info__row">
            <dt className="float-left ad-account-info__header">Ad Account</dt>
            <dd className="float-left fs-12 ad-account-info__body">
              <span>{accountId}
                <Icon type={`media-${media}`} style={{ fontSize: '17px', verticalAlign: 'middle', marginLeft: '5px' }}/>
              </span>
            </dd>
          </dl>
          <dl className="clearfix ad-account-info__row">
            <dt className="float-left ad-account-info__header">Currency</dt>
            <dd className="float-left fs-12 ad-account-info__body">{adAccount.currency}</dd>
          </dl>
          <dl className="clearfix ad-account-info__row">
            <dt className="float-left ad-account-info__header">Time Zone</dt>
            <dd className="float-left fs-12 ad-account-info__body">{adAccount.timezone}</dd>
          </dl>
        </div>

        {this.isGoogle() ?
          null :
          <FacebookOption
            accountId={accountId}
            selectedData={selected}
            onSelect={this.handelSelect}
            onDelete={this.handelDelete}
          />
        }

        <IndustryOption
          selectedData={selected}
          onSelect={this.handelSelect}
          onDelete={this.handelDelete}
        />
      </Dialog>
    );
  }
}

AdAccountInfoDialog.propTypes = {
  accountId: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
  media: PropTypes.string.isRequired,
  getAdAccount: PropTypes.func.isRequired,
};

AdAccountInfoDialog.defaultProps = {
  media: 'facebook' // google
};

export default connect(
  null,
  {
    getAdAccount,
  },
)(AdAccountInfoDialog);
