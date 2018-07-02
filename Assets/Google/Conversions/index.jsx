import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountSelectBox from 'ai/ui/AccountSelectBox';
import Button from 'core/ui/Button';
import CampaignStatus from 'ai/ui/CampaignStatus';
import Header from 'ai/ui/Header';
import StickyTable from 'core/ui/StickyTable';
import AddNewConversionsModal from './AddNewConversionsModal';
import { getConversionList } from './action';

class GoogleConversions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowAddNewConversionsModal: false,
    };
  }

  componentWillMount() {
    this.columns = [
      {
        key: 'status', label: 'Status', width: '5%', isSortable: true, renderCell: (value) =>
          <span>
            <CampaignStatus status={value}/>
            <Button.Icon icon="arrow-bottom-line"/>
          </span>,
      },
      { key: 'name', label: 'Name', width: '14%', isSortable: true, align: 'left' },
      { key: 'source', label: 'Source', width: '10%', isSortable: true },
      { key: 'category', label: 'Category', width: '10%', isSortable: true },
      { key: 'conversionTrackerType', label: 'Tracking Status', width: '10%', isSortable: true },
      { key: 'conversionWindow', label: 'Conversion Window', isSortable: true, renderCell: (value) => this.renderConversionWindow(value) },
      { key: 'count', label: 'Count', isSortable: true },
      { key: 'includeInConversions', label: 'Include in “Conversions”', isSortable: true, renderCell: (value) => value ? 'No' : 'Yes' },
      { key: '_repeatRate', label: 'Repeat Rate', isSortable: true, alian: 'right', renderCell: () => 0.00 },
      { key: '_allConv', label: 'All Conv.', tooltip: 'All Conversions', isSortable: true, alian: 'right', renderCell: () => 0.00 },
      { key: '_repeatRate', label: 'All Conv.value', tooltip: 'All Conversions Value', isSortable: true, alian: 'right', renderCell: () => 0.00 },
    ];

    if (this.props.webToken.channeltoken) {
      this.handleLoadConversionList();
    }
  }

  handleLoadConversionList = () => this.props.getConversionList(this.props.webToken.channeltoken[ 0 ].GG.ownerId);

  onClickAddNewConversions = () => this.setState({ isShowAddNewConversionsModal: true });

  onClickDoneAddNewConversions = () => this.setState({ isShowAddNewConversionsModal: false });

  onClickCancelAddNewConversions = () => this.setState({ isShowAddNewConversionsModal: false });

  renderConversionWindow = (value) => {
    const numValue = Number(value);
    if (numValue < 30) {
      const divided = Math.floor(numValue / 7);
      return `${divided} week${divided > 1 ? 's' : ''}`;
    }
    return `${numValue.toLocaleString('en')} days`;
  };

  render() {
    const { conversionList } = this.props;

    return (
      <div>
        <Header name="googleConversions"/>

        <div className="bs row contents--account-conversion-action">
          <h3 className="sub-title inline-block">Ad Account for Conversion Actions</h3>
          <div className="sub-contents inline-block">
            <AccountSelectBox onChange={() => {
            }}/>
          </div>
        </div>

        <div className="bs row">
          <div className="contents--add-conversions inline-block">
            {/* aria-expanded="false / true" 로 툴팁 토글 */}
            <Button.Flat
              label="+ App Conversions"
              expanded
              className="button--add-conversions gg-color medium"
              onClick={this.onClickAddNewConversions}
            />

            {/*<div className="list--bubble-wrap">
             <div className="list--bubble-inner">
             <ul className="list--bubble fs-12">
             <li><a className="list--bubble__item">Website</a></li>
             <li><a className="list--bubble__item selected">App</a></li>
             <li><a className="list--bubble__item">Phone calls</a></li>
             <li><a className="list--bubble__item">Import</a></li>
             </ul>
             </div>
             </div>*/}
          </div>

          {/* table */}
          <div className="table--conversion-list">
            <StickyTable
              columns={this.columns}
              data={conversionList}
              dataKey="name"
              noDataTemplate="No data available in table."
            />
          </div>
          {/* // table */}
        </div>
        {this.state.isShowAddNewConversionsModal ?
          <AddNewConversionsModal
            webToken={this.props.webToken}
            loadConversionList={this.handleLoadConversionList}
            onClickDone={this.onClickDoneAddNewConversions}
            onClickCancel={this.onClickCancelAddNewConversions}
          />
          : null
        }
      </div>
    );
  }
}

GoogleConversions.propTypes = {
  webToken: PropTypes.object,
  conversionList: PropTypes.array,
  getConversionList: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    webToken: state.login.webToken,
    conversionList: state.assets.googleConversions.conversionList,
  };
}

export default connect(
  mapStateToProps,
  {
    getConversionList,
  },
)(GoogleConversions);
