import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdAccountGroupEditor from 'ai/pages/Account/AdAccount/ManageAccountGroupDialog/AdAccountGroupEditor';
import AdAccountGroupList from 'ai/pages/Account/AdAccount/ManageAccountGroupDialog/AdAccountGroupList';

export default class AdAccountGroupsBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { groupData, deleteItemInGroupData, completeGroupEditor, cancelGroupEditor, editingGroup, deleteGroup } = this.props;
    const groups = [ ...groupData.add, ...groupData.edit ];

    return (
      <div className="link-accounts link-accounts--group">
        <div className="link-accounts__heading clearfix">
          <h2 className="link-accounts__heading-text">Account Groups</h2>
          <span className="link-accounts__length">{groups.length}</span>
        </div>

        <AdAccountGroupEditor
          groupData={groupData}
          deleteItemInGroupData={deleteItemInGroupData}
          completeGroupEditor={completeGroupEditor}
          cancelGroupEditor={cancelGroupEditor}
        />

        <AdAccountGroupList
          groupData={groupData}
          editingGroup={editingGroup}
          deleteGroup={deleteGroup}
        />

      </div>
    );
  }
}

AdAccountGroupsBox.propTypes = {
  groupData: PropTypes.object,

  deleteItemInGroupData: PropTypes.func.isRequired,
  completeGroupEditor: PropTypes.func.isRequired,
  cancelGroupEditor: PropTypes.func.isRequired,
  editingGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
};
