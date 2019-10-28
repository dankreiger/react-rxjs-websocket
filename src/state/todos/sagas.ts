import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api';
import { ETodosActionTypes } from './ts/enums';
import { ITodo, ITodosApiResponse } from './ts/interfaces';
import { fetchTodosSuccess } from './actions';

export function* fetchTodosBeginAsync() {
  const response: ITodosApiResponse = yield api.get<ITodo[]>('todos');
  yield put(fetchTodosSuccess(response.data));
}

export function* watchFetchTodosBegin() {
  yield takeLatest(ETodosActionTypes.FETCH_TODOS_BEGIN, fetchTodosBeginAsync);
}

export function* todosSagas() {
  yield all([call(watchFetchTodosBegin)]);
}
