import produce from 'immer';
import types from './action';

const initialState = {
  userInfo: {}
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
  // }
};

export default produce((draft, { type, payload }) => {
  switch (type) {
    case types.GET_USER_INFO:
      draft.userInfo = payload || {};
      break;
    case types.UPDATE_USER_INFO:
    case types.UPDATE_USER_NOTI_INFO:
      draft.userInfo = { ...draft.userInfo, ...payload };
      break;
    case types.RESUBMIT:
      // userInfo: payload || {}
      // TODO 재심사 요청을 하면 상태를 pending_review로 변경하기 때문에 status를 변경하면 될듯.
      // userInfo 데이터 확인을 못하여 작업 보류
      break;
    default:
      break;
  }
}, initialState);
