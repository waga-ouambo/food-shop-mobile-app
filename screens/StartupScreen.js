import React, {useEffect} from 'react';
import { View, Text, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
import {useDispatch} from 'react-redux';
import * as AuthActions from '../store/actions/authAction';
import Colors from '../constants/Color';


const StartupScreen = props => {

    const dispatch = useDispatch();

    const tryLogin = async () => {
        const userData = await AsyncStorage.getItem('userData');
        if(!userData) {
            props.navigation.navigate('Auth');
            return
        }
        const transformedData = JSON.parse(userData);
        const { token, userId, expiryDate} = transformedData;
        const expirationDate = new Date(expiryDate);

        if(expirationDate <= new Date() || !token || !userId) {
            props.navigation.navigate('Auth');
            return
        }
        props.navigation.navigate('Shop');
        dispatch(AuthActions.authenticate(token, userId));
            
    }

    useEffect(() => {
        tryLogin();
    }, [dispatch])

    return (<View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} /> 
        </View>)

}

const styles = StyleSheet.create({
    centered: {
        fontFamily: 'open-sans-bold',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' 
    }
})

export default StartupScreen;