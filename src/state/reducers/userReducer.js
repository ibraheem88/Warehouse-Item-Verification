import {SET_ORDERS, SET_TOKEN_ID, SET_USER_INFO} from '../actions/userActions';
import moment from 'moment';

const initialState = {
  user: {token: null},
  orders: [],
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN_ID: {
      return {
        ...state,
        user: {
          ...state.user,
          token: action.payload.token,
          lastLogin: moment(new Date()),
          userId: action.payload.userId,
        },
      };
    }
    case SET_USER_INFO: {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    }
    case SET_ORDERS: {
      return {
        ...state,
        orders: [...action.payload],
      };
    }
    default:
      return state;
  }
}

export default userReducer;
