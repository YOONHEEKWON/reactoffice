import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from 'core/ui/Button';
import CampaignStatus from 'ai/ui/CampaignStatus';
import Content from 'core/ui/Content';
import DateRangePicker from 'core/ui/DateRangePicker';
import InputBox from 'core/ui/InputBox';
import StickyTable from 'core/ui/StickyTable';
import TagList from 'core/ui/TagList';
import { DATE_FORMAT } from 'core/constants/Configure';

const today = moment().format(DATE_FORMAT);

export default class DashboardMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerAccountId: String(props.webToken.channeltoken[ 0 ].GG.ownerId),
      isLoadedReport: false,
      startDate: today,
      endDate: today,
      selectedFilter: '',
      searchText: '',
      addedSearchText: [],
      addedSearchForm: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.webToken.channeltoken !== nextProps.webToken.channeltoken) {
      this.setState({
        ownerAccountId: String(nextProps.webToken.channeltoken[ 0 ].GG.ownerId),
      });
    }
    if (this.props.dashboardFilters !== nextProps.dashboardFilters) {
      if (nextProps.dashboardFilters.length) {
        const data = nextProps.dashboardFilters[ 0 ];
        this.setState({
          selectedFilter: `${data.optionValue}|${data.optionName}`,
        });
      } else {
        this.setState({
          selectedFilter: '',
        });
      }
    }
  }

  componentWillMount() {
    // 테이블 칼럼 정의
    this.columns = {
      accountPerformance: [
        { key: 'name', label: 'Account' },
        { key: 'cost', label: 'Cost', width: '16%', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'impressions', label: 'Impr.', tooltip: 'Impressions', width: '16%', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'clicks', label: 'Clicks', width: '16%', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'conversions', label: 'Conversions', width: '16%', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'allConv', label: 'All Conv.', tooltip: 'All Conversions', width: '16%', renderCell: (value) => Number(value).toLocaleString('en') },
      ],
      campaignList: [
        { key: 'customerID', label: 'Account', width: '10%' },
        {
          key: 'campaignState', label: 'Status', width: '5%', align: 'center', renderCell: (value, rowData) => {
            if (!rowData.isGroup) {
              return <CampaignStatus status={value}/>;
            } else {
              return null;
            }
          },
        },
        {
          key: 'campaignName', label: 'Campaign Name', width: '20%', align: 'left', renderCell: (value, rowData) => {
            if (!rowData.isGroup) {
              return <span title={rowData.campaign}>{this.renderCampaignLink(rowData.campaignID, rowData.campaign)}</span>;
            } else {
              return <span>{rowData.network}</span>;
            }
          },
        },
        { key: 'advertisingChannel', label: 'Campaign Type' },
        { key: 'startDate', label: 'Start Time', align: 'center' },
        { key: 'endDate', label: 'End Time', align: 'center' },
        { key: 'budget', label: 'Budget', align: 'right', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'cost', label: 'Cost', align: 'right', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'impressions', label: 'Impr.', tooltip: 'Impressions', align: 'right', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'clicks', label: 'Click', align: 'right', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'ctr', label: 'CTR', align: 'right', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'conversions', label: 'Conversions', align: 'right', renderCell: (value) => Number(value).toLocaleString('en') },
        { key: 'allConv', label: 'All Conv.', tooltip: 'All Conversions', align: 'right', renderCell: (value) => Number(value).toLocaleString('en') },
      ],
    };

    if (!this.state.isLoadedReport) {
      this.addDefaultFilter();

      // 대시보드 리스트 불러오기
      //this.props.getDashboardList({
      //  ownerAccountId: this.state.ownerAccountId
      //});

      // 대시보드 필터 목록 불러오기
      this.props.getDashboardFilters();

      this.handleLoadDashboardDetail();

      this.setState({
        isLoadedReport: true,
      });
    }
  }

  componentDidMount() {
    if (this.state.selectedFilter) {
      this.refDashboardFilter.selectedIndex = 0;
    }
  }

  handleLoadDashboardDetail = () => {
    // 대시보드 전체 데이터 불러오기
    //this.props.getDashboardDetail({
    //  ownerAccountId: this.state.ownerAccountId,
    //  inclAccountId: [ this.state.ownerAccountId ],
    //  startDate: this.state.startDate,
    //  endDate: this.state.endDate,
    //  //id: this.props.channelToken.id,
    //}, 'GG');

    // Account Report 불러오기
    this.props.getDashboardDetailAccountReport({
      inclAccountId: this.state.ownerAccountId,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      channel: 'GG',
    });

    // Campaign Report 불러오기
    this.props.getDashboardDetailCampaignReport({
      inclAccountId: [ this.state.ownerAccountId ],
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      filters: this.state.addedSearchForm || [],
    });

    // 대시보드 캠페인ID 목록 (링크) 불러오기
    this.props.getDashboardDetailReportCampaignLink(this.state.ownerAccountId, {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    });
  };

  handleChangeCampaignPerformanceDate = (startDate, endDate) => {
    if (this.state.startDate !== startDate || this.state.endDate !== endDate) {
      this.setState({
        startDate,
        endDate,
      }, this.handleLoadDashboardDetail);
    }
  };

  handleChangeSearchText = (e) => this.setState({ searchText: e.target.value });

  handleGetDashboardDetailReport = () => {
    // "Add" 버튼 클릭시 Campaign Report 검색
    const requestForm = {
      inclAccountId: [ this.state.ownerAccountId ],
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      filters: this.state.addedSearchForm || [],
    };
    this.props.getDashboardDetailCampaignReport(requestForm);
  };

  addFilter = (filterName, optionName, optionValue = '') => {
    const addedSearchText = this.state.addedSearchText;
    const insertText = optionValue ? `${optionName}: ${optionValue}` : `${optionName}`;

    if (!addedSearchText.filter((item) => item === insertText).length) {
      addedSearchText.push({ label: insertText });
      const addedSearchForm = this.state.addedSearchForm;
      addedSearchForm.push({ type: filterName, optionValue });

      this.setState({
        searchText: '',
        addedSearchText,
        addedSearchForm,
      }, this.handleGetDashboardDetailReport);
    }
  };

  addDefaultFilter = () => {
    // 초기 기본 필터 추가 (ACTIVE)
    const addedSearchText = this.state.addedSearchText;
    addedSearchText.push({ label: 'Campaign Status: ACTIVE' });
    const addedSearchForm = this.state.addedSearchForm;
    addedSearchForm.push({ type: 'campaignStatus', optionValue: 'ACTIVE' });
    this.setState({
      addedSearchText,
      addedSearchForm,
    });
  };

  onChangeDashboardFilter = (e) => {
    const selectedFilter = e.target.value.toString();

    this.setState({
      selectedFilter,
    });

    const filter = selectedFilter.split('|');
    if ([ 'campaignNetwork', 'campaignNetworkPartners' ].indexOf(filter[ 0 ]) >= 0) {
      this.setState({
        addedSearchText: this.state.addedSearchText.filter((item) => !String(item.label).startsWith('Network')),
        addedSearchForm: this.state.addedSearchForm.filter((item) => item.type !== 'campaignNetwork' && item.type !== 'campaignNetworkPartners'),
      }, () => this.addFilter(filter[ 0 ], filter[ 1 ]));
    } else if ([ 'campaignName', 'campaignId' ].indexOf(filter[ 0 ]) === -1) {
      this.addFilter(filter[ 0 ], filter[ 1 ], filter[ 2 ]);
    }
  };

  onClickAddFilter = (e) => {
    e.preventDefault();

    if (this.state.searchText) {
      const filter = this.state.selectedFilter.split('|');
      if ([ 'campaignName', 'campaignId' ].indexOf(filter[ 0 ]) >= 0) {
        this.addFilter(filter[ 0 ], filter[ 1 ], this.state.searchText.trim());
      } else {
        this.props.systemMessage('Please select a filter type what named "Campaign Name" or "Campaign ID".');
      }
    } else {
      this.props.systemMessage('Please input a search text.');
    }
  };

  onClickClearAllFilter = (e) => {
    e.preventDefault();

    this.setState({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      selectedFilter: '',
      searchText: '',
      addedSearchText: [],
      addedSearchForm: [],
    }, this.handleGetDashboardDetailReport);
  };

  onClickClearFilter = (addedIndex) =>
    this.setState({
      addedSearchText: this.state.addedSearchText.filter((item, index) => index !== addedIndex),
      addedSearchForm: this.state.addedSearchForm.filter((item, index) => index !== addedIndex),
    }, this.handleGetDashboardDetailReport);

  onClickCampaign = (campaignId) => (e) => {
    e.preventDefault();
    this.props.onClickCampaign(campaignId);
  };

  renderCampaignLink = (campaignId, value) => {
    const hasLink = this.props.dashboardCampaignLink && this.props.dashboardCampaignLink.indexOf(Number(campaignId)) >= 0;
    return hasLink ?
      <a href="" role="button" className="text-google" onClick={this.onClickCampaign(campaignId)}><span>{value}</span></a>
      :
      <span>{value}</span>;
  };

  render() {
    if (!this.state.ownerAccountId) {
      return null;
    }

    const { dashboardFilters, dashboardDetail } = this.props;
    const accountReportList = dashboardDetail.account_report.length ? dashboardDetail.account_report : [];
    const campaignReportList = dashboardDetail.campaign_report.length ? dashboardDetail.campaign_report : [];

    return (
      <div>
        <Content.Section
          title="Campaign Performance"
          component={
            <DateRangePicker
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              contentAlign="right"
              onChange={this.handleChangeCampaignPerformanceDate}
            />
          }
          innerClassName="dashboard-section float-right"
        />

        {/* 디자인 기획 비교 후 확인 필요 */}
        <Content.Card title="Account Performance" secondary>
          <StickyTable
            columns={this.columns.accountPerformance}
            data={accountReportList}
            dataKey="name"
            noDataTemplate="No data available in table."
          />
        </Content.Card>

        <Content.Card title="Campaign management" secondary>
          {/* filter */}
          {/* 검색어 입력할 때: typing */}
          {/* 검색어 추가(enter 누를때)할 때: add */}
          <div className="table-filter clearfix typing add">
            <p className="table-filter-item table-filter--title fs-13">Filter</p>
            <div className="table-filter-item table-filter--scope">
              <select ref={ref => this.refDashboardFilter = ref} onChange={this.onChangeDashboardFilter}>
                {dashboardFilters.length ?
                  dashboardFilters.map((item, itemIndex) => {
                    if (item.hasChild) {
                      return (
                        <optgroup key={`filters-optgroup-${itemIndex}`} label={item.optionName}>
                          {item.child.map((childItem, childIndex) =>
                            <option
                              key={`filters-opt-${childIndex}`}
                              value={`${item.optionValue}|${item.optionName}|${childItem.optionValue}`}
                            >{childItem.optionName}</option>,
                          )}
                        </optgroup>
                      );
                    } else {
                      return (
                        <option
                          key={`filters-opt-${itemIndex}`}
                          value={`${item.optionValue}|${item.optionName}`}>{item.optionName}</option>
                      );
                    }
                  })
                  : null
                }
              </select>
            </div>
            <div className="table-filter-item table-filter--search">
              <InputBox
                type="search"
                placeholder="Search"
                value={this.state.searchText}
                style={{ width: '365px' }}
                onChange={this.handleChangeSearchText}
              />
            </div>
            <div className="table-filter-item">
              <Button.Flat label="Add" primary className="medium button--searching-add" onClick={this.onClickAddFilter}/>
            </div>
            <div className="table-filter--result-wrap clearfix">
              <div className="table-filter--result">
                <TagList data={this.state.addedSearchText} onClickRemove={this.onClickClearFilter}/>
              </div>
              <Button.Flat label="Clear All" secondary className="medium fixed button--clear" onClick={this.onClickClearAllFilter}/>
            </div>
            <div className="table-filter--button-group">
              <Button.Flat label="Save Filter" className="medium fixed button--save-filter"/>
              <Button.Flat label="Load Filter" className="medium fixed button--load-filter"/>
            </div>
          </div>
          {/* // filter */}

          {/* button group */}
          <div className="table-control clearfix">
            <div className="inline-block">
              <select name="" id="">
                <option value="0">Auto Optimization</option>
                <option value="1">Create rule for Facebook ads</option>
                <option value="2">Create rule for Google ads</option>
                <option value="3">Manage rules of Facebook</option>
                <option value="4">Manage rules of Google</option>
              </select>
            </div>
            <Button.Flat
              label="Edit"
              iconAfterLabel="arrow-bottom-line"
              className="medium hollow button--addition icon--arrow"
            />
            <div className="float-right">
              <Button.Flat label="Auto Optimization" iconAfterLabel="arrow-bottom-line" className="medium hollow button--addition icon--arrow"/>
              <Button.Flat label="View KPI" className="medium hollow"/>
              <Button.Flat label="My Columns" primary className="medium"/>
              <select name="" id="">
                <option value="">My Columns</option>
              </select>
              <Button.Flat label="Edit Columns" primary className="medium"/>
              <Button.Flat label="Save Columns" primary className="medium"/>
            </div>
          </div>
          {/* //button group */}

          {/* table */}
          <div className="table--campaign-list">
            <StickyTable
              columns={this.columns.campaignList}
              data={campaignReportList}
              dataKey="campaignID"
              dataGroupKey="network"
              noDataTemplate={<span><br/>No Results Found.<br/>Try searching again or using different filters.<br/><br/></span>}
            />
          </div>
          {/* //table */}
        </Content.Card>
      </div>
    );
  }
}

DashboardMain.propTypes = {
  webToken: PropTypes.object.isRequired,
  dashboardList: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  dashboardFilters: PropTypes.array,
  dashboardDetail: PropTypes.object,
  dashboardCampaignLink: PropTypes.array,
  getDashboardList: PropTypes.func.isRequired,
  getDashboardFilters: PropTypes.func.isRequired,
  getDashboardDetail: PropTypes.func.isRequired,
  getDashboardDetailAccountReport: PropTypes.func.isRequired,
  getDashboardDetailCampaignReport: PropTypes.func.isRequired,
  getDashboardDetailReportCampaignLink: PropTypes.func.isRequired,
  setDashboardDetail: PropTypes.func.isRequired,
  updateDashboardDetail: PropTypes.func.isRequired,
  deleteDashboardDetail: PropTypes.func.isRequired,
  systemMessage: PropTypes.func.isRequired,
  onClickCampaign: PropTypes.func.isRequired,
};
