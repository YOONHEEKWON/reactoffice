import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import moment from 'moment';
import Button from 'core/ui/Button';
import CampaignStatus from 'ai/ui/CampaignStatus';
import Content from 'core/ui/Content';
import InputBox from 'core/ui/InputBox';
import StickyTable from 'core/ui/StickyTable';
import TagList from 'core/ui/TagList';
import ListBubble from 'core/ui/ListBubble';
//import { DATE_FORMAT } from 'core/constants/Configure';
import EditColumnsModal from './EditColumnsModal';
import { EditColumns } from 'ai/constants/EditColumns';
import { getEditColumns } from 'ai/pages/Dashboard/action';

import './styles.scss';
//import MediaFilter from '../MediaFilter';

//const today = moment().format(DATE_FORMAT);

const viewKpiItems = [
  { id: 'standardColumns', label: 'Standard Columns' },
  { id: 'campaignGroupKPI', label: 'Campaign Group KPI' },
  { id: 'campaignKPI', label: 'Campaign KPI' },
];

class CampaignDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: {
        FB: this.props.initialData.channel[ 'FB' ],
        GG: this.props.initialData.channel[ 'GG' ],
      },
      startDate: this.props.initialData.startDate,
      endDate: this.props.initialData.endDate,
      ownerAccountId: Object.keys(this.props.initialData.channel)
        .filter(item => this.props.initialData.channel[ item ])
        .map(item => String(props.webToken.channeltoken[ 0 ][ item ].ownerId)),
      isLoadedReport: false,
      selectedFilter: '', // filter selectbox Text
      searchText: '', // filter textbox value
      addedSearchText: [],
      filterList: [], // tag list
      isShowEditColumnsModal: false,
      isShowViewKpi: false,
      query: {},
      columnsList: EditColumns,
      editColumnsModalResultList: [],
    };
  }

  /*componentWillReceiveProps(nextProps) {
   const checkedChannel = Object.keys(nextProps.dataFilter.channel).filter(item => nextProps.dataFilter.channel[item]);

   if (this.props.webToken.channeltoken !== nextProps.webToken.channeltoken) {
   this.setState({
   ownerAccountId: String(nextProps.webToken.channeltoken[0].GG.ownerId),
   });
   }

   if (this.props.campaignDetailsFilters !== nextProps.campaignDetailsFilters) {
   if (nextProps.campaignDetailsFilters.length) {
   const data = nextProps.campaignDetailsFilters[0];
   this.setState({
   selectedFilter: `${data.optionValue}|${data.optionName}`,
   });
   } else {
   this.setState({
   selectedFilter: '',
   });
   }
   }
   }*/

  componentWillMount() {

    // 테이블 칼럼 정의
    this.columns = {
      campaignList: [
        {
          key: 'campaignStatus',
          label: 'Status',
          align: 'center',
          renderCell: (value, rowData) => {
            console.log('???????', !rowData.isGroup);
            if (!rowData.isGroup) {
              return <CampaignStatus status={value}/>;
            } else {
              return null;
            }
          },
        },
        {
          key: 'columnName',
          label: 'Campaign Name',
          align: 'left',
          renderCell: (value, rowData) => {
            if (!rowData.isGroup) {
              return <span title={rowData.campaign}>{this.renderCampaignLink(rowData.campaignID, rowData.columnName)}</span>;
            } else {
              return <span>{rowData.columnName}</span>;
            }
          },
        },
        {
          key: 'columnCategory',
          label: 'Media',
          align: 'left',
          renderCell: (value, rowData) => {
            if (!rowData.isGroup) {
              return <span title={rowData.campaign}>{this.renderCampaignLink(rowData.campaignID, rowData.columnCategory)}</span>;
            } else {
              return <span>{rowData.columnCategory}</span>;
            }
          },
        },
        {
          key: 'objective',
          label: 'Objective',
          align: 'left',
          renderCell: (value, rowData) => {
          },
        },
        {
          key: 'startDate',
          label: 'Start Time',
          align: 'left',
        },
        {
          key: 'endDate',
          label: 'End Time',
          align: 'left',
        },
        {
          key: 'budget',
          label: 'Budget',
          align: 'right',
          renderCell: (value) => Number(value).toLocaleString('en'),
        },
        {
          key: 'amountSpent',
          label: 'Amount Spent',
          align: 'right',
          renderCell: (value) => Number(value).toLocaleString('en'),
        },
        {
          key: 'impressions',
          label: 'Impressions',
          tooltip: 'Impressions',
          align: 'right',
          renderCell: (value) => Number(value).toLocaleString('en'),
        },
        {
          key: 'clicks',
          label: 'Clicks',
          align: 'right',
          renderCell: (value) => Number(value).toLocaleString('en'),
        },
      ],
    };

    // 초기 기본 필터 추가
    this.addDefaultFilter();

    const checkedChannel = Object.keys(this.state.channel).filter(item => this.state.channel[ item ]);

    // 대시보드 필터 목록 불러오기
    this.props.getCampaignDetailsFilters({
      channel: checkedChannel.toString(),
    });

    // 대시보드 캠페인ID 목록 (링크) 불러오기
    this.props.getDashboardDetailReportCampaignLink(this.state.ownerAccountId[ 0 ], {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.webToken.channeltoken !== nextProps.webToken.channeltoken) {
      this.setState({
        ownerAccountId: Object.keys(this.state.channel)
          .filter(item => this.state.channel[ item ])
          .map(item => String(nextProps.webToken.channeltoken[ 0 ][ item ].ownerId)),
      });
    }

    if (this.props.dataFilter !== nextProps.dataFilter) {
      const checkedChannel = Object.keys(nextProps.dataFilter.channel).filter(item => nextProps.dataFilter.channel[ item ]);

      this.setState({
        channel: {
          FB: nextProps.dataFilter.channel[ 'FB' ],
          GG: nextProps.dataFilter.channel[ 'GG' ],
        },
        startDate: nextProps.dataFilter.startDate,
        endDate: nextProps.dataFilter.endDate,
      }, () => {
        this.props.getCampaignDetailsFilters({
          channel: checkedChannel.toString(),
        });

        this.props.getCampaignDetailsReport({
          channel: checkedChannel.toString(),
        }, {
          channel: checkedChannel.toString(),
          startDate: nextProps.dataFilter.startDate,
          endDate: nextProps.dataFilter.endDate,
        });
      });
    }
  }

  addDefaultFilter = () => {
    // 초기 기본 필터 추가 (ACTIVE)
    const addedSearchText = [
      { type: 'campaignStatus', optionName: 'Campaign Status', optionValue: 'Active' },
    ];
    const filterList = [
      { label: 'Campaign Status: Active' },
    ];

    // 초기 필터 선택
    const selectedFilter = 'campaignName|Campaign Name';

    this.setState({
      addedSearchText,
      selectedFilter,
      filterList,
    }, this.handleGetDashboardDetailReport);
  };

  handleChangeSearchText = (e) => this.setState({ searchText: e.target.value });

  onClickAddFilter = () => {
    if (this.state.searchText) {
      const filter = this.state.selectedFilter.split('|');
      if ([ 'Campaign Group', 'Campaign Name', 'Campaign Id' ].indexOf(filter[ 1 ]) >= 0) { // 선택한 필터
        this.addFilter(filter[ 0 ], filter[ 1 ], '', this.state.searchText.trim()); // optionValue, optionName, childOptionValue, childOptionName
      } else {
        this.props.systemMessage('Please select a filter type what named "Campaign Name" or "Campaign ID".');
      }
    }
  };

  onChangeDashboardFilter = (e) => {
    const selectedFilter = e.target.value.toString();

    this.setState({
      selectedFilter,
    });

    const filter = selectedFilter.split('|');
    if ([ 'Campaign Group', 'Campaign Name', 'Campaign Id' ].indexOf(filter[ 1 ]) === -1) {
      this.addFilter(filter[ 0 ], filter[ 1 ], filter[ 2 ], filter[ 3 ]); // optionValue, optionName, childOptionValue, childOptionName
    }
  };

  addFilter = (optionValue, optionName, childOptionValue = '', childOptionName = '') => {

    if (!this.state.addedSearchText.filter((item) => (item.optionName === optionName && item.optionValue === childOptionName)).length) {
      const addedSearchText = [ ...this.state.addedSearchText, { type: optionValue, optionName: optionName, optionValue: childOptionName } ];
      const filters = {};
      const filterList = [];
      [ ...new Set(addedSearchText.map(item => item.optionName)) ].forEach(item => filters[ item ] = []);
      addedSearchText.forEach(item => filters[ item.optionName ].push(item.optionValue));
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          if ('Campaign Status'.indexOf(key) >= 0 && filters[ 'Campaign Status' ].length >= 3) {
            filterList.push({ label: `${key}: All` });
          } else if ('Delivery Status'.indexOf(key) >= 0 && filters[ 'Delivery Status' ].length >= 2) {
            filterList.push({ label: `${key}: All` });
          } else {
            filterList.push({ label: `${key}: ${filters[ key ].toString()}` });
          }
        }
      }

      this.setState({
        searchText: '',
        addedSearchText,
        filterList,
      }, this.handleGetDashboardDetailReport);
    }
  };

  onClickClearFilter = (addedItem) => {
    const addedItemLabel = addedItem.label.split(':');

    this.setState({
      addedSearchText: this.state.addedSearchText.filter((item) => item.optionName !== addedItemLabel[ 0 ]),
      filterList: this.state.filterList.filter((item) => item !== addedItem),
    }, this.handleGetDashboardDetailReport);
  };

  onClickClearAllFilter = () => {
    this.setState({
      addedSearchText: [],
      filterList: [],
    }, this.handleGetDashboardDetailReport);
  };

  handleGetDashboardDetailReport = () => {
    // "Add" 버튼 클릭시 Campaign Report 검색
    const checkedChannel = Object.keys(this.state.channel).filter(item => this.state.channel[ item ]);
    this.props.getCampaignDetailsReport({
      channel: checkedChannel.toString(),
    }, {
      inclAccountId: this.state.ownerAccountId,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      filters: this.state.addedSearchText.map(item => {
        return {
          type: item.type,
          optionValue: item.optionValue,
        };
      }),
    });
  };

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

  showEditColumnsModal = () => {
    this.setState({
      isShowEditColumnsModal: true,
    });
  };

  onCloseEditColumnsModal = () => {
    this.setState({
      isShowEditColumnsModal: false,
    });
  };

  onClickViewKpi = () => {
    this.setState({
      isShowViewKpi: true,
    });
  };

  columnsListCheckData = (lastCheckList, attrClickingDate, attrViewingAdDate) => {
    this.props.getEditColumns(lastCheckList, attrClickingDate, attrViewingAdDate);
    console.log('lastCheckList, attrClickingDate, attrViewingAdDate', lastCheckList, attrClickingDate, attrViewingAdDate);
  };

  onClickViewKpiItem = (item) => this.setState({ isShowViewKpi: false });

  render() {
    console.log('this.props.getEditColumns', this.props.dashboardEditColumnsList);
    if (!this.state.ownerAccountId) {
      return null;
    }

    const { campaignDetailsFilters, campaignDetailsReport } = this.props;
    //const accountReportList = dashboardDetail.account_report.length ? dashboardDetail.account_report : [];
    //const campaignReportList = dashboardDetail.campaign_report.length ? dashboardDetail.campaign_report : [];

    return (
      <div className="campaign-details">
        <Content.Section title="Campaign Details"/>

        <Content.Card secondary>
          {/* filter */}
          {/* 검색어 입력할 때: typing */}
          {/* 검색어 추가(enter 누를때)할 때: add */}
          <div className="table-filter clearfix typing add">
            <p className="table-filter-item table-filter--title fs-13">Filter</p>
            <div className="table-filter-item table-filter--scope">
              <select ref={ref => this.refDashboardFilter = ref} onChange={this.onChangeDashboardFilter}>
                {campaignDetailsFilters.length ?
                  campaignDetailsFilters.map((item, itemIndex) => {
                    if (item.hasChild) {
                      return (
                        <optgroup key={`filters-optgroup-${itemIndex}`} label={item.optionName}>
                          {item.child.map((childItem, childIndex) =>
                            <option
                              key={`filters-opt-${childIndex}`}
                              value={`${item.optionValue}|${item.optionName}|${childItem.optionValue}|${childItem.optionName}`}
                            >{childItem.optionName}</option>,
                          )}
                        </optgroup>
                      );
                    } else {
                      return (
                        <option
                          key={`filters-opt-${itemIndex}`}
                          value={`${item.optionValue}|${item.optionName}`}
                        >{item.optionName}</option>
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
              {this.state.searchText.length >= 1 ?
                <Button.Flat label="Add" primary className="medium button--searching-add" onClick={this.onClickAddFilter}/> : null
              }
            </div>
            <div className="table-filter--result-wrap clearfix">
              <div className="table-filter--result">
                <TagList data={this.state.filterList} onClickRemove={this.onClickClearFilter}/>
              </div>
              {this.state.addedSearchText.length >= 1 ?
                <Button.Flat label="Clear All" secondary className="medium fixed button--clear" onClick={this.onClickClearAllFilter}/> : null
              }
            </div>
          </div>
          {/* // filter */}

          {/* button group */}
          <div className="table-control clearfix">
            {/*<Button.Flat
             label="Edit"
             iconAfterLabel="arrow-bottom-line"
             className="medium hollow button--addition icon--arrow"
             />*/}
            <div className="float-right">
              <div className="viewKpi">
                <Button.Flat label="View KPI" iconAfterLabel="arrow-bottom-line" className="medium hollow" onClick={this.onClickViewKpi}/>
                {this.state.isShowViewKpi ?
                  <ListBubble items={viewKpiItems} onClick={this.onClickViewKpiItem}/>
                  : null
                }
              </div>
              <Button.Flat label="Edit Columns" primary className="medium" onClick={this.showEditColumnsModal}/>
              {/*<Button.Flat label="My Columns" primary className="medium"/>
               <Button.Flat label="Save Columns" primary className="medium"/>*/}
            </div>
          </div>
          {/* //button group */}

          {/* table */}
          <div className="table--campaign-list">
            <StickyTable
              columns={this.columns.campaignList}
              data={this.props.dashboardEditColumnsList}
              dataKey="campaignID"
              dataGroupKey="campaignGroupID"
              noDataTemplate={<span><br/>No Results Found.<br/>Try searching again or using different filters.<br/><br/></span>}
            />
            {/*<StickyTable
             className="campaigns-table"
             columns={columns}
             data={this.props.campaignsList}
             summary={summary}
             dataKey="dataKey"
             dataGroupKey="group"
             query={this.state.query}
             tableHeight={550}
             cellHeight={45}
             sortedColumns={this.state.sort}
             onSort={this.onSort}
             />*/}
          </div>
          {/* //table */}

          {this.state.isShowEditColumnsModal ?
            <EditColumnsModal
              onClose={this.onCloseEditColumnsModal}
              columnsList={this.state.columnsList}
              columnsListCheckData={this.columnsListCheckData}
            />
            : null
          }
        </Content.Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dashboardEditColumnsList: state.dashboard.dashboardEditColumns.dashboardEditColumnsList,
  };
}

CampaignDetails.propTypes = {
  initialData: PropTypes.object,
  webToken: PropTypes.object.isRequired,
  dataFilter: PropTypes.object,
  campaignDetailsFilters: PropTypes.array,
  campaignDetailsReport: PropTypes.array,
  dashboardCampaignLink: PropTypes.array,

  systemMessage: PropTypes.func.isRequired,
  onClickCampaign: PropTypes.func.isRequired,
  getCampaignDetailsFilters: PropTypes.func.isRequired,
  getCampaignDetailsReport: PropTypes.func.isRequired,
  getDashboardDetailReportCampaignLink: PropTypes.func.isRequired,
  getEditColumns: PropTypes.func,
  dashboardEditColumnsList: PropTypes.array,
};

export default connect(
  mapStateToProps,
  {
    getEditColumns,
  }
)(CampaignDetails);
