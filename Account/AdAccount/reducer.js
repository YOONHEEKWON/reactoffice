import produce from 'immer';
import types from './action';

const initialState = {
  adAccounts: [],
  //adAccounts: [
  //  {
  //    accountId: 363278027083604,
  //    accountName: 'campaign_group_test',
  //    channel: 'FB',
  //    currency: 'KRW',
  //    ownerId: '',
  //    timezone: 'Asia/Seoul',
  //    userId: 'adwitt_dev',
  //  },
  //],
  adAccountGroups: [],
  // adAccountGroups: [
  //   {
  //     "groupName": "개발팀안녕",
  //     "userId": "adwitt_dev",
  //     "accountId": 2120724622791,
  //     "accountName": "test",
  //     "channel": "FB",
  //     "currency": "KRW",
  //     "timezone": "Asia/Seoul"
  //   }
  // ],
  //adAccount: {},
  pages: [],
  //apps: {},
  //productCatalogs: {},
  industries: [],
  facebookAccessToken: null,
  googleAccessToken: null,
};

export default produce((draft, { type, payload }) => {
  switch (type) {
    case types.GET_AD_ACCOUNTS:
    case types.GET_AD_ACCOUNTS_FOR_ROOT:
    case types.RESET_USED_IN_AD_ACCOUNTS:
    case types.USE_AD_ACCOUNTS:
      draft.adAccounts = payload;
      break;
    case types.REFRESH_AD_ACCOUNTS:
      draft.adAccounts = payload;
      break;
    case types.GET_AD_ACCOUNT_GROUPS:
      draft.adAccountGroups = payload;
      break;
    //case types.GET_AD_ACCOUNT:
    //  draft.adAccount = payload;
    //  break;
    case types.GET_PAGES:
      draft.pages = payload;
      break;
    //case types.GET_APPS:
    //  draft.apps = payload;
    //  break;
    //case types.GET_PRODUCT_CATALOGS:
    //  draft.productCatalogs = payload;
    //  break;
    case types.GET_INDUSTRIES:
      draft.industries = payload;
      break;
    case types.SET_FACEBOOK_ACCESS_TOKEN:
      draft.facebookAccessToken = payload;
      break;
    case types.SET_GOOGLE_ACCESS_TOKEN:
      draft.googleAccessToken = payload;
      break;
    default:
      break;
  }
}, initialState);
