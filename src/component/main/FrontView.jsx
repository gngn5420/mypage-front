import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const FrontView = () => {
    // === 상태 관리 ===
    // isExpanded: 원형이 화면 전체로 확장되었는지 여부 (배경 전환 상태)
    const [isExpanded, setIsExpanded] = useState(false);
    // showLogin: 로그인 폼을 표시할지 여부 (폼 요소 등장 상태)
    const [showLogin, setShowLogin] = useState(false);
    // isAnimating: 현재 애니메이션 중인지 여부 (다중 클릭 방지)
    const [isAnimating, setIsAnimating] = useState(false);

    // === 애니메이션 상수 (HTML/CSS 로직 기반) ===
    const TRANSITION_DURATION = 1200; // 원 확장 애니메이션 시간 (1.2s)
    const LOGIN_APPEAR_DELAY = 600; // 원이 커지는 중간에 로그인 폼 표시 시작 (0.6s)
    const SHRINK_DELAY = 300; // 로그인 폼이 사라진 후 원이 축소되기 시작하는 딜레이
    const SHRINK_DURATION = 800; // 축소 애니메이션 완료 시간 (텍스트 복원 딜레이에 사용)

    // === 폰트 로딩 강화 (useEffect를 사용하여 <head>에 <link> 태그 직접 삽입) ===
    useEffect(() => {
        const fontUrls = [
            'https://cdn.tailwindcss.com', // Tailwind CSS CDN을 안정적으로 로드
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'
        ];

        fontUrls.forEach(url => {
            // 이미 링크가 존재하면 중복 추가를 방지합니다.
            if (document.querySelector(`link[href="${url}"]`) || document.querySelector(`script[src="${url}"]`)) {
                return;
            }

            if (url.endsWith('.js')) {
                 const script = document.createElement('script');
                 script.src = url;
                 document.head.appendChild(script);
            } else {
                const link = document.createElement('link');
                link.href = url;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        });
    }, []);

    // === 이벤트 핸들러: 랜딩 페이지 클릭 ===
    const handleLandingClick = () => {
        if (isAnimating || isExpanded) return;
        
        setIsAnimating(true);
        setIsExpanded(true); // 원 확장 시작
        
        // LOGIN_APPEAR_DELAY 후 로그인 폼 표시 시작
        setTimeout(() => {
            setShowLogin(true);
        }, LOGIN_APPEAR_DELAY);

        // TRANSITION_DURATION (1.2s) 후 애니메이션 상태 해제
        setTimeout(() => {
            setIsAnimating(false);
        }, TRANSITION_DURATION);
    };

    // === 이벤트 핸들러: 뒤로 가기 클릭 ===
    const handleBackClick = () => {
        if (isAnimating || !isExpanded) return;

        setIsAnimating(true);
        setShowLogin(false); // 로그인 폼 숨김 (즉시)

        // SHRINK_DELAY 후 원 축소 시작
        setTimeout(() => {
            setIsExpanded(false); // 원 축소
            
            // 축소 애니메이션이 끝난 후 상태 초기화
            setTimeout(() => {
                setIsAnimating(false);
            }, SHRINK_DURATION); 
        }, SHRINK_DELAY);
    };

    return (
        <div className="relative w-full h-screen bg-white text-black overflow-hidden font-sans">
            {/* 커스텀 CSS 정의 */}
            <style>{`
                /* CSS 변수 */
                :root {
                    --color-mellow-yellow: #FFB82E;
                    --color-mellow-dark: #000000;
                }
                
                /* 폰트 설정 */
                .font-inter {
                    font-family: 'Inter', sans-serif;
                }
                .serif-font {
                    font-family: 'Playfair Display', serif;
                }

                /* 원형 확대 애니메이션 */
                .expand-circle-active {
                    transform: translate(-50%, -50%) scale(100); 
                    transition: transform ${TRANSITION_DURATION}ms cubic-bezier(0.66, 0.00, 0.20, 1.00); 
                }
                
                /* 원형 축소 애니메이션 */
                .expand-circle-shrink {
                    transform: translate(-50%, -50%) scale(1);
                    transition: transform 500ms ease-out;
                }

                /* 초기 로그인 폼 상태를 제어하기 위한 Tailwind 오버라이드 */
                .login-form-initial {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                }
            `}</style>

            {/* 중앙 노란색 원 (애니메이션 주체) */}
            <div 
                id="yellow-circle" 
                className={`
                    fixed top-1/2 left-1/2 
                    w-[300px] h-[300px] md:w-[500px] md:h-[500px] 
                    rounded-full bg-[#FFB82E] will-change-transform z-30
                    ${isExpanded ? 'expand-circle-active' : 'expand-circle-shrink'}
                `}
            ></div>

            {/* === 메인 랜딩 페이지 영역 === */}
            <div 
                id="landing-page" 
                onClick={handleLandingClick}
                className={`
                    relative w-full h-full group z-50 transition-opacity duration-300
                    ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer pointer-events-auto'}
                `} 
            >
                
                {/* 상단 네비게이션 (오른쪽) */}
                <nav className="absolute top-8 right-8 z-20 text-right font-bold text-lg md:text-xl p-4 md:p-8">
                    <a href="#" className="block hover:underline">Works</a>
                    <a href="#" className="block mt-1 hover:underline">Contact</a>
                </nav>

                {/* 상단 텍스트 콘텐츠 (2단 레이아웃) */}
                <div className="absolute top-8 left-8 md:top-16 md:left-16 z-20 max-w-6xl flex flex-col md:flex-row gap-8 md:gap-16 p-4 md:p-8">
                    <div className="flex-1">
                        <p className="serif-font text-xl md:text-2xl leading-tight font-semibold">
                            Mellow Yellow is a creative studio and advertising agency with a special approach to design, centered around powerful visual experiences with warm, impactful colours.
                        </p>
                    </div>
                    <div className="flex-1">
                        <p className="serif-font text-xl md:text-2xl leading-tight font-semibold">
                            We work in any medium, ranging from industrial to web design, but our mission remains constant: to avoid depressing hues from the cold side of the palette at all costs.
                        </p>
                    </div>
                </div>

                {/* 하단 거대 타이포그래피 */}
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 z-40 pointer-events-none">
                    <h1 className="text-[12vw] leading-none font-extrabold tracking-tighter text-center md:text-left mix-blend-multiply">
                        Mellow Yellow
                    </h1>
                </div>
                
                {/* 클릭 유도 힌트 */}
                <div className="absolute bottom-10 right-10 z-20 text-sm animate-bounce opacity-50">
                    Click anywhere to enter
                </div>
            </div>

            {/* === 로그인 페이지 섹션 (isExpanded 상태일 때만 표시 가능) === */}
            <div 
                id="login-section" 
                className={`
                    absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300
                    ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}
                `}
            >
                {/* 로그인 폼 카드 (showLogin 상태에 따라 부드럽게 등장) */}
                <div 
                    className={`
                        w-full max-w-md p-8
                        ${showLogin ? 'opacity-100 translate-y-0' : 'login-form-initial'}
                    `}
                >
                    
                    {/* 상단 Login 텍스트 및 뒤로 가기 버튼 */}
                    <div className="absolute top-8 w-full text-center">
                        <button 
                            onClick={handleBackClick} 
                            className="absolute left-8 top-8 text-black/70 hover:text-black/90 transition-colors font-bold flex items-center p-2 rounded-full hover:bg-black/5"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            <span className="text-sm tracking-wider uppercase">Back</span>
                        </button>
                        <h2 className="text-2xl font-bold tracking-widest text-black/80 uppercase">Login</h2>
                    </div>

                    <div className="text-center mb-10 mt-16">
                        <h1 className="text-5xl font-extrabold mb-2 tracking-tighter">Welcome Back.</h1>
                        <p className="text-black/60 serif-font italic">Please enter your details.</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="hello@mellowyellow.com" 
                                className="w-full bg-transparent border-b-2 border-black/20 py-3 text-xl focus:outline-none focus:border-black transition-colors placeholder-black/30"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold uppercase tracking-wider">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="••••••••" 
                                className="w-full bg-transparent border-b-2 border-black/20 py-3 text-xl focus:outline-none focus:border-black transition-colors placeholder-black/30"
                            />
                        </div>

                        <button type="submit" className="w-full bg-black text-[#FFB82E] font-bold text-xl py-4 rounded-full mt-8 hover:bg-gray-900 hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer">
                            Sign In
                        </button>
                    </form>
                    
                    {/* HTML의 "Back to Home" 버튼의 대체 (handleBackClick으로 연결) */}
                    <div className="mt-8 text-center">
                        <button onClick={handleBackClick} className="text-sm underline hover:text-black/60 cursor-pointer">
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrontView;