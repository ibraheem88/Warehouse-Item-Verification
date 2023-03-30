import {render} from '@testing-library/react-native';
import OrderComponent from '../src/components/OrderComponent';

describe('Order Component', () => {
  it('Render Order Component', () => {
    render(<OrderComponent />);
  });
});
