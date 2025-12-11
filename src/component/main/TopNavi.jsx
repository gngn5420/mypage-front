import { useNavigate } from "react-router-dom";

const TopNavi = ({ isLoggedIn, setIsLoggedIn, setUserInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");

    // ✅ 상태 즉시 반영
    setIsLoggedIn(false);
    setUserInfo({});

    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "25px 40px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "#F8F7F4",
        letterSpacing: "0.5px"
      }}
    >
      <h1
        style={{
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 400,
          opacity: 0.85,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
        onClick={() => navigate("/")}
      >
        My Daily Life
      </h1>

      <div
        style={{
          display: "flex",
          gap: "18px",
          fontSize: "14px",
          opacity: 0.75
        }}
      >
        {isLoggedIn ? (
          <>
            <span
              style={{ cursor: "pointer", letterSpacing: "0.5px" }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </span>

            <span
              style={{ cursor: "pointer", letterSpacing: "0.5px" }}
              onClick={handleLogout}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <span
              style={{ cursor: "pointer", letterSpacing: "0.5px" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>

            <span
              style={{ cursor: "pointer", letterSpacing: "0.5px" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </>
        )}
      </div>
    </header>
  );
};

export default TopNavi;
