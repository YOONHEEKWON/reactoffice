//import types from './action';

import types from './action';
//store
const initialState = {
  assetdata: null,
};

export default function audience(state = initialState, { type, payload }) {
  switch (type) {
    case types.LOAD_ASSET_DATA:
      return {
        ...state,
        Assettabledatalist: payload,
      };
    default:
      return state;
  }
}
