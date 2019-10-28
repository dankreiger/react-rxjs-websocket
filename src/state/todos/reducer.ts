import { TodosActionTypes } from './ts/types';
import { ETodosActionTypes } from './ts/enums';
import { TodosState } from './ts/classes';

const initialState: TodosState = new TodosState();

export default (state = initialState, action: TodosActionTypes): TodosState => {
  switch (action.type) {
    case ETodosActionTypes.FETCH_TODOS_BEGIN:
      return {
        ...state,
        loading: true
      };
    case ETodosActionTypes.FETCH_TODOS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload
      };
    default:
      return state;
  }
};
