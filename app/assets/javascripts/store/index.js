import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import project from 'reducers/project';
import projectBoard from 'reducers/projectBoard';
import users from 'reducers/users';
import stories from 'reducers/stories';

const reducer = combineReducers({
  project,
  projectBoard,
  users,
  stories,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
