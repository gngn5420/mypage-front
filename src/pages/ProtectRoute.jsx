// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ isLoggedIn, children }) => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//         // 토큰이 없으면 로그인 페이지로 리다이렉트
//         return <Navigate to="/login" />;
//     }

//     // 토큰이 있으면 자식 컴포넌트 렌더링
//     return children;
// };

// export default ProtectedRoute;

// ------------- 위 코드가 맞음. 아래는 개발자용 코드임 -------------------

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, dev, children }) => {

  // ⭐ DEV_MODE === true → 로그인 체크 없이 통과
  if (dev === true) {
    return children;
  }

  // 일반 모드에서는 로그인 여부 체크
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
