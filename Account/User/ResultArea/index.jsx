import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'core/ui/Button';

export default class ResultArea extends Component {
  onClickAddPartnerModal = () => {
    this.props.handleClickAddUser();
  };

  render() {
    return (
      <div>
        <Button.Flat label="Add Partner" className="medium" onClick={this.onClickAddPartnerModal}/>
        === result Area ===
      </div>
    );
  }
}

ResultArea.propTypes = {
  handleClickAddUser: PropTypes.func.isRequired,
};
