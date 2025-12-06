import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "#EFEDE7",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px",
      }}
    >
      {/* 라벨 */}
      <div
        style={{
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          opacity: 0.55,
          marginBottom: "12px",
        }}
      >
        page not found
      </div>

      {/* 404 숫자 */}
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 400,
          letterSpacing: "1px",
          color: "#333",
          marginBottom: "10px",
        }}
      >
        404
      </h1>

      {/* 안내 문구 */}
      <p
        style={{
          fontSize: "16px",
          color: "#555",
          lineHeight: "1.6",
          marginBottom: "30px",
        }}
      >
        요청하신 페이지가 존재하지 않습니다.
        <br />
        잘못된 경로이거나 이동된 페이지일 수 있어요.
      </p>

      {/* 돌아가기 버튼 */}
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "12px 24px",
          background: "#333",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          letterSpacing: "0.5px",
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
