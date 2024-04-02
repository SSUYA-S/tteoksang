import { createSlice } from '@reduxjs/toolkit';
import { BuyInfo, ProductBucket, ProductInfo } from '../type/types';

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
        buyAndShow: (state: productInfoAndEventState, action) => {
            const recentProductList = action.payload;

            //구매 품목 수 반영
            recentProductList.map((product: BuyInfo) => {
                const buyInfo: ProductBucket = product.buyingInfo;
                if (buyInfo.productQuantity !== 0) {
                    state.productInfoList[
                        buyInfo.productId
                    ].productMaxQuantity =
                        state.productInfoList[buyInfo.productId]
                            .productMaxQuantity - buyInfo.productQuantity;
                }
            });
        },
    },
});

export const {
    productInfoState,
    buyableProductIdState,
    specialEventState,
    privateEventState,
    buyAndShow,
} = productAndEventSlice.actions;

export default productAndEventSlice.reducer;
