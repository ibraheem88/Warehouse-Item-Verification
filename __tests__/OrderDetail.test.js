import React from 'react';
import {fireEvent, waitFor, act} from '@testing-library/react-native';
import OrderDetail from '../src/screens/OrderDetail';
import SalesOrderSample from './mockedApiResponse/SalesOrderSample.json';
import OrdersVerifiedItems from './mockedApiResponse/orderVerifiedItems.json';
import renderWithRedux from '../helpers/RenderWithRedux';
import verifiedOrder from './mockedApiResponse/verifiedOrder.json';
import {useIsFocused} from '@react-navigation/native';

const orders = SalesOrderSample.orders;
const ordersVerifiedItems = OrdersVerifiedItems.orders;

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Order Detail', () => {
  it('Renders Correctly and shows all order items', async () => {
    const store = {
      user: {user: {token: null}},
    };
    const mockOrder = {
      data: orders[0],
      status: 200,
    };
    useIsFocused.mockReturnValueOnce(true);
    fetch.mockResponseOnce(JSON.stringify(mockOrder));
    const {getAllByTestId} = renderWithRedux(store, OrderDetail, {
      route: {params: {orderId: '6068'}},
    });
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/orders/detail/6068`,
        );
        // expect(getAllByTestId('orderComponent')).toHaveLength(
        //   orders[0].item.length,
        // );
      });
    });
  });

  it('Verify order button opens signature canvas', async () => {
    const store = {
      user: {user: {token: null}},
    };
    const mockOrder = {
      data: ordersVerifiedItems[0],
      status: 200,
    };
    useIsFocused.mockReturnValueOnce(true);
    fetch.mockResponseOnce(JSON.stringify(mockOrder));
    const {getAllByTestId, getByTestId} = renderWithRedux(store, OrderDetail, {
      route: {params: {orderId: '6068'}},
    });
    await act(async () => {
      await waitFor(() => {
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/orders/detail/6068`,
        );
        const verifyButton = getByTestId('verifyButton');
        fireEvent.press(verifyButton);
        expect(getByTestId('signatureCanvas')).toBeDefined();
      });
    });
  });

  it('Show error message when user taps confirm and signature is empty and dismiss error on onStart', async () => {
    const store = {
      user: {user: {token: null}},
    };
    const mockOrder = {
      data: ordersVerifiedItems[0],
      status: 200,
    };
    useIsFocused.mockReturnValueOnce(true);
    fetch.mockResponseOnce(JSON.stringify(mockOrder));
    const rbSheetRef = React.createRef();
    const {getByTestId, findByTestId, queryByTestId} = renderWithRedux(
      store,
      OrderDetail,
      {route: {params: {orderId: '6068'}}, rbSheetRef: rbSheetRef},
    );
    await act(async () => {
      await waitFor(async () => {
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/orders/detail/6068`,
        );
        const verifyButton = getByTestId('verifyButton');
        fireEvent.press(verifyButton);
        const canvas = await findByTestId('webview');
        fireEvent(canvas, 'onOK', '');
        expect(getByTestId('errorEmptySignature')).toBeDefined();
        fireEvent(canvas, 'onBegin');
        expect(queryByTestId('errorEmptySignature')).toBeNull();
      });
    });
  });

  it('Call verifyOrder api when signature available and tap on confirm', async () => {
    const store = {
      user: {user: {token: null}},
    };
    const mockOrder = {
      data: ordersVerifiedItems[0],
      status: 200,
    };
    useIsFocused.mockReturnValueOnce(true);
    fetch.mockResponseOnce(JSON.stringify(mockOrder));
    fetch.mockResponseOnce(
      JSON.stringify({
        message: 'Order With Id ' + '6068' + ' Verified',
        status: 200,
      }),
    );
    const rbSheetRef = React.createRef();
    const {getByTestId, findByTestId, queryByTestId} = renderWithRedux(
      store,
      OrderDetail,
      {route: {params: {orderId: '6068'}}, rbSheetRef: {rbSheetRef}},
    );
    await act(async () => {
      await waitFor(async () => {
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/orders/detail/6068`,
        );
        const verifyButton = await findByTestId('verifyButton');
        fireEvent.press(verifyButton);
        const canvas = await findByTestId('webview');
        fireEvent(
          canvas,
          'onOK',
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABC0AAAMuCAYAAAA9v/kr......................',
        );
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(getByTestId('orderConfirmation')).toBeDefined();
        expect(await findByTestId('verifiedAnimation')).toBeDefined();
        // expect(store.getActions()).toEqual([
        //   {type: SET_ORDERS, payload: [verifiedOrder]},
        // ]);
      });
    });
  });
});
