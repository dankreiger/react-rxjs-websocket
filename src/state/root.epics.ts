import { combineEpics } from 'redux-observable';
import {
  notificationConnectionEpic,
  notificationSendEpic
} from './stockTicker/epics';

export const rootEpic = combineEpics(
  notificationConnectionEpic,
  notificationSendEpic
);
