import { ETodosActionTypes } from './ts/enums';
import { TodosActionTypes } from './ts/types';
import { ITodo } from './ts/interfaces';

export const fetchTodosBegin = (): TodosActionTypes => ({
  type: ETodosActionTypes.FETCH_TODOS_BEGIN
});

export const fetchTodosSuccess = (list: ITodo[]): TodosActionTypes => ({
  type: ETodosActionTypes.FETCH_TODOS_SUCCESS,
  payload: list
});
