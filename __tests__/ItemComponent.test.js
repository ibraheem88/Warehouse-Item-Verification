import {waitFor, act, fireEvent, screen} from '@testing-library/react-native';
import ItemComponent from '../src/components/ItemComponent';
import RenderWithRedux from '../helpers/RenderWithRedux';
import SalesOrderSample from './mockedApiResponse/SalesOrderSample.json';

const orders = SalesOrderSample.orders;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Item Component', () => {
  it('Renders Successfully', () => {
    const store = {user: {userId: 123, name: 'John Doe'}};
    const {getByTestId} = RenderWithRedux(store, ItemComponent, {
      item: orders[0].item[0],
    });
    expect(getByTestId('orderComponent')).toBeDefined();
  });

  it('Item click opens confirm item RbSheet', async () => {
    const store = {user: {userId: 123, name: 'John Doe'}};
    const {getByTestId} = RenderWithRedux(store, ItemComponent, {
      item: orders[0].item[0],
    });
    await act(async () => {
      await waitFor(() => {
        expect(getByTestId('orderComponent')).toBeDefined();
        fireEvent(getByTestId('orderComponent'), 'onPress');
        expect(getByTestId('confirmSheet')).toBeDefined();
      });
    });
  });

  it('Verify Items verifies and updates item on successfull api call', async () => {
    const store = {user: {user: {userId: 123, name: 'John Doe'}}};
    const {getByTestId, findByTestId, queryByTestId} = RenderWithRedux(
      store,
      ItemComponent,
      {
        item: orders[0].item[0],
        order: orders[0],
        setOrder: jest.fn(),
      },
    );
    fetch.mockResponseOnce(JSON.stringify({status: 200}));
    await act(async () => {
      await waitFor(async () => {
        expect(getByTestId('orderComponent')).toBeDefined();
        fireEvent.press(getByTestId('orderComponent'));
        expect(getByTestId('confirmSheet')).toBeDefined();
        const textinput = queryByTestId('inputQuantity');
        fireEvent.changeText(textinput, '2');
        //expect(textinput.props.value).toBe('1');
        fireEvent(getByTestId('verifyButton'), 'press');
        expect(getByTestId('error').children[0]).toEqual(
          'Qunaity can not exceed alloted quantity!',
        );
        expect(fetch.mock.calls[0]).toBe(undefined);
        fireEvent.changeText(textinput, '');
        fireEvent(getByTestId('verifyButton'), 'press');
        expect(getByTestId('error').children[0]).toEqual(
          'Item Qunatity Required!',
        );
        expect(fetch.mock.calls[0]).toBe(undefined);
        fireEvent.changeText(textinput, orders[0].item[0].qty_to_verify);
        fireEvent(getByTestId('verifyButton'), 'press');
        expect(fetch.mock.calls[0][0]).toBe(
          `https://mulberriestec.com/orders/${orders[0].entity_id}/item/${orders[0].item[0].item_id}`,
        );
        //expect(queryByTestId('confirmSheet')).toBeNull();
      });
    });
  });
});
