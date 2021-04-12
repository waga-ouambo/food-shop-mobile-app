import React,{useEffect, useState, useCallback} from 'react';
import { View, Text, FlatList, StyleSheet, Button, Platform, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as cartAction from '../../store/actions/cartAction';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import Colors from '../../constants/Color';

import HeaderButton from '../../components/UI/HeaderButton'; 
import * as producstActions from '../../store/actions/productsAction';

const ProductOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('productDetail', {
            productId: id,
            productTitle: title
        })
    }

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(producstActions.fetchProducts())
        } catch (error) {
            console.log(error.message);
            setError(error.message);
        } finally {
            setIsRefreshing(false); 
        } 
    }, [dispatch, setIsLoading, setError]);


    useEffect(() => {
         const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
         return () => { willFocusSub.remove(); }
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);


    var date = new Date(); 
    console.log(date);
    var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    console.log(new Date(now_utc));


    if(error){
        return <View style={styles.centered}>
           <Text> {error} </Text>
           <Button title='Try again' onPress={loadProducts} color={Colors.primary} />
        </View>
    }

    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} /> 
        </View>
    }

    if(!isLoading && products.length === 0  ){
        return <View style={styles.centered}>
            <Text> No Products Found. Maybe start adding some!  </Text>
        </View>
    }



    return <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
        keyExtractor={item => item.id }
        renderItem={itemData => 
            <ProductItem 
            totalAmount={totalAmount}
            image={itemData.item.imageUrl} 
            title={itemData.item.title} 
            price={itemData.item.price} 
            onSelect= {() => {
                console.log('onSelect');
                selectItemHandler(itemData.item.id, itemData.item.title)
            }}
            
            // onViewDetail={() => props.navigation.navigate('productDetail', {
            //     productId: itemData.item.id,
            //     productTitle: itemData.item.title
            // })} 
             >
                <Button 
                color={Colors.primary} 
                title="View Detail" 
                onPress={ () => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }
                } />

                <Button 
                color={Colors.primary} 
                title="To Cart" 
                onPress={() => {
                    dispatch(cartAction.addToCart(itemData.item));
                    }} />
             </ProductItem>     
    }
    />;
}

const headerRightButton = (navData) => {
    return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item 
            title='Cart' 
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}  
            onPress={() => {navData.navigation.navigate('Cart')}} 
            />
        </HeaderButtons>
    )
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

ProductOverviewScreen.navigationOptions = navData => { 
    return{
        headerTitle: 'All Products',
        headerRight:(() => headerRightButton(navData)),
        headerLeft:(() => headerLeftButton(navData))
    }
}


const styles = StyleSheet.create({
    centered: {
        fontFamily: 'open-sans-bold',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' 
    }
})

export default ProductOverviewScreen;