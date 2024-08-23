import { createSlice } from '@reduxjs/toolkit';
import { LocalData } from '../../constants';

const date = new Date();

const initialState = {
  userDetails: "",
  token: "",
  needRefresh:false
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
    
    _setreffeshStatus: (state, action) => {
      state.needRefresh = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  _setUserData,
  _setToken,
  _setreffeshStatus
} = projectReducer.actions;

export default projectReducer.reducer;
