import { ETodosActionTypes } from './enums';
import { AxiosResponse } from 'axios';

// payload for todo
export interface ITodo {
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

// api response
export interface ITodosApiResponse extends AxiosResponse {
  data: ITodo[];
}

// actions
export interface IFetchTodosBeginAction {
  readonly type: typeof ETodosActionTypes.FETCH_TODOS_BEGIN;
}

export interface IFetchTodosSuccessAction {
  readonly type: typeof ETodosActionTypes.FETCH_TODOS_SUCCESS;
  payload: ITodo[];
}
