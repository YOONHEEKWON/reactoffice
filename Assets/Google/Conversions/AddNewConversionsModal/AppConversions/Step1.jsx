import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radio from 'core/ui/Radio';

const appConversionType = [ 'GOOGLE_PLAY', 'FIRST_OPEN', 'FIREBASE' ];
const appPlatform = [ 'ANDROID_MARKET', 'ANDROID_INAPP', 'IOS_MARKET', 'IOS_INAPP' ];

export default class Step1 extends Component {
  componentWillMount() {
    // 기본 폼 값을 넣어준다.
    this.props.setData('userId', this.props.webToken.userId);
    this.props.setData('accountId', this.props.webToken.channeltoken[0].GG.ownerId);
    this.props.setData('appPlatform', appPlatform[0]);
    this.props.setData('appValue', 'EACH');
    this.props.setData('alwaysUseRevenueValue', true);
    this.props.setData('conversionId', 0);
    this.props.setData('conversionType', 'string');
    this.props.setData('appConversionType', appConversionType[1]);
    this.props.setData('alwaysUseRevenueValue', true);
    this.props.setData('category', 'DEFAULT');
    this.props.setData('conversionId', 0);
    this.props.setData('conversionType', 'string');
    this.props.setData('includeConversion', 'string');
  }

  onClickAppConversionType = (value) => () => {
    this.props.setData('appPlatform', null);
    this.props.setData('appConversionType', value);
  };

  onClickAppPlatform = (value) => () => {
    this.props.setData('appConversionType', appConversionType[1]);
    this.props.setData('appPlatform', value);
  };

  render() {
    const { getData } = this.props;

    return (
      <div>
        <div className="steps-wrap">

          {/* step 단계에 따라 클래스명: "steps--2, steps--3" */}
          <ul className="steps steps--2 clearfix">
            {/* step 상태에 따라 클래스명: "active, done" */}
            <li className="step font-13 active">
              <div className="step__text">
                <span className="step__text-order fs-13">1</span>
                Conversion Source
              </div>
            </li>
            <li className="step font-13">
              <div className="step__text">
                <span className="step__text-order fs-13">2</span>
                Settings
              </div>
            </li>
            {/*<li className="step font-13">
              <div className="step__text">
                <span className="step__text-order fs-13">3</span>
                Review &amp; Install
              </div>
            </li>*/}
          </ul>
        </div>

        <div className="row bs">
          <p className="font-13 conversion-type--info">Select how to track your conversions.</p>

          {/* Google play */}
          <div className="conversion-type--box">
            <Radio
              group="appConversionType"
              label="Google Play"
              readOnly
              checked={getData('appConversionType') === appConversionType[0]}
              classPrefix="aw-radio2"
              className="fs-13 conversion-type__radio"
              onChange={this.onClickAppConversionType(appConversionType[0])}
            />
            <p className="fs-12 conversion-type__desc">Automatically track Android app installs or in-app purchases, without adding code to your app.</p>
          </div>
          {/* // Google play */}

          {/* First opens and in-app actions */}
          <div className="conversion-type--box active">
            <label htmlFor="rcs-2" className="aw-radio2 conversion-type__radio">
              <input
                type="radio"
                name="appConversionType"
                id="rcs-2"
                readOnly
                checked={getData('appConversionType') === appConversionType[1]}
              />
              <span className="aw-radio2__label">
                <span className="aw-radio2__form"/>
                {/*<span className="aw-radio2__text">First opens and in-app actions</span>*/}
                <span className="aw-radio2__text">First opens</span>
              </span>
            </label>
            <p className="fs-12 conversion-type__desc">Track app conversions by adding code to your app or using 3rd-party analytics</p>

            {/* hide */}
            <div className="conversion-type__detail-option">
              <p className="text-primary fs-12">Select your mobile app platform.</p>

              <p className="conversion-type__detail-option-title bullet-dot fs-12"><strong>Android</strong></p>
              <p className="conversion-type__detail-option-radio">
                <label htmlFor="r1-1" className="aw-radio">
                  <input
                    type="radio"
                    name="r1"
                    id="r1-1"
                    readOnly
                    checked={getData('appPlatform') === appPlatform[0] ? 'checked' : ''}
                    onClick={this.onClickAppPlatform(appPlatform[0])}
                  />
                  <span className="aw-radio__label">
                    <span className="aw-radio__form"/>
                    <span className="aw-radio__text">App installs (first-open)</span>
                  </span>
                </label>
              </p>
              {/*<p className="conversion-type__detail-option-radio">
                <label htmlFor="r1-2" className="aw-radio">
                  <input
                    type="radio"
                    name="r1"
                    id="r1-2"
                    readOnly
                    checked={getData('appPlatform') === appPlatform[1] ? 'checked' : ''}
                    onClick={this.onClickAppPlatform(appPlatform[1])}
                  />
                  <span className="aw-radio__label">
                    <span className="aw-radio__form"/>
                    <span className="aw-radio__text">In-app actions</span>
                  </span>
                </label>
              </p>*/}

              <p className="conversion-type__detail-option-title bullet-dot fs-12" style={{ marginTop: '10px' }}><strong>IOS</strong></p>
              <p className="conversion-type__detail-option-radio">
                <label htmlFor="r2-1" className="aw-radio">
                  <input
                    type="radio"
                    name="r1"
                    id="r2-1"
                    readOnly
                    checked={getData('appPlatform') === appPlatform[2] ? 'checked' : ''}
                    onClick={this.onClickAppPlatform(appPlatform[2])}
                  />
                  <span className="aw-radio__label">
                    <span className="aw-radio__form"/>
                    <span className="aw-radio__text">App installs (first-open)</span>
                  </span>
                </label>
              </p>
              {/*
              <p className="conversion-type__detail-option-radio">
                <label htmlFor="r2-2" className="aw-radio">
                  <input
                    type="radio"
                    name="r1"
                    id="r2-2"
                    readOnly
                    checked={getData('appPlatform') === appPlatform[3]}
                    onClick={this.onClickAppPlatform(appPlatform[3])}
                  />
                  <span className="aw-radio__label">
                    <span className="aw-radio__form"/>
                    <span className="aw-radio__text">In-app actions</span>
                  </span>
                </label>
              </p>
              */}
            </div>
            {/* // hide */}
          </div>
          {/* // First opens and in-app actions */}

          {/* Firebase */}
          <div className="conversion-type--box">
            <Radio
              group="appConversionType"
              label="Firebase"
              readOnly
              checked={getData('appConversionType') === appConversionType[2]}
              classPrefix="aw-radio2"
              className="fs-13 conversion-type__radio"
              onChange={this.onClickAppConversionType(appConversionType[2])}
            />
            <p className="fs-12 conversion-type__desc">Import conversions from a linked Firebase project.</p>
          </div>
          {/* // Firebase */}

        </div>
      </div>
    );
  }
}

Step1.propTypes = {
  getData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  webToken: PropTypes.object,
};
