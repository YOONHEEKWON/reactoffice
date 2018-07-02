import React, { Component } from 'react';
import Button from 'core/ui/Button';
import InputBox from 'core/ui/InputBox';
import PropTypes from 'prop-types';

const text1 =
`<receiver android:name="com.google.ads.conversiontracking.InstallReceiver" android:exported="true">
  <intent-filter>
    <action andorid:name="com.android.vending.INSTALL_REFERER" />
  </intent-filter>
</receiver>`;
const text2 =
`// First opens and in-app actions_And_App installs (first-open)
// Google Android first open conversion tracking snippet
// Add this code to the onCreate() method of your application activity

AdWordsConversionReporter.reportWithConversionId(
  this.getApplicationContext(), "924693462", "1WXNCPDrsHQQ1uf2uAM", "1.00", false);`;

export default class Step3 extends Component {
  onClickSetData = (key, value) => () => this.props.setData(key, value);

  render() {
    const { getData } = this.props;

    return (
      <div>
        <div className="steps-wrap">

          {/* step 단계에 따라 클래스명: "steps--2, steps--3" */}
          <ul className="steps steps--3 clearfix">
            {/* step 상태에 따라 클래스명: "active, done" */}
            <li className="step font-13 done">
              <div className="step__text">
                <span className="step__text-order fs-13">1</span>
                Conversion Source
              </div>
            </li>
            <li className="step font-13 done">
              <div className="step__text">
                <span className="step__text-order fs-13">2</span>
                Settings
              </div>
            </li>
            <li className="step font-13 active">
              <div className="step__text">
                <span className="step__text-order fs-13">3</span>
                Review &amp; Install
              </div>
            </li>
          </ul>
        </div>

        <div className="row bs">
          <h2 className="fs-14">Implementing app install tracking</h2>
          <p className="conversion-setting__step-desc fs-13">
            You've created a tag to track Android app install (first open) conversions.<br/>
            The last step for you, or your app's developer, is to install the tag below in your app or set up a server-to-server feed.
          </p>
        </div>

        <div className="row row-special secondary bs">
          <p className="font-13 conversion-type--info">Select how to track your conversions.</p>

          {/* Put tracking code into the app */}
          <div className="conversion-setting__tracking">
            <label htmlFor="r1-1" className="aw-radio">
              <input
                type="radio"
                name="isPutTrackingCode"
                id="r1-1"
                readOnly
                checked={getData('isPutTrackingCode')}
                onClick={this.onClickSetData('isPutTrackingCode', true)}
              />
              <span className="aw-radio__label">
                <span className="aw-radio__form"/>
                <span className="aw-radio__text">Put tracking code into the app</span>
              </span>
            </label>

            <div className="conversion-setting__tracking-box">
              <ol className="conversion-setting__order-list">
                <li>
                  <p className="fs-12 conversion-setting__order-list-text">
                    Download and import this SDK into your Android project: <strong className="text-google">Google Conversion Tracking SDK
                    (Deprecated)</strong>
                  </p>
                </li>
                <li>
                  <p className="fs-12 conversion-setting__order-list-text">
                    Add these lines to your AndroidManifest.xml, between the &lt;application&gt;&lt;/application&gt; tags:
                  </p>
                  <textarea className="textarea font-11" defaultValue={text1}/>
                  <Button.Flat label="Copy" className="conversion-setting__tracking-copy-button xsmall fs-11"/>
                </li>
                <li>
                  <p className="fs-12 conversion-setting__order-list-text">
                    Add the following code to the onCreate() method of your application activity:
                  </p>
                  <textarea className="textarea font-11" style={{ height: '135px' }} defaultValue={text2}/>
                  <Button.Flat label="Copy" className="conversion-setting__tracking-copy-button xsmall fs-11"/>
                </li>
              </ol>
            </div>
          </div>
          {/* // Put tracking code into the app */}

          {/* Set up a server-to-server conversion feed from an app analytics package to Adwords */}
          <div className="conversion-setting__tracking">
            <label htmlFor="r1-2" className="aw-radio">
              <input
                type="radio"
                name="isPutTrackingCode"
                id="r1-2"
                readOnly
                checked={!getData('isPutTrackingCode')}
                onClick={this.onClickSetData('isPutTrackingCode', false)}
              />
              <span className="aw-radio__label">
                <span className="aw-radio__form"/>
                <span className="aw-radio__text">Set up a server-to-server conversion feed from an app analytics package to Adwords</span>
              </span>
            </label>

            <div className="conversion-setting__tracking-box">
              <p className="fs-12 conversion-setting__adwords-info">
                You'll need to follow&nbsp;
                <a
                  href="https://developers.google.com/app-conversion-tracking/api/legacy/android-conversion-tracking-server?hl=en-US"
                  target="_blank"
                  title="New Window"
                  className="text-google"
                  rel="noopener noreferrer"
                >
                  these steps
                </a>
                &nbsp;in our developer guide using the following information:
              </p>
              <p className="conversion-setting__adwords-data">
                <label htmlFor="infoConversionId" className="fs-12 inline-block">Conversion ID</label>
                <span className="inline-block conversion-setting__adwords-id-input">
                  <InputBox
                    id="infoConversionId"
                    value="924693462"
                    onChange={() => {}}
                  />
                </span>
              </p>
              <p className="conversion-setting__adwords-data">
                <label htmlFor="infoConversionLabel" className="fs-12 inline-block">Conversion label</label>
                <span className="inline-block conversion-setting__adwords-label-input">
                  <InputBox
                    id="infoConversionLabel"
                    value="1WXNCPDrsHQQ1uf2uAM"
                    onChange={() => {}}
                  />
                </span>
              </p>
            </div>
          </div>
          {/* // Set up a server-to-server conversion feed from an app analytics package to Adwords */}

          <hr className="divider"/>

          <div className="conversion-setting__email">
            <p className="conversion-setting__email-title">
              {/* 이 문구로 통일 */}
              <span className="text-primary fs-13">Email this information</span>
              <Button.Flat label="Save this information" primary className="medium"/>
              {/* // 이 문구로 통일 */}
            </p>
            <div className="conversion-setting__email-box">
              <p className="conversion-setting__email-data clearfix">
                <label htmlFor="sendToData" className="conversion-setting__email-label fs-13 float-left">Send to</label>
                <span className="conversion-setting__email-input float-right">
                  <InputBox
                    id="sendToData"
                    placeholder="email1@example.com, email2@example.com"
                    onChange={() => {}}
                  />
                </span>
              </p>
              <p className="conversion-setting__email-data clearfix">
                <label htmlFor="replyToData" className="conversion-setting__email-label fs-13 float-left">Reply to (Opt)</label>
                <span className="conversion-setting__email-input float-right">
                  <InputBox
                    id="replyToData"
                    placeholder="email1@example.com"
                    onChange={() => {}}
                  />
                </span>
              </p>
              <p className="conversion-setting__email-data clearfix">
                <label htmlFor="noteData" className="conversion-setting__email-label fs-13 float-left">Reply to (Opt)</label>
                <span className="conversion-setting__email-input float-right">
                  <textarea name="" id="noteData" cols="30" rows="3"/>
                </span>
              </p>
              <div className="text-right">
                <Button.Flat type="submit" label="Send" className="medium"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

Step3.propTypes = {
  getData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};
