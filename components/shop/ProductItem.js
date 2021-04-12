import React from 'react';
import {View, Text, Image, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Colors } from '../../constants/Color';
import Card from '../UI/Card';

const ProductItem = props => {

    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21){
        TouchableCmp = TouchableNativeFeedback
    }


    return <Card onSelect={props.onSelect} style={styles.product} useForeGround> 
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{uri: props.image}}/>
                </View>
                    <View style={styles.details}> 
                        <Text style={styles.title} >{props.title}</Text>
                        <Text style={styles.price}>{props.price.toFixed(0) } xaf</Text> 
                    </View>
                <View style={styles.actions}>
                    {props.children}
                </View>
            </Card> 
}


const styles = StyleSheet.create({
    product: { 
        height: 300,
        margin: 20
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        alignItems: 'center',
        height: '17%',
        padding: 10
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '23%',
        paddingHorizontal: 20
    },
    detail: {

    }
})


export default ProductItem;