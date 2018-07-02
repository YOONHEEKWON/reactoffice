import React, { Component } from 'react';
import Button from 'core/ui/Button';
import Content from 'core/ui/Content';
import SelectBox from 'core/ui/SelectBox';

const selectBoxData = [
  'All', 'Approved', 'Disapproved', 'Pending Review', 'Invitation Sent'
];

const onChangeItem = (item, index) => {
  alert(`SELECTED ITEM: ${item} (${index})`);
};

export default class PageFilter extends Component{
  render() {
    return (
      <Content.Card title="Approval Status" noWrap className="filter-wrap--user">
        <SelectBox
          data={selectBoxData}
          selectedIndex={0}
          selectedIcon
          contentWidth="150px"
          titleWidth="150px"
          onChange={onChangeItem}
        />
        <Button.Flat label="OK" primary className="medium" style={{ marginLeft: '10px' }}/>
      </Content.Card>
    )
  }
}
