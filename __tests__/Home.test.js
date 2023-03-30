import {fireEvent, waitFor, act} from '@testing-library/react-native';
import {useIsFocused} from '@react-navigation/native';
import renderWithRedux from '../helpers/RenderWithRedux';
import Home from '../src/screens/Home';

jest.mock('redux-persist', () => ({
  persistStore: jest.fn(),
  // other mocked functions here, if necessary
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Home', () => {
  it('Renders Loading before fetching user data', () => {
    const mockUser = {data: {userId: 123, name: 'John Doe'}};
    fetch.mockResponseOnce(JSON.stringify(mockUser));
    const store = {
      user: {user: {token: null}, orders: []},
    };
    const {getByTestId} = renderWithRedux(store, Home);
    expect(getByTestId('loadingIndicator')).toBeDefined();
  });

  it('fetches user data on mount and displays orders', async () => {
    const mockUser = {data: {userId: 123, name: 'John Doe'}};
    const mockOrders = {
      data: [{entity_id: 1, name: 'Order 1', is_verified: false}],
    };
    fetch.mockResponseOnce(JSON.stringify(mockOrders));
    fetch.mockResponseOnce(JSON.stringify(mockUser));
    useIsFocused.mockReturnValueOnce(true);
    const store = {
      user: {user: mockUser, orders: mockOrders},
    };
    const {getByTestId, queryByTestId} = renderWithRedux(store, Home);
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls.length).toBe(2);
        expect(fetch.mock.calls[1][0]).toBe(
          `https://mulberriestec.com/users/detail/${mockUser.userId}`,
        );
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/users/orders/page/1/search/`,
        );
        expect(getByTestId('orderComponent')).toBeDefined();
      });
    });
  });

  it('Show QR code button and navigate to Scan Order screen on press', async () => {
    const mockUser = {data: {userId: 123, name: 'John Doe'}};
    const mockOrders = {
      data: [{entity_id: 1, name: 'Order 1', is_verified: false}],
    };
    fetch.mockResponseOnce(JSON.stringify(mockOrders));
    fetch.mockResponseOnce(JSON.stringify(mockUser));
    useIsFocused.mockReturnValueOnce(true);
    const store = {
      user: {user: mockUser, orders: mockOrders},
    };
    const navigateMock = jest.fn();
    const {queryByTestId} = renderWithRedux(store, Home, {
      navigation: {navigate: navigateMock},
    });
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/users/orders/page/1/search/`,
        );
        expect(queryByTestId('qrCodeButton')).toBeDefined();
        fireEvent.press(queryByTestId('qrCodeButton'));
        expect(navigateMock).toHaveBeenCalledWith('Scan Order');
      });
    });
  });

  it('List Empty component is rendered when orders list is empty', async () => {
    const mockUser = {data: {userId: 123, name: 'John Doe'}};
    const mockOrders = {data: []};
    fetch.mockResponseOnce(JSON.stringify(mockOrders));
    fetch.mockResponseOnce(JSON.stringify(mockUser));
    useIsFocused.mockReturnValueOnce(true);
    const store = {
      user: {user: mockUser, orders: mockOrders},
    };
    const {queryByTestId, getByTestId} = renderWithRedux(store, Home);
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/users/orders/page/1/search/`,
        );
        expect(getByTestId('emptyComponent')).toBeTruthy();
        expect(queryByTestId('qrCodeButton')).toBeFalsy();
      });
    });
    // expect(getByTestId('emptyComponent')).not.toBeNull();
  });
});
