import { StatusBar } from 'expo-status-bar';
import React, {useState } from 'react'; 
import { StyleSheet, Text, View, LogBox } from 'react-native';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';

import {Provider} from 'react-redux';
import productsReducer from './store/reducers/productsReducer';
import cartReducer from './store/reducers/cartReducer';
import orderReducer from './store/reducers/orderReducer';
import authReducer from './store/reducers/authReducer';

import ShopNavigator from './navigation/ShopNavigator';
import { composeWithDevTools } from 'redux-devtools-extension'

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

LogBox.ignoreLogs([
  "The global \"__expo\" and \"Expo\" objects will be removed in SDK 41. Learn more about how to fix this warning: https://expo.fyi/deprecated-globals",
]);

const fetchFonts = async () => {
  await Font.loadAsync({
    'open-sans' : require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf'),
  })
}

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);

  if(!fontLoaded) {
    return (<AppLoading 
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
    />);
  }


  // return (
  //   <View style={styles.container}>
  //     <Text>Open up App.js to start working on your app!</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
  return  (
      <Provider store={store}>
          <ShopNavigator/>
      </Provider> 
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
