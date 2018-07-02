import { restApi, restApiRepo, apiError } from 'core/utils/API';
import { mapToUrl } from 'core/utils/Text';

const types = {
  GET_DASHBOARD_LIST: 'GET_DASHBOARD_LIST',
  GET_DASHBOARD_FILTERS: 'GET_DASHBOARD_FILTERS',
  GET_DASHBOARD_DETAIL: 'GET_DASHBOARD_DETAIL',
  GET_DASHBOARD_DETAIL_ACCOUNT_REPORT: 'GET_DASHBOARD_DETAIL_ACCOUNT_REPORT',
  GET_DASHBOARD_DETAIL_CAMPAIGN_REPORT: 'GET_DASHBOARD_DETAIL_CAMPAIGN_REPORT',
  GET_DASHBOARD_DETAIL_REPORT_CAMPAIGN_LINK: 'GET_DASHBOARD_DETAIL_REPORT_CAMPAIGN_LINK', // 대시보드 목록 캠페인 링크 목록
  SET_DASHBOARD_DETAIL: 'SET_DASHBOARD_DETAIL',
  UPDATE_DASHBOARD_DETAIL: 'UPDATE_DASHBOARD_DETAIL',
  DELETE_DASHBOARD_DETAIL: 'DELETE_DASHBOARD_DETAIL',
  GET_ACCOUNT_WIDGETS: 'GET_ACCOUNT_WIDGETS',
  SET_ACCOUNT_WIDGETS: 'SET_ACCOUNT_WIDGETS',
  UPDATE_ACCOUNT_WIDGETS: 'UPDATE_ACCOUNT_WIDGETS',
  DELETE_ACCOUNT_WIDGETS: 'DELETE_ACCOUNT_WIDGETS',
  GET_ACCOUNT_CAMPAIGNS: 'GET_ACCOUNT_CAMPAIGNS',
  GET_ACCOUNT_RULES: 'GET_ACCOUNT_RULES',
  SET_ACCOUNT_RULES: 'SET_ACCOUNT_RULES',
  UPDATE_ACCOUNT_RULES: 'UPDATE_ACCOUNT_RULES',
  DELETE_ACCOUNT_RULES: 'DELETE_ACCOUNT_RULES',

  SET_DATA_FILTER: 'SET_DATA_FILTER',
  GET_CAMPAIGN_SUMMARY_LIST: 'GET_CAMPAIGN_SUMMARY_LIST',
  GET_CAMPAIGN_DETAILS_LIST: 'GET_CAMPAIGN_DETAILS_LIST',
  GET_CAMPAIGN_DETAILS_FILTERS: 'GET_CAMPAIGN_DETAILS_FILTERS',
  GET_CAMPAIGN_DETAILS_REPORT: 'GET_CAMPAIGN_DETAILS_REPORT',

  GET_DASHBOARD_EDIT_COLUMNS: 'GET_DASHBOARD_EDIT_COLUMNS',
};

export default types;

export function getDashboardList(data) {
  const promise = restApi({
    url: `/service/v1.0/dashboard/list?channel=GG&${mapToUrl(data)}`,
  });

  return function thunkGetDashboardList(dispatch) {
    // No loading bars
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_DASHBOARD_LIST,
        payload: res.data,
      }))
      .catch((err) => apiError('[Dashboard] Cannot get dashboard list', err));
  };
}

export function getDashboardFilters() {
  const promise = restApi({
    url: '/service/v1.0/dashboard/filter/list?channel=GG',
  });

  return function thunkGetDashboardFilters(dispatch) {
    // No loading bars
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_DASHBOARD_FILTERS,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[Dashboard] Cannot get dashboard filters', err));
  };
}

export function getDashboardDetail(data) {
  const promise = restApi({
    url: `/service/v1.0/dashboard?channel=GG&${mapToUrl(data)}`,
  });

  return function thunkGetDashboardDetail(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => {
        const payloads = res.data.data[ 0 ].GG[ 0 ];
        dispatch({
          type: types.GET_DASHBOARD_DETAIL,
          payload: {
            campaign_report: payloads.campaign_report.length ? payloads.campaign_report[ 0 ].row : [],
            account_report: payloads.account_report.length ? payloads.account_report[ 0 ].row : [],
            dashboard: payloads.dashboard,
          },
        });
      })
      .catch((err) => apiError('[Dashboard] Cannot get dashboard detail', err));
  };
}

export function getDashboardDetailAccountReport(formData) {
  const promise = restApi({
    url: `/service/v1.0/dashboard/report/account?channel=GG&${mapToUrl(formData)}`,
  });

  return function thunkGetDashboardDetailAccountReport(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => {
        const payloads = res.data.data[ 0 ].GG[ 0 ];
        dispatch({
          type: types.GET_DASHBOARD_DETAIL_ACCOUNT_REPORT,
          payload: payloads.account_report.length ? payloads.account_report[ 0 ].row : [],
        });
      })
      .catch((err) => apiError('[Dashboard] Cannot get dashboard detail account report', err));
  };
}

export function getDashboardDetailCampaignReport(formData) {
  const promise = restApi({
    method: 'post',
    url: '/service/v1.0/dashboard/report/campaign?channel=GG',
    data: [ formData ],
  });

  return function thunkGetDashboardDetailCampaignReport(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => {
        const payloads = res.data.data[ 0 ].GG[ 0 ];
        dispatch({
          type: types.GET_DASHBOARD_DETAIL_CAMPAIGN_REPORT,
          payload: payloads.campaign_report.length ? payloads.campaign_report[ 0 ].row : [],
        });
      })
      .catch((err) => apiError('[Dashboard] Cannot get dashboard detail campaign report', err));
  };
}

export function getDashboardDetailReportCampaignLink(customerId, formData) {
  const promise = restApi({
    url: `/service/v1.0/campaigns/list/${customerId}?channel=GG&${mapToUrl(formData)}`,
  });

  return function thunkGetDashboardDetailReportCampaignLink(dispatch) {
    return promise
      .then((res) => restApiRepo(res))
      .then((res) => {
        if (res.hasValidError) {
          throw new Error(res.validMessage);
        } else {
          dispatch({
            type: types.GET_DASHBOARD_DETAIL_REPORT_CAMPAIGN_LINK,
            payload: res.data.data[ 0 ].GG[ 0 ].campaignIds,
          });
        }
      })
      .catch((err) => apiError('[Dashboard] Cannot get dashboard detail report campaign link', err));
  };
}

export function setDashboardDetail(data) {
  const promise = restApi({
    method: 'post',
    url: '/service/v1.0/dashboard',
    data,
  });

  return function thunkSetDashboardDetail(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.SET_DASHBOARD_DETAIL,
        payload: data,
      }))
      .catch((err) => apiError('[Dashboard] Cannot set dashboard detail', err));
  };
}

export function updateDashboardDetail(data) {
  const promise = restApi({
    method: 'put',
    url: '/service/v1.0/dashboard',
    data,
  });

  return function thunkUpdateDashboardDetail(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.UPDATE_DASHBOARD_DETAIL,
        payload: data,
      }))
      .catch((err) => apiError('[Dashboard] Cannot update dashboard detail', err));
  };
}

export function deleteDashboardDetail(data) {
  const promise = restApi({
    method: 'delete',
    url: '/service/v1.0/dashboard',
    data,
  });

  return function thunkDeleteDashboardDetail(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.DELETE_DASHBOARD_DETAIL,
        payload: data,
      }))
      .catch((err) => apiError('[Dashboard] Cannot delete dashboard detail', err));
  };
}

export function getAccountWidget(data, adwittAccountId = 'me', id) {
  const promise = restApi({
    url: `/service/v1.0/${adwittAccountId}/widgets/${id}`,
    data,
  });

  return function thunkGetAccountWidget(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_ACCOUNT_WIDGETS,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot get account widget', err));
  };
}

export function setAccountWidget(data, adwittAccountId = 'me') {
  const promise = restApi({
    method: 'post',
    url: `/service/v1.0/${adwittAccountId}/widgets`,
    data,
  });

  return function thunkSetAccountWidget(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.SET_ACCOUNT_WIDGETS,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot set account widget', err));
  };
}

export function updateAccountWidget(data, adwittAccountId = 'me') {
  const promise = restApi({
    method: 'put',
    url: `/service/v1.0/${adwittAccountId}/widgets`,
    data,
  });

  return function thunkUpdateAccountWidget(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.UPDATE_ACCOUNT_WIDGETS,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot update account widget', err));
  };
}

export function deleteAccountWidget(id, adwittAccountId = 'me') {
  const promise = restApi({
    method: 'delete',
    url: `/service/v1.0/${adwittAccountId}/widgets`,
    data: { id },
  });

  return function thunkDeleteAccountWidget(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.DELETE_ACCOUNT_WIDGETS,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot delete account widget', err));
  };
}

export function getAccountCampaigns(data, adwittAccountId = 'me', id) {
  const campaignId = id ? `/${id}` : '';
  const promise = restApi({
    url: `/service/v1.0/${adwittAccountId}/campaigns${campaignId}`,
    data,
  });

  return function thunkGetCampaigns(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_ACCOUNT_CAMPAIGNS,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot get account campaigns', err));
  };
}

export function getAccountRules(data, adwittAccountId = 'me', id) {
  const rulesId = id ? `/${id}` : '';
  const promise = restApi({
    url: `/service/v1.0/${adwittAccountId}/rules${rulesId}`,
    data,
  });

  return function thunkGetAccountRules(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_ACCOUNT_RULES,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot get account rules', err));
  };
}

export function setAccountRules(data, adwittAccountId = 'me') {
  const promise = restApi({
    method: 'post',
    url: `/service/v1.0/${adwittAccountId}/rules`,
    data,
  });

  return function thunkSetAccountRules(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.SET_ACCOUNT_RULES,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot set account rules', err));
  };
}

export function updateAccountRules(data, adwittAccountId = 'me') {
  const promise = restApi({
    method: 'put',
    url: `/service/v1.0/${adwittAccountId}/rules`,
    data,
  });

  return function thunkUpdateAccountRules(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.UPDATE_ACCOUNT_RULES,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot update account rules', err));
  };
}

export function deleteAccountRules(id, adwittAccountId = 'me') {
  const promise = restApi({
    method: 'delete',
    url: `/service/v1.0/${adwittAccountId}/rules`,
    data: { id },
  });

  return function thunkDeleteAccountRules(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.DELETE_ACCOUNT_RULES,
        payload: res,
      }))
      .catch((err) => apiError('[Dashboard] Cannot delete account rules', err));
  };
}


// 추가

export function setDataFilter(data) {
  return {
    type: types.SET_DATA_FILTER,
    payload: data,
  };
}

export function getCampaignSummaryList(data) {
  const promise = restApi({
    url: `/service/v1.0/dashboard/list?${mapToUrl(data)}`,
  });

  return function thunkGetCampaignSummary(dispatch) {
    // No loading bars
    promise
      .then((res) => restApiRepo(res))
      .then((res) => {
        dispatch({
          type: types.GET_CAMPAIGN_SUMMARY_LIST,
          payload: res.data.data,
        });
      })
      .catch((err) => apiError('[Dashboard] Cannot get dashboard campaign summary', err));
  };
}

export function getCampaignDetailsList(data) {
  const promise = restApi({
    url: `/service/v1.0/dashboard/list?${mapToUrl(data)}`,
  });

  return function thunkGetCampaignDetails(dispatch) {
    // No loading bars
    promise
      .then((res) => restApiRepo(res))
      .then((res) => {
        dispatch({
          type: types.GET_CAMPAIGN_DETAILS_LIST,
          payload: res.data,
        });
      })
      .catch((err) => apiError('[Dashboard] Cannot get dashboard campaign details', err));
  };
}

export function getCampaignDetailsFilters(data) {
  const promise = restApi({
    url: `/service/v1.0/dashboard/filter/list?${mapToUrl(data)}`,
  });

  return function thunkGetDashboardDetailsFilters(dispatch) {
    // No loading bars
    promise
      .then((res) => restApiRepo(res))
      .then((res) => dispatch({
        type: types.GET_CAMPAIGN_DETAILS_FILTERS,
        payload: res.data.data,
      }))
      .catch((err) => apiError('[Dashboard] Cannot get dashboard campaign details filters', err));
  };
}

export function getCampaignDetailsReport(data, formData) {
  const promise = restApi({
    method: 'post',
    url: `/service/v1.0/dashboard/report/campaign?${mapToUrl(data)}`,
    //url: `/mock/campaign_report`,
    data: [ formData ],
  });

  return function thunkGetDashboardDetailCampaignReport(dispatch) {
    promise
      .then((res) => restApiRepo(res))
      .then((res) => {

        //const payloads = res.data.data[0].GG[0];
        dispatch({
          type: types.GET_CAMPAIGN_DETAILS_REPORT,
          payload: res.data.campaign_report[ 0 ].length ? res.data.campaign_report[ 0 ].row : [],
        });
        /*dispatch({
          type: types.GET_CAMPAIGN_DETAILS_REPORT,
          payload: res.data.length ? res.data[ 0 ].row : [],
        });*/
      })
      .catch((err) => apiError('[Dashboard] Cannot get dashboard campaign details report', err));
  };
}

export function getEditColumns(data, attrClickDate, attrViewDate) {
  console.log('data?????', data, attrClickDate, attrViewDate);
  return {
    type: types.GET_DASHBOARD_EDIT_COLUMNS,
    payload: data, attrClickDate, attrViewDate,
  };
}
