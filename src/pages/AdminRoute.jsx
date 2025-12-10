// pages/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ isLoggedIn, userInfo, children }) => {
  const saved = localStorage.getItem("userInfo");
  const storedUser = saved ? JSON.parse(saved) : null;

  const rawRole = userInfo?.role || storedUser?.role || "";
  const isAdmin = rawRole === "ADMIN"; // ✅ DB 값과 동일하게

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;

