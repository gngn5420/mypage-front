import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginScreen = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!username || !password) {
            setErrorMessage("아이디와 비밀번호를 모두 입력해 주세요.");
            return;
        }

        setIsLoggedIn(true);

        // 로그인 성공 → 메인 페이지로 이동
        navigate("/");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
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
                }}
            >
                {errorMessage && (
                    <p style={{ color: "#b33a3a", fontSize: "14px" }}>
                        {errorMessage}
                    </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                        style={{
                            fontSize: "13px",
                            opacity: 0.7,
                            letterSpacing: "0.5px",
                        }}
                    >
                        아이디
                    </label>
                    <input
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
                        style={{
                            fontSize: "13px",
                            opacity: 0.7,
                            letterSpacing: "0.5px",
                        }}
                    >
                        비밀번호
                    </label>
                    <input
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

export default LoginScreen;
