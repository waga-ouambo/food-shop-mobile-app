import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton'; 
import OrderItem from '../../components/shop/OrderItem';
import * as ordersAction from '../../store/actions/orderAction';
import Colors from '../../constants/Color';

const  OrdersScreen = props => {

    const orders = useSelector( state =>  state.orders.orders); 
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const loadOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(ordersAction.fetchOrders() );
        } catch (error) {
            setError(error);
        }finally{
            setIsLoading(false);
        }
        
    }


    useEffect(() => { 
        loadOrders();
    }, [dispatch]);

    if(error){
        return <View style={styles.centered}>
           <Text> {error} </Text>
           <Button title='Try again' onPress={loadOrders} color={Colors.primary} />
        </View>
    }

    if(isLoading) {
        return <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary}  />
    </View>
    }

    if(!isLoading && orders.length === 0  ){
        return <View style={styles.centered}>
            <Text> No Orders Found. Maybe ordering some!  </Text>
        </View>
    }

    return <FlatList 
    data={orders} 
    keyExtractor={item => item.id} 
    renderItem= {
        itemData => <OrderItem
        amount= {itemData.item.totalAmount}
        readableDate={itemData.item.readableDate}
        items={itemData.item.items}
         />
    }
    /> 
}

const headerLeftButton = (navData) => {
    return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item 
            title='Menu' 
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}  
            onPress={() => {navData.navigation.toggleDrawer()}} 
            />
        </HeaderButtons>
    )
}

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft:(() => headerLeftButton(navData))
    }
    }

    const styles = StyleSheet.create({
        centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
   

export default OrdersScreen;    