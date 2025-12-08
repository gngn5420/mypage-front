import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import instance from "../../api/axios";

const Register = () => {
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setErrorMessage("");

    //     if (username.trim().length < 4) {
    //         setErrorMessage("아이디는 최소 4자 이상이어야 합니다.");
    //         return;
    //     }

    //     if (nickname.length < 2) {
    //         setErrorMessage("닉네임은 2자 이상 입력해야 합니다.");
    //         return;
    //     }

    //     if (password.length < 6) {
    //         setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
    //         return;
    //     }

    //     if (password !== confirmPassword) {
    //         setErrorMessage("비밀번호가 일치하지 않습니다.");
    //         return;
    //     }

    //     alert("회원가입이 완료되었습니다!");

    //     // 가입 후 로그인 페이지로 이동
    //     navigate("/login");
    // };

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // --- 회원가입 시 검증 로직, DB 연결 ---
    if (username.trim().length < 4) {
        setErrorMessage("아이디는 최소 4자 이상이어야 합니다.");
        return;
    }

    if (nickname.length < 2) {
        setErrorMessage("닉네임은 2자 이상 입력해야 합니다.");
        return;
    }

    if (password.length < 6) {
        setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
        return;
    }

    if (password !== confirmPassword) {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        return;
    }

    // --- 여기부터 실제 DB 저장 ---
    try {
        await instance.post("/api/user/register", {
            username,
            nickname,
            email,
            password
        });

        alert("회원가입이 완료되었습니다!");
        navigate("/login");

    } catch (err) {
        setErrorMessage("회원가입 과정에서 오류가 발생했습니다.");
    }
};


    // 로그인과 동일 input 스타일
    const inputStyle = {
        padding: "12px",
        border: "1px solid rgba(0,0,0,0.15)",
        background: "#F5F4EF",
        fontSize: "15px",
        letterSpacing: "0.3px",
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
            {/* 로그인 UI와 동일 */}
            <div
                style={{
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    opacity: 0.55,
                    marginBottom: "20px",
                }}
            >
                create your account
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
                회원가입
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
                    <p style={{ color: "#b33a3a", fontSize: "14px" }}>{errorMessage}</p>
                )}

                {/* 닉네임 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", opacity: 0.7 }}>닉네임</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임 (2자 이상)"
                        style={inputStyle}
                    />
                </div>

                {/* 아이디 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", opacity: 0.7 }}>아이디</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디 (4자 이상)"
                        style={inputStyle}
                    />
                </div>

                {/* 이메일 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", opacity: 0.7 }}>이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일"
                        style={inputStyle}
                    />
                </div>

                {/* 비밀번호 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", opacity: 0.7 }}>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 (6자 이상)"
                        style={inputStyle}
                    />
                </div>

                {/* 비밀번호 확인 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", opacity: 0.7 }}>비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호 확인"
                        style={inputStyle}
                    />
                </div>

                {/* 가입 버튼 */}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#333",
                        color: "white",
                        border: "none",
                        fontSize: "15px",
                        cursor: "pointer",
                        letterSpacing: "0.5px",
                    }}
                >
                    가입하기
                </button>

                {/* 로그인 이동 */}
                <p
                    style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#444",
                        textAlign: "center",
                        opacity: 0.8,
                    }}
                >
                    이미 계정이 있으신가요?
                    <span
                        onClick={() => navigate("/login")}
                        style={{
                            cursor: "pointer",
                            marginLeft: "5px",
                            textDecoration: "underline",
                            opacity: 0.9,
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
