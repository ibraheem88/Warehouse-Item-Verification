import {act, screen} from '@testing-library/react-native';
import ScanItem from '../src/screens/ScanItem';
import RenderWithRedux from '../helpers/RenderWithRedux';
import SalesOrderSample from './mockedApiResponse/SalesOrderSample.json';
import mockCamera from '../__mocks__/react-native-camera';

// jest.mock('react-native-qrcode-scanner', () => {
//   const {View} = require('react-native');
//   return {
//     __esModule: true,
//     default: ({onRead}) => (
//       <View
//         testID="mockQRCodeScanner"
//         onPress={() => onRead({data: '14280'})}
//       />
//     ),
//   };
// });

// jest.mock('react-native-camera', () => ({
//   RNCamera: mockCamera,
// }));

const orders = SalesOrderSample.orders;

describe('Scan Item', () => {
  it('Renders Scan Item correctly', () => {
    const store = {
      user: {user: {token: null}},
    };
    const {getByTestId} = RenderWithRedux(store, ScanItem, {
      route: {
        params: {
          items: orders[0].item,
        },
      },
    });
    console.log(screen.debug());
    expect(getByTestId('camera')).toBeDefined();
  });

  it('Item confirmation screen is displayed on successful scan', async () => {
    const store = {
      user: {user: {token: null}},
    };
    const {getByTestId} = RenderWithRedux(store, ScanItem, {
      route: {
        params: {
          items: orders[0].item,
        },
      },
    });
    await act(async () => {
      expect(getByTestId('confirmSheet')).toBeDefined();
    });
  });
});
