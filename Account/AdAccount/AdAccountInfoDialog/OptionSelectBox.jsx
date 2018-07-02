import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getUID } from 'core/utils/Text';
import Button from 'core/ui/Button';
import EllipsisText from 'core/ui/EllipsisText';
import SelectBox from 'core/ui/SelectBox';
import './style.scss';

export default class OptionSelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: getUID(),
    };
  }

  template = (item) => <span>{item.text}</span>;

  placeholderTemplate = () => this.props.placeholder;

  render() {
    const { data, selectedData, onSelect, onDelete } = this.props;

    return (
      <div>
        <ul className="list--box dot">
          {selectedData.map((item) =>
            <li key={`${this.state.uid}-${item.id}`}>
              <p className="list--box__text fs-12">
                <EllipsisText>{item.text}</EllipsisText>
              </p>
              <Button.Icon
                icon="x-line"
                description="Delete this item"
                className="list--box__button-delete"
                onClick={onDelete(item.id)}
              />
            </li>,
          )}
        </ul>

        <SelectBox
          data={data.filter((item) => !selectedData.some((d) => d.id === item.id))}
          dataTemplate={this.template}
          onChange={onSelect}
          titleWidth="100%"
          contentWidth="100%"
          placeholder={this.placeholderTemplate}
        />
      </div>
    );
  }
}

OptionSelectBox.propTypes = {
  data: PropTypes.array.isRequired, // ex) [{id:1,text:'A', ...}, ...]
  selectedData: PropTypes.array.isRequired, // ex) [{id:1,text:'A', ...}, ...]
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};
