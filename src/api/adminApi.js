import instance from "./axios";

export const adminApi = {
  // ✅ 탭 조회
  // ACTIVE 탭: 백에서 ACTIVE+SUSPENDED 같이 내려주는 설계라면 그대로 OK
  getUsers: (status) =>
    instance.get("/api/admin/users", { params: { status, mode: "card" } }),

  // ✅ 상태 변경 (정지/해제/삭제/복구를 하나로)
  updateStatus: (id, status) =>
    instance.patch(`/api/admin/users/${id}/status`, { status }),

  // ✅ 소프트 삭제 전용(원하면 사용)
  softDelete: (id) =>
    instance.patch(`/api/admin/users/${id}/soft-delete`),

  // ✅ 복구 전용(원하면 사용)
  restore: (id) =>
    instance.patch(`/api/admin/users/${id}/restore`),

  // ✅ 완전 삭제
  hardDelete: (id) =>
    instance.delete(`/api/admin/users/${id}/hard`),
};
