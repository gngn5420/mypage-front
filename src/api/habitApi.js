// src/api/habitApi.js
import instance from "./axios"; 

export const habitApi = {
  // ✅ 습관 목록
  getHabits: () => instance.get("/api/habit/list"),

  // ✅ 습관 추가
  addHabit: (payload) => instance.post("/api/habit/add", payload),
  // payload: { name, emoji }

  // ✅ 습관 삭제
  deleteHabit: (habitId) => instance.delete(`/api/habit/${habitId}`),

  // ✅ 특정 기간(예: 최근 7일) 습관 + 로그 한 번에 가져오기
  getHabitsWithLogs: (dates) => instance.post("/api/habit/logs", dates),
  // dates: ["YYYY-MM-DD", "YYYY-MM-DD", ...]

  // ✅ 이름 수정
  updateHabitName: (habitId, name) =>
    instance.put(`/api/habit/${habitId}/name`, { name }),

  // ✅ 이모지 수정
  updateHabitEmoji: (habitId, emoji) =>
    instance.put(`/api/habit/${habitId}/emoji`, { emoji }),

  // ✅ 체크 토글 (토글 결과 HabitLogDTO 반환)
  toggleHabit: (habitId, date) =>
    instance.put(`/api/habit/${habitId}/toggle`, null, {
      params: { date },
    }),
};
