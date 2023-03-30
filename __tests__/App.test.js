import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

//jest.mock('redux-persist', () => require('../__mocks__/redux-persist'));
jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({children}) => <>{children}</>,
}));

describe('App', () => {
  it('renders the component without errors', () => {
    render(<App />);
  });
});
