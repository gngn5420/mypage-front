// import axios from "axios";

// // axios 인스턴스 생성
// const todoApi = axios.create({
//   baseURL: "http://localhost:8086",  // 실제 API 서버 URL
// });

// // 요청 인터셉터
// todoApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   // 인증이 필요없는 URL 제외하고, 토큰을 헤더에 추가
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default todoApi;

import instance from "./axios";

export const todoApi = {
  fetchTodos: () => instance.get("/api/todo/list"),

  createTodo: (content) => instance.post("/api/todo/add", { content }),

  updateTodo: (id, content) =>
    instance.put(`/api/todo/update/${id}`, { content }),

  deleteTodo: (id) => instance.delete(`/api/todo/delete/${id}`),

  toggleTodo: (id) => instance.put(`/api/todo/toggle/${id}`),
};

export default todoApi;
