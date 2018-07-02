import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Content from 'core/ui/Content';
import Modal from 'core/ui/Modal';
import Radio from 'core/ui/Radio';
import InputBox from 'core/ui/InputBox';
import CheckBox from 'core/ui/CheckBox';
import TagList from 'core/ui/TagList';

import './styles.scss';
import classNames from 'classnames';

const modalButtons = [
  { label: 'Cancel', isSecondary: true, action: 'cancel' },
  { label: 'Save and Close', isPrimary: true, action: 'submit' },
];

export default class EditColumnsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCategory: 0,
      searchText: '',
      checkTagList: [],
      columns: [
        {
          columnCategory: 'Performance',
          generalColumns: [
            { columnName: 'Spend', isChecked: false },
            { columnName: 'Impressions', isChecked: false },
            { columnName: 'Link Clicks', isChecked: false },
            { columnName: 'CTR', isChecked: false },
            { columnName: 'App Installs', isChecked: false },
            { columnName: 'App Actions', isChecked: false },
            { columnName: 'Views', isChecked: false },
            { columnName: 'Video Watches at 25%', isChecked: false },
            { columnName: 'Video Watches at 50%', isChecked: false },
            { columnName: 'Video Watches at 75%', isChecked: false },
            { columnName: 'Video Watches at 100%', isChecked: false },
            { columnName: 'Total Conversion Value', isChecked: false },
          ],
          costPerColumns: [
            { columnName: 'CPM', isChecked: false },
            { columnName: 'CPC', isChecked: false },
            { columnName: 'CPI', isChecked: false },
            { columnName: 'CPA', isChecked: false },
            { columnName: 'CPV', isChecked: false },

          ],
          selectedColumns: [
            { value: '(C)Campaign Group' },
            { value: '(C)Campaign Name' },
            { value: '(C)Media' },
            { value: '(C)Account Name' },
            { value: '(C)Objective' },
            { value: '(C)Start Date' },
            { value: '(C)End Date' },
            { value: '(C)Budget' },
            { value: '(C)Spend' },
            { value: '(C)Impressions' },
            { value: '(C)Clicks' },
            { value: '(C)CTR' },
          ],
        },
        {
          columnCategory: 'Campaign Info',
          generalColumns: [
            { columnName: 'Campaign Name', isChecked: false },
            { columnName: 'Account Name', isChecked: false },
            { columnName: 'Start Date', isChecked: false },
            { columnName: 'End Date', isChecked: false },
            { columnName: 'Budget', isChecked: false },
            { columnName: 'Objective', isChecked: false },
            { columnName: 'Delivery Status', isChecked: false },
          ],
          costPerColumns: [
            { columnName: 'CPM3', isChecked: false },
            { columnName: 'CPC3', isChecked: false },
            { columnName: 'Cost per Mobile App Install', isChecked: false },
            { columnName: 'Cost per Mobile App Action', isChecked: false },
            { columnName: 'CPV', isChecked: false },
          ],
          selectedColumns: [
            { value: '(C)Campaign Group' },
            { value: '(C)Campaign Name' },
            { value: '(C)Media' },
            { value: '(C)Account Name' },
            { value: '(C)Objective' },
            { value: '(C)Start Date' },
            { value: '(C)End Date' },
            { value: '(C)Budget' },
            { value: '(C)Spend' },
            { value: '(C)Impressions' },
            { value: '(C)Clicks' },
            { value: '(C)CTR' },
          ],
        },
      ],
    };
  }

  //componentWillReceiveProps(nextProps) {
  //  if (this.state.activeCategory !== nextProps.activeCategory) {
  //    this.setState({
  //      activeCategory: nextProps.activeCategory,
  //    }, () => console.log('next', this.state.activeCategory));
  //  }
  //}

  componentWillMount() {
    this.setState({
      //generalColumnsDataList: this.state.columns[ this.state.activeCategory ].generalColumns,
      //costPerColumnsDataList: this.state.columns[ this.state.activeCategory ].costPerColumns,
      //columnsTagList: this.state.columns[ this.state.activeCategory ].selectedColumns,
      //최초인덱스 0
    });
  }

  handleClick = (action/*, index*/) => {
    if (action === 'submit') {
      this.props.onClose();
    } else if (action === 'cancel') {
      this.props.onClose();
    } else {
      this.props.onClose();
    }
  };

  onChangeRadio = (e) => {};

  onChangeCheck = (value, result) => {

    //const tagDataList = this.state.generalColumnsDataList;
    ////const checkDataChange = tagDataList.map(item => item.columnName === value && item.isChecked === false
    ////  ? ({ ...item, isChecked: true })
    ////  : item
    ////);
    ////console.log('tttttttt', checkDataChange);
    //const tagFilerDataList = tagDataList.filter((item) => {
    //  if (item.columnName === value && result === true) {
    //    return { value: value, isChecked: true };
    //  }
    //}).map((item) => {
    //  if ( item.columnName) {
    //    return { value: value, isChecked: true }
    //  }
    //});
    //
    //this.setState({
    //  columnsTagList: [
    //    ...this.state.columnsTagList,
    //    ...tagFilerDataList,
    //  ],
    //});
  };

  onClickRemoveTag = (itemInfo) => {
    //  console.log('++++++++++++++++++++++++++', this.state.columnsTagList);
    //  const checkTagList = this.state.generalColumnsDataList.map(item => item.columnName === itemInfo.value
    //    ? ({ ...item, isChecked: false })
    //    : item
    //  );
    //  this.setState({
    //    generalColumnsDataList: checkTagList,
    //  }, () => console.log('generalColumnsDataList', this.state.generalColumnsDataList));
    //  console.log('---------------------------- ', checkTagList);
    //};
    //
    //handleChangeSearchText = (e) => {
    //  this.setState({
    //    searchText: e.target.value,
    //  });
    //  const textData = String(this.state.searchText).toLowerCase();
    //  const generalFilterData = this.state.columns[ this.state.activeCategory ].generalColumns.filter((item) => item.columnName.toLowerCase().includes(textData));
    //  const costPerFilterData = this.state.columns[ this.state.activeCategory ].costPerColumns.filter((item) => item.columnName.toLowerCase().includes(textData));
    //
    //  this.setState({
    //    generalColumnsDataList: generalFilterData,
    //    costPerColumnsDataList: costPerFilterData,
    //  });
  };

  onClickCategory = (index) => (e) => {
    e.preventDefault();

    this.setState({
      activeCategory: index,
      //generalColumnsDataList: this.state.columns[ index ].generalColumns,
      //costPerColumnsDataList: this.state.columns[ index ].costPerColumns,
    });
  };

  render() {
    const { columns, activeCategory } = this.state;
    //this.state.columnsTagList.filter((item) => item.value).map((item) => ({ ...item, value: `${item.value}` }));
    //const tagListData = [
    //  //...quickLookList,
    //  ...this.state.columnsTagList,
    //];

    return (
      <Modal
        title="Edit Columns"
        buttons={modalButtons}
        onClick={this.handleClick}
      >
        <Content.Card className="full-card editcolumnsmodal">
          <h3 className="modal-h3 ">Data Type</h3>
          <div className="editcolumnsmodalbox">
            <Radio group="dataType" classPrefix="aw-radio2" label="Common" checked value="common" onChange={this.onChangeRadio}/>
            <Radio group="dataType" classPrefix="aw-radio2" label="Facebook" value="facebook" onChange={this.onChangeRadio}/>
            <Radio group="dataType" classPrefix="aw-radio2" label="Google" value="google" onChange={this.onChangeRadio}/>
            <Radio group="dataType" classPrefix="aw-radio2" label="3rd Party Measurement" value="3rdPartyMeasurement" onChange={this.onChangeRadio}/>
          </div>
          <div className="row-summary">
            <div className="row-summary-item long-row-summary-item-inner">
              <div className="row-summary-item-inner">
                <InputBox
                  type="search"
                  placeholder="Search"
                  //value={this.state.searchText}
                  onChange={this.handleChangeSearchText}
                />
              </div>
            </div>
            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                {/*<Content.Section title={`Selected Columns (${columns[ activeCategory ].selectedColumns.length})`} medium secondary/>*/}
              </div>
            </div>
          </div>

          <div className="row-summary">
            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <Content.Section title="Column Category" medium secondary/>
                <ul>
                  {columns.filter((item, index) =>
                    <li
                      key={index}
                      className={classNames({
                        category__item: true,
                        'category_item--active': activeCategory === index,
                      })}
                    >
                      <a href="" role="button" onClick={this.onClickCategory(index)}>{item.columnCategory}</a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <Content.Section title="General Columns" medium secondary/>
                <ul>
                  {columns.map((item, index) =>
                    <li
                      key={index}
                    ><CheckBox label={item.columnName} checked={item.isChecked} value={item.columnName} onChange={this.onChangeCheck}/></li>,
                  )}
                </ul>
              </div>
            </div>

            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <Content.Section title="Cost per Columns" medium secondary/>
                <ul>
                  {columns.map((item, index) =>
                    <li
                      key={index}
                    ><CheckBox label={item.columnName} checked={item.isChecked} onChange={this.onChangeCheck}/></li>,
                  )}
                </ul>
              </div>
            </div>

            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <TagList data={this.state.columns} cols={1} style={{ marginTop: '2px' }} onClickRemove={this.onClickRemoveTag}/>
              </div>
            </div>
          </div>
        </Content.Card>


        <Content.Card className="full-card editcolumnsmodal">
          <h3 className="modal-h3">Attribution Window</h3>
          <div>
            <span className="">After Clicking Ad</span>
            <Radio group="afterClickingAd" classPrefix="aw-radio2" label="1day" checked value="1" onChange={this.onChangeRadio}/>
            <Radio group="afterClickingAd" classPrefix="aw-radio2" label="7days" value="7" onChange={this.onChangeRadio}/>
            <Radio group="afterClickingAd" classPrefix="aw-radio2" label="28days" value="28" onChange={this.onChangeRadio}/>
          </div>
          <div>
            <span>After Viewing Ad</span>
            <Radio group="afterViewingAd" classPrefix="aw-radio2" label="1day" checked value="1" onChange={this.onChangeRadio}/>
            <Radio group="afterViewingAd" classPrefix="aw-radio2" label="7days" value="7" onChange={this.onChangeRadio}/>
            <Radio group="afterViewingAd" classPrefix="aw-radio2" label="28days" value="28" onChange={this.onChangeRadio}/>
          </div>
        </Content.Card>
      </Modal>
    );
  }
}

EditColumnsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
