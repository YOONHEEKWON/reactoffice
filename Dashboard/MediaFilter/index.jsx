import React, { Component } from 'react';
import { mediaChannelInfo } from 'core/constants/MediaChannel';
import Button from 'core/ui/Button';
import Content from 'core/ui/Content';
import CheckBox from 'core/ui/CheckBox';
import Icon from 'core/ui/Icon';
import DateRangePicker from 'core/ui/DateRangePicker';
//import { DATE_FORMAT } from 'core/constants/Configure';

import './styles.scss';
import PropTypes from 'prop-types';

export default class MediaFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: {
        FB: this.props.initialData.channel[ 'FB' ],
        GG: this.props.initialData.channel[ 'GG' ],
      },
      startDate: this.props.initialData.startDate,
      endDate: this.props.initialData.endDate,
    };
  }

  onChangeDateRange = (startDate, endDate) => {
    if (this.state.startDate !== startDate || this.state.endDate !== endDate) {
      this.setState({
        startDate,
        endDate,
      });
    }
  };

  handleChangeMedia = (type) => (value, checked) => {
    switch (type) {
      case 'GG':
        this.setState({
          channel: {
            ...this.state.channel,
            GG: checked,
          },
        });
        break;
      case 'FB':
        this.setState({
          channel: {
            ...this.state.channel,
            FB: checked,
          },
        });
        break;
      // no default
    }
  };

  handleApplyMediaFilter = () => {
    const {
      channel,
      startDate,
      endDate,
    } = this.state;

    this.props.setDataFilter({ channel, startDate, endDate });
  };

  render() {
    return (
      <Content.Card secondary>
        <div className="media clearfix">
          <h3 className="fs-14 filter-title">Media</h3>
          <div className="filter-content">
            <div className="media-filter">
              <ul className="channel">
                <li>
                  <CheckBox group="selectbox-media-channel" checked={this.state.channel[ 'FB' ]} onChange={this.handleChangeMedia('FB')}>
                    <Icon type={mediaChannelInfo[ 'FB' ].icon}/>
                    <span style={{ marginLeft: '2px' }}>{mediaChannelInfo[ 'FB' ].label}</span>
                  </CheckBox>
                </li>
                <li>
                  <CheckBox group="selectbox-media-channel" checked={this.state.channel[ 'GG' ]} onChange={this.handleChangeMedia('GG')}>
                    <Icon type={mediaChannelInfo[ 'GG' ].icon}/>
                    <span style={{ marginLeft: '2px' }}>{mediaChannelInfo[ 'GG' ].label}</span>
                  </CheckBox>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="period clearfix">
          <h3 className="fs-14 filter-title">Period</h3>
          <div className="filter-content">
            <DateRangePicker
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.onChangeDateRange}
            />
          </div>
        </div>
        <Button.Flat label="OK" className="medium button--searching-ok" onClick={this.handleApplyMediaFilter}/>
      </Content.Card>
    );
  }
}

MediaFilter.propTypes = {
  initialData: PropTypes.object,
  setDataFilter: PropTypes.func.isRequired,
};
