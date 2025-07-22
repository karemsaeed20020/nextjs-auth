import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';

import productReducer from './product/productSlice';
import authReducer from './auth/authSlice';
import favoritesReducer from './favorites/favoritesSlice';
import cartReducer from './cart/cartSlice';
import notificationsReducer from './notifications/notificationsSlice';
import addressesReducer from './addresses/addressesSlice'
const rootReducer = combineReducers({
  product: productReducer,
  auth: authReducer,
  favorites: favoritesReducer,
  cart: cartReducer,
  notifications: notificationsReducer,
  addresses: addressesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['product', 'auth', 'favorites', 'cart', 'notifications', 'addresses'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
