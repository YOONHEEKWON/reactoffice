import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'core/ui/Modal/index';
import Step1 from './AppConversions/Step1';
import Step2 from './AppConversions/Step2';
import Step3 from './AppConversions/Step3';
import { systemMessage } from 'core/components/SystemMessage/action';
import {
  setAddConversionFormData,
  setConversion,
  resetAllConversionFormData
} from 'ai/pages/Assets/Google/Conversions/action';

const buttons = {
  step1: [
    { label: 'Cancel', description: 'Cancel', action: 'cancel' },
    { label: 'Continue', description: 'Continue', isPrimary: true, action: 'submit' },
  ],
  step2: [
    { label: 'Back', description: 'Back', isSecondary: true, align: 'left', action: 'back' },
    { label: 'Cancel', description: 'Cancel', action: 'cancel' },
    { label: 'Save', description: 'Save', isPrimary: true, action: 'submit' },
    //{ label: 'Continue', description: 'Continue', isPrimary: true, action: 'submit' },
  ],
  step3: [
    { label: 'Back', description: 'Back', isSecondary: true, align: 'left', action: 'back' },
    { label: 'Cancel', description: 'Cancel', action: 'cancel' },
    { label: 'Done', description: 'Done', isPrimary: true, action: 'submit' },
  ],
};

class AddNewConversionsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      isStepDone: false,
      isSavedConversion: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isInit !== nextProps.isInit && nextProps.isInit && this.state.isSavedConversion) {
      this.props.onClickDone();
      this.props.loadConversionList();
      this.props.systemMessage(
        'New Conversion Added',
        'Congratulations!\nYou\'re ready to start measuring your campaign\'s success. Once you\'ve set up your tracking method, you\'ll start seeing conversions within a day after prople click your ads and install your app.'
      );
      this.setState({
        isSavedConversion: false
      });
    }
  }

  componentWillUnmount() {
    // 다른 메뉴로의 이동 등의 경우에 입력내용 초기화가 필요
    this.props.resetAllConversionFormData();
  }

  handleGetData = (key) => this.props.addConversion[key];

  handleSetData = (key, value) => this.props.setAddConversionFormData({ [`${key}`]: value });

  handleClick = (action/*, index*/) => {
    switch (action) {
      case 'submit': {
        // validation 체크 후 이동
        const formData = this.props.addConversion;

        switch (this.state.step) {
          case 1:
            if (formData.appConversionType === 'FIRST_OPEN' && !formData.appPlatform) {
              alert('Please select mobile app platform');
              return false;
            } else {
              this.setState({ step: 2 });
            }
            break;
          //case 2:
          //  this.setState({ step: 3 });
          //  break;
          case 2:
          case 3:
            // Validation Check
            if (!formData.name) {
              this.props.systemMessage('Validation', 'Insert name.');
              return false;
            } else if (!formData.appId || !formData.appId.length) {
              this.props.systemMessage('Validation', 'Enter your mobile app.');
              return false;
            } else if (!formData.revenueValue || Number(formData.revenueValue) < 1) {
              this.props.systemMessage('Validation', 'Insert value.');
              return false;
            }

            // Done
            this.props.setConversion(this.props.addConversion);
            this.setState({
              isSavedConversion: true
            });
            break;
          default:
            break;
        }
        break;
      }
      case 'cancel':
        this.props.onClickCancel();
        break;

      case 'back':
        this.setState({ step: this.state.step - 1 });
        break;

      default:
        break;
    }
  };

  renderStep() {
    switch (this.state.step) {
      case 1:
        // Step1: Conversion Source
        return <Step1 getData={this.handleGetData} setData={this.handleSetData} webToken={this.props.webToken}/>;
      case 2:
        // Step2: Settings
        return <Step2 getData={this.handleGetData} setData={this.handleSetData} selectAppList={this.props.selectAppList}/>;
      case 3:
        // Step3: Review & Install
        return <Step3 getData={this.handleGetData} setData={this.handleSetData}/>;
      default:
        break;
    }
  }

  render() {
    return (
      <Modal
        title="App Conversions"
        buttons={this.state.isStepDone ? buttons.step3 : buttons[`step${this.state.step}`]}
        visible
        onClick={this.handleClick}
      >
        {this.renderStep()}
      </Modal>
    );
  }
}

AddNewConversionsModal.propTypes = {
  webToken: PropTypes.object,
  loadConversionList: PropTypes.func.isRequired,
  onClickDone: PropTypes.func.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  addConversion: PropTypes.object.isRequired,
  isInit: PropTypes.bool.isRequired,
  selectAppList: PropTypes.array,
  systemMessage: PropTypes.func.isRequired,
  setAddConversionFormData: PropTypes.func.isRequired,
  setConversion: PropTypes.func.isRequired,
  resetAllConversionFormData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    addConversion: state.assets.googleConversions.addConversion,
    isInit: state.assets.googleConversions.isInit,
    selectAppList: state.campaign.selectAppList,
  };
}

export default connect(
  mapStateToProps,
  {
    systemMessage,
    setAddConversionFormData,
    setConversion,
    resetAllConversionFormData,
  }
)(AddNewConversionsModal);
