import { AnyAction } from 'redux';
import { notificationTypes } from './epics';

const reducer = (
  state = { connected: false, leadsCount: 0 },
  action: AnyAction
) => {
  switch (action.type) {
    case notificationTypes.WEBSOCKET_CONNECTED:
      return {
        ...state,
        connected: true,
      };
    case notificationTypes.WEBSOCKET_DISCONNECT:
      return {
        ...state,
        connected: false,
      };
    case notificationTypes.WEBSOCKET_MESSAGE_RECEIVED:
      return {
        ...state,
        leadsCount: state.leadsCount + 1,
      };
    default:
      return state;
  }
};

export default reducer;
