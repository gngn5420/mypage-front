import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ isLoggedIn, userInfo = {}, setUserInfo }) => {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 로그인 UI와 동일한 input 스타일
    const inputStyle = {
        padding: "12px",
        border: "1px solid rgba(0,0,0,0.15)",
        background: "#F5F4EF",
        fontSize: "15px",
        letterSpacing: "0.3px",
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        setNickname(userInfo.nickname || "");
        setEmail(userInfo.email || "");
    }, [isLoggedIn, userInfo, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!password.trim()) {
            setErrorMessage("비밀번호를 입력해야 수정이 가능합니다.");
            return;
        }

        // 임시 저장 로직 (실 서버 연동 시 수정)
        setUserInfo({ nickname, email });

        alert("프로필이 수정되었습니다!");
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
            {/* 로그인과 동일한 상단 라벨 */}
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

            {/* 로그인과 동일한 제목 스타일 */}
            <h1
                style={{
                    fontSize: "22px",
                    fontWeight: 400,
                    letterSpacing: "0.8px",
                    marginBottom: "30px",
                    color: "#333",
                }}
            >
                프로필 관리
            </h1>

            {/* 로그인 UI의 form 박스와 완전히 동일한 구조 */}
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

                {/* 닉네임 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                        style={{
                            fontSize: "13px",
                            opacity: 0.7,
                            letterSpacing: "0.5px",
                        }}
                    >
                        닉네임
                    </label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* 이메일 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                        style={{
                            fontSize: "13px",
                            opacity: 0.7,
                            letterSpacing: "0.5px",
                        }}
                    >
                        이메일
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* 비밀번호 확인 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                        style={{
                            fontSize: "13px",
                            opacity: 0.7,
                            letterSpacing: "0.5px",
                        }}
                    >
                        현재 비밀번호
                    </label>
                    <input
                        type="password"
                        placeholder="변경 확인용 비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* 버튼 (로그인 UI 동일한 버튼 스타일) */}
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
                    변경사항 저장
                </button>
            </form>
        </div>
    );
};

export default Profile;
