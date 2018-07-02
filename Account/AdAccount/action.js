import { restApi, restApiRepo, apiError } from 'core/utils/API';
import { signinFacebook } from 'core/utils/FacebookAPI';
import { signinGoogle } from 'core/utils/GoogleAPI';

const types = {
  GET_AD_ACCOUNTS: 'adAccount/GET_AD_ACCOUNTS',
  GET_AD_ACCOUNTS_FOR_ROOT: 'adAccount/GET_AD_ACCOUNTS_FOR_ROOT',
  REFRESH_AD_ACCOUNTS: 'adAccount/REFRESH_AD_ACCOUNTS',
  GET_AD_ACCOUNT_GROUPS: 'adAccount/GET_AD_ACCOUNT_GROUPS',
  //GET_AD_ACCOUNT: 'adAccount/GET_AD_ACCOUNT',
  GET_PAGES: 'adAccount/GET_PAGES',
  //GET_APPS: 'adAccount/GET_APPS',
  //GET_PRODUCT_CATALOGS: 'adAccount/GET_PRODUCT_CATALOGS',
  GET_INDUSTRIES: 'adAccount/GET_INDUSTRIES',
  SET_FACEBOOK_ACCESS_TOKEN: 'SET_FACEBOOK_ACCESS_TOKEN',
  SET_GOOGLE_ACCESS_TOKEN: 'SET_GOOGLE_ACCESS_TOKEN',
  RESET_USED_IN_AD_ACCOUNTS: 'adAccount/RESET_USED_IN_AD_ACCOUNTS',
  USE_AD_ACCOUNTS: 'adAccount/USE_AD_ACCOUNTS',
};

export default types;


// FRONTEND-1026
// FRONTEND-1028
// FRONTEND-1029
// FRONTEND-1060
// FRONTEND-1061
export function getAdAccounts() {
  const promise = restApi({
    url: '/service/v1.0/accounts',
    params: {
      channel: 'FB,GG',
      //channel: 'FB'
    },
  });

  return function thunkGetAdAccounts(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_AD_ACCOUNTS,
        payload: res.data.data.map((acc) => {
          const bool = typeof acc.used === 'boolean' ? acc.used : Math.random() * 10 > 5; // TODO 제거하기
          return {
            ...acc,
            used: bool, // TODO 제거하기
            originUsed: bool,
          };
        }),
      }))
      .catch((err) => apiError('[Account] Cannot get AdAccounts', err));
  };
}

// FRONTEND-1010
export function getAdAccountsForRoot() {
  const promise = restApi({
    url: '/service/v1.0/accounts/adwittmaster',
    params: {
      channel: 'FB,GG',
      //channel: 'FB'
    },
  });

  return function thunkGetAdAccountsForRoot(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_AD_ACCOUNTS_FOR_ROOT,
        payload: res.data.data.map((acc) => {
          const bool = typeof acc.used === 'boolean' ? acc.used : Math.random() * 10 > 5; // TODO 제거하기
          return {
            ...acc,
            used: bool, // TODO 제거하기
            originUsed: bool,
          };
        }),
      }))
      .catch((err) => apiError('[Account] Cannot get AdAccountsForRoot', err));
  };
}

// FRONTEND-1027
export function refreshAdAccounts() {
  const promise = restApi({
    url: '/service/v1.0/commons/pages/refresh',
    params: {
      channel: 'FB',
    },
  });

  return function thunkRefreshAdAccounts(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.REFRESH_AD_ACCOUNTS,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[Account] Cannot refresh ad accounts', err));
  };
}

// FRONTEND-1028
// FRONTEND-1029
// FRONTEND-1060
export function getAdAccountGroups() {
  const promise = restApi({
    url: '/service/v1.0/accounts/groups',
    params: {
      channel: 'FB,GG',
    },
  });

  return function thunkGetAdAccountGroups(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_AD_ACCOUNT_GROUPS,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[Account] Cannot get AdAccount groups', err));
  };
}

/**
 * getFacebookAccessToken
 * 페이스북 계정 로그인하여 access token을 받아와 store에 저장한다.
 * FRONTEND-992
 *
 * @param callback 완료 후 실행 될 콜백
 * @returns {{function}}
 */
export function getFacebookAccessToken(callback = function() {
}) {
  return function thunkGetFacebookAccessToken(dispatch) {
    signinFacebook((accessToken) => {
      callback(accessToken);
      dispatch({
        type: types.SET_FACEBOOK_ACCESS_TOKEN,
        payload: accessToken,
      });
    });
  };
}

/**
 * getGoogleAccessToken
 * 구글 계정 로그인하여 access token을 받아와 store에 저장한다.
 * FRONTEND-992
 *
 * @param callback 완료 후 실행 될 콜백
 * @returns {{function}}
 */
export function getGoogleAccessToken(callback = function() {
}) {
  return function thunkGetGoogleAccessToken(dispatch) {
    signinGoogle((accessToken) => {
      callback(accessToken);
      dispatch({
        type: types.SET_GOOGLE_ACCESS_TOKEN,
        payload: accessToken,
      });
    });
  };
}

/**
 * removeAccessToken
 * 페이스북 / 구글 등 계정의 access token을 제거한다.
 *
 * @param type 'facebook' or 'google'
 * @param callback 완료 후 실행 될 콜백
 * @return {{type: string, payload: null}}
 */
export function removeAccessToken(type = 'facebook', callback = function() {
}) {
  callback();
  return {
    type: type === 'facebook' ? types.SET_FACEBOOK_ACCESS_TOKEN : types.SET_GOOGLE_ACCESS_TOKEN,
    payload: null,
  };
}

// TODO response 확인 불가.
// FRONTEND-1058
export function unlink(media) {
  // const promise = restApi({
  //   method: 'post',
  //   url: '/service/v1.0/', // TODO unlink 구현하기.
  //   data: media
  // });
  //
  // return function thunkUnlink (dispatch) {
  //   promise
  //     .then((res) => restApiRepo(res))
  //     .then((res) => dispatch({
  //       type: types.GET_AD_ACCOUNT_GROUPS,
  //       payload: res.data.data,
  //     }))
  //     .catch((err) => apiError('[Account] Cannot get AdAccount groups', err));
  // };
}

// FRONTEND-1071
export function addAdAccountGroups(data) {
  const promise = restApi({
    method: 'post',
    url: '/service/v1.0/accounts/groups?channel=FB,GG',
    data,
  });

  return function thunkAddAdAccountGroups(/*dispatch*/) {
    return promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[Account] Cannot add AdAccount groups', err));
  };
}

// FRONTEND-1071
export function updateAdAccountGroups(data) {
  const promise = restApi({
    method: 'put',
    url: '/service/v1.0/accounts/groups?channel=FB,GG',
    data,
  });

  return function thunkUpdateAdAccountGroups(/*dispatch*/) {
    return promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[Account] Cannot update AdAccount groups', err));
  };
}

// FRONTEND-1071
export function deleteAdAccountGroups(data) {
  const promise = restApi({
    method: 'delete',
    url: '/service/v1.0/accounts/groups?channel=FB,GG',
    data: {
      data,
    },
  });

  return function thunkUpdateAdAccountGroups(/*dispatch*/) {
    return promise
      .then((res) => restApiRepo(res))
      .catch((err) => apiError('[Account] Cannot delete AdAccount groups', err));
  };
}

// FRONTEND-1072
export function getAdAccount(accountId) {
  const promise = restApi({
    url: `/service/v1.0/accounts/${accountId}`,
    params: {
      channel: 'FB',
    },
  });

  return function thunkGetAdAccount(/*dispatch*/) {
    return promise
      .then((res) => restApiRepo(res))
      //.then((res) => dispatch({
      //  type: types.GET_AD_ACCOUNT,
      //  payload: res.data.data,
      //}))
      .catch((err) => apiError('[Account] Cannot get AdAccount', err));
  };
}

// TODO response 확인 불가.
// FRONTEND-1072
export function getPages(/*accountId*/) {
  const promise = restApi({
    //url: `/service/v1.0/accounts/${accountId}/pages`,
    url: `/service/v1.0/commons/pages`,
    params: {
      channel: 'FB',
    },
  });

  return function thunkGetPages(dispatch) {
    return promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_PAGES,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[Account] Cannot get pages', err));
  };
}

// TODO response 확인 불가.
// FRONTEND-1072
export function getApps(accountId) {
  const promise = restApi({
    //url: `/service/v1.0/accounts/${accountId}/apps`,
    url: `/service/v1.0/commons/apps/${accountId}`,
    params: {
      channel: 'FB',
    },
  });

  return function thunkGetApps(/*dispatch*/) {
    return promise
      .then((res) => restApiRepo(res))
      //.then((res) => dispatch({
      //  type: types.GET_APPS,
      //  payload: res.data.data,
      //}))
      .catch((err) => apiError('[Account] Cannot get apps', err));
  };
}

// TODO response 확인 불가.
// FRONTEND-1072
export function getProductCatalogs(accountId) {
  const promise = restApi({
    //url: `/service/v1.0/accounts/${accountId}/productCatalogs`,
    url: `/service/v1.0/commons/catalogs/${accountId}`,
    params: {
      channel: 'FB',
    },
  });

  return function thunkGetApps(/*dispatch*/) {
    return promise
      .then((res) => restApiRepo(res))
      //.then((res) => dispatch({
      //  type: types.GET_PRODUCT_CATALOGS,
      //  payload: res.data.data,
      //}))
      .catch((err) => apiError('[Account] Cannot get product catalog', err));
  };
}

// FRONTEND-1072
export function getIndustries(/*accountId*/) {
  const promise = restApi({
    //url: `/service/v1.0/accounts/${accountId}/productCatalogs`,
    url: `/service/v1.0/accounts/industry`,
    params: {
      channel: 'FB',
    },
  });

  return function thunkGetIndustries(dispatch) {
    return promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_INDUSTRIES,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[Account] Cannot get industries', err));
  };
}

export function resetUsedInAdAccounts() {
  return function thunkResetUsedInAdAccounts(dispatch, getState) {
    dispatch({
      type: types.RESET_USED_IN_AD_ACCOUNTS,
      payload: getState()
        .adAccount
        .adAccounts
        .map((acc) => {
          return {
            ...acc,
            used: acc.originUsed,
          };
        }),
    });
  };
}

export function useAdAccountsInStore(selectAccounts, deselectAccountIds) {
  return function thunkuseAdAccountsInStore(dispatch, getState) {
    const adAccounts = getState().adAccount.adAccounts;
    dispatch({
      type: types.USE_AD_ACCOUNTS,
      payload: adAccounts.map((acc) => {
        if (selectAccounts.some((accountId) => accountId === acc.accountId)) {
          return {
            ...acc,
            used: true,
          };
        } else if (deselectAccountIds.some((accountId) => accountId === acc.accountId)) {
          return {
            ...acc,
            used: false,
          };
        }
        return acc;
      }),
    });
  };
}

export function useAdAccounts(data) {
  return function thunkUseAdAccounts(dispatch, getState) {
  };
}

export function disuseAdAccounts(data) {
  return function thunkDisuseAdAccounts(dispatch, getState) {
  };
}

