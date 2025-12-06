// import { useNavigate } from "react-router-dom";

// const TopNavi = ({ isLoggedIn }) => {
//   const navigate = useNavigate();

//   return (
//     <header
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "15px 30px",
//         borderBottom: "1px solid #eee"
//       }}
//     >
//       <h1 
//         style={{ cursor: "pointer" }}
//         onClick={() => navigate("/")}
//       >
//         MY DAILY LIFE
//       </h1>

//       <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
        
//         {isLoggedIn ? (
//           <>
//             {/* 로그인 O */}
//             <span 
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate("/profile")}
//             >
//               PROFILE
//             </span>

//             <span
//               style={{ cursor: "pointer" }}
//               onClick={() => {
//                 // 실제 로그아웃은 로컬스토리지와 상태 초기화
//                 localStorage.removeItem("token");
//                 navigate("/login");
//                 window.location.reload(); // 임시 초기화
//               }}
//             >
//               LOGOUT
//             </span>
//           </>
//         ) : (
//           <>
//             {/* 로그인 X */}
//             <span 
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate("/login")}
//             >
//               LOGIN
//             </span>

//             <span 
//               style={{ cursor: "pointer" }}
//               onClick={() => navigate("/register")}
//             >
//               REGISTER
//             </span>
//           </>
//         )}

//       </div>
//     </header>
//   );
// };

// export default TopNavi;

import { useNavigate } from "react-router-dom";

const TopNavi = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "25px 40px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "#F8F7F4",
        letterSpacing: "0.5px"
      }}
    >
      {/* 다이어리 표지 느낌의 타이틀 */}
      <h1
        style={{
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 400,
          opacity: 0.85,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
        onClick={() => navigate("/")}
      >
        My Daily Life
      </h1>

      <div
        style={{
          display: "flex",
          gap: "18px",
          fontSize: "14px",
          opacity: 0.75
        }}
      >
        {isLoggedIn ? (
          <>
            {/* 로그인한 경우 */}
            <span
              style={{
                cursor: "pointer",
                letterSpacing: "0.5px"
              }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </span>

            <span
              style={{
                cursor: "pointer",
                letterSpacing: "0.5px"
              }}
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
                window.location.reload(); 
              }}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            {/* 로그인하지 않았을 경우 */}
            <span
              style={{
                cursor: "pointer",
                letterSpacing: "0.5px"
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>

            <span
              style={{
                cursor: "pointer",
                letterSpacing: "0.5px"
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </>
        )}
      </div>
    </header>
  );
};

export default TopNavi;
