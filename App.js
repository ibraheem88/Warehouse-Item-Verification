import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import ScanOrder from './src/screens/ScanOrder';
import OrderDetail from './src/screens/OrderDetail';
import VerifiedOrders from './src/screens/VerifiedOrders';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useSelector, useDispatch} from 'react-redux';
import {persistor, store} from './src/state/store';
import {setUserInfo} from './src/state/actions/userActions';
import ScanItem from './src/screens/ScanItem';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
  const {user} = useSelector(state => state.user);
  const {token} = user;
  return (
    <Stack.Navigator initialRouteName={token ? 'Home' : 'Login'}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={AppDrawer}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Scan Order" component={ScanOrder} />
      <Stack.Screen name="Scan Item" component={ScanItem} />
      <Stack.Screen name="Order Detail" component={OrderDetail} />
    </Stack.Navigator>
  );
};

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => {
          dispatch(setUserInfo({token: null, userId: null}));
          props.navigation.replace('Login');
        }}
      />
    </DrawerContentScrollView>
  );
}

const AppDrawer = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
    <Drawer.Screen
      name="Home Drawer"
      component={Home}
      options={{title: 'Home'}}
    />
    <Drawer.Screen name="Verified Orders" component={VerifiedOrders} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
              <HomeStack />
            </SafeAreaView>
          </SafeAreaProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
