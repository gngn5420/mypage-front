import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

// ✅ 관리자 화면에서 볼 목록을 2개로 나눔 
const TABS = {
  ACTIVE: "ACTIVE", // 활성/정지 (삭제 전 사용자)
  DELETED: "DELETED", // ✅ 삭제된 사용자(복구/완전삭제 대상)
};

const AdminPage = () => {
  const [users, setUsers] = useState([]); // 현재 화면에 보여줄 사용자 목록 
  const [selectedUsers, setSelectedUsers] = useState([]); // 회원목록 여러 명 선택시 담아두는 배열 
  const [activeTab, setActiveTab] = useState(TABS.ACTIVE); // ✅ 지금 어떤 탭을 보고 있는지 -> 시작: ACTIVE 탭 

  // 회원 목록 불러오기 ---------------------------------------
  const fetchUsers = async () => {
  const res = await adminApi.getUsers(activeTab);
  const data = res.data;

  const list =
    Array.isArray(data) ? data :
    Array.isArray(data?.content) ? data.content :
    Array.isArray(data?.users) ? data.users :
    [];

  // ✅ ADMIN은 목록에서 제외 (방어적으로 대문자 처리)
  const filtered = list.filter(
    (u) => String(u?.role ?? "").toUpperCase() !== "ADMIN"
  );

  setUsers(filtered);   
  setSelectedUsers([]);
  };

  useEffect(() => {
    fetchUsers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);


  // 백엔드 연결 코드 -------------------------------------------

  // 사용자 상태 변경 (정지/활성 토글)
  const handleToggleSuspend = async (user) => {
    const next = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    await adminApi.updateStatus(user.id, next);
    fetchUsers();
  };

  // 사용자 상태만 삭제
  const handleSoftDelete = async (user) => {
    await adminApi.updateStatus(user.id, "DELETED");
    fetchUsers();
  };


  // 사용자 상태 복구 
  const handleRestore = async (user) => {
    await adminApi.updateStatus(user.id, "ACTIVE");
    fetchUsers();
  };

  // 하드 삭제 (DB에서 완전히 제거)
  const handleHardDelete = async (user) => {
    await adminApi.hardDelete(user.id);
    fetchUsers();
  };

  const toggleSelect = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) return prev.filter((u) => u.id !== user.id);
      return [...prev, user];
    });
  };

    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#EFEDE7",
          padding: "60px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            fontWeight: 500,
            color: "#333",
            marginBottom: "40px",
          }}
        >
          👤 관리자 페이지
        </h1>

        {/* ✅ 탭 버튼(로직만 최소 추가, 스타일은 심플 유지) */}
        <div style={{ width: "900px", marginBottom: "20px", display: "flex", gap: "10px"}}>
          <button
            onClick={() => setActiveTab(TABS.ACTIVE)}
            style={{
              padding: "8px 14px",
              border: "1px solid rgba(0,0,0,0.25)",
              background: activeTab === TABS.ACTIVE ? "rgba(0,0,0,0.06)" : "transparent",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            활성 사용자
          </button>

          <button
            onClick={() => setActiveTab(TABS.DELETED)}
            style={{
              padding: "8px 14px",
              border: "1px solid rgba(0,0,0,0.25)",
              background: activeTab === TABS.DELETED ? "rgba(0,0,0,0.06)" : "transparent",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            삭제된 사용자
          </button>
        </div>

        {/* 리스트 영역 --------------------------------------------- */}
        <div style={{ width: "900px", marginBottom: "50px" }}>
          <table
            style={{
              width: "100%",
              fontSize: "16px",
              textAlign: "center",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  opacity: 0.75,
                  borderBottom: "1px dashed rgba(0,0,0,0.25)",
                }}
              >
                <th style={{ padding: "14px 0" }}>No.</th>
                <th>아이디</th>
                <th>이메일</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {(Array.isArray(users) ? users : []).map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => toggleSelect(user)}
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px dashed rgba(0,0,0,0.25)",
                    background:
                      selectedUsers.find((u) => u.id === user.id)
                        ? "rgba(0,0,0,0.05)"
                        : "transparent",
                  }}
                >
                  <td style={{ padding: "14px 0" }}>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>

                  {/* ✅ 관리 */}
                  <td>
                    {activeTab === TABS.ACTIVE ? (
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSuspend(user);
                          }}
                          style={{
                            padding: "5px 10px",
                            border: "1px solid rgba(0,0,0,0.3)",
                            background: "transparent",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          {user.status === "SUSPENDED" ? "정지 해제" : "정지"}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSoftDelete(user);
                          }}
                          style={{
                            padding: "5px 10px",
                            border: "1px solid rgba(0,0,0,0.3)",
                            background: "transparent",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(user);
                          }}
                          style={{
                            padding: "5px 10px",
                            border: "1px solid rgba(0,0,0,0.3)",
                            background: "transparent",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          복구
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHardDelete(user);
                          }}
                          style={{
                            padding: "5px 10px",
                            border: "1px solid rgba(0,0,0,0.3)",
                            background: "transparent",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          완전 삭제
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 카드 그리드 -------------------------------------------------------- */}
        {/* <div
          style={{
            width: "900px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              style={{
                background: "#F7F6F2",
                border: "1px solid rgba(0,0,0,0.15)",
                padding: "24px 24px 15px 24px",
                borderRadius: "6px",
                minHeight: "170px",
                transition: "0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                fontSize: "16px",
              }}
            >
              <div style={{ fontSize: "14px", opacity: 0.6 }}>No. {user.id}</div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 500,
                  marginTop: "12px",
                  marginBottom: "12px",
                }}
              >
                {user.nickname}
              </div>

              <div style={{ marginBottom: "6px" }}>
                <strong style={{ opacity: 0.85 }}>아이디:</strong> {user.username}
              </div>

              <div>
                <strong style={{ opacity: 0.85 }}>이메일:</strong> {user.email}
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  style={{
                    marginTop: "20px",
                    padding: "7px 14px",
                    border: "1px solid rgba(0,0,0,0.35)",
                    background: "transparent",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  상세 보기
                </button>
              </div>
            </div>
          ))} */}

        {/* 카드 그리드 -------------------------------------------------------- */}
        <div
          style={{
            width: "900px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {selectedUsers.map((user) => {
            // ✅ 안전한 fallback
            const todoCount = Number(user?.todoCount ?? 0);
            const habitCount = Number(user?.habitCount ?? 0);
            const habit7dRate =
              user?.habit7dRate !== undefined && user?.habit7dRate !== null
                ? Number(user.habit7dRate)
                : 0;

            return (
              <div
                key={user.id}
                style={{
                  background: "#F7F6F2",
                  border: "1px solid rgba(0,0,0,0.15)",
                  padding: "24px 24px 18px 24px",
                  borderRadius: "6px",
                  minHeight: "170px",
                  transition: "0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  fontSize: "16px",
                }}
              >
                <div style={{ fontSize: "14px", opacity: 0.6 }}>No. {user.id}</div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 500,
                    marginTop: "12px",
                    marginBottom: "12px",
                  }}
                >
                  {user.nickname}
                </div>

                <div style={{ marginBottom: "6px" }}>
                  <strong style={{ opacity: 0.85 }}>아이디:</strong> {user.username}
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <strong style={{ opacity: 0.85 }}>이메일:</strong> {user.email}
                </div>

                {/* ✅ 요약 지표 라인 (버튼 대신) */}
                <div
                  style={{
                    fontSize: "13px",
                    opacity: 0.65,
                    borderTop: "1px dashed rgba(0,0,0,0.15)",
                    paddingTop: "10px",
                    lineHeight: 1.4,
                    
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    justifyItems: "center",
                    width: "100%",
                  }}
                >
                  <span>Todo {todoCount}</span>
                  <span>Habit {habitCount}</span>
                  <span>7d {habit7dRate}%</span>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    );
  };

  export default AdminPage;
