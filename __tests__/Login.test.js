import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import renderWithRedux from '../helpers/RenderWithRedux';
import {SET_TOKEN_ID} from '../src/state/actions/userActions';
import Login from '../src/screens/Login';

const mockStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Login', () => {
  it('Redux action SET_TOKEN_ID is dispatched to redux on Successfull Login', async () => {
    const mockUser = {token: null};
    const store = mockStore({
      user: {user: mockUser},
    });
    const mockNavigation = jest.fn();
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {token: 'token123', userId: 'user123'},
        status: 200,
      }),
    );
    const {getByTestId} = render(
      <Provider store={store}>
        <Login navigation={{replace: mockNavigation}} />
      </Provider>,
    );
    const loginButton = getByTestId('loginButton');
    //here data is the token coming froma api response
    fireEvent.press(loginButton);
    await waitFor(() => {
      expect(fetch).toBeCalledTimes(1);
      expect(store.getActions()).toEqual([
        {type: SET_TOKEN_ID, payload: {token: 'token123', userId: 'user123'}},
      ]);
    });
  });

  it('Navigate to Home only if token available', async () => {
    const mockUser = {token: null};
    const store = {
      user: {user: mockUser},
    };
    const mockNavigation = jest.fn();
    renderWithRedux(store, Login, {navigation: {replace: mockNavigation}});

    expect(mockNavigation).toHaveBeenCalledTimes(0);
    const updatedStore = {
      user: {user: {token: 'token123', userId: 'user123'}},
    };
    renderWithRedux(updatedStore, Login, {
      navigation: {replace: mockNavigation},
    });
    expect(mockNavigation).toHaveBeenCalledWith('Home');
  });

  it('Show Error if wrong credentials and dismiss on touch start of textinput', async () => {
    const mockUser = {token: null};
    const store = {
      user: {user: mockUser},
    };
    const mockNavigation = jest.fn();
    fetch.mockResponseOnce(
      JSON.stringify({message: 'Invalid User Id or Username', status: 403}),
    );
    const {getByTestId, queryByTestId} = renderWithRedux(store, Login, {
      navigation: {replace: mockNavigation},
    });
    const loginButton = getByTestId('loginButton');
    fireEvent.press(loginButton);
    await act(async () => {
      await waitFor(() => {
        expect(getByTestId('error')).toBeDefined();
      });
    });
    const userIdInput = getByTestId('userIdInput');
    fireEvent(userIdInput, 'touchStart');
    expect(queryByTestId('error')).toBeNull();
  });
});
