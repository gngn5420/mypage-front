// import { Navigate } from "react-router-dom";

// // 로그인 제한 
// const ProtectedRoute = ({ isLoggedIn, children }) => {
//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        return <Navigate to="/login" />;
    }

    // 토큰이 있으면 자식 컴포넌트 렌더링
    return children;
};

export default ProtectedRoute;
