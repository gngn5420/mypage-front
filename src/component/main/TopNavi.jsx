import React from 'react';

const TopNavi = ({ isLoggedIn, setShowAuth, setAuthMode, setActiveItem }) => {
    return (
        <header 
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '15px 30px', 
                borderBottom: '1px solid #eee', 
                flexShrink: 0,
                backgroundColor: '#fff' 
            }}
        >

            {/* 로고 */}
            <h1 
                style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => {
                    setShowAuth(false);
                    setActiveItem('home');
                }}
            >
                MY DAILY LIFE
            </h1>

            {/* 오른쪽 메뉴 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px' }}>
                
                {/* 로그인 X → LOGIN / REGISTER */}
                {!isLoggedIn ? (
                    <>
                        <span
                            style={{ color: '#333', cursor: 'pointer' }}
                            onClick={() => {
                                setAuthMode("login");
                                setShowAuth(true);
                            }}
                        >
                            LOGIN
                        </span>

                        <span
                            style={{ color: '#333', cursor: 'pointer' }}
                            onClick={() => {
                                setAuthMode("register");
                                setShowAuth(true);
                            }}
                        >
                            REGISTER
                        </span>
                    </>
                ) : (
                    <>
                        {/* 로그인 O → PROFILE / LOGOUT */}
                        <span
                            style={{ color: '#333', cursor: 'pointer' }}
                            onClick={() => setActiveItem("profile")}
                        >
                            PROFILE
                        </span>

                        <span
                            style={{ color: '#333', cursor: 'pointer' }}
                            onClick={() => {
                                setShowAuth(false);
                                setAuthMode("login");
                                setActiveItem("home");
                            }}
                        >
                            LOGOUT
                        </span>
                    </>
                )}
            </div>

        </header>
    );
};

export default TopNavi;
