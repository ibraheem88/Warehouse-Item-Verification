import {waitFor, act, fireEvent} from '@testing-library/react-native';
import VerifiedOrders from '../src/screens/VerifiedOrders';
import renderWithRedux from '../helpers/RenderWithRedux';
import verifiedOrdersRes from './mockedApiResponse/verifiedOrders.json';
import RenderWithRedux from '../helpers/RenderWithRedux';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Verified Orders Screen', () => {
  it('Renders Successfully and displays first 10 verified orders', async () => {
    const mockUser = {userId: 123, name: 'John Doe'};
    const store = {user: {user: mockUser}};
    const verifiedOrders = verifiedOrdersRes.orders;
    fetch.mockResponseOnce(JSON.stringify({data: verifiedOrders}));
    const {getByTestId, getAllByTestId, queryByTestId} = renderWithRedux(
      store,
      VerifiedOrders,
    );
    expect(getByTestId('loadingIndicator')).toBeDefined();
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls[0][0]).toBe(
          'https://mulberriestec.com/users/orders/verified/page/1',
        );
        expect(queryByTestId('loadingIndicator')).toBeFalsy();
        expect(getAllByTestId('orderComponent')).toHaveLength(
          verifiedOrders.length,
        );
      });
    });
  });

  it('Shows Empty animation if no verified orders', async () => {
    const mockUser = {userId: 123, name: 'John Doe'};
    const store = {user: {user: mockUser}};
    fetch.mockResponseOnce(JSON.stringify({data: []}));
    const {getByTestId, queryByTestId} = RenderWithRedux(store, VerifiedOrders);
    expect(getByTestId('loadingIndicator')).toBeDefined();
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls[0][0]).toBe(
          'https://mulberriestec.com/users/orders/verified/page/1',
        );
        expect(queryByTestId('loadingIndicator')).toBeFalsy();
        expect(getByTestId('emptyComponent')).toBeDefined();
      });
    });
  });

  it('Loads next page of verified orders on scroll to end', async () => {
    const mockUser = {
      userId: 123,
      name: 'John Doe',
    };
    const store = {user: {user: mockUser}};
    const verifiedOrders = verifiedOrdersRes.orders;
    fetch.mockResponseOnce(JSON.stringify({data: verifiedOrders}));
    fetch.mockResponseOnce(JSON.stringify({data: []}));
    const {getByTestId, getAllByTestId, queryByTestId} = renderWithRedux(
      store,
      VerifiedOrders,
    );
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls[0][0]).toBe(
          'https://mulberriestec.com/users/orders/verified/page/1',
        );
        const list = getByTestId('flatlist');
        fireEvent.scroll(list, {
          nativeEvent: {
            contentSize: {height: 600, width: 400},
            contentOffset: {y: 500},
            layoutMeasurement: {height: 100, width: 100},
          },
        });
        //expect(handlePagination).toHaveBeenCalledTimes(1);
        //console.log(fetch.mock.calls);
        expect(fetch.mock.calls[1][0]).toBe(
          'https://mulberriestec.com/users/orders/verified/page/2',
        );
      });
    });
  });
});
