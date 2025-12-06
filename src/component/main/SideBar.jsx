
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { id: "home", path: "/", name: "MAIN", year: "2026", subtitle: "메인 화면" },
  { id: "todo", path: "/todo", name: "TODO LIST", year: "2026", subtitle: "할 일 리스트" },
  { id: "habit", path: "/habit", name: "HABIT TRACKER", year: "2026", subtitle: "습관 추적기" },
  { id: "news", path: "/news", name: "NEWS SUMMARY", year: "2026", subtitle: "경제뉴스" },
  { id: "profile", path: "/profile", name: "MY PAGE", year: "2026", subtitle: "개인정보" }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <div style={{
        fontSize: "12px",
        textTransform: "uppercase",
        opacity: 0.45,
        letterSpacing: "1.2px",
        marginBottom: "30px"
      }}>
        Daily Log
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => {
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
              <div style={{
                fontSize: "11px",
                opacity: 0.5,
                marginTop: "2px"
              }}>{item.subtitle}</div>
            </li>
          );
        })}
      </ul>
    </nav>


  );
};

export default Sidebar;
