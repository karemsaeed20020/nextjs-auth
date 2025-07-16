import { configureStore, combineReducers } from '@reduxjs/toolkit';
import productReducer from './product/productSlice';
import authReducer from './auth/authSlice';
import favoritesReducer from './favorites/favoritesSlice';
import cartReducer from './cart/cartSlice';
import notificationsReducer from "./notifications/notificationsSlice";

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  product: productReducer,
  auth: authReducer,
  favorites: favoritesReducer,
  cart: cartReducer,
  notifications: notificationsReducer, 
  
  
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['product', 'auth', 'favorites', 'cart', 'notifications'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
