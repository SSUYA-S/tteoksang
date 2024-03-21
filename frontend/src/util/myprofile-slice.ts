import { createSlice } from '@reduxjs/toolkit';

export interface ProfileState {
    //닉네임
    userNickname: string;
    //커리어
    career: number;
    //칭호
    title: number;
}
const initialState: ProfileState = {
    userNickname: '',
    career: 0,
    title: 0,
};

export const myProfileSlice = createSlice({
    name: 'myProfileSlice',
    initialState,
    reducers: {
        //닉네임 설정
        userNicknameState: (state, action) => {
            state.userNickname = action.payload;
        },
        careerState: (state, action) => {
            state.career = action.payload;
        },
        titleState: (state, action) => {
            state.title = action.payload;
        },
    },
});
export const { userNicknameState, careerState, titleState } =
    myProfileSlice.actions;
export default myProfileSlice.reducer;
