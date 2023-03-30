export const SET_TOKEN_ID = 'user/setTokenId';
export const SET_USER_INFO = 'user/setUserInfo';
export const SET_ORDERS = 'user/setOrders';

export function setTokenAndId(tokenId) {
  return {
    type: SET_TOKEN_ID,
    payload: tokenId,
  };
}

export function setUserInfo(userData) {
  return {
    type: SET_USER_INFO,
    payload: userData,
  };
}

export function setOrders(orders) {
  return {
    type: SET_ORDERS,
    payload: orders,
  };
}
