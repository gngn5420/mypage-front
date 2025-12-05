import { useState } from "react";


const Register = ({ setIsLoggedIn, setAuthMode, setShowAuth }) => {
    const [username, Setusername] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        // 아이디 검사
        if (!username.trim()) {
            setErrorMessage("아이디를 입력해주세요.");
            return;
        }

        if (username.trim().length < 4) {
            setErrorMessage("아이디는 최소 4자 이상이어야 합니다.");
            return;
        }

        // 닉네임 검사
        if (nickname.length < 2) {
            setErrorMessage("닉네임은 2자 이상 입력해야 합니다.");
            return;
        }

        // 비밀번호 검사
        if (password.length < 6) {
            setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        console.log("회원가입 시도:", { nickname, email, password });

        // 회원가입 성공 시 → 로그인 화면으로 이동
        setAuthMode("login");
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
                회원가입
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
                    <p
                        style={{
                            color: "#ef4444",
                            fontSize: "14px",
                            marginBottom: "5px",
                        }}
                    >
                        {errorMessage}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="닉네임 (2자 이상)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    style={{
                        padding: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                        boxSizing: "border-box",
                    }}
                />

                <input
                    type="text"
                    placeholder="아이디"
                    value={nickname}
                    onChange={(e) => Setusername(e.target.value)}
                    style={{
                        padding: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                        boxSizing: "border-box",
                    }}
                />

                <input
                    type="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                        boxSizing: "border-box",
                    }}
                />

                <input
                    type="password"
                    placeholder="비밀번호 (최소 6자)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                        boxSizing: "border-box",
                    }}
                />

                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                        padding: "14px",
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
                        marginTop: "8px",
                        transition: "opacity 0.2s",
                    }}
                >
                    가입하기
                </button>

                <p
                    style={{
                        marginTop: "18px",
                        fontSize: "14px",
                        color: "#555",
                        textAlign: "center",
                    }}
                >
                    이미 계정이 있으신가요?
                    <span
                        onClick={() => setAuthMode("login")}
                        style={{
                            cursor: "pointer",
                            color: "#111",
                            fontWeight: "600",
                            marginLeft: "4px",
                            textDecoration: "underline",
                        }}
                    >
                        로그인
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;
