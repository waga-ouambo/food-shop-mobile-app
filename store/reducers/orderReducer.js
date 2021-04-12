import { ADD_ORDER, SET_ORDERS } from "../actions/orderAction";
import Order from '../../models/order';

const initialState = {
    orders: []
}


export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORDER: 
        const newOrder = new Order(
            // new Date().toString(), 
            action.orderData.id, 
            action.orderData.items, 
            action.orderData.amount, 
            // new Date()
            action.orderData.date 
            );
        
        return { 
            ...state,
            orders: [...state.orders, newOrder]
        }

        case SET_ORDERS: 
        return { 
            ...state,
            orders: action.orders
        }
    }
    return state;
}