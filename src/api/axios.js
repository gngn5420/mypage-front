import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8086"
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    const noAuthUrls = [
        "/api/user/register",
        "/api/user/login"
    ];

    // 로그인, 회원가입 요청은 Authorization 제거
    if (noAuthUrls.some(url => config.url.endsWith(url))) {
        delete config.headers.Authorization;
        return config;
    }

    // 나머지는 토큰 자동 추가
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default instance;
