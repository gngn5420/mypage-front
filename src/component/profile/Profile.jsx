import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";

const Profile = ({ isLoggedIn, userInfo = {}, setUserInfo, onLogout }) => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");       // 새 비밀번호 (선택)
  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호 (필수)

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // 공통 인풋 스타일
  const inputStyle = {
    padding: "12px",
    border: "1px solid rgba(0,0,0,0.15)",
    background: "#F5F4EF",
    fontSize: "15px",
    letterSpacing: "0.3px",
    width: "100%",
    boxSizing: "border-box",
  };

  // 회원 탈퇴
  const handleWithdraw = async () => {
    const ok = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n탈퇴 후에는 계정을 다시 사용할 수 없습니다."
    );
    if (!ok) return;

    try {
      await instance.post("/api/user/withdraw");

      // 공통 로그아웃 로직
      if (onLogout) onLogout();

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/"); // 홈으로 이동
    } catch (e) {
      console.error("회원탈퇴 오류:", e);
      alert("회원탈퇴 처리 중 문제가 발생했습니다.");
    }
  };

  // 초기 값 세팅
  useEffect(() => {
    if (!isLoggedIn) {
      // 로그인 안 된 상태면 그냥 리턴
      return;
    }
    setNickname(userInfo.nickname || "");
    setEmail(userInfo.email || "");
  }, [isLoggedIn, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // 현재 비밀번호는 항상 필수
    if (!currentPassword.trim()) {
      setErrorMessage("현재 비밀번호를 입력해야 수정이 가능합니다.");
      return;
    }

    // TODO: 실제 서버에 프로필 수정 + 비밀번호 변경 API 연동
    // 지금은 UI 동작만 유지하기 위해 로컬 userInfo만 갱신
    setUserInfo({
      ...userInfo,
      nickname,
      email,
      // 비밀번호는 서버에서만 관리 → 프론트 userInfo에는 보통 안 넣음
    });

    // 새 비밀번호는 선택 항목이라 비워져 있으면 그냥 통과
    // 실제 API 연동 시:
    // if (newPassword.trim()) { /api/user/password 호출 }

    alert("프로필이 수정되었습니다!");

    // 입력값 정리 (비밀번호들은 화면에서 비워두는 게 안전함)
    setNewPassword("");
    setCurrentPassword("");
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
        프로필 관리
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
        {/* 안내 문구 */}
        <p style={{ fontSize: "13px", color: "#b33a3a", marginTop: 0 }}>
          프로필을 수정하려면 마지막에 현재 비밀번호를 입력해야 합니다.
        </p>

        {errorMessage && (
          <p style={{ color: "#b33a3a", fontSize: "14px", whiteSpace: "pre-line" }}>
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

        {/* 새 비밀번호 (선택) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{
              fontSize: "13px",
              opacity: 0.7,
              letterSpacing: "0.5px",
            }}
          >
            새 비밀번호 (선택)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="변경할 새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "50px" }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "12px",
                opacity: 0.7,
              }}
            >
              {showNewPassword ? "숨기기" : "보기"}
            </button>
          </div>
        </div>

        {/* 현재 비밀번호 (필수) */}
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
          <div style={{ position: "relative" }}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="현재 비밀번호를 입력해주세요"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "50px" }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "12px",
                opacity: 0.7,
              }}
            >
              {showCurrentPassword ? "숨기기" : "보기"}
            </button>
          </div>
        </div>

        {/* 변경사항 저장 버튼 */}
        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "20px",
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

        {/* 회원 탈퇴 */}
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid rgba(0,0,0,0.2)",
            paddingTop: "30px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={handleWithdraw}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid rgba(200,0,0,0.6)",
              background: "transparent",
              color: "#b00000",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            회원 탈퇴
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
