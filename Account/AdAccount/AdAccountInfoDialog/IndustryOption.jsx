import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import EllipsisText from 'core/ui/EllipsisText';
import {
  getIndustries,
} from 'ai/pages/Account/AdAccount/action';

import Button from 'core/ui/Button';

class IndustryOption extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { industries, getIndustries } = this.props;
    if (!industries.length) {
      getIndustries();
    }
  }

  handelSelect = (sub) => () => this.props.onSelect('industries')({ ...sub, id: sub.industrySubId });

  makeName = (industrySub) => {
    const mainName = this.props.industries.find((industry) => industry.industryId === industrySub.industryId).industryName;
    const subName = industrySub.industrySubName;
    return `[${mainName}] ${subName}`;
  };

  render() {
    const { industries, selectedData, onDelete } = this.props;

    return (
      <div className="ad-account-info__divider">
        <dl className="clearfix ad-account-info__row">
          <dt className="float-left ad-account-info__header">Industry</dt>
          <dd className="float-left fs-12 ad-account-info__body">

            <ul className="list--box dot">
              {selectedData.industries.map((industrySub) =>
                <li key={`industry-selected-${industrySub.industrySubId}`}>
                  <p className="list--box__text fs-12">
                    <EllipsisText>{this.makeName(industrySub)}</EllipsisText>
                  </p>
                  <Button.Icon
                    icon="x-line"
                    description="Delete this item"
                    className="list--box__button-delete"
                    onClick={onDelete('industries')(industrySub.industrySubId)}
                  />
                </li>,
              )}
            </ul>

            <div className={classNames('industry-list', { disabled: !!selectedData.industries.length })}>
              {industries.map((main) =>
                <dl className="industry__section" key={`inudstry-main-${main.industryId}`}>
                  <dt className="industry__title">{main.industryName}</dt>
                  {main.industrySubList.map((sub) =>
                    <dd className="industry__item" key={`inudstry-sub-${sub.industrySubId}`}>
                      <button
                        type="button"
                        className="industry__item__button fs-12"
                        onClick={this.handelSelect(sub)}
                      >
                        {sub.industrySubName}
                      </button>
                    </dd>,
                  )}
                </dl>,
              )}
            </div>

          </dd>
        </dl>
      </div>
    );
  }
}

IndustryOption.propTypes = {
  selectedData: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,

  industries: PropTypes.array,
  getIndustries: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    industries: state.adAccount.industries,
  };
}

export default connect(
  mapStateToProps,
  {
    getIndustries,
  },
)(IndustryOption);
