import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";

const Login = ({ setIsLoggedIn, setUserInfo }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      const response = await instance.post("/api/user/login", {
        username,
        password,
      });

      // ✅ 성공 케이스
      if (response.data && response.data.token) {
        const token = response.data.token;

        // 토큰 저장
        localStorage.setItem("accessToken", token);

        // 유저 정보 구성
        const nextUserInfo = {
          username: response.data.username,
          nickname: response.data.nickname,
          email: response.data.email,
          role: response.data.role,
        };

        // userInfo 저장
        localStorage.setItem("userInfo", JSON.stringify(nextUserInfo));

        // 디버그 로그
        console.log("✅ 로그인 응답 raw:", response.data);
        console.log("✅ 응답 role:", response.data.role);
        console.log("✅ nextUserInfo(저장 예정):", nextUserInfo);
        console.log(
          "✅ LS accessToken exists?",
          !!localStorage.getItem("accessToken")
        );
        console.log(
          "✅ LS userInfo:",
          JSON.parse(localStorage.getItem("userInfo"))
        );
        console.log("✅ setUserInfo 호출 role:", nextUserInfo.role);

        // 상태 반영
        setIsLoggedIn(true);
        setUserInfo(nextUserInfo);

        // 홈으로 이동
        navigate("/");
        return;
      }

      // 응답은 왔는데 token이 없는 경우
      setErrorMessage(
        "로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요."
      );
    } catch (err) {
      console.error("❌ 로그인 에러:", err);
      if (err && err.response) {
        console.error("❌ 서버 응답:", err.response.data);
      }

      const status = err?.response?.status;
      const data = err?.response?.data || {};

      // 백엔드에서 어떤 필드명을 쓰든 대응 (reason 또는 code)
      const reason = data.reason || data.code;

      // 1) 없는 아이디
      if (status === 401 && reason === "NO_SUCH_USER") {
        setErrorMessage("존재하지 않는 아이디입니다.");
        return;
      }

      // 2) 비밀번호 오류
      if (status === 401 && reason === "BAD_PASSWORD") {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 4) 정지 계정
      if (status === 403 && reason === "SUSPENDED") {
        setErrorMessage(
          "정지된 계정입니다.\n자세한 내용은 관리자에게 문의해 주세요."
        );
        return;
      }

      // 5) 기타 서버 에러
      setErrorMessage(
        "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "82vh",
        background: "#EFEDE7",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          opacity: 0.55,
          marginBottom: "20px",
        }}
      >
        access your daily log
      </div>

      <h1
        style={{
          fontSize: "22px",
          fontWeight: 400,
          letterSpacing: "0.8px",
          marginBottom: "30px",
          color: "#333",
        }}
      >
        로그인
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "360px",
          background: "#F7F6F2",
          border: "1px solid rgba(0,0,0,0.08)",
          padding: "35px 30px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          // ❌ 여기에는 textAlign/whiteSpace 빼고
        }}
      >
        {errorMessage && (
          <p
            style={{
              color: "#b33a3a",
              fontSize: "14px",
              whiteSpace: "pre-line", // \n 줄바꿈
              textAlign: "center",    // 가운데 정렬
            }}
          >
            {errorMessage}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="username"
            style={{
              fontSize: "13px",
              opacity: 0.7,
              letterSpacing: "0.5px",
            }}
          >
            아이디
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#F5F4EF",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="password"
            style={{
              fontSize: "13px",
              opacity: 0.7,
              letterSpacing: "0.5px",
            }}
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#F5F4EF",
              fontSize: "15px",
              letterSpacing: "0.3px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#333",
            color: "white",
            border: "none",
            fontSize: "15px",
            letterSpacing: "0.5px",
            cursor: "pointer",
          }}
        >
          로그인
        </button>

        <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#444",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          계정이 없으신가요?
          <span
            onClick={() => navigate("/register")}
            style={{
              cursor: "pointer",
              marginLeft: "5px",
              textDecoration: "underline",
              opacity: 0.9,
            }}
          >
            회원가입
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
