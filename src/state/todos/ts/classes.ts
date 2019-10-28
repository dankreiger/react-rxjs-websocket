import { ITodo } from './interfaces';

export class TodosState {
  readonly loading: boolean = false;
  readonly list: ITodo[] = [];
}
