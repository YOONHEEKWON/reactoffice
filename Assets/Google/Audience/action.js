import { restApi, apiError } from 'core/utils/API';

const types = {
  LOAD_ASSET_DATA: 'LOAD_ASSET_DATA',
};
export default types;

/*
 export function assettabledata(asdata) {
 return {
 type: types.TABLE_DATA_ASSET,
 payload: {
 asdata,
 }
 };
 }
 */

export function loadAssetTablDdata() {
  const promise = restApi({
    //url: `/service/v1.0/assets/audience/custom/${accountId}?channel=GG,FB`,
    url: `/mock/fBCustomAudience`,
  });

  return function thunkLoadAssetTablDdata(dispatch) {
    return promise
    //.then((res) => restApiRepo(res))
      .then((res) => {
        dispatch({
          type: types.LOAD_ASSET_DATA,
          payload: res.data,
        });
      })
      .catch((err) => apiError('[Asset] Cannot load asset table data', err));
  };
}


