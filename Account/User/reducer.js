import produce from 'immer';
import types from './action';

const initialState = {
  userList: [],
  // userList: [
  //   {
  //     "userId": "adwitt_qkr",
  //     "accountId": 1859422987,
  //     "accountName": "wisebirds.S",
  //     "channel": "GG",
  //     "currency": "KRW",
  //     "timezone": "Asia/Seoul"
  //   }
  // ]
  userInfo: {},
  userInfoForNoId: {},
  // userInfo: {
  //   "id": "adwitt_qkr",
  //   "email": "kykkyn2@adwitt.com",
  //   "mobilePhoneNumber": "010-9232-1728",
  //   "userRole": "MASTER",
  //   "userAccessAuth": "CREATE",
  //   "approvalStatus": "APPROVAL",
  //   "createDate": "2017-09-19 04:45",
  //   "updateDate": "2017-10-17 08:37",
  //   "name": "애드윗_박정현2",
  //   "companyId": 1
  // },
  fbBusinessManagerList: [],
  userHistory: [],
  // userHistory: [
  //   {
  //     "userId": "adwitt_dev",
  //     "name": "dev",
  //     "status": "APPROVAL",
  //     "comment": "",
  //     "dateTime": "2017-09-11 21:07"
  //   }
  // ]
  isLoadedUserList: false,
};

export default produce((draft, { type, payload }) => {
  switch (type) {
    case types.GET_USER_LIST:
    case types.GET_USER_LIST_FOR_ADWITT_MASTER:
      draft.userList = payload || [];
      draft.isLoadedUserList = true;
      break;
    case types.GET_USER_INFO:
      draft.userInfo = payload;
      break;
    case types.GET_USER_INFO_FOR_NO_ID:
    case types.UPDATE_USER_INFO_FOR_NO_ID:
      draft.userInfoForNoId = payload;
      break;
    case types.CLEAR_USER_INFO:
      draft.userInfo = initialState.userInfo;
      break;
    case types.UPDATE_USER_INFO:
      draft.userInfo = payload;
      break;
    case types.GET_FB_BUSINESS_MANAGER_LIST:
      draft.fbBusinessManagerList = payload || [];
      break;
    case types.GET_USER_HISTORY:
      draft.userHistory = payload || [];
      break;
    case types.CLEAR_USER_HISTORY:
      draft.userHistory = initialState.userHistory;
      break;
    default:
      break;
  }
}, initialState);
