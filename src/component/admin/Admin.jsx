// import React, { useEffect, useState } from "react";

// const AdminPage = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]); // 여러 명 선택 가능하게 처리

//   useEffect(() => {
//     setUsers([
//       { id: 1, username: "john", nickname: "존", email: "john@mail.com" },
//       { id: 2, username: "mira", nickname: "미라", email: "mira@mail.com" },
//       { id: 3, username: "hana", nickname: "하나", email: "hana@mail.com" },
//       { id: 4, username: "sunny", nickname: "써니", email: "sunny@mail.com" },
//       { id: 5, username: "mark", nickname: "마크", email: "mark@mail.com" },
//       { id: 6, username: "yo", nickname: "요", email: "yo@mail.com" },
//     ]);
//   }, []);

//   const toggleSelect = (user) => {
//     // 선택된 회원을 배열로 눌렀다 끄기
//     setSelectedUsers((prev) => {
//       const exists = prev.find((u) => u.id === user.id);
//       if (exists) return prev.filter((u) => u.id !== user.id);
//       return [...prev, user];
//     });
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         minHeight: "100vh",
//         background: "#EFEDE7",
//         padding: "60px 0",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       {/* 제목 */}
//       <h1
//         style={{
//           fontSize: "32px",
//           fontWeight: 500,
//           color: "#333",
//           marginBottom: "40px",
//         }}
//       >
//         👤 관리자 페이지
//       </h1>

//       {/* 리스트 영역 */}
//       <div style={{ width: "900px", marginBottom: "50px" }}>
//         <table style={{ width: "100%", fontSize: "15px" , textAlign: "center"}}>
//           <thead>
//             <tr style={{ opacity: 0.7, borderBottom: "1px dashed rgba(0,0,0,0.15)" }}>
//               <th style={{ padding: "12px 0" }}>No.</th>
//               <th>아이디</th>
//               <th>이메일</th>
//               <th>관리</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user, index) => (
//               <tr
//                 key={user.id}
//                 onClick={() => toggleSelect(user)}
//                 style={{
//                   cursor: "pointer",
//                   borderBottom: "1px dashed rgba(0,0,0,0.1)",
//                   background:
//                     selectedUsers.find((u) => u.id === user.id) ? "rgba(0,0,0,0.05)" : "transparent",
//                 }}
//               >
//                 <td style={{ padding: "12px 0" }}>{index + 1}</td>
//                 <td>{user.username}</td>
//                 <td>{user.email}</td>
//                 <td>
//                   <button
//                     style={{
//                       padding: "4px 8px",
//                       border: "1px solid rgba(0,0,0,0.25)",
//                       background: "transparent",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     삭제
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 상세 정보 카드 그리드 */}
//       <div
//         style={{
//           width: "900px",
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//           gap: "20px",
//         }}
//       >
//         {selectedUsers.map((user) => (
//           <div
//             key={user.id}
//             style={{
//               background: "#F7F6F2",
//               border: "1px solid rgba(0,0,0,0.1)",
//               padding: "20px",
//               borderRadius: "6px",
//               minHeight: "160px",
//               transition: "0.2s",
//               boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
//             }}
//           >
//             <div style={{ fontSize: "14px", opacity: 0.6 }}>No. {user.id}</div>

//             <div
//               style={{
//                 fontSize: "20px",
//                 fontWeight: 500,
//                 marginTop: "10px",
//                 marginBottom: "14px",
//               }}
//             >
//               {user.nickname}
//             </div>

//             <div style={{ fontSize: "14px", opacity: 0.75 }}>
//               <strong style={{ opacity: 0.9 }}>아이디:</strong> {user.username}
//             </div>

//             <div style={{ fontSize: "14px", opacity: 0.75, marginTop: "4px" }}>
//               <strong style={{ opacity: 0.9 }}>이메일:</strong> {user.email}
//             </div>

//             <button
//               style={{
//                 marginTop: "25px",
//                 padding: "6px 10px",
//                 border: "1px solid rgba(0,0,0,0.25)",
//                 background: "transparent",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 fontSize: "13px",
              
//               }}
//             >
//               상세 보기
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminPage;

import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setUsers([
      { id: 1, username: "john", nickname: "존", email: "john@mail.com" },
      { id: 2, username: "mira", nickname: "미라", email: "mira@mail.com" },
      { id: 3, username: "hana", nickname: "하나", email: "hana@mail.com" },
      { id: 4, username: "sunny", nickname: "써니", email: "sunny@mail.com" },
      { id: 5, username: "mark", nickname: "마크", email: "mark@mail.com" },
      { id: 6, username: "yo", nickname: "요", email: "yo@mail.com" },
    ]);
  }, []);

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
          fontSize: "34px",   // 폰트 조금 크게
          fontWeight: 500,
          color: "#333",
          marginBottom: "40px",
        }}
      >
        👤 관리자 페이지
      </h1>

      {/* 리스트 영역 */}
      <div style={{ width: "900px", marginBottom: "50px" }}>
        <table
          style={{
            width: "100%",
            fontSize: "16px",   // 폰트 크게
            textAlign: "center",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                opacity: 0.75,
                borderBottom: "1px dashed rgba(0,0,0,0.25)", // 선 조금 더 진하게
              }}
            >
              <th style={{ padding: "14px 0" }}>No.</th>
              <th>아이디</th>
              <th>이메일</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                onClick={() => toggleSelect(user)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px dashed rgba(0,0,0,0.25)", // 더 선명한 라인
                  background:
                    selectedUsers.find((u) => u.id === user.id)
                      ? "rgba(0,0,0,0.05)"
                      : "transparent",
                }}
              >
                <td style={{ padding: "14px 0" }}>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 카드 그리드 */}
      <div
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
              border: "1px solid rgba(0,0,0,0.15)", // 살짝 더 강하게
              padding: "24px 24px 15px 24px",
              borderRadius: "6px",
              minHeight: "170px",
              transition: "0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              fontSize: "16px",  // 카드 폰트도 조금 크게
            }}
          >
            <div style={{ fontSize: "14px", opacity: 0.6 }}>No. {user.id}</div>

            <div
              style={{
                fontSize: "22px",  // 강조 텍스트 크게
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

            {/* 버튼 중앙 정렬 */}
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
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
