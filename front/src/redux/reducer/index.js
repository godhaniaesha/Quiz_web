import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import techReducer from '../slice/tech.slice';
import questionReducer from '../slice/question.slice';
import quizReducer from '../slice/quiz.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  tech : techReducer,
  ques : questionReducer,
  quiz: quizReducer, // Add the quiz slice reducer here
});

export default rootReducer;
