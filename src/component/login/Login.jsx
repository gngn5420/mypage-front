import { useState } from "react";

const LoginScreen = ({ setIsLoggedIn, setAuthMode, setShowAuth }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!username || !password) {
            setErrorMessage("아이디와 비밀번호를 모두 입력해 주세요.");
            return;
        }

        // 로그인 성공 처리
        console.log("로그인 시도:", { username, password });
        setIsLoggedIn(true);
        setShowAuth(false); // 인증창 닫기
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f6f7f8",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <h1
                style={{
                    fontSize: "30px",
                    fontWeight: "800",
                    color: "#111",
                    marginBottom: "40px",
                }}
            >
                로그인
            </h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    width: "350px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {errorMessage && (
                    <p style={{ color: "#ef4444", fontSize: "14px" }}>
                        {errorMessage}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        padding: "14px",
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                        boxSizing: "border-box",
                    }}
                />

                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "14px",
                        width: "100%",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                        boxSizing: "border-box",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "#111",
                        color: "white",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                    }}
                >
                    로그인
                </button>

                <p
                    style={{
                        marginTop: "18px",
                        fontSize: "14px",
                        color: "#555",
                        textAlign: "center",
                    }}
                >
                    계정이 없으신가요?
                    <span
                        onClick={() => setAuthMode("register")}
                        style={{
                            cursor: "pointer",
                            color: "#111",
                            fontWeight: "600",
                            marginLeft: "4px",
                            textDecoration: "underline",
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
