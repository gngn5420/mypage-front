import { useState, useEffect } from "react";

const Profile = ({ isLoggedIn, userInfo, setUserInfo, setShowAuth, setAuthMode }) => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!isLoggedIn) {
            setAuthMode("login");
            setShowAuth(true);
            return;
        }

        if (userInfo) {
            setNickname(userInfo.nickname || "");
            setEmail(userInfo.email || "");
        }
    }, [isLoggedIn, userInfo, setShowAuth, setAuthMode]);

    const handleSave = (e) => {
        e.preventDefault();
        setErrorMessage("");

        // 비밀번호 확인
        if (!currentPassword.trim()) {
            setErrorMessage("변경사항을 저장하려면 현재 비밀번호를 입력해야 합니다.");
            return;
        }

        // 실제 업데이트는 API로 보내야 하지만 지금은 프론트 상태 변경만 수행
        setUserInfo(prev => ({
            ...prev,
            nickname,
            email
        }));

        alert("프로필이 수정되었습니다!");
        setCurrentPassword("");
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
                프로필 관리
            </h1>

            <form
                onSubmit={handleSave}
                style={{
                    width: "350px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {errorMessage && (
                    <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "5px" }}>
                        {errorMessage}
                    </p>
                )}

                {/* 닉네임 */}
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    style={{
                        padding: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                    }}
                />

                {/* 이메일 */}
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                    }}
                />

                {/* 현재 비밀번호 */}
                <input
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                        padding: "14px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        fontSize: "15px",
                        backgroundColor: "#f1f5fd",
                    }}
                />

                {/* 저장 버튼 */}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "#111",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginTop: "8px",
                        transition: "opacity 0.2s",
                    }}
                >
                    변경사항 저장
                </button>
            </form>
        </div>
    );
};

export default Profile;
