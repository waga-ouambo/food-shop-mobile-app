import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import {useSelector, useDispatch} from 'react-redux';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton'; 
import Colors from "../../constants/Color";
import * as productAction from '../../store/actions/productsAction';

const UserProductScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch(); 

    const editProductHandler = (id) => { 
        props.navigation.navigate('EditProduct', {
            productId: id
        })
    }

    const deleteHandler = id => {

        Alert.alert('Are you sure ?', 'Do you really want to delete this item', [
            {text: 'NO', style: 'default'},
            {text: 'Yes', style: 'desctructive', onPress: () => {
                dispatch(productAction.deleteProduct(id));
            }}
        ],
        { cancelable: true }
        )
    }

    if(userProducts.length === 0  ){
        return <View style={styles.centered}>
            <Text> No Orders Found. Maybe start creating some! </Text>
        </View>
    }


    return <FlatList 
                data={userProducts}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ProductItem
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}
                        totalAmount={itemData.item.sum}
                        onSelect={() => {editProductHandler(itemData.item.id)}} 
                    >
                        <Button 
                            color={Colors.primary} 
                            title="Edit" 
                            onPress={ () => { editProductHandler(itemData.item.id)}
                            } />

                        <Button 
                            color={Colors.primary} 
                            title="Delete" 
                            onPress={() => {deleteHandler(itemData.item.id) }} />
            </ProductItem>
                )}

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
const headerRightButton = (navData) => {
    return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item 
            title='Add' 
            iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}  
            onPress={() => {navData.navigation.navigate('EditProduct')}} 
            />
        </HeaderButtons>
    )
}

UserProductScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Products',
        headerLeft:(() => headerLeftButton(navData)),
        headerRight: (() => headerRightButton(navData))
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

export default UserProductScreen;