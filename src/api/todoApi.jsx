import axios from "axios";

const API_URL = "http://localhost:8086/api/todo";

// 📌 전체 목록 가져오기
export const fetchTodos = async () => {
  const res = await axios.get(`${API_URL}/list`);
  return res.data;
};

// 📌 새로운 todo 생성
export const createTodo = async (content) => {
  const res = await axios.post(`${API_URL}`, { content });
  return res.data;
};

// 📌 todo 내용 수정
export const updateTodo = async (todoId, content) => {
  const res = await axios.put(`${API_URL}/${todoId}`, { content });
  return res.data;
};

// 📌 todo 완료/미완료 토글
export const toggleTodoComplete = async (todoId) => {
  const res = await axios.put(`${API_URL}/${todoId}/toggle`);
  return res.data;
};

// 📌 todo 삭제
export const deleteTodo = async (todoId) => {
  const res = await axios.delete(`${API_URL}/${todoId}`);
  return res.data;
};
