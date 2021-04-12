import PRODUCTS from '../../data/dummy-data';
import {DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS}  from '../actions/productsAction';
import Product from '../../models/product';

const initialState = {
    // availableProducts: PRODUCTS,
    // userProducts: PRODUCTS.filter(product => product.ownerId === 'u1')
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, action) =>{ 
    switch(action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case DELETE_PRODUCT:  
        console.log(action.pid);
        return {
            ...state,
            userProducts: state.userProducts.filter(product => product.id !== action.pid),
            availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
        }
        case CREATE_PRODUCT:    
                const newProduct = new Product(
                    action.productData.id, 
                    action.productData.ownerId,
                    action.productData.title, 
                    action.productData.imageUrl, 
                    action.productData.description, 
                    action.productData.price
                    )
                    return {
                         ...state,
                         availableProducts: [...state.availableProducts, newProduct],
                         userProducts: [...state.userProducts, newProduct]
                    }
        case UPDATE_PRODUCT:

        const updatedUserProducts = [...state.userProducts];
        const updatedAvailableProducts = [...state.availableProducts];

        const userProductsIndex = updatedUserProducts.findIndex(product => product.id === action.pid) ;
        const availableProductsIndex = updatedAvailableProducts.findIndex(product => product.id === action.pid) ;

        const updatedProduct = new Product(
            action.pid,
            state.userProducts[userProductsIndex].ownerId,
            action.productData.title,
            action.productData.imageUrl,
            action.productData.description,
            action.productData.price 
        );

        const updatedAvailableProduct = new Product(
            action.pid,
            state.availableProducts[userProductsIndex].ownerId,
            action.productData.title,
            action.productData.imageUrl,
            action.productData.description,
            action.productData.price  
        );

        updatedUserProducts[userProductsIndex] = updatedProduct;
        updatedAvailableProducts[availableProductsIndex] = updatedAvailableProduct;

        return {
            ...state,
            availableProducts: updatedAvailableProducts,
            userProducts: updatedUserProducts
        }

        // ======================================
        // updatedAvailableProducts.map(product => (
        //     product.id === action.pid ? { ...product, 
        //         title: action.productData.title , 
        //         description: action.productData.description , 
        //         imageUrl: action.productData.imageUrl
        //     } : product
        // ));

        // updatedUserProducts.map(product => {
        //     // product.id === action.pid ? { ...product, title: action.productData.title , description: action.productData.description, imageUrl: action.productData.imageUrl} : product));
        //     if(product.id === action.pid){
        //         product.title = action.productData.title
        //         product.description = action.productData.description
        //         product.imageUrl = action.productData.imageUrl
        //     }
        // })

         
        // return {
        //     ...state,
        //     availableProducts: updatedAvailableProducts,
        //     userProducts: updatedUserProducts
        // }


    }
     return state;
}