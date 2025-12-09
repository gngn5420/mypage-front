import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";

const LoginScreen = ({ setIsLoggedIn, setUserInfo }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");  // 에러 메시지 초기화

        if (!username || !password) {
            setErrorMessage("아이디와 비밀번호를 모두 입력해 주세요.");
            return;
        }

        try {
            const response = await instance.post("/api/user/login", {
                username,
                password,
            });

            if (response.data && response.data.token) {
                const token = response.data.token;
                console.log("token", token)
                localStorage.setItem("accessToken", token);  // 로그인 시 토큰 저장

                console.log("로그인 응답:", response.data);

                // 로그인 후 상태 변경
                setIsLoggedIn(true);
                setUserInfo({
                    username: response.data.username,
                    nickname: response.data.nickname,
                    email: response.data.email,
                });

                navigate("/");  // 프로필 페이지로 이동
            } else {
                setErrorMessage("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요.");
            }
        } catch (err) {
            setErrorMessage("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요.");
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
                }}
            >
                {errorMessage && (
                    <p style={{ color: "#b33a3a", fontSize: "14px" }}>
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


                {/* <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                </div> */}

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
