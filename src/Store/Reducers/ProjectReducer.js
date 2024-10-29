import { createSlice } from '@reduxjs/toolkit';
import { LocalData } from '../../constants';

const date = new Date();

const initialState = {
  userDetails: "",
  companyData: "",
  token: "",
  needRefresh:false,
  masterData:""
};

export const projectReducer = createSlice({
  name: 'project',
  initialState,
  reducers: {

    _setUserData: (state, action) => {
      state.userDetails = action.payload;
    },

    _setcompanyData: (state, action) => {
      state.companyData = action.payload;
    },

    _setToken: (state, action) => {
      state.token = action.payload;
    },
    
    _setreffeshStatus: (state, action) => {
      state.needRefresh = action.payload;
    },

    _setmasterData: (state, action) => {
      state.masterData = action.payload;
    },

  },
});

// Action creators are generated for each case reducer function
export const {
  _setUserData,
  _setToken,
  _setreffeshStatus,
  _setmasterData,
  _setcompanyData
} = projectReducer.actions;

export default projectReducer.reducer;
