import { ECarsActionTypes } from './ts/enums';

export const CarsActions = {
  tryConnect: () => ({ type: ECarsActionTypes.WS_TRY_CONNECT }),
  sendNotification: (message: string) => ({
    type: ECarsActionTypes.WS_MESSAGE_SEND,
    message
  }),
  sentNotification: (message: string) => ({
    type: ECarsActionTypes.WS_MESSAGE_SENT,
    message
  }),
  receivedNotification: (message: string) => ({
    type: ECarsActionTypes.WS_MESSAGE_RECEIVED,
    message
  }),
  connected: () => ({ type: ECarsActionTypes.WS_CONNECTED }),
  disconnected: () => ({ type: ECarsActionTypes.WS_DISCONNECTED }),
  error: (error: any) => ({ type: ECarsActionTypes.WS_ERROR, error })
};
