import React, {useState} from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import {useSelector, useDispatch} from 'react-redux'; 
import Colors from '../../constants/Color';
import CartItem from '../../components/shop/CartItem';
import * as CartAction from '../../store/actions/cartAction';
import * as OrderAction from '../../store/actions/orderAction';
import Card from '../../components/UI/Card';


const CartScreen = props => {


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const cartTotalAmount = useSelector(state => state.cart.totalAmount) ;
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        
        for(const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice:state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }
       
        return transformedCartItems.sort((a, b) =>  
            a.productId > b.productId ? 1 : -1
         ) ;
    })

    const dispatch = useDispatch();

    const sendOrderHandler = async () => { 
        setIsLoading(true);
        try {
            await dispatch(OrderAction.addOrder(cartItems, cartTotalAmount));
        } catch (error) {
            setError(error.message);
        }
        finally{
            setIsLoading(false);
        }
    }

    if(error){
        // Alert.alert('An error occured !', error, [ {text: 'Okay'}]  );
        return <View style={styles.centered}>
           <Text> {error} </Text>
           <Button title='Back' onPress={() => props.navigation.goBack()} color={Colors.primary} />
        </View>
    }
    
     return <View style={styles.screen}>
                <Card style={styles.summary}>
                    <Text style={styles.summaryText}>
                        Total <Text style={styles.amount}> $ {Math.round(cartTotalAmount.toFixed(2) * 100) / 100} </Text></Text>
                        {isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> : 
                    <Button 
                    title='Order Now' 
                    disabled={cartItems.length === 0} 
                    onPress= {sendOrderHandler}
                    />
                }
                </Card>
                <FlatList 
                    data={cartItems}
                    keyExtractor={item => item.productId}
                    renderItem= {itemData =>  <CartItem 
                        quantity={itemData.item.quantity} 
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        onRemone={() => {dispatch(CartAction.removeFromCart(itemData.item.productId) )}}
                        />}
                />
        </View>
}

const styles =  StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18     
    },
    amount: {
        color: Colors.primary
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
};

export default CartScreen;