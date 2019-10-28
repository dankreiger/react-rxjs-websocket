import { webSocket } from 'rxjs/webSocket';
import { mergeMap, map, take, takeUntil, switchMap } from 'rxjs/operators';
import { of, merge, Subject } from 'rxjs';
import { StateObservable, ofType } from 'redux-observable';
import { ECarsActionTypes } from './ts/enums';
import { CarsActions } from './actions';

let webSocket$: any = null;
const wsLocation = 'ws://localhost:3030';

export const carsNotificationSendEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(ECarsActionTypes.WS_MESSAGE_SEND),
    mergeMap((action: any) => {
      if (!webSocket$) {
        return of(
          CarsActions.error(
            `Attempted to send message while no connection was open.`
          )
        );
      }
      webSocket$.next(action.message);
      return of(CarsActions.sentNotification(action.message));
    })
  );

export const carsNotificationConnectionEpic = (
  action$: any,
  state$: StateObservable<any>
) =>
  action$.pipe(
    ofType(ECarsActionTypes.WS_TRY_CONNECT),
    switchMap(() => {
      if (webSocket$) {
        return of(
          CarsActions.error(
            `Attempted to open connection when one was already open.`
          )
        );
      }

      const webSocketOpen$ = new Subject();
      const webSocketClose$ = new Subject();

      const open$ = webSocketOpen$.pipe(
        take(1),
        map(() => of(CarsActions.connected()))
      );
      const close$ = webSocketClose$.pipe(
        take(1),
        map(() => of(CarsActions.disconnected()))
      );

      webSocket$ = webSocket({
        url: wsLocation,
        openObserver: webSocketOpen$,
        closeObserver: webSocketClose$
      });

      const message$ = webSocket$.pipe(
        takeUntil(action$.ofType(CarsActions.disconnected)),
        map((evt: any) => of(CarsActions.receivedNotification(evt)))
      );

      return merge(message$, open$, close$);
    }),
    mergeMap((v: any) => v)
  );
