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
        overdueMethod: (state: myProductState, action) => {
            const productList = action.payload;
            //해시맵
            const newHashMap = new Map();
            for (let i = 0; i < productList.length; i++) {
                newHashMap.set(
                    productList[i].productId,
                    productList[i].productQuantity
                );
            }

            //내 상태에 반영
            const newList = [];
            for (let i = 0; i < state.myProductList.length; i++) {
                const id = state.myProductList[i].productId;
                const newProduct = state.myProductList[i];
                //있으면 감소
                if (newHashMap.get(id)) {
                    newProduct.productQuantity -= newHashMap.get(id);
                }
                //남으면 추가
                if (newProduct.productQuantity > 0) {
                    newList.push(newProduct);
                }
            }
            state.myProductList = newList;
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
    overdueMethod,
} = myProductSlice.actions;
export default myProductSlice.reducer;
