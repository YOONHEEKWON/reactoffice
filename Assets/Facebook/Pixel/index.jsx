import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from 'ai/ui/Header';
import './styles.scss';

class FacebookPixel extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Header name="facebookPixel"/>
      </div>
    );
  }
}

FacebookPixel.propTypes = {
};

function mapStateToProps(state) {
  return {
  };
}

export default connect(
  mapStateToProps,
  {
  }
)(FacebookPixel);
