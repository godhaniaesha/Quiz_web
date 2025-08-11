import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import techReducer from '../slice/tech.slice';
import questionReducer from '../slice/question.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  tech : techReducer,
  ques : questionReducer,
});

export default rootReducer;
