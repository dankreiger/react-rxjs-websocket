import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodosBegin } from '../state/todos/actions';
import { IAppState } from '../state/root.reducer';
import { ITodo } from '../state/todos/ts/interfaces';
import { notificationTypes } from '../state/stockTicker/epics';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const leadCount = useSelector((state) => state as IAppState).ticker
    .leadsCount;
  const todosList: ITodo[] = useSelector(
    (state) => (state as IAppState).todos.list
  );
  useEffect(() => {
    dispatch(fetchTodosBegin());
    dispatch({
      type: notificationTypes.WEBSOCKET_TRY_CONNECT,
    });
    return () => {
      dispatch({
        type: notificationTypes.WEBSOCKET_DISCONNECT,
      });
    };
  }, [dispatch]);
  return (
    <div className="App">
      <div>
        <button
          onClick={() =>
            dispatch({
              type: 'INCREMENT_LEADS',
              message: 'woofing in a websocket',
            })
          }
        >
          send message to websocket server
        </button>
        {leadCount}
      </div>
      <ul>
        {todosList.map((item) => (
          <li key={item.title}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
