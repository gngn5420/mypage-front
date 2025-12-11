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
