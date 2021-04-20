import axios from "axios";
import Order from "../../models/order";
import dayjs from "dayjs";
import CartItem from "../../components/shop/CartItem";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';


export const fetchOrders = () => {
    return async (dispatch, getState) => { 
        const userId = getState().auth.userId;
        try { 
            const response  = await axios.get(`https://rn-project-backend-default-rtdb.firebaseio.com/orders/${userId}.json`);

             const resData = await response.data;
            const loadedOrders = [];

        for(const key in resData) {
            loadedOrders.push(new Order(
                key, 
                resData[key].cartItems,
                resData[key].totalAmount,
                new Date(resData[key].date)

            ))
        }

            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            })
            
        } catch (error) {
            throw error;
        } 
       
    }
}


export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const date = new Date();
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            console.log(totalAmount);
            const response = await  axios.post(`https://rn-project-backend-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`, 
            {
                cartItems,
                totalAmount,
                 date: date.toISOString()
            } );
    
            const resData = await response.data;
    
            dispatch ({ 
                type: ADD_ORDER,
                orderData: {
                    id: resData.name,
                    items: cartItems, 
                    amount: totalAmount,
                    date: date
                 }
            })

            for(const cartItem of cartItems){
                const pushToken = cartItem.productPushToken;
                console.log(cartItem);
                 axios.post('https://exp.host/--/api/v2/push/send', 
                    {
                        to: pushToken,  
                        title: 'Order was placed!',
                        body:  cartItem.productTitle
                    } 
                );
            }

        } catch (error) {
            console.log(error);
            throw error
        }
        
    }
   
}