import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/ui/Icon';

export default function ArrowButton(props) {
  return (
    <button className="arrow-bottom" onClick={props.handleClick}>
      {props.isToggle ?
        <Icon type="arrow-top-circle"/>
        :
        <Icon type="arrow-bottom-circle"/>
      }
    </button>
  );
}

ArrowButton.propTypes = {
  isToggle: PropTypes.bool,
  handleClick: PropTypes.func,
};

ArrowButton.defaultProps = {
  isToggle: false,
  handleClick: () => {},
};
