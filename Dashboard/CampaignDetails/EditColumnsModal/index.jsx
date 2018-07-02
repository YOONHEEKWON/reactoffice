import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Content from 'core/ui/Content';
import Modal from 'core/ui/Modal';
import Radio from 'core/ui/Radio';
import InputBox from 'core/ui/InputBox';
import CheckBox from 'core/ui/CheckBox';
import TagList from 'core/ui/TagList';
import './styles.scss';

const modalButtons = [
  { label: 'Cancel', isSecondary: true, action: 'cancel' },
  { label: 'Save and Close', isPrimary: true, action: 'submit' },
];
//const tabColumnCategory = [
//  { columnTabCategory: 'Performance' , columnTabType: 'Common' },
//  { columnTabCategory: 'Campaign Info', columnTabType: 'Common' },
//  { columnTabCategory: 'Appsflyer', columnTabType: '3rdPartyMeasurements' },
//  { columnTabCategory: 'Kochava', columnTabType: '3rdPartyMeasurements' },
//];
//const columns = ;

class EditColumnsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 'Common',
      activeSubCategory: '',
      searchText: '',
      columnsList: [],
      checkedTagList: [],
      attributionWindowDaysClicking: '28days',
      attributionWindowDaysViewingAd: '1day',
    };
  }

  componentWillMount() {
    const uniq = [...new Set(this.props.columnsList.map(item => item.columnCategory))];
    this.setState({
      activeSubCategory: 'Performance',
      columnsList: this.props.columnsList,
      uniqColumnsList: uniq.map(item => this.props.columnsList.find(column => column.columnCategory === item)),
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('newxt', nextProps);
    if (this.props.columnsList !== nextProps.columnsList) {
      this.setState({
        columnsList: nextProps.columnsList,
      });
    }
  }

  handleClick = (action/*, index*/) => {
    if (action === 'submit') {
      const lastCheckList = this.state.columnsList.filter(item => item.isChecked);
      const attrClickingDate = this.state.attributionWindowDaysClicking;
      const attrViewingAdDate = this.state.attributionWindowDaysViewingAd;
      console.log('attrDate', attrClickingDate, attrViewingAdDate);
      this.props.columnsListCheckData(lastCheckList, attrClickingDate, attrViewingAdDate);
      this.props.onClose();
      //this.props.onClose();
    } else if (action === 'cancel') {
      this.props.onClose();
    } else {
      this.props.onClose();
    }
  };

  onChangeRadio = (e, ) => {
    const finals = e.target.value;
    const categoryValue = this.state.uniqColumnsList.filter(item => item.dataCategory === finals );
    this.setState({
      activeSubCategory: categoryValue[0].columnCategory,
      activeCategory: e.target.value,
    });
  };

  onChangeAttrWindowAfterClicking =(e) => {
    this.setState({
      attributionWindowDaysClicking: e.target.value,
    });
  };

  onChangeAttrWindowAfterViewingAd =(e) => {
    this.setState({
      attributionWindowDaysViewingAd: e.target.value,
    });
  };

  onChangeCheck = (value, result) => {
    const columnsList = this.state.columnsList.map((item) => (item.columnName === value ? { ...item, isChecked: result } : item));
    this.setState({
      columnsList,
    });
  };

  handleChangeSearchText = (e) => {
    this.setState({
      searchText: e.target.value,
    });
    const textData = String(this.state.searchText).toLowerCase();
    const columnsList = this.state.columnsList.map((item) => (!textData || item.columnName.toLowerCase().includes(textData) ? { ...item, isFiltered: true } : { ...item, isFiltered: false }));
    this.setState({
      columnsList,
    });
  };

  onClickCategory = (value) => (e) => {
    e.preventDefault();
    this.setState({
      activeSubCategory: value,
    });
  };

  onClickRemoveTag = (e) => {
    this.setState({
      checkedTagList: this.state.checkedTagList.filter(item => item.columnName !== e.columnName),
      columnsList: this.state.columnsList.map(
        item => item.columnName === e.columnName
          ? { ...item, isChecked: false }
          : item
      ),
    });
  };

  render() {

    //const reduceTest = this.state.columnsList.map(( item , b ) => {
    //  const uniqcategoryarray = []; //빈 상자
    //  if ( item.columnCategory.includes( uniqcategoryarray )) {
    //    return { ...item }
    //  }
    //});

    const checkListLength = this.state.columnsList.filter(item => item.isChecked);

    return (
      <Modal
        title="Edit Columns"
        buttons={modalButtons}
        onClick={this.handleClick}
      >
        <Content.Card className="editcolumnsmodal" noWrap>
          <h3 className="modal-h3 ">Data Type</h3>
          <div className="editcolumnsmodalbox">
            <Radio group="dataType" classPrefix="aw-radio2" label="Common" checked value="Common" onChange={this.onChangeRadio}/>
            <Radio group="dataType" classPrefix="aw-radio2" label="Facebook" value="Facebook" onChange={this.onChangeRadio}/>
            <Radio group="dataType" classPrefix="aw-radio2" label="Google" value="Google" onChange={this.onChangeRadio}/>
            <Radio group="dataType" classPrefix="aw-radio2" label="3rd Party Measurement" value="3rdPartyMeasurements" onChange={this.onChangeRadio}/>
          </div>
          <div className="row-summary">
            <div className="row-summary-item long-row-summary-item-inner">
              <div className="row-summary-item-inner">
                <InputBox
                  type="search"
                  placeholder="Search"
                  value={this.state.searchText}
                  onChange={this.handleChangeSearchText}
                />
              </div>
            </div>
            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <Content.Section title={`Selected Columns (${checkListLength.length})`} medium secondary/>
              </div>
            </div>
          </div>

          <div className="row-summary">
            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <Content.Section title="Column Category" medium secondary noFolding/>
                <ul>
                  {this.state.uniqColumnsList.map((item, index) => item.dataCategory === this.state.activeCategory
                    ?
                      <li
                        key={index}
                      ><a href="" role="button" onClick={this.onClickCategory(item.columnCategory)}>{item.columnCategory}</a>
                      </li>
                      :
                      null
                  )}
                  {/*{tabColumnCategory.map((item, index) => item.columnTabCategory === this.state.activeSubCategory*/}
                  {/*?*/}
                  {/*<li*/}
                  {/*key={index}*/}
                  {/*>*/}
                  {/*<a href="" role="button" onClick={this.onClickCategory(item.columnTabCategory)}>{item.columnTabCategory}</a>*/}
                  {/*</li>*/}
                  {/*:*/}
                  {/*null*/}
                  {/*)}*/}
                </ul>
              </div>
            </div>

            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <Content.Section title="General Columns" medium secondary noFolding/>
                <ul>
                  {this.state.columnsList.map((item, index) => item.columnCategory === this.state.activeSubCategory && item.dataCategory === this.state.activeCategory && item.columnSubCategory === 'generalColumns' && item.isFiltered
                    ?
                      <li
                        key={index}
                      ><CheckBox label={item.columnName} checked={item.isChecked} value={item.columnName} onChange={this.onChangeCheck}/></li>
                      :
                      null
                  )}
                </ul>
              </div>
            </div>

            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <Content.Section title="Cost per Columns" medium secondary noFolding/>
                <ul>
                  {this.state.columnsList.map((item, index) => item.columnCategory === this.state.activeSubCategory && item.dataCategory === this.state.activeCategory && item.columnSubCategory === 'costPerColumns' && item.isFiltered
                    ?
                      <li
                        key={index}
                      ><CheckBox label={item.columnName} checked={item.isChecked} value={item.columnName} onChange={this.onChangeCheck}/></li>
                      :
                      null
                  )}
                </ul>
              </div>
            </div>

            <div className="row-summary-item">
              <div className="row-summary-item-inner">
                <TagList data={this.state.columnsList.filter((item) => item.isChecked)} cols={1} style={{ marginTop: '2px' }} onClickRemove={this.onClickRemoveTag}/>
              </div>
            </div>
          </div>
        </Content.Card>


        <Content.Card className=" editcolumnsmodal" noWrap>
          {this.state.activeCategory === 'Common' || this.state.activeCategory === 'Facebook'
            ?
              <div>
                <h3 className="modal-h3">Attribution Window</h3>
                <div className="attribution-window-inner">
                  <span className="attribution-window-title">After Clicking Ad</span>
                  <Radio group="afterClickingAd" classPrefix="aw-radio2" label="1day" value="1day" onChange={this.onChangeAttrWindowAfterClicking}/>
                  <Radio group="afterClickingAd" classPrefix="aw-radio2" label="7days" value="7days" onChange={this.onChangeAttrWindowAfterClicking}/>
                  <Radio group="afterClickingAd" classPrefix="aw-radio2" label="28days" checked value="28days" onChange={this.onChangeAttrWindowAfterClicking}/>
                </div>
                <div className="attribution-window-inner">
                  <span className="attribution-window-title">After Viewing Ad</span>
                  <Radio group="afterViewingAd" classPrefix="aw-radio2" label="1day" checked value="1day" onChange={this.onChangeAttrWindowAfterViewingAd}/>
                  <Radio group="afterViewingAd" classPrefix="aw-radio2" label="7days" value="7days" onChange={this.onChangeAttrWindowAfterViewingAd}/>
                  <Radio group="afterViewingAd" classPrefix="aw-radio2" label="28days" value="28days" onChange={this.onChangeAttrWindowAfterViewingAd}/>
                </div>
              </div>
            :
              <div>
                <h3 className="modal-h3">Attribution Window</h3>
                <div className="attribution-window-inner">
                  <span className="attribution-window-title">After Clicking Ad</span>
                  <Radio group="afterClickingAd" classPrefix="aw-radio2" label="1day" disabled value="1day" onChange={() => {}}/>
                  <Radio group="afterClickingAd" classPrefix="aw-radio2" label="7days" disabled value="7days" onChange={() => {}}/>
                  <Radio group="afterClickingAd" classPrefix="aw-radio2" label="28days" disabled value="28days" onChange={() => {}}/>
                </div>
                <div className="attribution-window-inner">
                  <span className="attribution-window-title">After Viewing Ad</span>
                  <Radio group="afterViewingAd" classPrefix="aw-radio2" label="1day" disabled value="1day" onChange={() => {}}/>
                  <Radio group="afterViewingAd" classPrefix="aw-radio2" label="7days" disabled value="7days" onChange={() => {}}/>
                  <Radio group="afterViewingAd" classPrefix="aw-radio2" label="28days" disabled value="28days" onChange={() => {}}/>
                </div>
              </div>
          }
        </Content.Card>
      </Modal>
    );
  }
}

EditColumnsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  getEditColumns: PropTypes.func,
  columnsList: PropTypes.array,
  columnsListCheckData: PropTypes.func,
};

//function mapStateToProps(state) {
//  return {
//    dashboardEditColumnsList: state.dashboard.dashboardEditColumnsList,
//
//  };
//}

//export default connect(
//  mapStateToProps,
//  {
//    getEditColumns,
//  }
//)(EditColumnsModal);

export default EditColumnsModal;
