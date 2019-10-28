import { webSocket } from 'rxjs/webSocket';
import {
  mergeMap,
  map,
  take,
  takeUntil,
  switchMap,
  retryWhen,
  withLatestFrom
} from 'rxjs/operators';
import { of, merge, Subject, timer, fromEvent } from 'rxjs';
import { ofType } from 'redux-observable';

let webSocket$: any = null;
const wsLocation = 'ws://localhost:3030';
export const notificationTypes = {
  WEBSOCKET_TRY_CONNECT: 'WEBSOCKET_TRY_CONNECT',
  WEBSOCKET_CONNECTED: 'WEBSOCKET_CONNECTED',
  WEBSOCKET_DISCONNECT: 'WEBSOCKET_DISCONNECT',
  WEBSOCKET_DISCONNECTED: 'WEBSOCKET_DISCONNECTED',
  WEBSOCKET_ERROR: 'WEBSOCKET_ERROR',
  WEBSOCKET_MESSAGE_SEND: 'WEBSOCKET_MESSAGE_SEND',
  WEBSOCKET_MESSAGE_SENT: 'WEBSOCKET_MESSAGE_SENT',
  WEBSOCKET_MESSAGE_RECEIVED: 'WEBSOCKET_MESSAGE_RECEIVED'
};

export const notificationActions = {
  tryConnect: () => ({ type: notificationTypes.WEBSOCKET_TRY_CONNECT }),
  sendNotification: (message: any) => ({
    type: notificationTypes.WEBSOCKET_MESSAGE_SEND,
    message
  }),
  sentNotification: (message: any) => ({
    type: notificationTypes.WEBSOCKET_MESSAGE_SENT,
    message
  }),
  receivedNotification: (message: any) => ({
    type: notificationTypes.WEBSOCKET_MESSAGE_RECEIVED,
    message
  }),
  connected: () => ({ type: notificationTypes.WEBSOCKET_CONNECTED }),
  disconnected: () => ({ type: notificationTypes.WEBSOCKET_DISCONNECTED }),
  error: (error: any) => ({ type: notificationTypes.WEBSOCKET_ERROR, error })
};

export const notificationSendEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(notificationTypes.WEBSOCKET_MESSAGE_SEND, 'INCREMENT_LEADS'),
    mergeMap((action: any) => {
      if (!webSocket$) {
        return of(
          notificationActions.error(
            `Attempted to send message while no connection was open.`
          )
        );
      }
      webSocket$.next(action.message || 'no message in payload woof');
      return of(notificationActions.sentNotification(action.message));
    }),
    retryWhen(err =>
      window.navigator.onLine ? timer(1000) : fromEvent(window, 'online')
    )
  );

export const notificationConnectionEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(notificationTypes.WEBSOCKET_TRY_CONNECT),
    switchMap((action: any) => {
      if (webSocket$) {
        return of(
          notificationActions.error(
            `Attempted to open connection when one was already open.`
          )
        );
      }

      // Subjects are a combination of an Observer *and* an Observable
      // so webSocket can call openObserver$.next(event) and
      // anyone who is subscribing to openObserver$ will receive it
      // because Subjects are "hot"
      const webSocketOpen$ = new Subject();
      const webSocketClose$ = new Subject();

      // Listen for our open/close events and transform them
      // to redux actions. We could also include values from
      // the events like event.reason, etc if we wanted
      const open$ = webSocketOpen$.pipe(
        take(1),
        map(() => of(notificationActions.connected()))
      );
      const close$ = webSocketClose$.pipe(
        take(1),
        map(() => of(notificationActions.disconnected()))
      );

      // webSocket has an overload signature that accepts this object
      webSocket$ = webSocket({
        url: wsLocation,
        openObserver: webSocketOpen$,
        closeObserver: webSocketClose$
      });

      // We're merging them all together because we want to listen for
      // and emit actions from all three. For good measure I also included
      // a generic .takeUntil() to demonstrate the most obvious way to stop
      // the websocket (as well as the open/close, which we shouldn't forget!)
      // Also notice how I'm listening for both the STOP_SOCKET_OR_WHATEVER
      // or also a SOCKET_ERROR because we want to stop subscribing
      // to open$/close$ if there is an error.
      const message$ = webSocket$.pipe(
        withLatestFrom(state$),
        map(([, state]: any) => state.ticker),
        takeUntil(
          action$.ofType(
            notificationActions.disconnected,
            notificationTypes.WEBSOCKET_ERROR
          )
        ),
        map(ticker => {
          return of(notificationActions.receivedNotification(ticker));
        })
      );

      return merge(message$, open$, close$);
    }),
    mergeMap((v: any) => v)
  );
