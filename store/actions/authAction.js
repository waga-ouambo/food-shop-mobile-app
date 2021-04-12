import axios from "axios";
import { AsyncStorage } from 'react-native';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';


export const authenticate = (token, userId) => {
    return {type: AUTHENTICATE, token: token, userId: userId}
}


export const signup = (email, password) => { 

    return async dispatch => {
        try {
            console.log(email, password);
            const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDPWtzQhWRoqd54l3CXoLbtBEy2llb_kRg',
            {
                email: email,
                password: password,
                returnSecureToken: true
            });
    
            const resData = await response.data;
            console.log(resData);
        
            // dispatch({ type: SIGNUP, token: resData.idToken , userId: resData.localId });
            dispatch(authenticate(resData.idToken, resData.localId));
            const expirationDate = new Date().getTime() + parseInt(resData.expiresIn) * 1000; 
            saveDataStorage(resData.idToken, resData.localId, expirationDate);
                
        } catch (error) {
            // console.log(error.response.data.error.message);
            const msg = error.response.data.error.message;
            throw new Error(msg);
        }
    
    } 
}

export const login = (email, password) => { 

    return async dispatch => {
        try {
            console.log(email, password);
            const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDPWtzQhWRoqd54l3CXoLbtBEy2llb_kRg',
            {
                email: email,
                password: password,
                returnSecureToken: true
            });

           
            const resData = await response.data;
            console.log(resData);
        
            // dispatch({ type: LOGIN, token: resData.idToken , userId: resData.localId});
            dispatch(authenticate(resData.idToken, resData.localId));
            const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000) 
            saveDataStorage(resData.idToken, resData.localId, expirationDate); 
            
                
        } catch (error) {
            // if (error.response) {
            //     console.log(error.response.data);
            //     console.log(error.response.status);
            //     console.log(error.response.headers);
            // }else if (error.request) { 
            //     console.log(error.request);
            // } else { 
            // console.log(error.message);
            // }
            // console.log(error.response); 
            const msg = error.response.data.error.message;
            throw new Error(msg);
        }
    
    } 
}

const saveDataStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }))
}

export const logout = () => {
    return {type: LOGOUT}
}