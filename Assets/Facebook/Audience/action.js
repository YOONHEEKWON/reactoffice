//import { restApi, apiError } from 'core/utils/API';

import { restApi, apiError } from 'core/utils/API';

const types = {
  GET_HOME_SETTING: 'GET_HOME_SETTING',
  GET_HOME_LIST: 'GET_HOME_LIST',
  DELETE_HOME_ITEM: 'DELETE_HOME_ITEM',
  ADD_HOME_ITEM: 'ADD_HOME_ITEM',
  LOAD_ASSET_DATA: 'LOAD_ASSET_DATA',
};

export default types;

export function loadAssetTableData() {
  const promise = restApi({
    //url: `/service/v1.0/assets/audience/custom/${accountId}?channel=GG,FB`,
    url: `/mock/fBCustomAudience`,
  });

  return function thunkLoadAssetTableData(dispatch) {
    return promise
    //.then((res) => restApiRepo(res))
      .then((res) => {
        console.log('dd');
        dispatch({
          type: types.LOAD_ASSET_DATA,
          payload: res.data,
        });
      })
      .catch((err) => apiError('[Asset] Cannot load asset table data', err));
  };
}
