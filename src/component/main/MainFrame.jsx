// import TodoList from "../todo/TodoList";
// import HabitTracker from "../habit/HabitTracker";
// import EconomyNews from "../news/EconomyNews";

// const MainFrame = ({ activeId, todo, onCreate, onUpdate, onDelete }) => {
//   if (activeId === "home") {
//     return (
//       <div
//         style={{
//           height: "100%",
//           width: "100%",
//           backgroundImage: "url('/src/assets/05.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         {/* <h1
//           style={{
//             fontSize: "6rem",
//             color: "#eee",
//             textTransform: "uppercase",
//             textAlign: "center",
//             letterSpacing: "4px",
//             textShadow: "0 2px 6px rgba(0,0,0,0.2)",
//           }}
//         >
//           DAILY LOG
//         </h1> */}
//       </div>
//     );
//   }

//   if (activeId === "todo") {
//     return <TodoList todo={todo} onCreate={onCreate} onUpdate={onUpdate} onDelete={onDelete} />;
//   }

//   if (activeId === "habit") {
//     return <HabitTracker />;
//   }

//   if (activeId === "news") {
//     return <EconomyNews />;
//   }

//   if (activeId === "profile") {
//     return <div>Profile Page</div>;
//   }

//   return null;
// };

// export default MainFrame;

import TodoList from "../todo/TodoList";
import HabitTracker from "../habit/HabitTracker";
import EconomyNews from "../news/EconomyNews";

const PlaceholderComponent = ({ title, description, children }) => (
  <div style={{ padding: "40px", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
    <h2 style={{ fontSize: "28px", marginBottom: "10px", color: "#333" }}>
      {title}
    </h2>

    <div
      style={{
        width: "100%",
        borderBottom: "2px solid #ddd",
        marginBottom: "20px",
      }}
    />

    <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6", marginBottom: "30px" }}>
      {description}
    </p>

    {/* 실제 콘텐츠 */}
    <div style={{ width: "100%" }}>{children}</div>
  </div>
);

const MainFrame = ({ activeId, todo, onCreate, onUpdate, onDelete }) => {
  // 페이지별 타이틀 + 설명
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
      // component: <EconomyNews />,
      component: 
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <EconomyNews />
      </div>
    },
    profile: {
      title: "My Profile",
      description: "사용자 정보 및 설정을 관리하세요.",
      component: <div>Profile Page</div>,
    },
  };

  // HOME 처리
  if (activeId === "home") {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: "url('/src/assets/05.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }
  

  // contentMap에서 선택
  const selected = contentMap[activeId];
  if (!selected) return null;

  return (
    <PlaceholderComponent title={selected.title} description={selected.description}>
      {selected.component}
    </PlaceholderComponent>
  );
};

export default MainFrame;
