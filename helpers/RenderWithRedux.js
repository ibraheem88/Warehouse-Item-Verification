import {Provider} from 'react-redux';
import {render} from '@testing-library/react-native';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();

const RenderWithRedux = (initialState, Component, props = {}) => {
  const store = mockStore(initialState);

  return render(
    <Provider store={store}>
      <Component {...props} />
    </Provider>,
  );
};

export default RenderWithRedux;
