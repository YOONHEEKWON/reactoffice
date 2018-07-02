import { restApi, restApiRepo, apiError } from 'core/utils/API';
import { groupByAddChild } from 'core/utils/GroupBy';

const types = {
  CLEAR_USER_HISTORY: 'user/CLEAR_USER_HISTORY',
  CLEAR_USER_INFO: 'user/CLEAR_USER_INFO',
  GET_USER_LIST: 'user/GET_USER_LIST',
  // SEND_INVITATION_MAIL: 'user/SEND_INVITATION_MAIL',
  UPDATE_USER_INFO: 'user/view/UPDATE_USER_INFO',
  UPDATE_USER_INFO_FOR_NO_ID: 'user/UPDATE_USER_INFO_FOR_NO_ID',
  UPDATE_USER_STATUS: 'user/view/UPDATE_USER_STATUS',
  GET_USER_LIST_FOR_ADWITT_MASTER: 'user/GET_USER_LIST_FOR_ADWITT_MASTER',
  GET_FB_BUSINESS_MANAGER_LIST: 'user/GET_FB_BUSINESS_MANAGER_LIST',
  GET_USER_INFO: 'user/GET_USER_INFO',
  GET_USER_INFO_FOR_NO_ID: 'user/GET_USER_INFO_FOR_NO_ID',
  GET_USER_HISTORY: 'user/GET_USER_HISTORY',
  CHECK_PARTNER_COMPANY: 'user/CHECK_PARTNER_COMPANY',
  ADD_PARTNER: 'user/ADD_PARTNER',
  UPDATE_PARTNER_INFO: 'user/UPDATE_PARTNER_INFO',
};

export default types;

export function addUser(data) {
  const promise = restApi({
    method: 'post',
    url: '/service/v1.0/users/partner/user?channel=GG,FB',
    data: [ data ],
  });

  return function thunkAddUser() {
    return promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[User] Cannot add user', err));
  };
}

export function getUserList() {
  const promise = restApi({
    url: '/service/v1.0/users/partner/company?accountTimeZone=Asia/Seoul&channel=FB,GG',
  });

  return function thunkGetUserList(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_USER_LIST,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[User] Cannot get user list', err));
  };
}

export function sendInvitationMail(maildata) {
  const promise = restApi({
    method: 'post',
    url: '/common/v1.0/commons/mail/template?channel=GG,FB',
    data: maildata,
  });

  return function thunkSendInvitationMail(/*dispatch*/) {
    return promise
      .then((res) => restApiRepo(res));
    //.catch((err) => apiError('[User] Cannot send invitation mail', err));
  };
}

export function getUserInfo(id) {
  const promise = restApi({
    url: `/service/v1.0/users/${id}`,
  });

  return function thunkGetUserInfo(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_USER_INFO,
        payload: res.data.data[ 0 ],
      }))
      .catch((err) => apiError('[User] Cannot get User info', err));
  };
}

// 상태가 Invitation_sent인 user(id가 없음)
export function getUserInfoForNoId(seq) {
  const promise = restApi({
    url: `/service/v1.0/users/invitation/${seq}?channel=GG`,
  });

  return function thunkGetUserInfoForNoId(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_USER_INFO_FOR_NO_ID,
        payload: res.data.data[ 0 ],
      }))
      .catch((err) => apiError('[User] Cannot get User info for Invitation_sent', err));
  };
}

export function updateUserInfo(id, data) {
  const promise = restApi({
    method: 'put',
    url: `/service/v1.0/users/${id}/info`,
    data,
  });

  return function thunkUpdateUserInfo(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.UPDATE_USER_INFO,
        payload: data,
      }))
      .catch((err) => apiError('[User] Cannot update user info', err));
  };
}

// 상태가 Invitation_sent인 user(id가 없음)
export function updateUserInfoForNoId(seq, data) {
  const promise = restApi({
    method: 'put',
    url: `/service/v1.0/users/invitation/${seq}?channel=FB,GG`,
    data,
  });

  return function thunkUpdateUserInfoForNoId(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.UPDATE_USER_INFO_FOR_NO_ID,
        payload: data,
      }))
      .catch((err) => apiError('[User] Cannot update user info for Invitation_sent', err));
  };
}

/**
 * clearUserInfo
 * 모달 창을 닫을 때 저장된 store > userInfo 항목을 초기화 한다.
 *
 * @returns {{type: *}}
 */
export function clearUserInfo() {
  return {
    type: types.CLEAR_USER_INFO,
  };
}

export function updateUserStatus(id, data) {
  const promise = restApi({
    method: 'post',
    url: `/service/v1.0/users/${id}/status`,
    data,
  });

  return function thunkUpdateUserStatus() {
    return promise
      .then((res) => restApiRepo(res));
    //.catch((err) => apiError('[User] Cannot update "User status"', err));
  };
}

export function getUserListForAdwittMaster() {
  const promise = restApi({
    url: `/service/v1.0/users/partner/company?accountTimeZone=Asia/Seoul&channel=FB,GG`,
  });

  return function thunkGetUserListForAdwittMaster(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_USER_LIST_FOR_ADWITT_MASTER,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[User] Cannot get User list for adwitt master', err));
  };
}

export function getFBBusinessManagerList() {
  const promise = restApi({
    url: '/service/v1.0/accounts/business?channel=FB',
  });

  return function thunkGetFBBusinessManagerList(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => {
        let payload = [];
        if (res.data.data.length) {
          const list = res.data.data[ 0 ].FB;
          list.forEach((listItem) => {
            const item = {
              businessId: listItem.businessId,
              businessName: listItem.businessName,
            };
            listItem.users.forEach((userItem) => {
              payload.push({
                ...item,
                ...userItem,
                filtered: false,
              });
            });
          });
          payload = groupByAddChild(payload, 'businessName', 'id');
        }

        dispatch({
          type: types.GET_FB_BUSINESS_MANAGER_LIST,
          payload,
        });
      })
      .catch((err) => apiError('[User] Cannot get FaceBook Business Manager List', err));
  };
}

export function getUserHistory(id) {
  const promise = restApi({
    url: `/service/v1.0/users/${id}/history`,
  });

  return function thunkGetUserHistory(dispatch) {
    // No loading bars
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_USER_HISTORY,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[User] Cannot get User history', err));
  };
}

/**
 * clearUserHistory
 * 모달 창을 닫을 때 저장된 store > userHistory 항목을 초기화 한다.
 *
 * @returns {{type: *}}
 */
export function clearUserHistory() {
  return {
    type: types.CLEAR_USER_HISTORY,
  };
}

// 회사이름 중복 확인
export function checkPartnerCompany(data) {
  const promise = restApi({
    method: 'post',
    url: `/service/v1.0/users/partner/company/check?channel=FB,GG`,
    data: data,
  });

  return function thunkCheckPartnerCompany() {
    return promise
      .then((res) => restApiRepo(res));
    //.catch((err) => apiError('[User] Cannot check "Company name"', err));
  };
}

// adwitt master가 파트너사 추가하기
export function addPartner(data) {
  const promise = restApi({
    method: 'post',
    url: `/service/v1.0/users/partner/company?channel=FB,GG`,
    data: [ data ],
  });

  return function thunkAddPartner() {
    return promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[User] Cannot add your partner', err));
  };
}

// 파트너 정보 보내기
export function updatePartnerInfo(data) {
  const promise = restApi({
    method: 'put',
    url: `/service/v1.0/users/partner/company?channel=FB,GG`,
    data,
  });

  return function thunkUpdatePartnerInfo() {
    return promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[User] Cannot send "Partner Info"', err));
  };
}

// 권한 수정
export function updateUserRole(id, data) {
  const promise = restApi({
    method: 'put',
    url: `/service/v1.0/users/${id}/role`,
    data,
  });

  return function thunkUpdatePartnerInfo() {
    promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[User] Cannot edit "User Role"', err));
  };
}
