import types from './action';

const initialState = {
  dashboardList: [],
  dashboardFilters: [],
  dashboardDetail: {
    campaign_report: [],
    account_report: [],
    dashboard: {},
  },
  dashboardCampaignLink: [],
  accountWidgets: [],
  accountCampaigns: [],
  accountRules: [],


  dataFilter: {
    channel: {
      FB: true,
      GG: true,
    },
    startDate: '',
    endDate: '',
  },
  campaignSummary: {
    list: [],
  },
  campaignDetails: {
    filters: [],
    report: [],
  },
  dashboardEditColumns: [],
};

export default function dashboard(state = initialState, { type, payload }) {
  switch (type) {
    case types.GET_DASHBOARD_LIST:
      return {
        ...state,
        dashboardList: payload || [],
      };
    case types.GET_DASHBOARD_FILTERS:
      return {
        ...state,
        dashboardFilters: payload,
      };
    case types.GET_DASHBOARD_DETAIL:
      return {
        ...state,
        dashboardDetail: payload || {
          campaign_report: [],
          account_report: [],
          dashboard: {},
        },
      };
    case types.GET_DASHBOARD_DETAIL_ACCOUNT_REPORT:
      return {
        ...state,
        dashboardDetail: {
          ...state.dashboardDetail,
          account_report: payload,
        },
      };
    case types.GET_DASHBOARD_DETAIL_CAMPAIGN_REPORT:
      return {
        ...state,
        dashboardDetail: {
          ...state.dashboardDetail,
          campaign_report: payload,
        },
      };
    case types.GET_DASHBOARD_DETAIL_REPORT_CAMPAIGN_LINK:
      return {
        ...state,
        dashboardCampaignLink: payload,
      };
    case types.SET_DASHBOARD_DETAIL:
      return {
        ...state,
        dashboardDetail: {
          ...payload,
        },
      };
    case types.UPDATE_DASHBOARD_DETAIL:
      return {
        ...state,
        dashboardDetail: {
          ...payload,
        },
      };
    case types.DELETE_DASHBOARD_DETAIL:
      return {
        ...state,
        dashboardDetail: {},
      };
    case types.GET_ACCOUNT_WIDGETS:
      return {
        ...state,
        accountWidgets: payload,
      };
    case types.SET_ACCOUNT_WIDGETS:
      return {
        ...state,
        accountWidgets: [
          ...state.accountWidgets,
          ...payload,
        ],
      };
    case types.UPDATE_ACCOUNT_WIDGETS:
      return {
        ...state,
        accountWidgets: state.accountWidgets.map((item) => item.id === payload.id ? payload : item),
      };
    case types.DELETE_ACCOUNT_WIDGETS:
      return {
        ...state,
        accountWidgets: state.accountWidgets.filter((item) => item.id !== payload.id),
      };
    case types.GET_ACCOUNT_CAMPAIGNS:
      return {
        ...state,
        accountCampaigns: payload,
      };
    case types.GET_ACCOUNT_RULES:
      return {
        ...state,
        accountRules: payload,
      };
    case types.SET_ACCOUNT_RULES:
      return {
        ...state,
        accountRules: [
          ...state.accountRules,
          ...payload,
        ],
      };
    case types.UPDATE_ACCOUNT_RULES:
      return {
        ...state,
        accountRules: state.accountRules.map((item) => item.id === payload.id ? payload : item),
      };
    case types.DELETE_ACCOUNT_RULES:
      return {
        ...state,
        accountRules: state.accountRules.filter((item) => item.id !== payload.id),
      };


    case types.SET_DATA_FILTER:
      return {
        ...state,
        dataFilter: payload,
      };
    case types.GET_CAMPAIGN_SUMMARY_LIST:
      return {
        ...state,
        campaignSummary: {
          ...state.campaignSummary,
          list: payload,
        },
      };
    case types.GET_CAMPAIGN_DETAILS_LIST:
      return {
        ...state,
        campaignDetails: {
          ...state.campaignDetails,
          list: payload,
        },
      };
    case types.GET_CAMPAIGN_DETAILS_FILTERS:
      return {
        ...state,
        campaignDetails: {
          ...state.campaignDetails,
          filters: payload,
        },
      };
    case types.GET_CAMPAIGN_DETAILS_REPORT:
      return {
        ...state,
        campaignDetails: {
          ...state.campaignDetails,
          report: payload,
        },
      };
    case types.GET_DASHBOARD_EDIT_COLUMNS:
      return {
        ...state,
        dashboardEditColumns: {
          ...state,
          dashboardEditColumnsList: payload,
        },
      };
    default:
      return state;
  }
}
