import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ isLoggedIn, userInfo, setUserInfo }) => {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 로그인 안 했으면 로그인 페이지로 이동
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        // 로그인한 사용자 정보가 이미 있다면 UI에 반영
        if (userInfo) {
            setNickname(userInfo.nickname || "");
            setEmail(userInfo.email || "");
        } else {
            // 서버에서 사용자 정보 가져오기 (예: /api/me)
            fetch("/api/user/me", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUserInfo(data);
                    setNickname(data.nickname);
                    setEmail(data.email);
                })
                .catch(() => {
                    navigate("/login");
                });
        }
    }, [isLoggedIn, userInfo, navigate, setUserInfo]);

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!currentPassword.trim()) {
            setErrorMessage("비밀번호를 입력해야 수정이 가능합니다.");
            return;
        }

        // DB 업데이트 API 호출 (예시)
        const response = await fetch("/api/user/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                nickname,
                email,
                currentPassword
            })
        });

        const result = await response.json();

        if (!response.ok) {
            setErrorMessage(result.message || "업데이트 중 문제가 발생했습니다");
            return;
        }

        // 프론트 상태 업데이트
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
                    }}
                >
                    변경사항 저장
                </button>
            </form>
        </div>
    );
};

export default Profile;
