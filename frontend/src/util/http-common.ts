import axios from 'axios';

//api axios 환경
export default function localAxios() {
    //axios instance 생성
    const instance = axios.create({
        baseURL: 'http://localhost:5173',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            accept: 'application/json',
        },
        withCredentials: true,
    });

    return instance;
}
