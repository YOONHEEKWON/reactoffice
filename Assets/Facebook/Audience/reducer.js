//import types from './action';

import types from './action';
//store
const initialState = {
  AssetData: null,
};

export default function audience(state = initialState, { type, payload }) {
  switch (type) {
    case types.LOAD_ASSET_DATA:
      return {
        ...state,
        AssetTableDataList: payload,
      };
    default:
      return state;
  }
}
