import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "5rem", marginBottom: "20px" }}>404</h1>
      <p style={{ fontSize: "1.5rem" }}>
        페이지를 찾을 수 없습니다.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        홈으로 이동
      </button>

    </div>

  );
};

export default NotFound;
