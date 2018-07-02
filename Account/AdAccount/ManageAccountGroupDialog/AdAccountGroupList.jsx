import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import InputBox from 'core/ui/InputBox';

export default class AdAccountGroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.groupData.selectedGroupName !== nextProps.groupData.selectedGroupName) {
      if (nextProps.groupData.selectedGroupName) {
        this.props.editingGroup(nextProps.groupData.selectedGroupName)();
      }
    }
  }

  search = (e) => {
    this.setState({
      searchKey: e.target.value.trim(),
    });
  };

  filteredGroups = (totalGroups) => {
    const { searchKey } = this.state;
    return totalGroups
      .filter((group) => group.groupName.startsWith(searchKey));
  };

  isSelected = (groupName) => this.props.groupData.target.oldGroupName === groupName;

  // editor 에서 수정사항이 있는지 확인한다.(그룹명, 추가, 제거)
  isEdited = () => {
    const { groupData } = this.props;
    const targetGroup = groupData.target;
    const originGroup = [ ...groupData.add, ...groupData.edit ].find((group) => group.oldGroupName === targetGroup.oldGroupName);
    const inputTag = document.querySelector('.account-group-maker input');

    if (!originGroup || !inputTag) {
      return false;
    } else if (targetGroup.groupName !== inputTag.value.trim()) { // 그룹명
      return true;
    } else if (!_.isEqual(targetGroup.edit, originGroup.edit)) { // 수정사항 1
      return true;
    } else if (!originGroup.accounts.length && !!targetGroup.accounts.length) {
      return true;
    } else if (originGroup.accounts.length !== targetGroup.accounts.length) {
      return true;
    }
    return false;
  };

  editingGroup = (groupName) => () => {
    const { editingGroup } = this.props;
    if (this.isEdited()) {
      if (window.confirm('Do you want to edit this account group?\nAccount group that is not saved will be deleted.')) {
        editingGroup(groupName)();
      }
    } else {
      editingGroup(groupName)();
    }
  };

  deleteGroup = (groupName) => () => {
    const { deleteGroup } = this.props;
    if (this.isEdited()) {
      if (window.confirm('Do you want to edit this account group?\nAccount group that is not saved will be deleted.')) {
        deleteGroup(groupName)();
      }
    } else {
      deleteGroup(groupName)();
    }
  };

  render() {
    const { groupData } = this.props;
    const totalGroups = [ ...groupData.add, ...groupData.edit ];
    const filteredGroups = this.filteredGroups(totalGroups);

    return (
      !Object.keys(totalGroups).length ? //
        <p className="account-group-list__info">There is no account group yet.</p>
        : //
        <div>
          <div className="link-accounts__search">
            <InputBox data-type="search" placeholder="Search by Account(Group) Name." style={{ width: '320px' }} onChange={this.search}/>
          </div>
          {!filteredGroups.length ? //
            <p className="no-match-groups">No matching results found.</p>
            : //
            <div className="account-group-list">
              <ul className="list--dot">
                {filteredGroups
                  .map((group) =>
                    <li
                      className={classNames('account-group-list__item', 'clearfix', { _active: this.isSelected(group.groupName) })}
                      key={group.groupName}
                    >
                      <p className="account-group-list__name">{group.groupName}</p>
                      <button
                        type="button"
                        className="account-group-list__delete icon adwitt-garbage"
                        onClick={this.deleteGroup(group.groupName)}>
                      </button>
                      {this.isSelected(group.groupName) ?
                        null :
                        <button
                          type="button"
                          className="account-group-list__edit icon adwitt-pencil"
                          onClick={this.editingGroup(group.groupName)}>
                        </button>
                      }
                    </li>,
                  )}
              </ul>
            </div>
          }
        </div>
    );
  }
}

AdAccountGroupList.propTypes = {
  groupData: PropTypes.object,

  editingGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
};
