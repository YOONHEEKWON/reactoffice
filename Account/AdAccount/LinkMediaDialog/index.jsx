import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFacebookAccessToken,
  getGoogleAccessToken,
  removeAccessToken,
} from 'ai/pages/Account/AdAccount/action';
import Dialog from 'core/ui/Dialog';
import Content from 'core/ui/Content';
import LinkMediaButton from 'core/ui/LinkMediaButton';
import './style.scss';

class LinkMediaDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFacebookLinked: this.isLinked('FB'),
      isGoogleLinked: this.isLinked('GG'),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.facebookAccessToken !== nextProps.facebookAccessToken) {
      this.setState({ isFacebookLinked: !!nextProps.facebookAccessToken });
    }
    if (this.props.googleAccessToken !== nextProps.googleAccessToken) {
      this.setState({ isGoogleLinked: !!nextProps.googleAccessToken });
    }
  }

  isLinked = (media) => !!(this.props.webToken.channeltoken && this.props.webToken.channeltoken[ 0 ][ media ]);

  handleClickButton = (/*action, index*/) => this.props.close('linkMedia');

  // store에 facebookAccessToken이 저장됨
  onLinkFacebook = (callback) =>
    this.props.getFacebookAccessToken(() => {
      this.setState({ isFacebookLinked: true });
      callback();
    });

  // store에 googleAccessToken이 저장됨
  onLinkGoogle = (callback) =>
    this.props.getGoogleAccessToken(() => {
      this.setState({ isGoogleLinked: true });
      callback();
    });

  // 타입은 반드시 'facebook' or 'google'
  onUnlink = (type) => (callback) =>
    this.props.removeAccessToken(type, () => {
      if (type === 'facebook') {
        this.setState({ isFacebookLinked: false });
      } else if (type === 'google') {
        this.setState({ isGoogleLinked: false });
      }
      callback();
    });

  render() {
    return (
      <Dialog
        // No dialog buttons
        title="Link Media"
        buttons={null}
        modalClass="link-media"
        onClick={this.handleClickButton} // X 버튼을 위해 onClick 필요
      >
        <div>
          <p className="fs-13">
            Unlinking the connected media will disconnect all ad accounts within that media.<br/>
            If the disconnected Ad Account is included in the Account Group, it will be automatically removed from that Group.
          </p>

          <div style={{ marginTop: '25px' }}>
            <Content.Item
              title="Facebook"
              titleWidth={160}
              titleStyle={{ fontWeight: 400 }}
              titleClassName="fs-13"
            >
              <LinkMediaButton
                media="facebook"
                isLinked={this.state.isFacebookLinked}
                onLink={this.onLinkFacebook}
                onUnlink={this.onUnlink('facebook')}
              />
            </Content.Item>

            <Content.Item
              title="Google"
              titleWidth={160}>
              <LinkMediaButton
                media="google"
                isLinked={this.state.isGoogleLinked}
                onLink={this.onLinkGoogle}
                onUnlink={this.onUnlink('google')}
              />
            </Content.Item>

            {!this.state.isFacebookLinked && !this.state.isGoogleLinked ?
              <p className="text-primary" style={{ display: 'inline' }}>* At least 1 account must be linked.</p>
              : null
            }
          </div>
        </div>
      </Dialog>
    );
  }
}

LinkMediaDialog.propTypes = {
  close: PropTypes.func.isRequired,
  webToken: PropTypes.object.isRequired,
  facebookAccessToken: PropTypes.string,
  googleAccessToken: PropTypes.string,
  getFacebookAccessToken: PropTypes.func.isRequired,
  getGoogleAccessToken: PropTypes.func.isRequired,
  removeAccessToken: PropTypes.func.isRequired,
};

LinkMediaDialog.defaultProps = {
  close() { return true; },
};

function mapStateToProps(state) {
  return {
    webToken: state.login.webToken,
    facebookAccessToken: state.adAccount.facebookAccessToken,
    googleAccessToken: state.adAccount.googleAccessToken,
  };
}

export default connect(
  mapStateToProps,
  {
    getFacebookAccessToken,
    getGoogleAccessToken,
    removeAccessToken,
  },
)(LinkMediaDialog);
