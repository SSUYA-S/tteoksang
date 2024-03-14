import { createSlice } from '@reduxjs/toolkit';

interface myState {
    myProductList: Product[];
    warehouseLevel: number;
    vehicleLevel: number;
    brokerLevel: number;
}

const initialState: myState = {
    myProductList: [],
    warehouseLevel: 0,
    vehicleLevel: 0,
    brokerLevel: 0,
};

export const myProductSlice = createSlice({
    name: 'myProductSlice',
    initialState,
    reducers: {
        //내 product 설정
        myProductState: (state, action) => {
            state.myProductList = action.payload;
        },
        warehouseLevelState: (state, action) => {
            state.warehouseLevel = action.payload;
        },
        vehicleLevelState: (state, action) => {
            state.vehicleLevel = action.payload;
        },
        brokerLevelState: (state, action) => {
            state.brokerLevel = action.payload;
        },
    },
});

export const {
    myProductState,
    warehouseLevelState,
    vehicleLevelState,
    brokerLevelState,
} = myProductSlice.actions;
export default myProductSlice.reducer;
