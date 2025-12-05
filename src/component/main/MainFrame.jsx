import { Component } from "lucide-react";
import TodoList from '../todo/TodoList'
import HabitTracker from '../habit/HabitTracker'
import EconomyNews from "../news/EconomyNews";

// 화면 출력 부분 
const PlaceholderComponent = ({ title, description, component }) => (
  <div 
    style={{ 
      padding: '40px', 
      width: '100%',
      margin: '0',
    }}
  >
    <h2
      style={{
        fontSize: '28px',
        marginBottom: '10px',
        color: '#333'
      }}
    >
      {title}
    </h2>

    <div
      style={{
        width: "100%",
        borderBottom: "2px solid #ddd",
        marginBottom: "20px"
      }}
    />

    <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
      {description}
    </p>

    <div 
      style={{ 
        marginTop: '30px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        textAlign:'center',
        maxWidth: "1200px",
        margin: '0 auto'
      }}
    >
      <div style={{ width: '100%' }}>
        {component}
      </div>
    </div>
  </div>
);


// 사이드바랑 연결된 화면 출력 부분
const MainFrame = ({ activeId,  todo, onUpdate, onDelete, onCreate }) => {
  const contentMap = {
    'todo': { 
      title: 'TodoList', 
      description: '오늘 해야 할 일을 등록하고 하나씩 실행해보세요.' ,
      component: <TodoList
      todo={todo} 
      onUpdate={onUpdate}
      onCreate={onCreate} 
      onDelete={onDelete}/>
    },
    'habit': { 
      title: 'Habit Tracker', 
      description: '건강한 생활 습관과 루틴을 설정해보세요.' ,
      component: <HabitTracker/> 
    },
    'news': { 
      title: 'Economy News Summary', 
      description: '매일 경제 지식을 더해보세요.' ,
      component: <EconomyNews/>
    },
    'home': { 
      title: 'MY DAILY LIFE', 
      description: '환영합니다! My Daily Life와 함께 당신의 하루를 만들어가보세요!' 
    },
  };

  const selectedContent = contentMap[activeId] || contentMap['home'];
  
  if (activeId === 'home' || !activeId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        <h1 style={{ fontSize: '6rem', color: '#eee', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '4px' }}>
          DAILY LOG
        </h1>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', width: '100%' }}>
      <PlaceholderComponent 
        title={selectedContent.title} 
        description={selectedContent.description}
        component={selectedContent.component}
      />
    </div>
  );
};
export default MainFrame
