import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import project from 'reducers/project';
import projectBoard from 'reducers/projectBoard';
import users from 'reducers/users';
import stories from 'reducers/stories';

const reducer = combineReducers({
  project,
  projectBoard,
  users,
  stories
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
