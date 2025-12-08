import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import SideBar from "./component/main/SideBar";
import TopNavi from "./component/main/TopNavi";

import Login from "./component/login/Login";
import Register from "./component/register/Register";
import MainFrame from "./component/main/MainFrame";
import Profile from './component/profile/Profile';

import { useTodo } from "./component/todo/TodoData";
import ProtectedRoute from "./pages/ProtectRoute";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 한 상태 
  const [userInfo, setUserInfo] = useState({});  // 로그인한 사용자 정보 상태 관리
  const { todo, onCreate, onUpdate, onDelete } = useTodo(); // todoList 자료 불러오기 
  

  return (
    <BrowserRouter>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <TopNavi isLoggedIn={isLoggedIn} /> {/* 로그인 상태에 따라 메뉴 보여주기 */}

        <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <SideBar isLoggedIn={isLoggedIn} /> {/* 로그인 상태에 따라 사이드바 메뉴 보여주기 */}

          <section style={{ flexGrow: 1, overflowY: "auto", background: "#fafafa" }}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<MainFrame activeId="home" />} />
              {/* <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> */}
              <Route 
                path="/login" 
                element={<Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />} 
              />
              <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />

              {/* PRIVATE ROUTES */}
              <Route
                path="/todo"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <MainFrame
                      activeId="todo"
                      todo={todo}
                      onCreate={onCreate}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
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
                      userInfo={userInfo}   // userInfo를 Profile로 전달
                      setUserInfo={setUserInfo}  // setUserInfo를 Profile로 전달
                    />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </section>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
