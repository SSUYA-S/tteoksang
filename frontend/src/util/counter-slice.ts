import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SettingState {
    //BGM설정
    bgmFlag: boolean;
    //효과음설정
    effectFlag: boolean;
    //설정 테마 시간대
    themeType: string;
    //로그인 유무
    isLogin: boolean;
    //내가 적용한 테마
    profileTheme: string;
    //내가 적용한 아이콘
    profileIcon: number;
    //내가 적용한 프레임
    profileFrame: number;
}
const initialState: SettingState = {
    bgmFlag: true,
    effectFlag: true,
    themeType: 'auto',
    isLogin: false,
    profileTheme: 'main',
    profileIcon: 1,
    profileFrame: 1,
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
        profileThemeState: (state, action) => {
            state.profileTheme = action.payload;
        },
        profileIconeState: (state, action) => {
            state.profileIcon = action.payload;
        },
        profileFrameState: (state, action) => {
            state.profileFrame = action.payload;
        },
    },
});
export const {
    loginState,
    themeState,
    bgmState,
    effectState,
    profileFrameState,
    profileIconeState,
    profileThemeState,
} = reduxSlice.actions;
export default reduxSlice.reducer;
