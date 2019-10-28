import { IFetchTodosBeginAction, IFetchTodosSuccessAction } from './interfaces';

export type TodosActionTypes =
  | IFetchTodosBeginAction
  | IFetchTodosSuccessAction;
