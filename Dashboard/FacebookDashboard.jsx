import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import moment from 'moment';
import Button from 'core/ui/Button';
import CheckBox from 'core/ui/CheckBox';
import Content from 'core/ui/Content';
import DateRangePicker from 'core/ui/DateRangePicker';
import InputBox from 'core/ui/InputBox';
import { DATE_FORMAT } from 'core/constants/Configure';

const today = moment().format(DATE_FORMAT);

export default class DashboardMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: today,
      endDate: today,
    };
  }

  handleChangeCampaignPerformanceDate = (startDate, endDate) => {
    if (this.state.startDate !== startDate || this.state.endDate !== endDate) {
      this.setState({
        startDate,
        endDate,
      }, this.handleLoadDashboardDetail);
    }
  };

  render() {
    return (
      <div>
        <Content.Section
          title="Campaign Performance"
          component={
            <span>
              <DateRangePicker
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                contentAlign="right"
                onChange={this.handleChangeCampaignPerformanceDate}
              />
              {/*<select name="" id="">
               <option value="1">Standard Dashboard</option>
               <option value="2">Standard Dashboard</option>
               <option value="3">Standard Dashboard</option>
               </select>*/}
            </span>
          }
        />

        {/* 디자인 기획 비교 후 확인 필요 */}
        <Content.Card title="Facebook Account KPI, Yesterday" secondary>
          <table className="table text-center shadowy-bottom border">
            <colgroup>
              <col width="*"/>
              <col width="16%"/>
              <col width="16%"/>
              <col width="16%"/>
              <col width="16%"/>
              <col width="16%"/>
            </colgroup>

            <thead>
              <tr>
                <th className="text-center">Campaign</th>
                <th className="text-center">Impression</th>
                <th className="text-center">Clicks</th>
                <th className="text-center">Amount Spent</th>
                <th className="text-center">Reach</th>
                <th className="text-center">Results</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Campaign 1</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
              </tr>
              <tr>
                <td>Campaign 2</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
              </tr>
              <tr>
                <td>Campaign 3</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
                <td>000,000,000</td>
              </tr>
            </tbody>
          </table>
        </Content.Card>

        <Content.Card title="Campaign Management" secondary>
          {/* filter */}
          {/* 검색어 입력할 때: typing */}
          {/* 검색어 추가(enter 누를때)할 때: add */}
          <div className="table-filter clearfix typing add">
            <p className="table-filter-item table-filter--title fs-13">Filter</p>
            <div className="table-filter-item table-filter--scope">
              <select name="" id="">
                <option value="1">Campaign Name</option>
                <option value="2">Ad set/ad group Name</option>
                <optgroup label="Campaign Group">
                  <option value="3">Option 1.1</option>
                </optgroup>
                <optgroup label="Campaign Status">
                  <option value="4">Active</option>
                  <option value="5">paused</option>
                  <option value="6">Scheduled</option>
                </optgroup>
                <optgroup label="Objective (Campaign Type)">
                  <option value="7">Option 1.1</option>
                </optgroup>
                <optgroup label="Saved Filter">
                  <option value="8">Option 1.1</option>
                </optgroup>
              </select>
            </div>
            <div className="table-filter-item table-filter--search">
              <InputBox
                type="search"
                placeholder="Search"
                value=""
                style={{ width: '365px' }}
                onChange={() => {}}
              />
            </div>
            <div className="table-filter-item">
              <Button.Flat label="Add" primary className="medium button--searching-add"/>
            </div>
            <div className="table-filter--result-wrap clearfix">
              <div className="table-filter--result">
                <ul className="tag-list">
                  <li className="tag">
                    <span className="tag__text">170109_Website</span>
                    <button type="button" className="tag__delete icon adwitt-x-line" aria-label="Remove this tag"/>
                  </li>
                  <li className="tag">
                    <span className="tag__text">a</span>
                    <button type="button" className="tag__delete icon adwitt-x-line" aria-label="Remove this tag"/>
                  </li>
                  <li className="tag">
                    <span className="tag__text">abcccccccc</span>
                    <button type="button" className="tag__delete icon adwitt-x-line" aria-label="Remove this tag"/>
                  </li>
                  <li className="tag">
                    <span className="tag__text">a</span>
                    <button type="button" className="tag__delete icon adwitt-x-line" aria-label="Remove this tag"/>
                  </li>
                  <li className="tag">
                    <span className="tag__text">a</span>
                    <button type="button" className="tag__delete icon adwitt-x-line" aria-label="Remove this tag"/>
                  </li>
                  <li className="tag">
                    <span className="tag__text">a</span>
                    <button type="button" className="tag__delete icon adwitt-x-line" aria-label="Remove this tag"/>
                  </li>
                  <li className="tag">
                    <span className="tag__text">a</span>
                    <button type="button" className="tag__delete icon adwitt-x-line" aria-label="Remove this tag"/>
                  </li>
                </ul>
              </div>
              <Button.Flat label="Clear All" secondary className="medium fixed button--clear"/>
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
            <Button.Flat label="Edit" iconAfterLabel="arrow-bottom-line" className="medium hollow button--addition"/>
            <div className="float-right">
              <Button.Flat label="Auto Optimization" iconAfterLabel="arrow-bottom-line" className="medium hollow button--addition"/>
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

            <table className="table text-center shadowy-bottom border">
              <thead>
                <tr>
                  <th><CheckBox group="dashboard-campaign-list" checked onChange={() => {
                  }}/></th>
                  <th>Account</th>
                  <th>Status</th>
                  <th>Campaign</th>
                  <th>Objective</th>
                  <th>Campaign Group</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Budget</th>
                  <th>Spend</th>
                  <th>Spend rate</th>
                  <th>Impression</th>
                  <th>Click</th>
                  <th>App install</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="14">
                    <p className="fs-12 text-center">
                      There are no active ads during the selected period.<br/>
                      Please check campaign period and status and search again.
                    </p>
                    <p className="fs-12 text-center">
                      No data available in table.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td><CheckBox group="dashboard-campaign-list" checked onChange={() => {
                  }}/></td>
                  <td>
                    <span className="icon adwitt-media-facebook icon--media"/>
                    account name1
                  </td>
                  <td>
                    <span className="aw-status">
                      <span className="icon adwitt-status" data-status="active"/>
                    </span>
                  </td>
                  <td>FB_Cam_01</td>
                  <td>App install</td>
                  <td>Open event</td>
                  <td>17-00-00</td>
                  <td>17-00-00</td>
                  <td>10,000</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><CheckBox group="dashboard-campaign-list" checked onChange={() => {
                  }}/></td>
                  <td>
                    <span className="icon adwitt-media-facebook icon--media"/>
                    account name1
                  </td>
                  <td>
                    <span className="aw-status">
                      <span className="icon adwitt-status" data-status="rejected"/>
                    </span>
                  </td>
                  <td>FB_Cam_01</td>
                  <td>App install</td>
                  <td>Open event</td>
                  <td>17-00-00</td>
                  <td>17-00-00</td>
                  <td>10,000</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><CheckBox group="dashboard-campaign-list" checked onChange={() => {
                  }}/></td>
                  <td>
                    <span className="icon adwitt-media-facebook icon--media"/>
                    account name1
                  </td>
                  <td>
                    <span className="aw-status">
                      <span className="icon adwitt-status" data-status="pending"/>
                    </span>
                  </td>
                  <td>FB_Cam_01</td>
                  <td>App install</td>
                  <td>Open event</td>
                  <td>17-00-00</td>
                  <td>17-00-00</td>
                  <td>10,000</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><CheckBox group="dashboard-campaign-list" checked onChange={() => {
                  }}/></td>
                  <td>
                    <span className="icon adwitt-media-facebook icon--media"/>
                    account name1
                  </td>
                  <td>
                    <span className="aw-status">
                      <span className="icon adwitt-status" data-status="inactive"/>
                    </span>
                  </td>
                  <td>FB_Cam_01</td>
                  <td>App install</td>
                  <td>Open event</td>
                  <td>17-00-00</td>
                  <td>17-00-00</td>
                  <td>10,000</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td><CheckBox group="dashboard-campaign-list" checked onChange={() => {
                  }}/></td>
                  <td>
                    <span className="icon adwitt-media-facebook icon--media"/>
                    account name1
                  </td>
                  <td>
                    <span className="aw-status">
                      <span className="icon adwitt-status-o" data-status="inactive"/>
                    </span>
                  </td>
                  <td>FB_Cam_01</td>
                  <td>App install</td>
                  <td>Open event</td>
                  <td>17-00-00</td>
                  <td>17-00-00</td>
                  <td>10,000</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* //table */}
        </Content.Card>
      </div>
    );
  }
}

DashboardMain.propTypes = {};
