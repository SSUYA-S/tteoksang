import axios from 'axios';

//api axios 환경
export default function localAxios() {
    //axios instance 생성
    const instance = axios.create({
        baseURL: import.meta.env.VITE_REACT_API_URL,
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            accept: 'application/json',
        },
        //쿠키 보내주도록 설정
        withCredentials: true,
    });

    return instance;
}
