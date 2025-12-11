import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import SideBar from "./component/main/SideBar";
import TopNavi from "./component/main/TopNavi";

import Login from "./component/login/Login";
import Register from "./component/register/Register";
import MainFrame from "./component/main/MainFrame";
import Profile from "./component/profile/Profile";

import ProtectedRoute from "./pages/ProtectRoute";
import NotFound from "./pages/NotFound";

// import AdminPage from "./pages/Adminpage";
import Admin from "./component/admin/Admin";
import AdminRoute from "./pages/AdminRoute";


const App = () => {
  // ✅ 변경 1) 초기 로그인 상태를 localStorage 기반으로 복원 
  // 즉, 홈으로 돌아오거나 새로고침해도 토큰이 남아 있는 한 “로그인 상태 유지”처럼 동작.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });

  // ✅ 변경 2) userInfo도 localStorage 기반으로 복원 -> 저장되어있던 사용자 정보로 시작됨. 
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : {
    };
  });

  return (
    <BrowserRouter>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <TopNavi 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUserInfo={setUserInfo} />
        
        <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <SideBar 
          isLoggedIn={isLoggedIn} 
          userInfo={userInfo} />
          
          <section style={{ flexGrow: 1, overflowY: "auto", background: "#fafafa" }}>
            <Routes>
              {/* PUBLIC ROUTES----------------------- */}
              <Route path="/" element={<MainFrame activeId="home" />} />

              <Route
                path="/login"
                element={
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setUserInfo={setUserInfo}
                  />
                }
              />

              <Route
                path="/register"
                element={<Register setIsLoggedIn={setIsLoggedIn} />}
              />

              {/* PRIVATE ROUTES ----------------------- */}
              <Route
                path="/todo"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <MainFrame activeId="todo" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/habit"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <MainFrame activeId="habit" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/news"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <MainFrame activeId="news" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      isLoggedIn={isLoggedIn}
                      userInfo={userInfo}
                      setUserInfo={setUserInfo}
                    />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route
                path="/admin"
                element={
                  <AdminRoute isLoggedIn={isLoggedIn} userInfo={userInfo}>
                    <Admin />
                  </AdminRoute>
                }
              />
            </Routes>
          </section>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
