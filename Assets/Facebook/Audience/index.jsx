import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountSelectBox from 'ai/ui/AccountSelectBox';
import InputBox from 'core/ui/InputBox';
import Content from 'core/ui/Content';
import CheckableSelectBox from 'core/ui/CheckableSelectBox';
import Icon from 'core/ui/Icon';
import TagList from 'core/ui/TagList';
import StickyTable from 'core/ui/StickyTable';
import { connect } from 'react-redux';
import Header from 'ai/ui/Header';
import { loadAssetTableData } from 'ai/pages/Assets/Facebook/Audience/action';
import './styles.scss';

const iconStyle = {
  fontSize: '17px',
  verticalAlign: 'middle',
  marginRight: '5px',
};

/**
 * rowData: {
 *   ...rowData: 해당 row의 데이터
 *   isGroup: bool,
 *   isChild: bool,
 *   isSummary: bool,
 * }
 */
const columns = [
  //{ key: 'groupName', label: 'accountId', width: '350px', isSortable: true, sortKey: 'accountName',
  //  renderCell: (value, rowData, colInfo) => {
  //    if (rowData.isGroup) {
  //      return (
  //        <div><strong>{value}</strong></div>
  //      );
  //    } else if (rowData.isSummary) {
  //      return (
  //        <div><span>Total</span></div>
  //      );
  //    } else {
  //    return (
  //      <span style={rowData.isChild ? { marginLeft: '20px' } : null}>
  //          {rowData.channel === 'FB' ? <Icon type="media-facebook" style={iconStyle}/> : null}
  //        {rowData.channel === 'GG' ? <Icon type="media-google" style={iconStyle}/> : null}
  //        <span style={{ marginLeft: '4px' }}>{rowData.accountName}</span>
  //        </span>
  //    );
  //  }
  //  }
  //},
  {
    key: 'accountId', label: 'account Id', width: '350px', isSortable: true, align: 'center', sortKey: 'accountId',
    renderCell: (value, rowData, colInfo) => {
      if (rowData.isGroup) {
        return (
          <div><strong>{value}</strong></div>
        );
      } else if (rowData.isSummary) {
        return (
          <div><span>Total</span></div>
        );
      } else {
        return (
          <span style={rowData.isChild ? { marginLeft: '20px' } : null}>
            {rowData.channel === 'FB' ? <Icon type="media-facebook" style={iconStyle}/> : null}
            {rowData.channel === 'GG' ? <Icon type="media-google" style={iconStyle}/> : null}
            <span style={{ marginLeft: '4px' }}>{rowData.accountId}</span>
          </span>
        );
      }
    },
  },
  { key: 'dateCreated', label: 'date Created', isSortable: true, align: 'center' },
  { key: 'size', label: 'Size', isSortable: true, align: 'center' },
  { key: 'name', label: 'Name', isSortable: true, align: 'center' },
  { key: 'description', label: 'Description', isSortable: true, align: 'center' },
  { key: 'subType', label: 'sub Type', isSortable: true, align: 'center' },
  { key: 'availability', label: 'Availability', isSortable: true, align: 'center' },
  { key: 'id', label: 'Id', isSortable: true, align: 'center' },
  { key: 'type', label: 'Type', isSortable: true, align: 'center' },
];

const filterCheckBoxList = [
  { groupName: 'QuickLook', id: 'recentlyUsed', value: 'Recently Used', isChecked: true },
  { groupName: 'QuickLook', id: 'inActiveAds', value: 'In Active Ads', isChecked: true },
  { groupName: 'QuickLook', id: 'actionNeeded', value: 'Action Needed', isChecked: true },
  { groupName: 'QuickLook', id: 'shared', value: 'Shared', isChecked: true },
  { groupName: 'Type', id: 'customAudience', value: 'Custom Audience', isChecked: true },
  { groupName: 'Type', id: 'lookalike', value: 'Lookalike', isChecked: true },
  { groupName: 'Type', id: 'savedAudienceGroup', value: 'Saved Audience Group', isChecked: true },
  { groupName: 'Availability', id: 'ready', value: 'Ready', isChecked: true },
  { groupName: 'Availability', id: 'notReady', value: 'Not Ready', isChecked: true },
  { groupName: 'Source', id: 'dataFile', value: 'Data File', isChecked: true },
  { groupName: 'Source', id: 'website', value: 'Website', isChecked: true },
  { groupName: 'Source', id: 'leadAd', value: 'Lead Ad', isChecked: true },
  { groupName: 'Source', id: 'mobileApp', value: 'Mobile App', isChecked: true },
  { groupName: 'Source', id: 'video', value: 'Video', isChecked: true },
  { groupName: 'Source', id: 'customAudienceUser', value: 'Custom Audience User', isChecked: true },
  { groupName: 'Source', id: 'pageFan', value: 'Page Fan', isChecked: true },
];

class FacebookAudience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: null,
      query: {},
      filterList: null,
      quickLookList: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.AssetTableDataList !== nextProps.AssetTableDataList) {
      this.setTableData(nextProps.AssetTableDataList);
    }
  }

  //컴포넌트 생성 render  전
  componentWillMount() {
    this.props.loadAssetTableData();
    //초기값과 비교
    if (!this.state.filterList) {
      this.setState({
        filterList: filterCheckBoxList,
        //quickLookList: quickLookCheckBoxList,
      });
    }

    if (!this.state.tableData) {
      this.setTableData(this.props.AssetTableDataList);
    }
  }

  setTableData = (tableData) => this.setState({ tableData });

  onChangeSearchText = (e) => {
    if (e.target.value) {
      this.setState({
        query: {
          ...this.state.query,
          AND: {
            ...this.state.query.AND,
            //accountId: e.target.value,
            name: e.target.value,
          },
        },
      });
    } else {
      this.setState({
        query: {
          ...this.state.query,
          AND: {
            ...this.state.query.AND,
            //accountId: null,
            name: '',
          },
        },
      });
    }
  };

  //onChangeQuickLook = (resultList) => {
  //  const nextQuickLookList = [];
  //  quickLookCheckBoxList.forEach((quickLook) => {
  //    const target = resultList.filter((result) => result.id === quickLook.id)[0];
  //    const nextTarget = {
  //      ...quickLook,
  //      isChecked: target.isChecked,
  //    };
  //    nextQuickLookList.push(nextTarget);
  //  });
  //
  //  this.setState({
  //    quickLookList: nextQuickLookList,
  //    query: {
  //      ...this.state.query,
  //      OR: {
  //        ...this.state.query.OR,
  //        //// TODO 구현해야 함
  //        //dateCreated: '~~~~',
  //      },
  //    },
  //  });
  //};

  onChangeCampaignObjective = (resultList) => {
    // item은 체크 선택/해제된 것들의 목록이므로 state에 재반영 해준다.

    const nextFilterList = [];
    filterCheckBoxList.forEach((filter) => {
      const target = resultList.filter((result) => result.id === filter.id)[ 0 ];
      const nextTarget = {
        ...filter,
        isChecked: target.isChecked,
      };
      nextFilterList.push(nextTarget);
    });

    const checkedList = nextFilterList.filter((item) => item.isChecked);
    const type = checkedList.filter((item) => item.groupName === 'Type').map((item) => item.value);
    const availability = checkedList.filter((item) => item.groupName === 'Availability').map((item) => item.value);
    const subType = checkedList.filter((item) => item.groupName === 'Source').map((item) => item.value);
    const quickLook = nextFilterList.filter((item) => item.groupName === 'quicklook' && item.isChecked).map((item) => item.value);
    //console.log(objective);

    this.setState({
      filterList: nextFilterList,
      query: {
        ...this.state.query,
        OR: {
          ...this.state.query.OR,
          type: type.length > 0 ? type : null,
          availability: availability.length > 0 ? availability : null,
          subType: subType.length > 0 ? subType : null,
          quickLook: quickLook.length > 0 ? quickLook : null,
        },
      },
    });
  };

  onClickClearinfo = (itemInfo) => {
    console.log(itemInfo);
    if (itemInfo.groupName === 'Quick Look') {
      //TODO
    } else {
      const nextFilterList = this.state.filterList.map((item) => {
        if (item.id === itemInfo.id) {
          return { ...item, isChecked: false };
        }
        return item;
      });

      this.setState({
        filterList: nextFilterList,
      });

      const type = nextFilterList.filter((item) => item.groupName === 'Type' && item.isChecked).map((item) => item.value);
      const availability = nextFilterList.filter((item) => item.groupName === 'Availability' && item.isChecked).map((item) => item.value);
      const subType = nextFilterList.filter((item) => item.groupName === 'Source' && item.isChecked).map((item) => item.value);
      const quickLook = nextFilterList.filter((item) => item.groupName === 'quicklook' && item.isChecked).map((item) => item.value);
      console.log('0319 types', type, availability, subType, quickLook);

      this.setState({
        query: {
          ...this.state.query,
          OR: {
            ...this.state.query.OR,
            type: type.length > 0 ? type : null,
            availability: availability.length > 0 ? availability : null,
            subType: subType.length > 0 ? subType : null,
            quickLook: quickLook.length > 0 ? quickLook : null,
          },
        },
      });
    }
  };
  render() {
    const filteredList = this.state.filterList
      .filter((item) => item.isChecked)
      .map((item) => ({ ...item, value: `${item.groupName}: ${item.value}` }));
    const tagListData = [
      //...quickLookList,
      ...filteredList,
    ];
    return (
      <div>
        <Header name="facebookAudience"/>
        <div className="bs row contents--account-conversion-action">
          <h3 className="sub-title inline-block">AD Account filter</h3>
          <div className="sub-contents inline-block">
            <AccountSelectBox onChange={() => {
            }}/>
          </div>
        </div>
        <div>
          <div>
            <div style={{ marginBottom: '4px' }}>
              <Content.Card title="Asset - Audience" secondary>
                <div className="table-filter clearfix typing add">
                  <p className="table-filter-item table-filter--title fs-13">Filter</p>
                  <div className="table-filter-item table-filter--scope">

                    <CheckableSelectBox
                      data={this.state.filterList}
                      placeholder="Campaign Objective"
                      groupName="groupName"
                      width="210px"
                      onChange={this.onChangeCampaignObjective}
                    />
                  </div>
                  <div className="table-filter-item table-filter--search">
                    <InputBox
                      type="search"
                      placeholder="Search by Name or ID"
                      style={{ width: '325px' }}
                      onChange={this.onChangeSearchText}
                    />
                  </div>
                  <div className="table-filter--result-wrap clearfix">
                    <div className="table-filter--result">
                      <TagList data={tagListData} onClickRemove={this.onClickClearinfo}/>
                    </div>
                  </div>
                </div>
                <div className="table--campaign-list">
                  <StickyTable
                    columns={columns}
                    data={this.state.tableData}
                    //summary={summary}
                    dataKey="name"
                    dataGroupKey="groupName"
                    query={this.state.query}
                    tableHeight={300}
                  />
                </div>
              </Content.Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FacebookAudience.propTypes = {
  //changeCampaignObjective: PropTypes.func.isRequired,
  AssetTableDataList: PropTypes.array,
  loadAssetTableData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    //AssetData: state.mainFrame.AssetData,
    AssetTableDataList: state.assets.facebookAudience.AssetTableDataList,
  };
}

export default connect(
  mapStateToProps,
  {
    loadAssetTableData,
  }
)(FacebookAudience);
