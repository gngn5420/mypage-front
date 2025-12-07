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
        maxWidth: "1200px", // 뉴스 컨텐츠 때문에 영역 늘려 놓음. / 원래 900px
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
