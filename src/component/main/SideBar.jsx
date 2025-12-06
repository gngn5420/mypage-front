
// // 이 데이터 배열을 순회하며 메뉴 항목을 동적으로 생성합니다.
// const menuItems = [
//   { id: 'home', name: 'MAIN VIEW', year: '2026', subtitle: '메인 화면' },
//   { id: 'todo', name: 'TODO LIST', year: '2026', subtitle: '할 일 목록' },
//   { id: 'habit', name: 'HABIT TRACKER', year: '2026', subtitle: '습관 체크' },
//   { id: 'news', name: 'ECONOMY NEWS', year: '2026', subtitle: '경제 뉴스' },
// ];

// // 2. Sidebar 컴포넌트 (Logic & Structure) - 사용자 제공 코드를 기반으로 통합
// /**
//  * @param {string} activeItem 현재 활성화된 메뉴 항목 ID
//  * @param {function} setActiveItem 클릭 시 activeItem을 변경하는 함수
//  */
// const Sidebar = ({ activeItem, setActiveItem, setShowAuth }) => { 
//   return (
//     <nav style={{ 
//       width: '300px', 
//       borderRight: '1px solid #eee', 
//       padding: '30px', 
//       display: 'flex', 
//       flexDirection: 'column', 
//       flexShrink: 0, 
//       overflowY: 'auto',
//       height: '100%',
//       backgroundColor: '#f9f9f9'
//     }}>
//       <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: '10px' }}>
//         DAILY LOG
//       </h2>
//       <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//         {menuItems.map((item) => (
//           <li
//             key={item.id}
//             style={{
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'flex-start', 
//               padding: '10px 0', 
//               borderBottom: '1px dashed #eee', 
//               cursor: 'pointer',
//               backgroundColor: activeItem === item.id ? '#f0f0f0' : 'transparent',
//               fontWeight: activeItem === item.id ? 'bold' : 'normal',
//               borderRadius: '4px',
//               paddingLeft: '5px',
//               paddingRight: '5px',
//             }}
//             onClick={() => {
//               setActiveItem(item.id);
//               setShowAuth(false);  
//             }}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//               <span style={{ fontSize: '12px', width: '30px', color: '#666' }}>{item.year}</span>
//               <span style={{ fontSize: '16px', textTransform: 'uppercase' }}>{item.name}</span>
//             </div>
//             <span style={{ fontSize: '12px', color: '#999', paddingTop: '2px' }}>
//               {item.subtitle}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar

import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { id: "home", path: "/", name: "MAIN", year: "2026", subtitle: "메인 화면" },
  { id: "todo", path: "/todo", name: "TODO", year: "2026", subtitle: "할 일" },
  { id: "habit", path: "/habit", name: "HABIT", year: "2026", subtitle: "습관" },
  { id: "news", path: "/news", name: "NEWS", year: "2026", subtitle: "뉴스" },
  { id: "profile", path: "/profile", name: "MY PAGE", year: "2026", subtitle: "마이페이지" }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    // <nav style={{ width: "300px", borderRight: "1px solid #eee", padding: "30px" }}>
    //   <ul style={{ listStyle: "none", padding: 0 }}>
    //     {menuItems.map((item) => {
    //       const isActive = location.pathname === item.path;

    //       return (
    //         <li
    //           key={item.id}
    //           onClick={() => navigate(item.path)}
    //           style={{
    //             background: isActive ? "#f0f0f0" : "transparent",
    //             fontWeight: isActive ? "bold" : "normal",
    //             padding: "10px 0",
    //             borderBottom: "1px dashed #ccc",
    //             cursor: "pointer",
    //           }}
    //         >
    //           {item.name}
    //         </li>
    //       );
    //     })}
    //   </ul>
    // </nav>
<nav
  style={{
    width: "260px",
    padding: "50px 30px",
    borderRight: "1px solid rgba(0,0,0,0.06)",
    background: "#F8F7F4",
    height: "100vh",
  }}
>
  <div style={{
    fontSize: "12px",
    textTransform: "uppercase",
    opacity: 0.45,
    letterSpacing: "1.2px",
    marginBottom: "30px"
  }}>
    Daily Log
  </div>

  <ul style={{ listStyle: "none", padding: 0 }}>
    {menuItems.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <li
          key={item.id}
          onClick={() => navigate(item.path)}
          style={{
            padding: "14px 8px",
            cursor: "pointer",
            borderBottom: "1px dashed rgba(0,0,0,0.15)",
            opacity: isActive ? 1 : 0.55,
            letterSpacing: "0.5px",
            fontSize: "15px",
            transition: "0.2s",
          }}
        >
          <span>{item.name}</span>
          <div style={{
            fontSize: "11px",
            opacity: 0.5,
            marginTop: "2px"
          }}>{item.subtitle}</div>
        </li>
      );
    })}
  </ul>
</nav>


  );
};

export default Sidebar;
