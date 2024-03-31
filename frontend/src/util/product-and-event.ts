import { createSlice } from '@reduxjs/toolkit';
import { ProductInfo } from '../type/types';

export interface productInfoAndEventState {
    productInfoList: ProductInfo[];
    buyableProductIdList: number[];
    specialEventId: string[];
    privateEventId: number;
}

const initialState: productInfoAndEventState = {
    productInfoList: [],
    buyableProductIdList: [],
    specialEventId: [],
    privateEventId: -1,
};

export const productAndEventSlice = createSlice({
    name: 'productAndEventSlice',
    initialState,
    reducers: {
        //state 설정
        productInfoState: (state: productInfoAndEventState, action) => {
            state.productInfoList = action.payload;
        },
        buyableProductIdState: (state: productInfoAndEventState, action) => {
            state.buyableProductIdList = action.payload;
        },
        specialEventState: (state: productInfoAndEventState, action) => {
            state.specialEventId = action.payload;
        },
        privateEventState: (state: productInfoAndEventState, action) => {
            state.privateEventId = action.payload;
        },
    },
});

export const {
    productInfoState,
    buyableProductIdState,
    specialEventState,
    privateEventState,
} = productAndEventSlice.actions;
export default productAndEventSlice.reducer;
