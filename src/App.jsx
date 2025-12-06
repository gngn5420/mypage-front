import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import SideBar from "./component/main/SideBar";
import TopNavi from "./component/main/TopNavi";

import Login from "./component/login/Login";
import Register from "./component/register/Register";
import MainFrame from "./component/main/MainFrame";
import Profile from './pages/Profile';

import { useTodo } from "./component/todo/TodoData";
import ProtectedRoute from "./pages/ProtectRoute";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 한 상태 
  const { todo, onCreate, onUpdate, onDelete } = useTodo(); // todoList 자료 불러오기 

  return (
    <BrowserRouter>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <TopNavi isLoggedIn={isLoggedIn} />

        <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <SideBar isLoggedIn={isLoggedIn} />

          <section style={{ flexGrow: 1, overflowY: "auto", background: "#fafafa" }}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<MainFrame activeId="home" />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
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
                      userInfo={{ email: "test@test.com", nickname: "홍길동" }} // 임시
                      setUserInfo={() => {}}
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
