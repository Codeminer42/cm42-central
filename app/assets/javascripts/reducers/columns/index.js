import { combineReducers } from 'redux';
import backlog from './backlog';
import chillyBin from './chillyBin';
import done from './done';
import inProgress from './inProgress';

export default combineReducers({
  backlog,
  chillyBin,
  done,
  inProgress,
});
