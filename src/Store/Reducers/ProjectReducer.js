import { createSlice } from '@reduxjs/toolkit';
import { LocalData } from '../../constants';

const date = new Date();

const initialState = {
  userDetails: "",
  token: "",
};

export const projectReducer = createSlice({
  name: 'project',
  initialState,
  reducers: {

    _setUserData: (state, action) => {
      state.userDetails = action.payload;
    },

    _setToken: (state, action) => {
      state.token = action.payload;
    },
    
    
  },
});

// Action creators are generated for each case reducer function
export const {
  _setUserData,
  _setToken
} = projectReducer.actions;

export default projectReducer.reducer;
