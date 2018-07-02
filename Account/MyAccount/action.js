import { restApi, restApiRepo, apiError } from 'core/utils/API';

const types = {
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  GET_USER_INFO: 'myAccount/GET_USER_INFO',
  UPDATE_USER_INFO: 'myAccount/UPDATE_USER_INFO',
  UPDATE_USER_NOTI_INFO: 'myAccount/UPDATE_USER_NOTI_INFO',
  RESUBMIT: 'myAccount/RESUBMIT',
};

export default types;

// TODO response 확인 불가.
// FRONTEND-1014
// FRONTEND-1024
export function changePassword(data) {
  const promise = restApi({
    method: 'put',
    url: '/service/v1.0/users/password',
    data: data,
  });

  return function thunkChangePassword() {
    return promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[MyAccount] Cannot change password', err));
  }
}

// FRONTEND-1011
// FRONTEND-1021
export function getUserInfo(userId = 'me') {
  const promise = restApi({
    url: `/service/v1.0/users/${userId}`,
  });

  return function thunkGetUserInfo(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_USER_INFO,
        payload: res.data.data[0],
      }))
      .catch((err) => apiError('[My Account] Cannot get user info', err));
  };
}

// FRONTEND-1015
export function updateUserInfo(payload) {
  const promise = restApi({
    method: 'put',
    url: '/service/v1.0/users',
    data: [payload],
  });

  return function thunkUpdateUserInfo(dispatch) {
    return promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.UPDATE_USER_INFO,
        payload: payload,
      }))
      .catch((err) => apiError('[My Account] Cannot update user info', err));
  };
}

// TODO response 확인 불가.
// FRONTEND-1016
export function updateEmailNotiForUser(payload) {
  const promise = restApi({
    method: 'put',
    url: '/service/v1.0/users/email/notification',
    data: [payload],
  });

  return function thunkUpdateUserInfo(dispatch) {
    return promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.UPDATE_USER_NOTI_INFO,
        payload
      }))
      .catch((err) => apiError('[My Account] Cannot update email noti for user', err));
  };
}

// FRONTEND-1012
export function resubmit(userId, payload) {
  const promise = restApi({
    method: 'post',
    url: `/service/v1.0/users/${userId}/status`,
    data: [payload],
  });

  return function thunkUpdateUserInfo(dispatch) {
    return promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.RESUBMIT,
        payload: payload,
      }))
      .catch((err) => apiError('[My Account] Cannot resubmit', err));
  };
}

// FRONTEND-1362
export function getDisapprovedReason(userId) {
  const promise = restApi({
    url: `/service/v1.0/users/${userId}/history`,
  });

  return function thunkGetDisapprovedReason() {
    return promise
      .then((res) => restApiRepo(res))
      .then((res) => res.data.data)
      .catch((err) => apiError('[My Account] Cannot getDisapprovedReason', err));
  };
}
