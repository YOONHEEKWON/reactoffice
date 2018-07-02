import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  setDataFilter,
  getCampaignSummaryList,
  getCampaignDetailsFilters,
  getCampaignDetailsReport,
  getDashboardDetailCampaignReport,
  getDashboardDetailReportCampaignLink,
} from './action';
import { changeMenu, redirectPage } from 'ai/action';
import { systemMessage } from 'core/components/SystemMessage/action';
import Header from 'ai/ui/Header';
import MediaFilter from './MediaFilter';
import CampaignSummary from './CampaignSummary';
import CampaignDetails from './CampaignDetails';
import { DATE_FORMAT } from 'core/constants/Configure';
import moment from 'moment/moment';

import './styles.scss';

const initialData = {
  channel: {
    FB: true,
    GG: true,
  },
  startDate: moment().add(-1, 'days').format(DATE_FORMAT),
  endDate: moment().add(-1, 'days').format(DATE_FORMAT),
};

class Dashboard extends Component {

  handleClickCampaign = (campaignId) => this.props.redirectPage(`/campaign/${campaignId}`, this.props.history.push);

  render() {
    return (
      <div>
        <Header name="dashboard">
        </Header>

        <div className="page-dashboard">

          <MediaFilter
            initialData={initialData}
            setDataFilter={this.props.setDataFilter}
          />

          <CampaignSummary
            initialData={initialData}
            dataFilter={this.props.dataFilter}
            getCampaignSummaryList={this.props.getCampaignSummaryList}
            campaignSummaryList={this.props.campaignSummaryList}
          />

          <CampaignDetails
            initialData={initialData}
            webToken={this.props.webToken}
            systemMessage={this.props.systemMessage}
            onClickCampaign={this.handleClickCampaign}
            dataFilter={this.props.dataFilter}
            getCampaignDetailsFilters={this.props.getCampaignDetailsFilters}
            campaignDetailsFilters={this.props.campaignDetailsFilters}
            getCampaignDetailsReport={this.props.getCampaignDetailsReport}
            campaignDetailsReport={this.props.campaignDetailsReport}
            getDashboardDetailReportCampaignLink={this.props.getDashboardDetailReportCampaignLink}
          />
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  campaignDetailsList: PropTypes.array,

  webToken: PropTypes.object,
  dashboardCampaignLink: PropTypes.array,
  dataFilter: PropTypes.object,
  campaignSummaryList: PropTypes.array,
  campaignDetailsFilters: PropTypes.array,
  campaignDetailsReport: PropTypes.array,

  redirectPage: PropTypes.func.isRequired,
  changeMenu: PropTypes.func.isRequired,
  systemMessage: PropTypes.func.isRequired,
  setDataFilter: PropTypes.func.isRequired,
  getCampaignSummaryList: PropTypes.func.isRequired,
  getCampaignDetailsFilters: PropTypes.func.isRequired,
  getCampaignDetailsReport: PropTypes.func.isRequired,
  getDashboardDetailCampaignReport: PropTypes.func.isRequired,
  getDashboardDetailReportCampaignLink: PropTypes.func.isRequired,

  history: PropTypes.object.isRequired, // React Router
  location: PropTypes.object.isRequired, // React Router,
};

function mapStateToProps(state) {
  return {
    webToken: state.login.webToken,
    dashboardCampaignLink: state.dashboard.dashboardCampaignLink,
    dataFilter: state.dashboard.dataFilter,
    campaignSummaryList: state.dashboard.campaignSummary.list,
    campaignDetailsFilters: state.dashboard.campaignDetails.filters,
    campaignDetailsReport: state.dashboard.campaignDetails.report,
  };
}

export default withRouter(connect(
  mapStateToProps,
  {
    redirectPage,
    changeMenu,
    systemMessage,
    setDataFilter,
    getCampaignSummaryList,
    getCampaignDetailsFilters,
    getCampaignDetailsReport,
    getDashboardDetailCampaignReport,
    getDashboardDetailReportCampaignLink,
  },
)(Dashboard));
