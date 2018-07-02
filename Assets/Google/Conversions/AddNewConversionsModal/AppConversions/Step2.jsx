import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'core/ui/Button';
import InputBox from 'core/ui/InputBox';
import Radio from 'core/ui/Radio';
import SelectBox from 'core/ui/SelectBox';
import AppSelection from 'ai/pages/RMFCampaign/AppSelection';

const revenueCurrencyCode = [
  'Slovenian Tolar (SIT)',
  'South African Rand (ZAR)',
  'South Korean (KRW:₩)',
  'Sri Lankan Rupee (LKR)',
  'Swedish Krona (SEK)',
  'Swiss Franc (CHF)',
];
const revenueCurrencyValue = [
  'SIT', 'ZAR', 'KRW', 'LKR', 'SEK', 'CHF',
];
const conversionWindow = [
  'A',
  'B',
];

export default class Step2 extends Component {
  componentWillMount() {
    this.props.setData('appId', this.props.selectAppList.appId);
    this.props.setData('revenueCurrencyCode', revenueCurrencyValue[0]);
    this.props.setData('excludeFromBidding', false);
  }

  handleRevenueCurrencyCode = (item, index) => this.props.setData('revenueCurrencyCode', revenueCurrencyValue[index]);

  onClickSetData = (key, value) => () => this.props.setData(key, value);

  onChangeText = (key) => (e) => this.props.setData(key, e.target.value);

  render() {
    const { getData } = this.props;
    const appPlatform = getData('appPlatform');

    return (
      <div>
        <div className="steps-wrap">

          {/* step 단계에 따라 클래스명: "steps--2, steps--3" */}
          <ul className="steps steps--2 clearfix">
            {/* step 상태에 따라 클래스명: "active, done" */}
            <li className="step font-13 done">
              <div className="step__text">
                <span className="step__text-order fs-13">1</span>
                Conversion Source
              </div>
            </li>
            <li className="step font-13 active">
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
          {appPlatform === 'ANDROID_MARKET' && <h2 className="fs-14">New conversion action: Android App install (first open)</h2>}
          {appPlatform === 'IOS_MARKET' && <h2 className="fs-14">New conversion action: iOS App install (first open)</h2>}
          <p className="conversion-setting__step-desc fs-13">Set basic information about this conversion action, including how much it's worth to your business.</p>
        </div>

        <div className="bs row row-special secondary conversion-setting">
          <h3 className="sub-title inline-block">Name</h3>
          <div className="sub-contents inline-block conversion-setting__name-input">
            <InputBox
              value={getData('name')}
              style={{ width: '450px' }}
              onChange={this.onChangeText('name')}
            />
          </div>
        </div>

        <div className="row row-special secondary bs conversion-setting">
          <h3 className="sub-title inline-block">Value</h3>
          <div className="sub-contents inline-block">
            <p className="fs-12" style={{ marginBottom: '5px' }}>Enter the value of each install of this app. This may be the price of the app.</p>
            <div>
              <Radio
                group="conversionReviewVal"
                label="Each install is worth"
                defaulted
                checked={getData('appValue') === 'EACH'}
                onChange={this.onClickSetData('appValue', 'EACH')}
              />

              <div className="inline-block conversion-setting__price-selectbox">
                <SelectBox
                  data={revenueCurrencyCode}
                  selectedIndex={revenueCurrencyValue.indexOf(getData('revenueCurrencyCode'))}
                  checked
                  titleWidth="210px"
                  contentWidth="210px"
                  onChange={this.handleRevenueCurrencyCode}
                />
              </div>

              <div className="inline-block conversion-setting__price-input">
                <InputBox
                  type="number"
                  value={getData('revenueValue')}
                  style={{ marginLeft: '10px' }}
                  onChange={this.onChangeText('revenueValue')}
                />
              </div>
            </div>
            <div>
              <Radio
                group="conversionReviewVal"
                label="Don’t assign a value to this install"
                checked={getData('appValue') === 'DONT_ASSIGN'}
                onChange={this.onClickSetData('appValue', 'DONT_ASSIGN')}
              />
            </div>
          </div>
        </div>

        <div className="row row-special secondary bs conversion-setting">
          <h3 className="sub-title inline-block">Mobile App</h3>
          <div className="sub-contents inline-block">
            <div className="conversion-setting__mobile-app-search clearfix">
              <div className="conversion-setting__mobile-app-search-input float-left">
                <AppSelection isGoogleConversions={true}/>
              </div>
            </div>

            {/*<p className="conversion-setting__mobile-app-desc fs-13">
              <span className="icon adwitt-info-bubble"/>
              No code is needed. We automatically track downloads from the Google Play store.<br/>
              Make sure to use your app's URL.<br/>
              <span className="conversion-setting__mobile-app-landing inline-block">
                <span className="text-primary">*Ex</span> : Your ads landing page - "http://play.google.com/store/apps/details?id=&lt;package_name&gt;"
              </span>
            </p>*/}
          </div>
        </div>

        <div className="row row-special secondary bs conversion-setting">
          <h3 className="sub-title inline-block">
            Include in “Conversions”
            {/*<span className="icon adwitt-info-circle text-primary fs-14"/>*/}
          </h3>
          <div className="sub-contents inline-block">
            <div className="conversion-setting__radio-content">
              <Radio
                group="conversionReviewInclude"
                label="Yes"
                checked={!getData('excludeFromBidding')}
                onChange={this.onClickSetData('excludeFromBidding', false)}
              />
              <p className="fs-12">
                Include data for this conversion action in your "Conversions" column,<br/>
                which is used by any conversion-based bid strategies you might have set up.
              </p>
            </div>

            <div className="conversion-setting__radio-content">
              <Radio
                group="conversionReviewInclude"
                label="No"
                checked={getData('excludeFromBidding')}
                onChange={this.onClickSetData('excludeFromBidding', true)}
              />
              <p className="fs-12">
                Do not include data for this conversion action in your "Conversions" column.<br/>
                It means your automated bid strategies won’t bid for these particular conversions.
              </p>
            </div>
          </div>
        </div>

        <div className="row row-special secondary bs conversion-setting">
          <h3 className="sub-title inline-block">Postback URL (Opt)</h3>
          <div className="sub-contents inline-block">
            <div className="conversion-setting__mobile-app-search clearfix">
              <div className="conversion-setting__mobile-app-search-input float-left">
                <InputBox
                  placeholder="Enter the url"
                  value={getData('postBackUrl')}
                  style={{ width: '450px' }}
                  onChange={this.onChangeText('postBackUrl')}
                />
              </div>
              <Button.Flat label="Search" primary className="medium"/>
            </div>

            <p className="conversion-setting__mobile-app-desc fs-13">
              <span className="icon adwitt-info-bubble"/>
              If you'd like, system can post conversion information to your Android app analytics package.<br/>
              Just enter the URL from your analytics provider where you'd like conversions to be posted.
              <span className="conversion-setting__mobile-app-landing">
                <span className="text-primary">*Ex</span> : http://my-app-analytics.com/google_install?click_url=[click_url]...
              </span>
            </p>
          </div>
        </div>

        <div className="row row-special secondary bs conversion-setting">
          <h3 className="sub-title inline-block">Count</h3>
          <div className="sub-contents inline-block">
            <div className="conversion-setting__radio-content">
              <Radio
                group="conversionCount"
                label="Every"
                defaulted
                checked={getData('conversionType') === 'EVERY'}
                onChange={this.onClickSetData('conversionType', 'EVERY')}
              />
              <p className="fs-12">Example: if one ad click leads to 3 purchases, that will count as 3 conversions.</p>
            </div>

            <div className="conversion-setting__radio-content">
              <Radio
                group="conversionCount"
                label="One"
                checked={getData('conversionType') === 'ONE'}
                onChange={this.onClickSetData('conversionType', 'ONE')}
              />
              <p className="fs-12">Example: if one ad click leads to 3 purchases, that will count as 1 conversion.</p>
            </div>
          </div>
        </div>

        <div className="row row-special secondary bs conversion-setting">
          <h3 className="sub-title inline-block">Conversion Window</h3>
          <div className="sub-contents inline-block">
            <p>Choose how long after a click you'd like to track conversions.</p>
            <SelectBox data={conversionWindow}/>
          </div>
        </div>

      </div>
    );
  }
}

Step2.propTypes = {
  getData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  selectAppList: PropTypes.array,
};
