import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { id: "home", path: "/", name: "MAIN", year: "2026", subtitle: "메인 화면" },
  { id: "todo", path: "/todo", name: "TODO LIST", year: "2026", subtitle: "할 일 리스트" },
  { id: "habit", path: "/habit", name: "HABIT TRACKER", year: "2026", subtitle: "습관 추적기" },
  { id: "news", path: "/news", name: "NEWS SUMMARY", year: "2026", subtitle: "경제뉴스" },
  { id: "profile", path: "/profile", name: "MY PAGE", year: "2026", subtitle: "개인정보" },
  { id: "admin", path: "/admin", name: "ADMIN PAGE", year: "2026", subtitle: "관리자 페이지" }
];

const Sidebar = ({ isLoggedIn = false, userInfo = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ localStorage fallback
  const saved = localStorage.getItem("userInfo");
  const storedUser = saved ? JSON.parse(saved) : null;

  const rawRole = userInfo?.role || storedUser?.role || "";
  const isAdmin = rawRole === "ADMIN";

  const visibleItems = menuItems.filter((item) => {
    if (item.id === "admin") {
      return isLoggedIn && isAdmin;
    }
    // ✅ 마이페이지는 로그인한 사용자만
    if (item.id === "profile") {
      return isLoggedIn;
    }
    return true;
  });

  // 로그아웃 상태에서 /profile 직접 입력 접근 차단
  useEffect(() => {
  if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn]);

  return (
    <nav
      style={{
        width: "260px",
        padding: "50px 30px",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        background: "#F8F7F4",
        height: "100vh",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          opacity: 0.45,
          letterSpacing: "1.2px",
          marginBottom: "30px"
        }}
      >
        Daily Log
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                padding: "14px 8px",
                cursor: "pointer",
                borderBottom: "1px dashed rgba(0,0,0,0.15)",
                opacity: isActive ? 1 : 0.55,
                letterSpacing: "0.5px",
                fontSize: "15px",
                transition: "0.2s",
              }}
            >
              <span>{item.name}</span>
              <div
                style={{
                  fontSize: "11px",
                  opacity: 0.5,
                  marginTop: "2px"
                }}
              >
                {item.subtitle}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
