import { AnyAction } from 'redux';

export default (state = {}, action: AnyAction) => {
  switch (action.type) {
    case 'ADD_TICKER':
      return {
        ...state,
        [action.ticker]: null
      };

    case 'TICKER_TICK':
      return {
        ...state,
        [action.ticker]: action.value
      };

    default:
      return state;
  }
};
