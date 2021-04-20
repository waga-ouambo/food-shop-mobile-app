import axios from "axios";
import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const SET_PRODUCTS = 'SET_PRODUCTS'


import * as permissionsToken from '../permissions';




export const fetchProducts = () => {
    return async (dispatch, getState)  => { 
        
        const userId = getState().auth.userId;
        try {
            const response  = await axios.get('https://rn-project-backend-default-rtdb.firebaseio.com/products.json');

             const resData = await response.data;
            const loadedProducts = [];

        for(const key in resData) {
            loadedProducts.push(new Product(
                key,
                resData[key].ownerId,
                resData[key].ownerPushToken, 
                resData[key].title,
                resData[key].imageUrl,
                resData[key].description,
                resData[key].price,

            ))
        } 
        
        dispatch({
            type: SET_PRODUCTS, 
            products: loadedProducts, 
            userProducts: loadedProducts.filter(product => product.ownerId === userId)
        });

        } catch (error) {
            throw error;
        }

        
    }
}

export const deleteProduct = productId  => { 

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        await axios.delete(`https://rn-project-backend-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`)

        dispatch ({type: DELETE_PRODUCT, pid: productId});
    }

    
} 

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {

        try {

            const pushToken = await permissionsToken.getNotificationPermissionsToken();

            const token = getState().auth.token;
            const userId = getState().auth.userId;
        // Add any async code here
       const response = await axios.post(`https://rn-project-backend-default-rtdb.firebaseio.com/products.json?auth=${token}`,
        // {body: JSON.stringify({
        //     title,
        //     description,
        //     imageUrl,
        //     price
        // })}
        {
            title,
            description,
            imageUrl,
            price,
            ownerId: userId,
            ownerPushToken: pushToken
        }
        );

        const resData = await response.data; 

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId,
                pushToken: pushToken
            } 
        })
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
   
}

export const updateProduct = (id, title, description, imageUrl, price) => {

    return async (dispatch, getState) => {
        const token = getState().auth.token; 
        try { 
            const response = await axios.put(`https://rn-project-backend-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`, 
            {
                title,
                description,
                imageUrl,
                price
            } );
  
            if(response.status !== 200 && response.status !== 201) { 
                 throw new Error (res.data);
               }

         dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl,
                price
            } 
        })
            
        } catch (error) {
            throw error ; 
        } 
            
    }
    
}