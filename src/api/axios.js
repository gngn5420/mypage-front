import axios from "axios";

// 로그인/회원가입엔 토큰 빼고, 나머지 모든 요청에는 JWT를 자동으로 붙여주는 공용 HTTP 클라이언트

const instance = axios.create({ // axios.create로 나만의 (instance)클라이언트 만들기
    baseURL: "http://localhost:8086"
});

instance.interceptors.request.use((config) => { // 이 인스턴스에서 나가는 모든 요청을 서버에 보내기 전에 한 번씩 거친다
    const token = localStorage.getItem("accessToken"); // localStorage에서 토큰 꺼내기 

    const noAuthUrls = [ //토큰 안 붙일 url 정의 
        "/api/user/register",
        "/api/user/login"
    ];

    // 로그인, 회원가입 요청은 강제로 Authorization 제거
    if (noAuthUrls.some(url => config.url.endsWith(url))) { // endsWith: url로 끝나는 값 확인 
        delete config.headers.Authorization;
        return config;
    }

    // 나머지는 토큰 자동 추가
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Authorization: Bearer xxxxx.yyyyy.zzzzz 이런 헤더 붙여서 보냄
    }

    return config;
});

export default instance;
