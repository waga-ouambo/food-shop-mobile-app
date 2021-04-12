import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Platform, SafeAreaView, Button, View} from  'react-native';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/authAction';

import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import Colors from '../constants/Color';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';

import {Ionicons} from '@expo/vector-icons';
import UserProductScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';

const defaultNavigationOptions =  {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary: ''
    } ,
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
    headerTitle: 'All Products'
}

// const Drawer = createDrawerNavigator();


const productNatigator = createStackNavigator({
    ProductOverview: ProductOverviewScreen,
    productDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons 
            name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            size={23}
            color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavigationOptions
})

const OrdersNavigator = createStackNavigator( {
        Orders: OrdersScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => (
                <Ionicons 
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size={23}
                color={drawerConfig.tintColor}
                />
            )
        },
        defaultNavigationOptions: defaultNavigationOptions
    }
)

const AdminNavigator = createStackNavigator( {
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen
},
{
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons 
            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            size={23}
            color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavigationOptions
}
)

const ShopNavigator = createDrawerNavigator ({
    Products : productNatigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
},
{
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: (props) => {
        const dispatch = useDispatch();

       return (<View style={{flex: 1, paddingTop: 30}}>
            <SafeAreaView forceIncet={{top: 'always', horizontal: 'never'}}>
                <DrawerItems {...props}/>
                <Button 
                title="Logout" 
                color={Colors.primary}
                onPress={() => { 
                    dispatch(authActions.logout()); 
                    props.navigation.navigate('Auth');
                }}
                 />
            </SafeAreaView>
        </View>)
    }
})

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen,
},
{
    defaultNavigationOptions: defaultNavigationOptions
})

const MainNavigator =  createSwitchNavigator( {
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
     } );

export default createAppContainer(MainNavigator);