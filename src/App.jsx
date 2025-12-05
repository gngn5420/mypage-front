import { useState } from 'react';
import SideBar from './component/main/SideBar';
import TopNavi from './component/main/TopNavi'
import Register from "./component/register/Register";
import Login from './component/login/Login'
import MainFrame from './component/main/MainFrame';
import { useTodo } from './component/todo/TodoData'

const App = () => {
    const [activeItem, setActiveItem] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [showAuth, setShowAuth] = useState(false); 
    const { todo, onCreate, onUpdate, onDelete } = useTodo();

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column'
        }}>

            {/* 상단 네비 */}
            <TopNavi
                setShowAuth={setShowAuth}
                setAuthMode={setAuthMode}
                setActiveItem={setActiveItem}   // 🔥 추가
            />

            {/* Sidebar + main */}
            <div style={{
                display: 'flex',
                flexGrow: 1,
                overflow: 'hidden'
            }}>

                <SideBar
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    setShowAuth={setShowAuth}   // 이거 실제로 들어가 있어야 함
                />

                <section style={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    backgroundColor: '#fafafa'
                }}>
                    {
                        showAuth
                            ? (
                                authMode === "login"
                                    ? <Login
                                        setIsLoggedIn={setIsLoggedIn}
                                        setAuthMode={setAuthMode}
                                        setShowAuth={setShowAuth}
                                    />
                                    : <Register
                                        setIsLoggedIn={setIsLoggedIn}
                                        setAuthMode={setAuthMode}
                                        setShowAuth={setShowAuth}
                                    />
                            )
                            : <MainFrame activeId={activeItem}
                                todo={todo}
                                onCreate={onCreate}
                                onUpdate={onUpdate}
                                onDelete={onDelete} />}
                </section>
            </div>
        </div>
    );
};

export default App;


