import types from './action';

const initialState = {
  addConversion: {},
  conversionList: [],
  isInit: true,
};

export default function googleConversions(state = initialState, { type, payload }) {
  switch (type) {
    case types.SET_ADD_CONVERSION:
      return {
        ...state,
        addConversion: {
          ...state.addConversion,
          ...payload
        },
        isInit: false
      };
    case types.GET_CONVERSION_LIST:
      return {
        ...state,
        conversionList: payload
      };
    case types.SET_CONVERSION:
      return initialState;
    case types.RESET_ALL_CONVERSION:
      return {
        ...state,
        addConversion: initialState.addConversion,
        isInit: initialState.isInit
      };
    default:
      return state;
  }
}
