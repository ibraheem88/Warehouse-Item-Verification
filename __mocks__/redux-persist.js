const mockReduxPersist = jest.genMockFromModule('redux-persist');

export const persistReducer = jest.fn((persistConfig, reducer) => reducer);

export const persistStore = jest.fn((store, options, callback) => {
  callback();
});

export default mockReduxPersist;
