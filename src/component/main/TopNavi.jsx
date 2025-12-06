import { useNavigate } from "react-router-dom";

const TopNavi = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 30px",
        borderBottom: "1px solid #eee"
      }}
    >
      <h1 
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        MY DAILY LIFE
      </h1>

      <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
        
        {isLoggedIn ? (
          <>
            {/* 로그인 O */}
            <span 
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              PROFILE
            </span>

            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                // 실제 로그아웃은 로컬스토리지와 상태 초기화
                localStorage.removeItem("token");
                navigate("/login");
                window.location.reload(); // 임시 초기화
              }}
            >
              LOGOUT
            </span>
          </>
        ) : (
          <>
            {/* 로그인 X */}
            <span 
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              LOGIN
            </span>

            <span 
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              REGISTER
            </span>
          </>
        )}

      </div>
    </header>
  );
};

export default TopNavi;
