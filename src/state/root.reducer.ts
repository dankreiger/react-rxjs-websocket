import { combineReducers } from 'redux';
import todos from './todos/reducer';
import ticker from './stockTicker/reducer';
import { TodosState } from './todos/ts/classes';

export interface IAppState {
  todos: TodosState;
  ticker: {
    connected: boolean;
    leadsCount: number;
  };
}

export default combineReducers<IAppState>({
  todos,
  ticker
});
