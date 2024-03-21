import { createSlice } from '@reduxjs/toolkit';
import { ProductBucket } from '../type/types';

export interface myProductState {
    myProductList: ProductBucket[];
    warehouseLevel: number;
    vehicleLevel: number;
    brokerLevel: number;
    gold: number;
    purchasedQuantity: number;
}

const initialState: myProductState = {
    myProductList: [],
    warehouseLevel: 0,
    vehicleLevel: 0,
    brokerLevel: 0,
    gold: 0,
    purchasedQuantity: 0,
};

export const myProductSlice = createSlice({
    name: 'myProductSlice',
    initialState,
    reducers: {
        //내 product 설정
        myProductState: (state: myProductState, action) => {
            state.myProductList = action.payload;
        },
        warehouseLevelState: (state: myProductState, action) => {
            state.warehouseLevel = action.payload;
        },
        vehicleLevelState: (state: myProductState, action) => {
            state.vehicleLevel = action.payload;
        },
        brokerLevelState: (state: myProductState, action) => {
            state.brokerLevel = action.payload;
        },
        goldState: (state: myProductState, action) => {
            state.gold = action.payload;
        },
        purchasedQuantityState: (state: myProductState, action) => {
            state.purchasedQuantity = action.payload;
        },
    },
});

export const {
    myProductState,
    warehouseLevelState,
    vehicleLevelState,
    brokerLevelState,
    goldState,
    purchasedQuantityState,
} = myProductSlice.actions;
export default myProductSlice.reducer;
