import {configureStore} from '@reduxjs/toolkit';
import {
  projectReducer,

} from './Reducers';


export const store = configureStore({
  reducer: {
    project: projectReducer,
  },
  
});
