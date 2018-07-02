import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';
import Content from 'core/ui/Content';
//import { mediaChannelInfo } from 'core/constants/MediaChannel';
import StickyTable from 'core/ui/StickyTable';
import './styles.scss';

const extraHead = [
  { label: [ 'Campaign Group Name', 'Clicks', 'App Installs', 'CPI' ], key: [ 'campaignGroupName' ], colSpan: [ 1, 2, 2, 1 ], rowSpan: [ 2 ] },
];
const columns = [
  {
    key: 'campaignGroupName',
    label: 'Campaign Group Name',
    isSortable: true,
    align: 'left',
    renderCell: (value, rowData, colInfo) => {

    },
  },
  {
    key: 'clicksAccomplishmentRateOverPeriod',
    label: 'Accomplishment Rate Over Period',
    align: 'right',
    isSortable: true,
    renderCell: (value, rowData, colInfo) => {

    },
  },
  {
    key: 'clicksTotalAccomplishmentRate',
    label: 'Total Accomplishment Rate',
    align: 'right',
    isSortable: true,
    renderCell: (value, rowData, colInfo) => {

    },
  },
  {
    key: 'appInstallsAccomplishmentRateOverPeriod',
    label: 'Accomplishment Rate Over Period',
    isSortable: true,
    align: 'right',
    renderCell: (value, rowData, colInfo) => {

    },
  },
  {
    key: 'appInstallsTotalAccomplishmentRate',
    label: 'Total Accomplishment Rate',
    isSortable: true,
    align: 'right',
    renderCell: (value, rowData, colInfo) => {

    },
  },
  {
    key: 'cpiTotalAccomplishmentRate',
    label: 'Total Accomplishment Rate',
    isSortable: true,
    align: 'right',
    renderCell: (value, rowData, colInfo) => {

    },
  },
];

//const defaultChartOptions = {
//  paletteColors: '#0075c2,#1aaf5d',
//  bgColor: '#ffffff',
//  showBorder: '0',
//  showCanvasBorder: '0',
//  plotBorderAlpha: '10',
//  usePlotGradientColor: '0',
//  legendBorderAlpha: '0',
//  legendShadow: '0',
//  plotFillAlpha: '60',
//  showXAxisLine: '1',
//  axisLineAlpha: '25',
//  showValues: '0',
//  divlineColor: '#999999',
//  divLineDashed: '1',
//  divLineDashLen: '1',
//  showAlternateHGridColor: '0',
//  toolTipColor: '#ffffff',
//  toolTipBorderThickness: '0',
//  toolTipBgColor: '#000000',
//  toolTipBgAlpha: '80',
//  toolTipBorderRadius: '2',
//  toolTipPadding: '5',
//};

export default class CampaignSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: {
        FB: props.initialData.channel[ 'FB' ],
        GG: props.initialData.channel[ 'GG' ],
      },
      startDate: props.initialData.startDate,
      endDate: props.initialData.endDate,
      last7daysSpentData: {
        dataset: [
          {
            seriesname: 'Facebook',
            data: [
              { value: '13000' },
              { value: '14500' },
              { value: '13500' },
              { value: '15000' },
              { value: '15500' },
              { value: '17650' },
              { value: '19500' },
            ],
          },
          {
            seriesname: 'Google',
            data: [
              { value: '8400' },
              { value: '9800' },
              { value: '11800' },
              { value: '14400' },
              { value: '18800' },
              { value: '24800' },
              { value: '30800' },
            ],
          },
        ],
      },
      campaignPerformanceTrendData: {
        dataset: [
          {
            seriesname: 'Facebook',
            data: [
              { value: '13000' },
              { value: '14500' },
              { value: '13500' },
              { value: '15000' },
              { value: '15500' },
              { value: '17650' },
              { value: '19500' },
            ],
          },
          {
            seriesname: 'Google',
            data: [
              { value: '8400' },
              { value: '9800' },
              { value: '11800' },
              { value: '14400' },
              { value: '18800' },
              { value: '24800' },
              { value: '30800' },
            ],
          },
        ],
      },
    };
  }

  componentWillMount() {
    const checkedChannel = Object.keys(this.state.channel).filter(item => this.state.channel[ item ]);
    const params = {
      channel: checkedChannel.toString(),
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };

    this.props.getCampaignSummaryList(params);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataFilter !== nextProps.dataFilter) {
      const checkedChannel = Object.keys(nextProps.dataFilter.channel).filter(item => nextProps.dataFilter.channel[ item ]);
      const params = {
        channel: checkedChannel.toString(),
        startDate: nextProps.dataFilter.startDate,
        endDate: nextProps.dataFilter.endDate,
      };

      this.props.getCampaignSummaryList(params);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.campaignSummaryList !== nextState.campaignSummaryList;
  }

  render() {
    const { dataFilter } = this.props;

    return (
      <div className="campaign-summary">
        <Content.Section title="Campaign Summary"/>

        <div className="row-summary">
          <Content.Card className="row-summary-item" title="Total Spent" noFolding>
            <div className="row-summary-item-inner">
              <div className="row-summary-item-inner-value">125M</div>
              <ul className="row-summary-item-inner-media">
                {dataFilter.channel[ 'FB' ] ? <li>Facebook 100M(80%)</li> : null}
                {dataFilter.channel[ 'GG' ] ? <li>Google 25M(20%)</li> : null}
              </ul>
            </div>
          </Content.Card>
          <Content.Card className="row-summary-item" title="Last 7 days Spent" noFolding>
            <ReactHighcharts config={
              {
                chart: {
                  type: 'area',
                },
                title: {
                  text: null,
                },
                xAxis: {
                  categories: [ '1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8' ],
                },
                yAxis: {
                  title: {
                    text: null,
                  },
                  labels: {
                    formatter: function() {
                      return this.value / 1000 + 'k';
                    },
                  },
                },
                series: [
                  {
                    name: 'Facebook',
                    data: [ 13000, 14500, 13500, 15000, 15500, 17650, 19500 ],
                    marker: {
                      enabled: false,
                    },
                  }, {
                    name: 'Google',
                    data: [ 8400, 9800, 11800, 14400, 18800, 24800, 30800 ],
                    marker: {
                      enabled: false,
                    },
                  },
                ],
              }
            } ref="chart1"/>
          </Content.Card>
        </div>

        <div className="row-summary">
          <Content.Card className="row-summary-item" title="Total Impressions" noFolding>
            <div className="row-summary-item-inner">
              <div className="row-summary-item-inner-value">125M</div>
              <ul className="row-summary-item-inner-media">
                {dataFilter.channel[ 'FB' ] ? <li>Facebook 100M(80%)</li> : null}
                {dataFilter.channel[ 'GG' ] ? <li>Google 25M(20%)</li> : null}
              </ul>
            </div>
          </Content.Card>
          <Content.Card className="row-summary-item" title="Total Clicks" noFolding>
            <div className="row-summary-item-inner">
              <div className="row-summary-item-inner-value">125M</div>
              <ul className="row-summary-item-inner-media">
                {dataFilter.channel[ 'FB' ] ? <li>Facebook 100M(80%)</li> : null}
                {dataFilter.channel[ 'GG' ] ? <li>Google 25M(20%)</li> : null}
              </ul>
            </div>
          </Content.Card>
          <Content.Card className="row-summary-item" title="Total App Installs" noFolding>
            <div className="row-summary-item-inner">
              <div className="row-summary-item-inner-value">125M</div>
              <ul className="row-summary-item-inner-media">
                {dataFilter.channel[ 'FB' ] ? <li>Facebook 100M(80%)</li> : null}
                {dataFilter.channel[ 'GG' ] ? <li>Google 25M(20%)</li> : null}
              </ul>
            </div>
          </Content.Card>
        </div>

        <div className="row-summary">
          <Content.Card className="row-summary-item" title="CPM" noFolding>
            <div className="row-summary-item-inner">
              <div className="row-summary-item-inner-value">125M</div>
              <ul className="row-summary-item-inner-media">
                {dataFilter.channel[ 'FB' ] ? <li>Facebook 100M(80%)</li> : null}
                {dataFilter.channel[ 'GG' ] ? <li>Google 25M(20%)</li> : null}
              </ul>
            </div>
          </Content.Card>
          <Content.Card className="row-summary-item" title="CPC" noFolding>
            <div className="row-summary-item-inner">
              <div className="row-summary-item-inner-value">125M</div>
              <ul className="row-summary-item-inner-media">
                {dataFilter.channel[ 'FB' ] ? <li>Facebook 100M(80%)</li> : null}
                {dataFilter.channel[ 'GG' ] ? <li>Google 25M(20%)</li> : null}
              </ul>
            </div>
          </Content.Card>
          <Content.Card className="row-summary-item" title="CPI" noFolding>
            <div className="row-summary-item-inner">
              <div className="row-summary-item-inner-value">125M</div>
              <ul className="row-summary-item-inner-media">
                {dataFilter.channel[ 'FB' ] ? <li>Facebook 100M(80%)</li> : null}
                {dataFilter.channel[ 'GG' ] ? <li>Google 25M(20%)</li> : null}
              </ul>
            </div>
          </Content.Card>
        </div>

        <div className="row-summary">
          <Content.Card className="row-summary-item" title="Campaign Performance Trend" noFolding>
            <ReactHighcharts config={
              {
                chart: {
                  type: 'line',
                },
                title: {
                  text: null,
                },
                xAxis: {
                  categories: [ '1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8' ],
                },
                yAxis: {
                  title: {
                    text: null,
                  },
                  labels: {
                    formatter: function() {
                      return this.value / 1000 + 'k';
                    },
                  },
                },
                series: [
                  {
                    name: 'Facebook',
                    data: [ 13000, 14500, 13500, 15000, 15500, 17650, 19500 ],
                  }, {
                    name: 'Google',
                    data: [ 8400, 9800, 11800, 14400, 18800, 24800, 30800 ],
                  },
                ],
              }
            } ref="chart2"/>
          </Content.Card>
        </div>

        <div>
          <Content.Card className="row-summary-item" title="Campaign Group KPI Accomplishments" noFolding>
            <StickyTable
              className="campaigns-table"
              columns={columns}
              extraHead={extraHead}
              data={this.props.campaignSummaryList}
              /*summary={summary}*/
              dataKey="dataKey"
              dataGroupKey="group"
              /*query={this.state.query}
               tableHeight={550}
               cellHeight={45}
               sortedColumns={this.state.sort}
               onSort={this.onSort}*/
            />
          </Content.Card>
        </div>

      </div>
    );
  }
}

CampaignSummary.propTypes = {
  initialData: PropTypes.object,
  dataFilter: PropTypes.object,
  campaignSummaryList: PropTypes.array,
  getCampaignSummaryList: PropTypes.func.isRequired,
};
