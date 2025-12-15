// 관리자 전용 페이지에 일반 유저가 못 들어오도록 막는 보호용 라우트 
// 라우트를 감싸는 필터용 

import { Navigate } from "react-router-dom";

const AdminRoute = ({ isLoggedIn, userInfo, children }) => { // 현재 로그인 상태, 로그인한 유저 정보, 이 보호를 통과한 뒤 실제로 렌더링할 컴포넌트 
  const saved = localStorage.getItem("userInfo"); // 브라우저 새로고침 -> 리액트 상태 날아감 -> 저장소에서 사용자 정보 백업해 옴.
  const storedUser = saved ? JSON.parse(saved) : null;

  const rawRole = userInfo?.role || storedUser?.role || ""; 
  const isAdmin = rawRole === "ADMIN"; // ✅ DB 값과 동일하게 -> isAdmin은 그 최종 role이 "ADMIN"인지 비교해서 결정

  if (!isLoggedIn) return <Navigate to="/login" replace />; // 아직 로그인이 안돼 있으면 로그인 페이지로 이동 함 
  if (!isAdmin) return <Navigate to="/" replace />;  // 로그인은 됐는데 admin이 아닐 때 메인으로 돌려보냄 

  return children; // 관리자 페이지 컴포넌트 렌더링 
};

export default AdminRoute;

