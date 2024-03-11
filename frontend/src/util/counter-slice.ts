import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SettingState {
    bgmFlag: boolean;
    effectFlag: boolean;
    themeType: String;
    isLogin: boolean;
}
const initialState: SettingState = {
    bgmFlag: true,
    effectFlag: true,
    themeType: 'morning',
    isLogin: false,
};

export const reduxSlice = createSlice({
    name: 'ReduxSlice',
    initialState,
    reducers: {
        //bgm 설정
        bgmState: (state, action) => {
            state.bgmFlag = action.payload;
        },
        //effect 설정
        effectState: (state, action) => {
            state.effectFlag = action.payload;
        },
        //theme 설정
        themeState: (state, action) => {
            state.themeType = action.payload;
        },
        //bgm 설정
        loginState: (state, action) => {
            state.isLogin = action.payload;
        },
    },
});
export const { loginState, themeState, bgmState, effectState } =
    reduxSlice.actions;
export default reduxSlice.reducer;
