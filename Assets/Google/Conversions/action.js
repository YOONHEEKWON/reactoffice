import { restApi, restApiRepo, apiError } from 'core/utils/API';

const types = {
  SET_ADD_CONVERSION: 'SET_ADD_CONVERSION',
  GET_CONVERSION_LIST: 'GET_CONVERSION_LIST',
  SET_CONVERSION: 'SET_CONVERSION',
  RESET_ALL_CONVERSION: 'RESET_ALL_CONVERSION',
};

export default types;

export function setAddConversionFormData(data) {
  return {
    type: types.SET_ADD_CONVERSION,
    payload: data
  };
}

export function getConversionList(customerId) {
  const promise = restApi({
    url: `/service/v1.0/assets/conversion/${customerId}?channel=GG`,
  });

  return function thunkGetConversionList(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_CONVERSION_LIST,
        payload: res.data ? res.data.data[0].GG : []
      }))
      .catch((err) => apiError('[GoogleConversions] Cannot get conversion list', err));
  };
}

export function setConversion(formData) {
  const promise = restApi({
    method: 'post',
    url: '/service/v1.0/assets/appconversion?channel=GG',
    data: [ formData ],
  });

  return function thunkSetConversion(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.SET_CONVERSION,
        payload: res
      }))
      .catch((err) => apiError('[GoogleConversions] Cannot set conversion', err));
  };
}

export function resetAllConversionFormData() {
  return {
    type: types.RESET_ALL_CONVERSION
  };
}
