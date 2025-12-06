// // import TodoList from "../todo/TodoList";
// // import HabitTracker from "../habit/HabitTracker";
// // import EconomyNews from "../news/EconomyNews";

// // const PlaceholderComponent = ({ title, description, children }) => (
// //   <div style={{ padding: "40px", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
// //     <h2 style={{ fontSize: "28px", marginBottom: "10px", color: "#333" }}>
// //       {title}
// //     </h2>

// //     <div
// //       style={{
// //         width: "100%",
// //         borderBottom: "2px solid #ddd",
// //         marginBottom: "20px",
// //       }}
// //     />

// //     <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6", marginBottom: "30px" }}>
// //       {description}
// //     </p>

// //     {/* 실제 콘텐츠 */}
// //     <div style={{ width: "100%" }}>{children}</div>
// //   </div>
// // );

// // const MainFrame = ({ activeId, todo, onCreate, onUpdate, onDelete }) => {
// //   // 페이지별 타이틀 + 설명
// //   const contentMap = {
// //     todo: {
// //       title: "Todo List",
// //       description: "오늘 해야 할 일을 등록하고 관리하세요.",
// //       component: (
// //         <TodoList
// //           todo={todo}
// //           onCreate={onCreate}
// //           onUpdate={onUpdate}
// //           onDelete={onDelete}
// //         />
// //       ),
// //     },
// //     habit: {
// //       title: "Habit Tracker",
// //       description: "꾸준함을 만들어주는 습관 체크 페이지입니다.",
// //       component: <HabitTracker />,
// //     },
// //     news: {
// //       title: "Economy News Summary",
// //       description: "매일 경제 지식을 더해보세요.",
// //       // component: <EconomyNews />,
// //       component: 
// //       <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
// //           <EconomyNews />
// //       </div>
// //     },
// //     profile: {
// //       title: "My Profile",
// //       description: "사용자 정보 및 설정을 관리하세요.",
// //       component: <div>Profile Page</div>,
// //     },
// //   };



// //   // HOME 처리
// //   if (activeId === "home") {
// //     return (
// //       <div
// //         style={{
// //           height: "100%",
// //           width: "100%",
// //           backgroundImage: "url('/src/assets/03.jpg')",
// //           backgroundSize: "cover",
// //           backgroundPosition: "center",
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //         }}
// //       />
// //     );
// //   }


// //   // contentMap에서 선택
// //   const selected = contentMap[activeId];
// //   if (!selected) return null;

// //   return (
// //     <PlaceholderComponent title={selected.title} description={selected.description}>
// //       {selected.component}
// //     </PlaceholderComponent>
// //   );
// // };

// // export default MainFrame;

// import TodoList from "../todo/TodoList";
// import HabitTracker from "../habit/HabitTracker";
// import EconomyNews from "../news/EconomyNews";

// /* 공통 배경 래퍼 */
// const ContentWrapper = ({ children }) => (
//   <div
//     style={{
//       width: "100%",
//       minHeight: "100%",
//       backgroundColor: "#F7F6F2", // ⭐ 다이어리 톤 배경
//       padding: "50px 0",         // 자연스러운 위아래 여백
//       boxSizing: "border-box",
//     }}
//   >
//     {children}
//   </div>
// );

// const PlaceholderComponent = ({ title, description, children }) => (
//   <div
//     style={{
//       width: "100%",
//       maxWidth: "900px",
//       margin: "0 auto",
//       padding: "20px 30px", // 자연스러운 여백만 유지
//       boxSizing: "border-box",

//       // 박스 UI 요소 제거
//       backgroundColor: "transparent",
//       border: "none",
//       boxShadow: "none",
//     }}
//   >
//     <h2 style={{ fontSize: "28px", marginBottom: "10px", color: "#333" }}>
//       {title}
//     </h2>

//     <div
//       style={{
//         width: "100%",
//         borderBottom: "1px solid #ccc",
//         marginBottom: "20px",
//       }}
//     />

//     <p
//       style={{
//         fontSize: "16px",
//         color: "#555",
//         lineHeight: "1.6",
//         marginBottom: "30px",
//       }}
//     >
//       {description}
//     </p>

//     <div style={{ width: "100%" }}>{children}</div>
//   </div>
// );


// const MainFrame = ({ activeId, todo, onCreate, onUpdate, onDelete }) => {
//   // 페이지별 타이틀 + 설명
//   const contentMap = {
//     todo: {
//       title: "Todo List",
//       description: "오늘 해야 할 일을 등록하고 관리하세요.",
//       component: (
//         <TodoList
//           todo={todo}
//           onCreate={onCreate}
//           onUpdate={onUpdate}
//           onDelete={onDelete}
//         />
//       ),
//     },
//     habit: {
//       title: "Habit Tracker",
//       description: "꾸준함을 만들어주는 습관 체크 페이지입니다.",
//       component: <HabitTracker />,
//     },
//     news: {
//       title: "Economy News Summary",
//       description: "매일 경제 지식을 더해보세요.",
//       component: (
//         <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
//           <EconomyNews />
//         </div>
//       ),
//     },
//     profile: {
//       title: "My Profile",
//       description: "사용자 정보 및 설정을 관리하세요.",
//       component: <div>Profile Page</div>,
//     },
//   };

//   // HOME 페이지 제외 → 별도 배경 처리 없음
//   if (activeId === "home") {
//     return (
//       <div
//         style={{
//           height: "100%",
//           width: "100%",
//           backgroundImage: "url('/src/assets/03.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       />
//     );
//   }

//   const selected = contentMap[activeId];
//   if (!selected) return null;

//   // ⭐️ HOME 제외 모든 페이지 배경은 ContentWrapper가 통일
//   return (
//     <ContentWrapper>
//       <PlaceholderComponent
//         title={selected.title}
//         description={selected.description}
//       >
//         {selected.component}
//       </PlaceholderComponent>
//     </ContentWrapper>
//   );
// };

// export default MainFrame;

import TodoList from "../todo/TodoList";
import HabitTracker from "../habit/HabitTracker";
import EconomyNews from "../news/EconomyNews";

/* ⭐ 전체 페이지 공통 배경 Wrapper */
const ContentWrapper = ({ children }) => (
  <div
    style={{
      width: "100%",
      minHeight: "100vh",
      backgroundColor: "#F7F6F2",  // 다이어리 톤 배경색
      padding: "25px 0", // 제목 상단
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

/* ⭐ 페이지 제목/설명 + 실제 컴포넌트 영역 */
const PlaceholderComponent = ({ title, description, children }) => (
  <div style={{ width: "100%" }}>
    
    {/* ⭐ 상단 타이틀 영역: 왼쪽 정렬 + 전체 폭 */}
    <div
      style={{
        padding: "10px 40px",
        paddingTop: "10px",
      }}
    >
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "6px",
          color: "#222",
          fontFamily: "'Pretendard', sans-serif",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "12px",
          fontFamily: "'Pretendard', sans-serif",
        }}
      >
        {description}
      </p>

      {/* ⭐ 라인이 화면 끝까지 가도록 width 100% */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "#ddd",
          marginTop: "8px",
        }}
      />
    </div>

    {/* ⭐ 중앙 컨텐츠 영역 */}
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 30px",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>

  </div>
);



const MainFrame = ({ activeId, todo, onCreate, onUpdate, onDelete }) => {
  const contentMap = {
    todo: {
      title: "Todo List",
      description: "오늘 해야 할 일을 등록하고 관리하세요.",
      component: (
        <TodoList
          todo={todo}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ),
    },
    habit: {
      title: "Habit Tracker",
      description: "꾸준함을 만들어주는 습관 체크 페이지입니다.",
      component: <HabitTracker />,
    },
    news: {
      title: "Economy News Summary",
      description: "매일 경제 지식을 더해보세요.",
      component: (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <EconomyNews />
        </div>
      ),
    },
    profile: {
      title: "My Profile",
      description: "사용자 정보 및 설정을 관리하세요.",
      component: <div>Profile Page</div>,
    },
  };

  /* HOME만 전체 배경 이미지 유지 */
  if (activeId === "home") {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: "url('/src/assets/03.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  const selected = contentMap[activeId];
  if (!selected) return null;

  /* ⭐ HOME 제외 모든 페이지는 ContentWrapper로 감싸기 */
  return (
    <ContentWrapper>
      <PlaceholderComponent
        title={selected.title}
        description={selected.description}
      >
        {selected.component}
      </PlaceholderComponent>
    </ContentWrapper>
  );
};

export default MainFrame;
